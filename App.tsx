
import React, { useState, useEffect } from 'react';
import { generateQuestions, generateNotes, generateFlashcards } from './services/geminiService';
import { Question, MedicalCategory, MedicalSubject, StudyMode, QuizSession, UserStats, NoteSection, Flashcard } from './types';
import QuizCard from './components/QuizCard';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import ResultScreen from './components/ResultScreen';
import StudyView from './components/StudyView';
import SubjectSelector from './components/SubjectSelector';

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'subjects' | 'study' | 'quiz' | 'results'>('dashboard');
  const [selectedSystem, setSelectedSystem] = useState<MedicalCategory | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<MedicalSubject | null>(null);
  const [studyMode, setStudyMode] = useState<StudyMode | null>(null);
  
  const [session, setSession] = useState<QuizSession | null>(null);
  const [notes, setNotes] = useState<NoteSection[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('medfree_stats_v2');
    return saved ? JSON.parse(saved) : {
      totalQuestionsAnswered: 0,
      correctAnswers: 0,
      streak: 0,
      categoriesMastered: {},
      subjectProgress: {}
    };
  });

  useEffect(() => {
    localStorage.setItem('medfree_stats_v2', JSON.stringify(stats));
  }, [stats]);

  const handleSystemSelect = (system: MedicalCategory) => {
    setSelectedSystem(system);
    setView('subjects');
  };

  const startMode = async (subject: MedicalSubject, mode: StudyMode) => {
    if (!selectedSystem) return;
    setLoading(true);
    setSelectedSubject(subject);
    setStudyMode(mode);

    try {
      if (mode === 'Notes') {
        const data = await generateNotes(selectedSystem, subject);
        setNotes(data);
        setView('study');
      } else if (mode === 'Flashcards') {
        const data = await generateFlashcards(selectedSystem, subject);
        setFlashcards(data);
        setView('study');
      } else {
        const data = await generateQuestions(selectedSystem, subject);
        setSession({
          questions: data,
          currentIndex: 0,
          score: 0,
          userAnswers: new Array(data.length).fill(null),
          isComplete: false
        });
        setView('quiz');
      }
    } catch (err) {
      alert("Error loading content. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    if (!session) return;
    const isCorrect = answerIndex === session.questions[session.currentIndex].correctAnswer;
    const newAnswers = [...session.userAnswers];
    newAnswers[session.currentIndex] = answerIndex;
    setSession({ ...session, score: isCorrect ? session.score + 1 : session.score, userAnswers: newAnswers });
  };

  const handleNext = () => {
    if (!session) return;
    if (session.currentIndex < session.questions.length - 1) {
      setSession({ ...session, currentIndex: session.currentIndex + 1 });
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    if (!session || !selectedSubject) return;
    const newStats = { ...stats };
    newStats.totalQuestionsAnswered += session.questions.length;
    newStats.correctAnswers += session.score;
    const key = `${selectedSystem}-${selectedSubject}`;
    newStats.subjectProgress[key] = (newStats.subjectProgress[key] || 0) + session.questions.length;
    setStats(newStats);
    setView('results');
  };

  const reset = () => {
    setView('dashboard');
    setSelectedSystem(null);
    setSelectedSubject(null);
    setStudyMode(null);
    setSession(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar onHomeClick={reset} stats={stats} />
      
      <main className="flex-grow container mx-auto px-4 py-6 max-w-5xl">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-xl font-bold text-slate-800 animate-pulse">Consulting Expert Sources...</h2>
            <p className="text-slate-500 max-w-xs mt-2 italic">Organizing high-yield content for your {selectedSystem} session.</p>
          </div>
        )}

        {!loading && view === 'dashboard' && <Dashboard onStartQuiz={handleSystemSelect} stats={stats} />}
        {!loading && view === 'subjects' && selectedSystem && (
          <SubjectSelector 
            system={selectedSystem} 
            onSelectMode={startMode} 
            stats={stats} 
          />
        )}
        {!loading && view === 'study' && (
          <StudyView 
            mode={studyMode!} 
            notes={notes} 
            flashcards={flashcards} 
            onExit={() => setView('subjects')} 
          />
        )}
        {!loading && view === 'quiz' && session && (
          <QuizCard 
            question={session.questions[session.currentIndex]}
            totalQuestions={session.questions.length}
            currentIndex={session.currentIndex}
            onAnswer={handleAnswer}
            onNext={handleNext}
            userAnswer={session.userAnswers[session.currentIndex]}
          />
        )}
        {!loading && view === 'results' && session && (
          <ResultScreen 
            session={session} 
            onRestart={() => startMode(selectedSubject!, 'Quiz')} 
            onHome={reset} 
          />
        )}
      </main>
    </div>
  );
};

export default App;

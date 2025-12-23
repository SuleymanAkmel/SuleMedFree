
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
  const [apiError, setApiError] = useState<string | null>(null);

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
    setApiError(null);
  };

  const startMode = async (subject: MedicalSubject, mode: StudyMode) => {
    if (!selectedSystem) return;
    setLoading(true);
    setApiError(null);
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
    } catch (err: any) {
      if (err.message === "API_KEY_MISSING") {
        setApiError("Your API key is missing! Please add 'API_KEY' to your Vercel Environment Variables.");
      } else if (err.message.includes("permission denied") || err.message.includes("403")) {
        setApiError("Permission Denied: Ensure your API Key is valid and billing is active in Google AI Studio.");
      } else {
        setApiError("Connection Error: Check your internet or API key limits.");
      }
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
    setApiError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar onHomeClick={reset} stats={stats} />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        {apiError && (
          <div className="bg-rose-50 border-2 border-rose-200 p-8 rounded-[2rem] text-center max-w-lg mx-auto animate-in slide-in-from-top-4">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-rose-900 mb-2">Access Issue</h2>
            <p className="text-rose-700 text-sm mb-6 leading-relaxed">{apiError}</p>
            <button onClick={reset} className="bg-rose-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-rose-100">Try Again</button>
          </div>
        )}

        {loading && !apiError && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="relative">
              <div className="w-20 h-20 border-[6px] border-blue-100 rounded-full"></div>
              <div className="w-20 h-20 border-[6px] border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-8 tracking-tight">Curating Expertise...</h2>
            <p className="text-slate-500 max-w-xs mt-3 text-sm font-medium italic">Preparing board-level data for the {selectedSystem} {selectedSubject} module.</p>
          </div>
        )}

        {!loading && !apiError && view === 'dashboard' && <Dashboard onStartQuiz={handleSystemSelect} stats={stats} />}
        {!loading && !apiError && view === 'subjects' && selectedSystem && (
          <SubjectSelector 
            system={selectedSystem} 
            onSelectMode={startMode} 
            stats={stats} 
          />
        )}
        {!loading && !apiError && view === 'study' && (
          <StudyView 
            mode={studyMode!} 
            notes={notes} 
            flashcards={flashcards} 
            onExit={() => setView('subjects')} 
          />
        )}
        {!loading && !apiError && view === 'quiz' && session && (
          <QuizCard 
            question={session.questions[session.currentIndex]}
            totalQuestions={session.questions.length}
            currentIndex={session.currentIndex}
            onAnswer={handleAnswer}
            onNext={handleNext}
            userAnswer={session.userAnswers[session.currentIndex]}
          />
        )}
        {!loading && !apiError && view === 'results' && session && (
          <ResultScreen 
            session={session} 
            onRestart={() => startMode(selectedSubject!, 'Quiz')} 
            onHome={reset} 
          />
        )}
      </main>
      
      <footer className="py-6 text-center text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em]">
        MedFree Open Education Project • NIME Master Syllabus
      </footer>
    </div>
  );
};

export default App;

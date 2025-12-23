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
  const [errorType, setErrorType] = useState<string | null>(null);

  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('medfree_stats_v3');
    return saved ? JSON.parse(saved) : {
      totalQuestionsAnswered: 0,
      correctAnswers: 0,
      streak: 0,
      categoriesMastered: {},
      subjectProgress: {}
    };
  });

  useEffect(() => {
    localStorage.setItem('medfree_stats_v3', JSON.stringify(stats));
  }, [stats]);

  const handleSystemSelect = (system: MedicalCategory) => {
    setSelectedSystem(system);
    setView('subjects');
    setErrorType(null);
  };

  const startMode = async (subject: MedicalSubject, mode: StudyMode) => {
    if (!selectedSystem) return;
    setLoading(true);
    setErrorType(null);
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
      console.error("Caught error in App:", err.message);
      if (err.message === "API_KEY_MISSING") setErrorType("MISSING");
      else if (err.message === "PERMISSION_DENIED") setErrorType("DENIED");
      else setErrorType("GENERIC");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setView('dashboard');
    setSelectedSystem(null);
    setSelectedSubject(null);
    setStudyMode(null);
    setSession(null);
    setErrorType(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar onHomeClick={reset} stats={stats} />
      
      <main className="flex-grow container mx-auto px-4 py-6 max-w-5xl">
        {errorType && (
          <div className="max-w-md mx-auto mt-12 bg-white rounded-[2.5rem] border-2 border-slate-100 p-10 text-center shadow-2xl">
            <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">⚠️</div>
            <h2 className="text-2xl font-black text-slate-900 mb-4">
              {errorType === 'MISSING' ? 'Key Missing' : errorType === 'DENIED' ? 'Access Blocked' : 'System Error'}
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              {errorType === 'MISSING' 
                ? "You haven't added your API Key to Vercel yet. Go to Settings -> Environment Variables and add API_KEY." 
                : errorType === 'DENIED' 
                ? "The API Key you provided was rejected. Check if it's copied correctly or if you've hit your free limit." 
                : "The connection failed. Please check your internet or try again later."}
            </p>
            <div className="space-y-3">
               <button onClick={reset} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all">Try Again</button>
               <a href="https://vercel.com" target="_blank" className="block w-full py-4 bg-blue-50 text-blue-600 rounded-2xl font-bold text-sm">Open Vercel Dashboard</a>
            </div>
          </div>
        )}

        {loading && !errorType && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-8"></div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight animate-pulse">Consulting AI Expert...</h2>
            <p className="text-slate-500 mt-4 max-w-xs mx-auto italic">Downloading the latest clinical guides for {selectedSystem}.</p>
          </div>
        )}

        {!loading && !errorType && view === 'dashboard' && <Dashboard onStartQuiz={handleSystemSelect} stats={stats} />}
        {!loading && !errorType && view === 'subjects' && selectedSystem && (
          <SubjectSelector 
            system={selectedSystem} 
            onSelectMode={startMode} 
            stats={stats} 
          />
        )}
        {!loading && !errorType && view === 'study' && (
          <StudyView 
            mode={studyMode!} 
            notes={notes} 
            flashcards={flashcards} 
            onExit={() => setView('subjects')} 
          />
        )}
        {!loading && !errorType && view === 'quiz' && session && (
          <QuizCard 
            question={session.questions[session.currentIndex]}
            totalQuestions={session.questions.length}
            currentIndex={session.currentIndex}
            onAnswer={(i) => {
              const isCorrect = i === session.questions[session.currentIndex].correctAnswer;
              const newAnswers = [...session.userAnswers];
              newAnswers[session.currentIndex] = i;
              setSession({ ...session, score: isCorrect ? session.score + 1 : session.score, userAnswers: newAnswers });
            }}
            onNext={() => {
              if (session.currentIndex < session.questions.length - 1) {
                setSession({ ...session, currentIndex: session.currentIndex + 1 });
              } else {
                const newStats = { ...stats };
                newStats.totalQuestionsAnswered += session.questions.length;
                newStats.correctAnswers += session.score;
                const key = `${selectedSystem}-${selectedSubject}`;
                newStats.subjectProgress[key] = (newStats.subjectProgress[key] || 0) + session.questions.length;
                setStats(newStats);
                setView('results');
              }
            }}
            userAnswer={session.userAnswers[session.currentIndex]}
          />
        )}
        {!loading && !errorType && view === 'results' && session && (
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
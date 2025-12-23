
import React from 'react';
import { QuizSession } from '../types';

interface ResultScreenProps {
  session: QuizSession;
  onRestart: () => void;
  onHome: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ session, onRestart, onHome }) => {
  const percentage = Math.round((session.score / session.questions.length) * 100);
  
  let title = "Keep Studying!";
  let emoji = "📚";
  if (percentage >= 80) { title = "Excellent Work!"; emoji = "🏆"; }
  else if (percentage >= 60) { title = "Good Effort!"; emoji = "💡"; }

  return (
    <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-xl animate-in zoom-in-95 duration-500">
      <div className="text-6xl mb-6">{emoji}</div>
      <h1 className="text-3xl font-bold text-slate-800 mb-2">{title}</h1>
      <p className="text-slate-500 mb-8">Clinical reasoning session complete.</p>

      <div className="flex items-center justify-center gap-12 mb-12">
        <div className="text-center">
          <div className="text-4xl font-black text-blue-600">{session.score} / {session.questions.length}</div>
          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Score</div>
        </div>
        <div className="h-12 w-px bg-slate-100"></div>
        <div className="text-center">
          <div className="text-4xl font-black text-emerald-500">{percentage}%</div>
          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Accuracy</div>
        </div>
      </div>

      <div className="space-y-4">
        <button 
          onClick={onRestart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg shadow-blue-100"
        >
          Try Again
        </button>
        <button 
          onClick={onHome}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 px-8 rounded-2xl transition-all"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="mt-12 pt-8 border-t border-slate-100 text-left">
        <h3 className="font-bold text-slate-800 mb-4">Question Breakdown</h3>
        <div className="grid grid-cols-5 gap-2">
          {session.userAnswers.map((answer, i) => (
            <div 
              key={i}
              className={`h-10 rounded-lg flex items-center justify-center font-bold ${
                answer === session.questions[i].correctAnswer 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-rose-100 text-rose-700'
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;

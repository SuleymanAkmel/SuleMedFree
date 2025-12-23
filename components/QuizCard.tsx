
import React from 'react';
import { Question } from '../types';

interface QuizCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  onAnswer: (index: number) => void;
  onNext: () => void;
  userAnswer: number | null;
}

const QuizCard: React.FC<QuizCardProps> = ({ 
  question, 
  currentIndex, 
  totalQuestions, 
  onAnswer, 
  onNext, 
  userAnswer 
}) => {
  const isAnswered = userAnswer !== null;
  const isCorrect = userAnswer === question.correctAnswer;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">{question.category}</span>
          <span className="text-slate-400 text-sm">Case Study {currentIndex + 1}</span>
        </div>
        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
          Level: {question.difficulty}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <h2 className="text-xl md:text-2xl font-semibold text-slate-800 leading-snug mb-8">
          {question.question}
        </h2>

        <div className="space-y-3">
          {question.options.map((option, index) => {
            let stateClass = "border-slate-200 hover:border-blue-400 bg-white";
            if (isAnswered) {
              if (index === question.correctAnswer) stateClass = "border-emerald-500 bg-emerald-50 text-emerald-900";
              else if (index === userAnswer) stateClass = "border-rose-500 bg-rose-50 text-rose-900";
              else stateClass = "border-slate-100 bg-slate-50 text-slate-400";
            }
            return (
              <button
                key={index}
                disabled={isAnswered}
                onClick={() => onAnswer(index)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${stateClass}`}
              >
                <span className="font-medium">{String.fromCharCode(65 + index)}. {option}</span>
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-top-2">
            <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl">
              <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2 text-sm uppercase">
                📖 Explanation
              </h4>
              <p className="text-slate-700 leading-relaxed text-sm">
                {question.explanation}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                <h4 className="font-bold text-amber-800 mb-1 text-xs uppercase">🧠 Mnemonic</h4>
                <p className="text-slate-700 text-sm italic">{question.mnemonic}</p>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                <h4 className="font-bold text-emerald-800 mb-1 text-xs uppercase">🖼️ Visual Aid</h4>
                <p className="text-slate-700 text-xs">{question.visualPrompt}</p>
              </div>
            </div>

            <a 
              href={question.videoLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100 hover:bg-red-100 transition-colors"
            >
              🎥 Watch Revision Video for this Topic
            </a>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
         <button onClick={() => window.location.reload()} className="text-slate-400 text-sm hover:text-slate-600 transition-colors">Exit Session</button>
         {isAnswered && (
          <button 
            onClick={onNext}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all"
          >
            {currentIndex === totalQuestions - 1 ? 'See Results' : 'Next Case'}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizCard;

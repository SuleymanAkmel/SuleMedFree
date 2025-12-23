
import React from 'react';
import { MedicalCategory, MedicalSubject, StudyMode, UserStats } from '../types';

interface Props {
  system: MedicalCategory;
  onSelectMode: (subject: MedicalSubject, mode: StudyMode) => void;
  stats: UserStats;
}

const subjects = Object.values(MedicalSubject);

const SubjectSelector: React.FC<Props> = ({ system, onSelectMode, stats }) => {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl text-2xl font-bold">
          {system.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">{system}</h1>
          <p className="text-slate-500">Select a discipline and learning mode.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((sub) => {
          const progress = stats.subjectProgress[`${system}-${sub}`] || 0;
          return (
            <div key={sub} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-800">{sub}</h3>
                <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded text-slate-500">
                  {progress}/200 MCQs
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => onSelectMode(sub, 'Notes')}
                  className="flex flex-col items-center p-3 rounded-2xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                >
                  <span className="text-xl mb-1">📝</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Notes</span>
                </button>
                <button 
                  onClick={() => onSelectMode(sub, 'Flashcards')}
                  className="flex flex-col items-center p-3 rounded-2xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                >
                  <span className="text-xl mb-1">🃏</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Cards</span>
                </button>
                <button 
                  onClick={() => onSelectMode(sub, 'Quiz')}
                  className="flex flex-col items-center p-3 rounded-2xl bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                >
                  <span className="text-xl mb-1">🎯</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Quiz</span>
                </button>
              </div>
              
              <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-1000" 
                  style={{ width: `${Math.min((progress / 200) * 100, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectSelector;

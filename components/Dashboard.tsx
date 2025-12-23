
import React from 'react';
import { MedicalCategory, UserStats } from '../types';

interface DashboardProps {
  onStartQuiz: (category: MedicalCategory) => void;
  stats: UserStats;
}

const categories = [
  { id: MedicalCategory.Intro, color: 'bg-slate-500', icon: '📖' },
  { id: MedicalCategory.Hematology, color: 'bg-red-600', icon: '🩸' },
  { id: MedicalCategory.CVS, color: 'bg-rose-500', icon: '🫀' },
  { id: MedicalCategory.Respiratory, color: 'bg-blue-400', icon: '🫁' },
  { id: MedicalCategory.GIS, color: 'bg-orange-500', icon: '🍏' },
  { id: MedicalCategory.MSK, color: 'bg-amber-600', icon: '🦴' },
  { id: MedicalCategory.Renal, color: 'bg-indigo-500', icon: '💧' },
  { id: MedicalCategory.Endocrine, color: 'bg-violet-500', icon: '🧪' },
  { id: MedicalCategory.Reproductive, color: 'bg-pink-500', icon: '🧬' },
  { id: MedicalCategory.Nervous, color: 'bg-purple-600', icon: '🧠' },
  { id: MedicalCategory.Infectious, color: 'bg-emerald-600', icon: '🦠' },
];

const Dashboard: React.FC<DashboardProps> = ({ onStartQuiz, stats }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          NIME Program <span className="text-blue-600">Open Learning</span>
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Access the full Yekatit 12 syllabus for free. Includes clinical cases, mnemonics, and curated revision videos.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onStartQuiz(cat.id)}
            className="group relative flex flex-col items-start p-6 bg-white border border-slate-200 rounded-2xl hover:shadow-xl hover:border-blue-400 transition-all text-left overflow-hidden"
          >
            <div className={`mb-4 w-12 h-12 flex items-center justify-center text-2xl rounded-xl ${cat.color} bg-opacity-10 text-slate-900 group-hover:scale-110 transition-transform`}>
              {cat.icon}
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-1">{cat.id}</h3>
            <p className="text-slate-500 text-xs">
              Module Study Guide & Quizzes
            </p>
          </button>
        ))}
      </div>

      <div className="bg-slate-800 text-white p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6">
        <div className="text-4xl">📶</div>
        <div>
          <h4 className="font-bold text-lg">Study Offline?</h4>
          <p className="text-slate-300 text-sm">Once loaded, this app works without internet. You can bookmark it or "Add to Home Screen" on your phone to use it in rural areas without data.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


import React from 'react';
import { UserStats } from '../types';

interface NavbarProps {
  onHomeClick: () => void;
  stats: UserStats;
}

const Navbar: React.FC<NavbarProps> = ({ onHomeClick, stats }) => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={onHomeClick}
        >
          <div className="bg-blue-600 text-white p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">Med<span className="text-blue-600">Free</span></span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Score</span>
            <span className="text-slate-700 font-bold">{stats.correctAnswers} / {stats.totalQuestionsAnswered}</span>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold border border-blue-100">
            {stats.totalQuestionsAnswered > 0 
              ? `${Math.round((stats.correctAnswers / stats.totalQuestionsAnswered) * 100)}% Accuracy`
              : 'New Student'
            }
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

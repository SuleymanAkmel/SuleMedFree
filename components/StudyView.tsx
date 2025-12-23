
import React, { useState } from 'react';
import { StudyMode, NoteSection, Flashcard } from '../types';

interface Props {
  mode: StudyMode;
  notes: NoteSection[];
  flashcards: Flashcard[];
  onExit: () => void;
}

const StudyView: React.FC<Props> = ({ mode, notes, flashcards, onExit }) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (mode === 'Notes') {
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
        <div className="flex justify-between items-center bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm sticky top-2 z-10 border border-slate-100">
          <h2 className="font-bold text-slate-800">High-Yield Notes</h2>
          <button onClick={onExit} className="bg-slate-800 text-white px-4 py-1.5 rounded-full font-bold text-xs hover:bg-slate-900 transition-all">Return to List</button>
        </div>

        {notes.map((note, i) => (
          <section key={i} className="bg-white overflow-hidden rounded-[2.5rem] shadow-sm border border-slate-200">
            {/* Dynamic Medical Image Placeholder */}
            <div className="w-full h-48 bg-slate-200 relative overflow-hidden">
              <img 
                src={`https://source.unsplash.com/featured/?medical,${(note as any).visualSearchKeyword || 'anatomy'}`} 
                alt={note.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                   (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <h3 className="text-white text-2xl font-black">{note.title}</h3>
              </div>
            </div>
            
            <div className="p-8">
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap mb-8 text-lg">{note.content}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                  <h4 className="text-xs font-black text-blue-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="text-xl">💡</span> Mnemonics for Recall
                  </h4>
                  <ul className="space-y-2">
                    {note.mnemonics.map((m, j) => (
                      <li key={j} className="text-sm text-slate-700 font-medium italic bg-white/50 p-2 rounded-xl">"{m}"</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                  <h4 className="text-xs font-black text-emerald-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="text-xl">🚑</span> Oral Board Correlate
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed italic">{note.clinicalCorrelate}</p>
                </div>
              </div>

              <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-6 rounded-3xl">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-center">Reference Guide</h4>
                <p className="text-sm text-slate-500 text-center italic">"{note.imageDescription}"</p>
              </div>
            </div>
          </section>
        ))}
        
        <button onClick={onExit} className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-bold text-lg hover:bg-black transition-all shadow-xl">Complete Study Module</button>
      </div>
    );
  }

  const card = flashcards[currentCard];
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Recall Mastery</h2>
        <div className="flex items-center justify-center gap-2 mt-2">
           <div className="h-1.5 w-32 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${((currentCard + 1) / flashcards.length) * 100}%` }}></div>
           </div>
           <p className="text-slate-400 text-xs font-bold">{currentCard + 1} / {flashcards.length}</p>
        </div>
      </div>

      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className="relative h-[28rem] w-full cursor-pointer perspective-1000 group"
      >
        <div className={`relative h-full w-full transition-all duration-700 preserve-3d shadow-2xl rounded-[3.5rem] ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-white flex flex-col items-center justify-center p-12 text-center rounded-[3.5rem] border border-slate-100 group-hover:border-blue-200 transition-colors">
            <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">Clinical Scenario</span>
            <p className="text-2xl font-bold text-slate-800 leading-snug">{card?.front}</p>
            <div className="mt-12 flex flex-col items-center animate-bounce opacity-40">
               <span className="text-2xl">👆</span>
               <span className="text-[10px] font-bold uppercase tracking-widest mt-2 text-slate-400">Tap to Reveal Mechanism</span>
            </div>
          </div>
          {/* Back */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-blue-600 text-white flex flex-col items-center justify-center p-12 text-center rounded-[3.5rem] shadow-inner shadow-blue-800/50">
            <span className="bg-white/20 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">Diagnostic Insight</span>
            <p className="text-3xl font-black mb-6 tracking-tight leading-tight">{card?.back}</p>
            <div className="h-px w-24 bg-white/30 mb-6"></div>
            <p className="text-blue-100 text-base leading-relaxed font-medium">{card?.explanation}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          disabled={currentCard === 0}
          onClick={(e) => { e.stopPropagation(); setCurrentCard(currentCard - 1); setIsFlipped(false); }}
          className="flex-1 py-5 bg-white border-2 border-slate-100 text-slate-400 rounded-3xl font-black hover:border-slate-200 transition-all disabled:opacity-20"
        >
          BACK
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (currentCard < flashcards.length - 1) {
              setCurrentCard(currentCard + 1);
              setIsFlipped(false);
            } else {
              onExit();
            }
          }}
          className="flex-[2] py-5 bg-slate-900 text-white rounded-3xl font-black shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2"
        >
          {currentCard === flashcards.length - 1 ? 'COMPLETE SET' : 'NEXT CARD'}
          <span className="text-xl">→</span>
        </button>
      </div>
    </div>
  );
};

export default StudyView;

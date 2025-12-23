
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
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-700">
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm sticky top-20 z-10 border border-slate-100">
          <h2 className="font-bold text-slate-800">Review Notes</h2>
          <button onClick={onExit} className="text-blue-600 font-bold text-sm">Return to Subjects</button>
        </div>

        {notes.map((note, i) => (
          <section key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
            <h3 className="text-2xl font-black text-slate-900 mb-4 border-b pb-2">{note.title}</h3>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap mb-6">{note.content}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                <h4 className="text-xs font-black text-blue-800 uppercase tracking-widest mb-2">💡 Mnemonics</h4>
                <ul className="list-disc list-inside text-sm text-slate-600">
                  {note.mnemonics.map((m, j) => <li key={j} className="italic mb-1">"{m}"</li>)}
                </ul>
              </div>
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                <h4 className="text-xs font-black text-emerald-800 uppercase tracking-widest mb-2">🚑 Clinical Correlate</h4>
                <p className="text-sm text-slate-600 italic">{note.clinicalCorrelate}</p>
              </div>
            </div>

            <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-8 rounded-3xl text-center">
              <span className="text-4xl block mb-2">🖼️</span>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-tighter">Diagram Study Guide</p>
              <p className="text-sm text-slate-500 mt-2 italic font-serif">"{note.imageDescription}"</p>
            </div>
          </section>
        ))}
        
        <button onClick={onExit} className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-colors">Done Reading</button>
      </div>
    );
  }

  const card = flashcards[currentCard];
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-800">Mastery Flashcards</h2>
        <p className="text-slate-500">Card {currentCard + 1} of {flashcards.length}</p>
      </div>

      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className="relative h-80 w-full cursor-pointer perspective-1000"
      >
        <div className={`relative h-full w-full transition-all duration-500 preserve-3d shadow-xl rounded-[3rem] ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-white flex flex-col items-center justify-center p-12 text-center rounded-[3rem] border-2 border-slate-100">
            <span className="text-blue-600 font-bold text-xs uppercase mb-4">Question</span>
            <p className="text-2xl font-bold text-slate-800">{card?.front}</p>
            <p className="mt-8 text-slate-300 text-xs font-bold uppercase tracking-widest">Click to reveal</p>
          </div>
          {/* Back */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-blue-600 text-white flex flex-col items-center justify-center p-12 text-center rounded-[3rem]">
            <span className="text-blue-200 font-bold text-xs uppercase mb-4">Correct Answer</span>
            <p className="text-2xl font-bold mb-4">{card?.back}</p>
            <p className="text-blue-100 text-sm italic">{card?.explanation}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          disabled={currentCard === 0}
          onClick={() => { setCurrentCard(currentCard - 1); setIsFlipped(false); }}
          className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl font-bold disabled:opacity-30"
        >
          Previous
        </button>
        <button 
          onClick={() => {
            if (currentCard < flashcards.length - 1) {
              setCurrentCard(currentCard + 1);
              setIsFlipped(false);
            } else {
              onExit();
            }
          }}
          className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100"
        >
          {currentCard === flashcards.length - 1 ? 'Finish Set' : 'Next Card'}
        </button>
      </div>
    </div>
  );
};

export default StudyView;

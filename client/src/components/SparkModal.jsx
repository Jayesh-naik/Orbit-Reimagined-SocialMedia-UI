import { useState, useEffect } from 'react';
import { X, Clock, Heart, Lock, MessageCircle, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { orbitStore } from '../services/orbitStore';
import { soundFx } from '../services/soundEffects';

const SparkModal = ({ spark, onClose, onOpenChat }) => {
  const [currentSpark, setCurrentSpark] = useState(spark);

  useEffect(() => {
    setCurrentSpark(spark);
  }, [spark]);

  if (!spark || !currentSpark) return null;

  const handleResonate = () => {
    soundFx.playResonateSound();
    const updated = orbitStore.toggleResonance(currentSpark.id);
    if (updated) setCurrentSpark({ ...updated });
  };

  const handleAnchor = () => {
    soundFx.playAnchorSound();
    const updated = orbitStore.toggleAnchor(currentSpark.id);
    if (updated) setCurrentSpark({ ...updated });
  };

  const minsRemaining = currentSpark.minsRemaining ?? 60;
  const maxMins = currentSpark.maxMins ?? 60;
  const pctRemaining = Math.max(0, Math.min(100, Math.round((minsRemaining / maxMins) * 100)));
  const isUrgent = minsRemaining <= 15;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col rounded-3xl border border-purple-500/30 bg-[#090d18] shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-purple-500/20 px-6 py-4 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            {currentSpark.avatar?.startsWith('http') ? (
              <img src={currentSpark.avatar} alt={currentSpark.author} className="h-8 w-8 rounded-full object-cover border border-purple-400" />
            ) : (
              <span className="text-xl font-bold">{currentSpark.avatar || '✨'}</span>
            )}
            <div>
              <span className="text-xs font-bold text-white block">{currentSpark.author}</span>
              <span className="text-[10px] text-purple-300 font-semibold">{currentSpark.constellationTag}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Decay Meter */}
          <div className="rounded-2xl border border-purple-500/20 bg-[#060911] p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-purple-300">
                <Clock className="h-3.5 w-3.5" />
                Decay Countdown
              </span>
              <span className={isUrgent ? 'text-rose-400' : 'text-purple-300'}>
                {currentSpark.isAnchored ? 'Infinite (Anchored to Sky)' : `${minsRemaining} mins remaining`}
              </span>
            </div>
            
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  currentSpark.isAnchored
                    ? 'bg-cyan-400'
                    : isUrgent
                    ? 'bg-rose-500'
                    : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                }`}
                style={{ width: `${currentSpark.isAnchored ? 100 : pctRemaining}%` }}
              />
            </div>
            {!currentSpark.isAnchored && (
              <p className="text-[10px] text-slate-400">
                Notice: When this timer hits 0, this moment vanishes permanently unless anchored.
              </p>
            )}
          </div>

          {/* Spark Main Text */}
          <div className="rounded-2xl border border-slate-800 bg-[#0c101d] p-5">
            <p className="text-sm md:text-base text-slate-100 font-medium leading-relaxed">
              "{currentSpark.content}"
            </p>
          </div>

          {/* Core Actions: Resonance & Anchoring */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
              Anti-Feed Interactions
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* 1. Resonance Button (Mutual-Only) */}
              <button
                onClick={handleResonate}
                className={`flex flex-col items-center justify-center gap-1 rounded-2xl border p-4 text-xs font-bold transition ${
                  currentSpark.resonanceStatus === 'mutual'
                    ? 'border-emerald-500/60 bg-emerald-950/30 text-emerald-300 shadow-lg shadow-emerald-500/20'
                    : currentSpark.resonanceStatus === 'pending'
                    ? 'border-amber-500/60 bg-amber-950/30 text-amber-300'
                    : 'border-purple-500/30 bg-purple-950/20 text-purple-300 hover:border-purple-400 hover:bg-purple-950/40'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Heart className={`h-4 w-4 ${currentSpark.resonanceStatus !== 'none' ? 'fill-current' : ''}`} />
                  <span>
                    {currentSpark.resonanceStatus === 'mutual'
                      ? 'Mutual Match! 💬'
                      : currentSpark.resonanceStatus === 'pending'
                      ? 'Signal Sent (Pending)'
                      : 'Resonate (Two-Way)'}
                  </span>
                </div>
                <span className="text-[9px] font-normal opacity-80 text-center">
                  {currentSpark.resonanceStatus === 'mutual'
                    ? 'Chat unlocked — both resonated!'
                    : currentSpark.resonanceStatus === 'pending'
                    ? 'Waiting for author to resonate back'
                    : 'No public counts; requires reciprocity'}
                </span>
              </button>

              {/* 2. Anchoring Button (Private Sky Save) */}
              <button
                onClick={handleAnchor}
                className={`flex flex-col items-center justify-center gap-1 rounded-2xl border p-4 text-xs font-bold transition ${
                  currentSpark.isAnchored
                    ? 'border-cyan-500/60 bg-cyan-950/30 text-cyan-300 shadow-lg shadow-cyan-500/20'
                    : 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-cyan-500/50 hover:bg-cyan-950/20'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Lock className="h-4 w-4" />
                  <span>{currentSpark.isAnchored ? 'Anchored to Sky 🔒' : 'Anchor to My Sky'}</span>
                </div>
                <span className="text-[9px] font-normal opacity-80 text-center">
                  {currentSpark.isAnchored
                    ? 'Saved in private Sky — saved from decay'
                    : 'Private act of keeping; visible to nobody else'}
                </span>
              </button>

            </div>

            {/* If Mutual Match: Open Chat Trigger */}
            {currentSpark.resonanceStatus === 'mutual' && (
              <button
                onClick={() => {
                  onClose();
                  onOpenChat(currentSpark.id);
                }}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-xs font-extrabold text-white hover:brightness-110 shadow-lg shadow-emerald-500/25 transition"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Open Private Mutual Chat Thread</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default SparkModal;

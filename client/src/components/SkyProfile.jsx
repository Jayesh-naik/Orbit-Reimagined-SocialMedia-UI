import { useState } from 'react';
import { Lock, Sparkles, Clock, Compass, Heart, Trash2 } from 'lucide-react';
import { orbitStore } from '../services/orbitStore';
import { soundFx } from '../services/soundEffects';

const SkyProfile = ({ skySparks, onSelectSpark }) => {
  const [skyList, setSkyList] = useState(skySparks);

  const handleUnanchor = (e, sparkId) => {
    e.stopPropagation();
    soundFx.playAnchorSound();
    orbitStore.toggleAnchor(sparkId);
    setSkyList((prev) => prev.filter((s) => s.id !== sparkId));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Sky Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
                <Lock className="h-4 w-4" />
              </div>
              <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold tracking-wider text-cyan-300 border border-cyan-500/20">
                Private Sky Profile
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Your Personal Cosmos</h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              This space is strictly private to you. No follower counts, no public grids, no metrics.
              Only moments you deliberately chose to anchor from fading away.
            </p>
          </div>

          <div className="flex flex-col items-end rounded-2xl bg-black/40 border border-cyan-500/20 p-4 backdrop-blur-md shrink-0">
            <span className="text-2xl font-black text-cyan-300">{skyList.length}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Anchored Moments</span>
          </div>
        </div>
      </div>

      {/* Anchored Grid */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <span>Anchored Moments ({skyList.length})</span>
          </h2>
          <span className="text-xs text-cyan-400 font-semibold">Saved from Decay</span>
        </div>

        {skyList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skyList.map((spark) => (
              <div
                key={spark.id}
                onClick={() => onSelectSpark(spark)}
                className="group cursor-pointer rounded-2xl border border-cyan-500/30 bg-[#080d1a]/90 p-5 shadow-lg backdrop-blur-md transition hover:border-cyan-400 hover:scale-[1.02] flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {spark.avatar?.startsWith('http') ? (
                        <img
                          src={spark.avatar}
                          alt={spark.author}
                          className="h-8 w-8 rounded-full object-cover border border-cyan-400"
                        />
                      ) : (
                        <span className="text-lg font-bold">{spark.avatar || '✨'}</span>
                      )}
                      <span className="text-xs font-bold text-slate-300">{spark.author}</span>
                    </div>
                    <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-[9px] font-bold text-cyan-300 flex items-center gap-1">
                      <Lock className="h-2.5 w-2.5" /> Private
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed font-medium line-clamp-4">
                    "{spark.content}"
                  </p>
                </div>

                <div className="mt-4 border-t border-slate-800/80 pt-3 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-semibold text-cyan-400">{spark.constellationTag}</span>
                  
                  <button
                    onClick={(e) => handleUnanchor(e, spark.id)}
                    className="flex items-center gap-1 text-slate-500 hover:text-rose-400 transition"
                    title="Remove from Sky (Let fade)"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Unanchor</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State for Sky */
          <div className="rounded-3xl border border-dashed border-slate-800 bg-[#060911] p-12 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white">Your Sky is empty</h3>
            <p className="max-w-md mx-auto text-xs text-slate-400 leading-relaxed">
              Nothing accumulates by default in Orbit. Browse the radial Orbit Map or Constellation rooms and tap 
              <strong className="text-cyan-300"> "Anchor to My Sky"</strong> on moments you wish to hold on to.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default SkyProfile;

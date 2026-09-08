import { Sparkles, Clock, Compass, Plus, MessageCircle, Lock, ArrowLeft } from 'lucide-react';
import { CONSTELLATIONS } from '../services/orbitStore';

const ConstellationRoom = ({ constellationId, sparks, onSelectSpark, onBack, onCreateSpark }) => {
  const room = CONSTELLATIONS.find((c) => c.id === constellationId) || CONSTELLATIONS[0];
  const roomSparks = sparks.filter((s) => s.constellationId === room.id);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Room Header Banner */}
      <div className={`relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-r ${room.color} p-8 text-white shadow-2xl`}>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-1.5 rounded-xl bg-black/30 border border-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-black/50 transition backdrop-blur-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Orbit Map</span>
        </button>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{room.icon}</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold tracking-wider backdrop-blur-md border border-white/20">
                {room.tag}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{room.name}</h1>
            <p className="text-xs sm:text-sm text-slate-200/80 leading-relaxed">{room.description}</p>
          </div>

          <button
            onClick={() => onCreateSpark(room.id)}
            className="flex items-center gap-2 rounded-2xl bg-white text-slate-900 px-5 py-3 text-xs font-extrabold hover:bg-slate-100 transition shadow-lg shadow-black/20 shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Release Spark Here</span>
          </button>
        </div>

        {/* Room Prompt of the Hour */}
        <div className="mt-6 rounded-2xl bg-black/40 border border-white/15 p-4 backdrop-blur-md">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300 block mb-1">
            Prompt of the Hour
          </span>
          <p className="text-xs sm:text-sm font-semibold text-white">"{room.prompt}"</p>
        </div>
      </div>

      {/* Sparks Grid inside Room */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <span>Moments Floating in Room ({roomSparks.length})</span>
          </h2>
          <span className="text-xs text-purple-400 font-semibold">Decaying by Default</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roomSparks.map((spark) => {
            const isUrgent = spark.minsRemaining <= 15;

            return (
              <div
                key={spark.id}
                onClick={() => onSelectSpark(spark)}
                className={`cursor-pointer rounded-2xl border bg-[#0c101d]/90 p-5 shadow-lg backdrop-blur-md transition hover:border-purple-500 hover:scale-[1.02] flex flex-col justify-between ${
                  spark.isAnchored
                    ? 'border-cyan-500/40 shadow-cyan-500/10'
                    : isUrgent
                    ? 'border-rose-500/50 shadow-rose-500/20'
                    : 'border-purple-500/20'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {spark.avatar?.startsWith('http') ? (
                        <img 
                          src={spark.avatar} 
                          alt={spark.author} 
                          className="h-7 w-7 rounded-full object-cover shadow-sm border border-slate-700" 
                        />
                      ) : (
                        <span className="text-lg">{spark.avatar}</span>
                      )}
                      <span className="text-xs font-bold text-slate-300">{spark.author}</span>
                    </div>
                    {spark.isAnchored ? (
                      <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-[9px] font-bold text-cyan-400">
                        Anchored
                      </span>
                    ) : (
                      <span className={`flex items-center gap-1 text-[10px] font-bold ${isUrgent ? 'text-rose-400' : 'text-purple-400'}`}>
                        <Clock className="h-3 w-3" />
                        {spark.minsRemaining}m remaining
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed font-medium line-clamp-4">
                    {spark.content}
                  </p>
                </div>

                <div className="mt-4 border-t border-slate-800/80 pt-3 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-semibold">{spark.constellationTag}</span>
                  {spark.resonanceStatus === 'mutual' && (
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" /> Mutual Match
                    </span>
                  )}
                  {spark.resonanceStatus === 'pending' && (
                    <span className="font-bold text-amber-400">Pending Signal</span>
                  )}
                  {spark.resonanceStatus === 'none' && (
                    <span className="text-purple-400 font-bold hover:underline">Inspect →</span>
                  )}
                </div>
              </div>
            );
          })}

          {roomSparks.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-800 p-12 text-center text-xs text-slate-500">
              🌌 No active moments in this constellation right now. Be the first to release a Spark!
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ConstellationRoom;

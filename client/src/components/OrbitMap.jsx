import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Play, Pause, RefreshCw, Eye, Heart, MessageCircle, Layers, Move, User } from 'lucide-react';
import { orbitStore } from '../services/orbitStore';
import { soundFx } from '../services/soundEffects';

// Generate vibrant deep space twinkling stars
const CELESTIAL_STARS = Array.from({ length: 45 }).map((_, i) => ({
  id: i,
  top: `${(i * 19 + 7) % 96}%`,
  left: `${(i * 29 + 11) % 96}%`,
  size: (i % 3) + 1, // 1px to 3px
  opacity: 0.35 + ((i % 5) * 0.15),
  color: i % 5 === 0 ? '#06b6d4' : i % 4 === 0 ? '#f59e0b' : i % 3 === 0 ? '#c084fc' : '#ffffff',
  duration: 1.8 + (i % 4) * 0.8,
  delay: (i % 6) * 0.3,
}));

const OrbitMap = ({ sparks, onSelectSpark, onOpenSky }) => {
  const [rotationAngle, setRotationAngle] = useState(15); // Yaw (Z-axis spin)
  const [tiltAngle, setTiltAngle] = useState(62); // Pitch (X-axis tilt)
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredRing, setHoveredRing] = useState(null);
  const [previewSpark, setPreviewSpark] = useState(sparks[0] || null);

  // Smooth Auto-Rotation Loop
  useEffect(() => {
    if (!isAutoRotating || isDragging) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + 0.25) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [isAutoRotating, isDragging]);

  // Global Drag listeners for true 3D Trackball Rotation
  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMouseMove = (e) => {
      const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
      const clientY = e.clientY || e.touches?.[0]?.clientY || 0;

      const deltaX = clientX - dragStart.x;
      const deltaY = clientY - dragStart.y;

      // X-drag rotates Yaw (Z-spin)
      setRotationAngle((prev) => (prev + deltaX * 0.5) % 360);

      // Y-drag rotates Pitch (X-tilt: 25deg to 82deg)
      setTiltAngle((prev) => Math.max(25, Math.min(82, prev - deltaY * 0.4)));

      setDragStart({ x: clientX, y: clientY });
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchmove', handleGlobalMouseMove);
    window.addEventListener('touchend', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchmove', handleGlobalMouseMove);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, [isDragging, dragStart]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
    const clientY = e.clientY || e.touches?.[0]?.clientY || 0;
    setDragStart({ x: clientX, y: clientY });
  };

  const handleReset3DView = () => {
    setRotationAngle(15);
    setTiltAngle(62);
  };

  const handleSendPulse = () => {
    soundFx.playPulseSound();
    orbitStore.sendPulse();
  };

  const featuredSpark = previewSpark || sparks[0];

  return (
    <main aria-label="Content Discovery and Content Creation & Sharing" data-testid="Content Discovery and Content Creation & Sharing" className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Header Metadata Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
            Solitude Synced
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold text-slate-300">
          <span>Equinox • 02:41 AM</span>
          <span className="flex items-center gap-1.5 rounded-full bg-purple-950/70 border border-purple-500/40 px-3.5 py-1 text-purple-300 text-xs shadow-md">
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            8 in alignment
          </span>
        </div>
      </div>

      {/* 2. Top Moment Preview Speech Bubble */}
      {featuredSpark && (
        <article
          onClick={() => onSelectSpark(featuredSpark)}
          className="mx-auto cursor-pointer max-w-sm sm:max-w-lg rounded-2xl border-2 border-purple-500/40 bg-[#0e1329]/95 p-4 backdrop-blur-xl shadow-[0_0_30px_rgba(139,92,246,0.25)] transition hover:border-purple-300 hover:scale-[1.02]"
        >
          <div className="flex items-start gap-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/25 border border-purple-400/40 text-purple-300 shadow-md">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs sm:text-sm font-semibold italic text-purple-100 line-clamp-2">
                "{featuredSpark.content}"
              </p>
              <div className="mt-2 flex items-center justify-between text-xs text-purple-300/90 font-bold">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-orange-400" />
                  {featuredSpark.author} • {featuredSpark.minsRemaining}m remaining
                </span>
                <span className="text-purple-400 hover:underline">tap to open →</span>
              </div>
            </div>
          </div>
        </article>
      )}

      {/* 3. Main 3D Tilted & Rotated Orbit Viewport */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        className={`relative w-full min-h-[580px] sm:min-h-[660px] flex items-center justify-center overflow-hidden rounded-3xl border-2 border-purple-500/30 bg-[#03050d] shadow-2xl p-4 select-none cursor-grab ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/60 via-[#050814] to-[#020308] pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-purple-600/15 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 h-96 w-96 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {CELESTIAL_STARS.map((star) => (
            <div
              key={star.id}
              className="absolute rounded-full animate-pulse"
              style={{
                top: star.top,
                left: star.left,
                width: `${star.size}px`,
                height: `${star.size}px`,
                backgroundColor: star.color,
                opacity: star.opacity,
                boxShadow: `0 0 ${star.size * 3}px ${star.color}`,
                animationDuration: `${star.duration}s`,
                animationDelay: `${star.delay}s`,
              }}
            />
          ))}
        </div>
        
        <div className="absolute inset-0 bg-[radial-gradient(#8b5cf6_1.5px,transparent_1.5px)] [background-size:40px_40px] opacity-15 pointer-events-none" />

        <div className="absolute top-4 left-4 z-30 flex items-center gap-2 rounded-full bg-black/60 border border-purple-500/30 px-3.5 py-1.5 text-[10px] font-extrabold text-purple-300 backdrop-blur-md shadow-lg pointer-events-none">
          <Move className="h-3.5 w-3.5 text-orange-400 animate-pulse" />
          <span>Drag 3D Sky (360° Rotate & Tilt)</span>
        </div>

        <div
          className="relative flex items-center justify-center"
          style={{
            perspective: '1200px',
            width: '100%',
            height: '100%',
          }}
        >
          <div
            className="relative flex items-center justify-center"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateX(${tiltAngle}deg) rotateZ(${rotationAngle}deg)`,
              width: '400px',
              height: '400px',
              transition: isDragging ? 'none' : 'transform 0.1s linear',
            }}
          >
            
            {[200, 320, 480].map((radius, i) => (
              <div
                key={`ring-${i}`}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: `${radius * 2}px`,
                  height: `${radius * 2}px`,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  border: '2px solid rgba(139, 92, 246, 0.25)',
                  boxShadow: hoveredRing === i ? '0 0 20px rgba(139, 92, 246, 0.4) inset, 0 0 20px rgba(139, 92, 246, 0.4)' : 'none',
                  transition: 'box-shadow 0.3s ease',
                  zIndex: 10,
                }}
              />
            ))}

            {sparks.map((spark) => {
              const radius = [200, 320, 480][spark.orbitRingIndex || 0] || 320;
              const baseAngleRad = (spark.orbitAngle || 0) * (Math.PI / 180);
              const rx = radius;
              const ry = radius * 0.55; 
              const posX = Math.cos(baseAngleRad) * rx;
              const posY = Math.sin(baseAngleRad) * ry;
              const glowColor = spark.glowColor || '#06b6d4';

              return (
                <div
                  key={spark.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewSpark(spark);
                    onSelectSpark(spark);
                  }}
                  onMouseEnter={() => {
                    setPreviewSpark(spark);
                    setHoveredRing(spark.orbitRingIndex || 2);
                  }}
                  onMouseLeave={() => setHoveredRing(null)}
                  className="absolute cursor-pointer group pointer-events-auto z-30"
                  style={{
                    left: `calc(50% + ${posX}px)`,
                    top: `calc(50% + ${posY}px)`,
                    transform: `translate(-50%, -50%) rotateZ(${-rotationAngle}deg) rotateX(${-tiltAngle}deg)`,
                  }}
                >
                  <div className="flex flex-col items-center group-hover:scale-125 transition-transform duration-200">
                    <div
                      className="relative flex h-16 w-16 items-center justify-center rounded-full border-3 bg-[#080c1a] shadow-2xl p-0.5 transition-all duration-300 group-hover:border-white"
                      style={{
                        borderColor: glowColor,
                        boxShadow: `0 0 35px ${glowColor}80`,
                      }}
                    >
                      {spark.avatar.startsWith('http') ? (
                        <img
                          src={spark.avatar}
                          alt={spark.author}
                          className="h-full w-full rounded-full object-cover shadow-sm"
                        />
                      ) : (
                        <span className="text-3xl">{spark.avatar}</span>
                      )}
                      
                      <span
                        className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-[#080c1a]"
                        style={{ backgroundColor: glowColor }}
                      />
                    </div>
                    
                    <div className="mt-2 rounded-xl bg-[#080c1a]/90 border border-slate-800 px-2.5 py-1 text-center backdrop-blur-md shadow-lg">
                      <p className="text-[11px] font-black tracking-wide text-slate-100">
                        {spark.author}
                      </p>
                      <p className="text-[9px] font-bold text-slate-400">
                        {spark.orbitLabel || 'drifting'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            <div
              className="absolute cursor-pointer group z-40"
              onClick={onOpenSky}
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) rotateZ(${-rotationAngle}deg) rotateX(${-tiltAngle}deg)`,
              }}
            >
              <div className="flex flex-col items-center group-hover:scale-110 transition-transform">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-orange-500 bg-[#060912] shadow-[0_0_50px_rgba(249,115,22,0.4)] p-1">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                    alt="Core Presence"
                    className="h-full w-full rounded-full object-cover opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 rounded-full border border-orange-400/50 animate-ping opacity-30" />
                </div>
                <div className="mt-2 rounded-xl bg-orange-500 px-3 py-1 text-center shadow-lg">
                  <p className="text-[10px] font-black tracking-widest text-white uppercase">
                    YOU
                  </p>
                </div>
                <p className="mt-1 text-[8px] uppercase tracking-[0.2em] font-extrabold text-orange-200/50 group-hover:text-orange-200">
                  Core Presence (Click Sky)
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className="flex items-center gap-2 rounded-xl bg-[#0e142e] border border-purple-500/20 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-purple-900/40 hover:text-white transition"
          >
            {isAutoRotating ? <Pause className="h-3 w-3 text-amber-400" /> : <Play className="h-3 w-3 text-emerald-400" />}
            {isAutoRotating ? 'Pause Auto-Orbit' : 'Resume Auto-Orbit'}
          </button>

          <button
            onClick={handleReset3DView}
            className="rounded-xl bg-[#0e142e] border border-purple-500/20 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-purple-900/40 hover:text-white transition"
          >
            Reset 3D View
          </button>
        </div>
      </div>

      <div className="rounded-3xl border-2 border-purple-500/20 bg-[#080b18]/80 backdrop-blur-xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <span className="h-3 w-3 rounded-full bg-orange-500 animate-ping" />
            <h3 className="text-xs font-black uppercase tracking-widest text-orange-400">
              Current Resonance
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-300">
            3 drifting nearby
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-100 font-semibold leading-relaxed mb-4">
          Elena drifted closer 2 hours ago. A quiet shared silence lingers between your skies.
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
                alt="Elena"
                className="h-8 w-8 rounded-full border-2 border-[#0e142e] object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
                alt="Maya"
                className="h-8 w-8 rounded-full border-2 border-[#0e142e] object-cover"
              />
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0e142e] bg-purple-900 text-xs font-bold text-purple-300">
                +1
              </div>
            </div>
          </div>

          <button
            onClick={handleSendPulse}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-xs font-extrabold text-white hover:brightness-110 shadow-[0_0_30px_rgba(249,115,22,0.5)] transition"
          >
            <Sparkles className="h-4 w-4" />
            <span>Send Pulse</span>
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-purple-500/20 text-center text-[11px] text-purple-300/70 font-semibold">
          ⏳ Farther souls soften gently into starlight
        </div>
      </div>

    </main>
  );
};

export default OrbitMap;

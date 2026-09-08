import { useState, useEffect } from 'react';
import { Compass, Clock, Lock, MessageCircle, Sparkles, Plus, BookOpen, RotateCcw, ShieldCheck } from 'lucide-react';
import OrbitMap from './components/OrbitMap';
import ConstellationRoom from './components/ConstellationRoom';
import SkyProfile from './components/SkyProfile';
import SparkModal from './components/SparkModal';
import ResonanceChat from './components/ResonanceChat';
import PitchModal from './components/PitchModal';
import CreateSparkModal from './components/CreateSparkModal';
import { CONSTELLATIONS, orbitStore } from './services/orbitStore';
import { soundFx } from './services/soundEffects';

function App() {
  const [activeTab, setActiveTab] = useState('orbital'); // 'orbital' | 'constellations' | 'sky' | 'chats'
  const [selectedConstellationId, setSelectedConstellationId] = useState(null);
  const [sparks, setSparks] = useState(orbitStore.getSparks());
  const [skySparks, setSkySparks] = useState(orbitStore.getSky());
  
  // Modals
  const [activeSpark, setActiveSpark] = useState(null);
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatSparkId, setChatSparkId] = useState(null);

  // Time decay notification toast
  const [decayToast, setDecayToast] = useState('');

  useEffect(() => {
    const update = () => {
      setSparks(orbitStore.getSparks());
      setSkySparks(orbitStore.getSky());
    };
    const unsubscribe = orbitStore.subscribe(update);
    return () => unsubscribe();
  }, []);

  // Demo Control: Fast-Forward Time ("Let a moment pass")
  const handleLetMomentPass = () => {
    soundFx.playTimePassSound();
    orbitStore.fastForwardTime(15);
    setDecayToast('⏳ Fast-forwarded 15 mins! Un-anchored moments aged & faded.');
    setTimeout(() => setDecayToast(''), 3000);
  };

  const handleResetDemo = () => {
    orbitStore.resetDemo();
    setDecayToast('🔄 Reset demo state to initial Sparks.');
    setTimeout(() => setDecayToast(''), 2500);
  };

  const handleOpenConstellation = (id) => {
    setSelectedConstellationId(id);
    setActiveTab('constellations');
  };

  const handleOpenChatForSpark = (sparkId) => {
    setChatSparkId(sparkId);
    setShowChatModal(true);
  };

  const mutualCount = sparks.filter((s) => s.resonanceStatus === 'mutual').length;

  return (
    <div className="min-h-screen bg-[#04060c] text-slate-100 font-sans selection:bg-purple-500 selection:text-white pb-24">
      
      {/* 1. Header Bar */}
      <header className="sticky top-0 z-40 border-b border-purple-500/20 bg-[#060912]/90 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between">
        
        {/* Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveTab('orbital')}
            className="cursor-pointer flex items-center gap-2.5 group"
          >
            {/* Custom Atom Logo matching uploaded image */}
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-300 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition overflow-hidden border border-slate-400">
              {/* Orbits */}
              <svg viewBox="0 0 100 100" className="absolute w-[120%] h-[120%] text-[#1e293b]">
                <ellipse cx="50" cy="50" rx="36" ry="12" fill="none" stroke="currentColor" strokeWidth="4" transform="rotate(30 50 50)" />
                <ellipse cx="50" cy="50" rx="36" ry="12" fill="none" stroke="currentColor" strokeWidth="4" transform="rotate(90 50 50)" />
                <ellipse cx="50" cy="50" rx="36" ry="12" fill="none" stroke="currentColor" strokeWidth="4" transform="rotate(150 50 50)" />
              </svg>
              
              {/* Bronze Core */}
              <div className="absolute z-10 h-4 w-4 rounded-full bg-gradient-to-br from-[#f59e0b] via-[#b45309] to-[#78350f] shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),_0_2px_5px_rgba(0,0,0,0.6)] flex items-center justify-center">
                {/* Engraved 4-Point Star */}
                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-[#451a03] opacity-80 mix-blend-multiply" fill="currentColor">
                  <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5L12 2Z" />
                </svg>
              </div>
            </div>
            
            <div>
              <span className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
                Orbit
              </span>
              <p className="text-[10px] text-purple-300/70 font-semibold leading-none">
                moments, not metrics
              </p>
            </div>
          </div>
        </div>

        {/* Header Tabs Navigation */}
        <div className="hidden sm:flex items-center gap-1 bg-black/40 border border-purple-500/20 p-1 rounded-2xl backdrop-blur-md">
          <button
            onClick={() => setActiveTab('orbital')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'orbital'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Orbital
          </button>

          <button
            onClick={() => {
              if (!selectedConstellationId) setSelectedConstellationId(CONSTELLATIONS[0].id);
              setActiveTab('constellations');
            }}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'constellations'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Constellations
          </button>

          <button
            onClick={() => setActiveTab('sky')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'sky'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sanctuary (Sky)
          </button>
        </div>

        {/* Action Controls & Avatar */}
        <div className="flex items-center gap-2">
          
          {/* Fast-Forward Time Button ("Let a moment pass") */}
          <button
            onClick={handleLetMomentPass}
            title="Fast-forward time by 15 mins"
            className="flex items-center gap-1 rounded-xl border border-rose-500/40 bg-rose-950/30 px-3 py-1.5 text-xs font-bold text-rose-300 hover:border-rose-400 transition"
          >
            <Clock className="h-3.5 w-3.5 text-rose-400" />
            <span className="hidden md:inline">Let moment pass</span>
          </button>

          {/* Thesis Pitch Modal */}
          <button
            onClick={() => setShowPitchModal(true)}
            className="flex items-center gap-1 rounded-xl border border-purple-500/30 bg-purple-950/30 px-3 py-1.5 text-xs font-bold text-purple-300 hover:border-purple-400 transition"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Thesis</span>
          </button>

          {/* Reset Demo State */}
          <button
            onClick={handleResetDemo}
            title="Reset demo data"
            className="rounded-xl border border-slate-800 bg-slate-900 p-1.5 text-slate-400 hover:text-white transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          {/* Functional User Profile Avatar */}
          <button
            onClick={() => {
              soundFx.playAnchorSound();
              setActiveTab('sky');
            }}
            title="View My Sanctuary (Sky Profile)"
            className={`h-9 w-9 rounded-full border-2 p-0.5 overflow-hidden transition-all duration-200 hover:scale-110 hover:shadow-[0_0_15px_rgba(6,182,212,0.6)] cursor-pointer ${
              activeTab === 'sky'
                ? 'border-cyan-400 ring-2 ring-cyan-500/50 shadow-lg shadow-cyan-500/30'
                : 'border-purple-500/50 hover:border-cyan-300'
            }`}
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="My Profile"
              className="h-full w-full rounded-full object-cover"
            />
          </button>

        </div>
      </header>

      {/* Decay Toast Bar */}
      {decayToast && (
        <div className="bg-gradient-to-r from-rose-600/90 to-purple-600/90 text-white text-center py-1.5 px-4 text-xs font-bold animate-in slide-in-from-top duration-200">
          {decayToast}
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">

        {/* 2. Constellations Filter Bar (When in Orbital View) */}
        {activeTab === 'orbital' && (
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
              Filter Orbit:
            </span>
            <button
              onClick={() => setSelectedConstellationId(null)}
              className={`rounded-xl px-3 py-1 text-xs font-semibold shrink-0 transition ${
                selectedConstellationId === null
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              All Skies
            </button>
            {CONSTELLATIONS.map((c) => (
              <button
                key={c.id}
                onClick={() => handleOpenConstellation(c.id)}
                className={`flex items-center gap-1 rounded-xl px-3 py-1 text-xs font-semibold shrink-0 transition ${
                  selectedConstellationId === c.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <span>{c.icon}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* 3. Main Active View */}
        <div>
          {activeTab === 'orbital' && (
            <OrbitMap
              sparks={sparks}
              onSelectSpark={setActiveSpark}
              onOpenSky={() => setActiveTab('sky')}
            />
          )}

          {activeTab === 'constellations' && (
            <ConstellationRoom
              constellationId={selectedConstellationId || CONSTELLATIONS[0].id}
              sparks={sparks}
              onSelectSpark={setActiveSpark}
              onBack={() => {
                setSelectedConstellationId(null);
                setActiveTab('orbital');
              }}
              onCreateSpark={(constId) => {
                setSelectedConstellationId(constId);
                setShowCreateModal(true);
              }}
            />
          )}

          {activeTab === 'sky' && (
            <SkyProfile skySparks={skySparks} onSelectSpark={setActiveSpark} />
          )}
        </div>

      </main>

      {/* FLOATING BOTTOM NAVIGATION PILL (Matching Reference Design) */}
      <div className="fixed bottom-6 inset-x-0 z-40 flex items-center justify-center px-4 pointer-events-none">
        <div className="flex items-center gap-6 rounded-full border border-purple-500/30 bg-[#090d1c]/90 px-6 py-3 shadow-2xl backdrop-blur-xl pointer-events-auto">
          
          <button
            onClick={() => setActiveTab('orbital')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-extrabold transition ${
              activeTab === 'orbital' ? 'text-orange-400 scale-105' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="h-5 w-5" />
            <span>Orbit</span>
          </button>

          {/* Central Glowing Orange "+" Release Spark Trigger */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-orange-500 via-amber-500 to-indigo-600 shadow-[0_0_25px_rgba(249,115,22,0.6)] hover:scale-110 transition active:scale-95"
            title="Release a Spark into Orbit"
          >
            <Plus className="h-6 w-6 text-white stroke-[3]" />
          </button>

          <button
            onClick={() => setActiveTab('sky')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-extrabold transition ${
              activeTab === 'sky' ? 'text-cyan-400 scale-105' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="h-5 w-5" />
            <span>Sky</span>
          </button>

        </div>
      </div>

      {/* 5. Modals */}
      <SparkModal
        spark={activeSpark}
        onClose={() => setActiveSpark(null)}
        onOpenChat={handleOpenChatForSpark}
      />

      <ResonanceChat
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        sparkId={chatSparkId}
      />

      <PitchModal
        isOpen={showPitchModal}
        onClose={() => setShowPitchModal(false)}
      />

      <CreateSparkModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        defaultConstellationId={selectedConstellationId}
      />

    </div>
  );
}

export default App;

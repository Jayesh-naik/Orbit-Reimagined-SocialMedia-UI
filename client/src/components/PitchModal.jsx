import { X, Zap, Shield, Sparkles, Compass, UserCheck, Lock, EyeOff, Award, Code, CheckCircle2 } from 'lucide-react';

const PitchModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-3xl border border-purple-500/40 bg-[#080b18] shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-500/25 px-6 py-5 bg-gradient-to-r from-purple-950/50 via-indigo-950/30 to-transparent">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-orange-500 shadow-lg shadow-purple-500/30">
              <Compass className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                Orbit — The Anti-Feed Thesis
                <span className="rounded-full bg-orange-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-orange-400 border border-orange-500/30">
                  Frontend Odyssey Hackathon
                </span>
              </h2>
              <p className="text-xs text-purple-200/80 font-medium">Reimagining social interaction beyond conventional feed patterns</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-purple-900/40 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 text-xs md:text-sm text-slate-300 leading-relaxed">
          
          {/* Hackathon Challenge Alignment Banner */}
          <div className="rounded-2xl border-2 border-purple-500/30 bg-purple-950/30 p-4 flex items-center gap-3.5">
            <Award className="h-6 w-6 text-purple-400 shrink-0" />
            <div>
              <span className="text-xs font-black text-white uppercase tracking-wider block">
                Frontend Odyssey Main Challenge: Reimagine Social
              </span>
              <p className="text-xs text-purple-200/80">
                "Do NOT build another Instagram, Snapchat, Reddit, or X clone. Think beyond the conventional feed."
              </p>
            </div>
          </div>

          {/* Problem Statement Box */}
          <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-5 space-y-2">
            <h3 className="text-sm font-extrabold text-rose-300 flex items-center gap-2">
              <EyeOff className="h-4 w-4" />
              The Market Gap: Eliminating Toxic Feed Mechanics
            </h3>
            <p className="text-xs text-rose-200/80 leading-relaxed">
              Every existing "anti-feed" app still retains the two mechanics that make social feeds toxic:
              <strong className="text-white"> Asymmetric Metrics</strong> (followers, likes, streaks) and 
              <strong className="text-white"> Permanent Accumulation</strong> (profiles as public grids of past posts).
              <br /><br />
              <strong>Orbit attacks both mechanics directly.</strong>
            </p>
          </div>

          {/* Two Core Mechanics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-5 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <UserCheck className="h-4 w-4" />
                1. Resonance (Mutual-Only)
              </div>
              <p className="text-xs text-slate-300">
                A two-way signal. You tap it, they have to tap it back independently before a chat unlocks. No public count ever. Zero one-sided broadcasting.
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-5 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Lock className="h-4 w-4" />
                2. Anchoring (Private Sky)
              </div>
              <p className="text-xs text-slate-300">
                A private, personal act of keeping a moment from fading. Not visible to anyone else. It builds your profile ("Sky") only from things you deliberately chose to keep.
              </p>
            </div>
          </div>

          {/* Comparison Table */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-300 mb-3">
              How Orbit Replaces Conventional Feed Patterns
            </h4>
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#050812]">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-900/80 text-purple-300 font-bold">
                  <tr>
                    <th className="p-3">Orbit Interaction</th>
                    <th className="p-3">Replaces</th>
                    <th className="p-3">Why it's different</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="p-3 font-bold text-purple-300">3D Orbit Map (Radial)</td>
                    <td className="p-3 text-slate-400">Algorithmic feed</td>
                    <td className="p-3">Moments cluster by current activity/mood in 3D, not engagement algorithms</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-amber-300">Sparks (Decaying)</td>
                    <td className="p-3 text-slate-400">Permanent Posts</td>
                    <td className="p-3">Nothing accumulates by default — permanence is explicitly chosen</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-cyan-300">Resonance</td>
                    <td className="p-3 text-slate-400">Likes & DMs</td>
                    <td className="p-3">No vanity metrics; connection requires mutual reciprocity</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-pink-300">Constellations</td>
                    <td className="p-3 text-slate-400">Hashtags / Explore</td>
                    <td className="p-3">Thematic rooms entered by state, not predictive engagement traps</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-indigo-300">Sky (Sanctuary)</td>
                    <td className="p-3 text-slate-400">Public Post Grid</td>
                    <td className="p-3">Private personal map of what you kept — never a performance stage</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 9 Focus Areas Checklist */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Evaluation Criteria Audit Checklist
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-200/90 font-medium">
              <div>✓ <strong>Originality</strong>: Decaying Sparks + 3D Orbital plane</div>
              <div>✓ <strong>User Experience</strong>: 3D drag rotation + instant response</div>
              <div>✓ <strong>Meaningful Interaction</strong>: Mutual reciprocity matching</div>
              <div>✓ <strong>Creative Social Concepts</strong>: Private Sky sanctuary</div>
              <div>✓ <strong>Visual Design</strong>: Glowing 3D orbit rings + crisp avatars</div>
              <div>✓ <strong>Functionality</strong>: 100% interactive frontend prototype</div>
              <div>✓ <strong>Responsiveness</strong>: Mobile-first bottom navigation pill</div>
              <div>✓ <strong>Accessibility</strong>: High contrast + semantic layout</div>
              <div>✓ <strong>Code Quality</strong>: Modular React 18 + Vite + Tailwind</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PitchModal;

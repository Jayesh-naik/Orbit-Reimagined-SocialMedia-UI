import { useState } from 'react';
import { X, Sparkles, Send } from 'lucide-react';
import { CONSTELLATIONS, orbitStore } from '../services/orbitStore';
import { soundFx } from '../services/soundEffects';

const CreateSparkModal = ({ isOpen, onClose, defaultConstellationId }) => {
  const [content, setContent] = useState('');
  const [constellationId, setConstellationId] = useState(defaultConstellationId || CONSTELLATIONS[0].id);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    soundFx.playPulseSound();
    orbitStore.createSpark({
      content: content.trim(),
      constellationId,
    });
    setContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-3xl border border-purple-500/30 bg-[#090d18] shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-500/20 px-6 py-4 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/30">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Release a Decaying Spark</h3>
              <p className="text-[10px] text-purple-300">Sparks fade automatically unless anchored by someone</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Select Constellation Room
            </label>
            <select
              value={constellationId}
              onChange={(e) => setConstellationId(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-[#060911] px-3.5 py-2.5 text-xs text-white outline-none focus:border-purple-500"
            >
              {CONSTELLATIONS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name} ({c.tag})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Your Moment / Thought
            </label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What are you sensing, creating, or thinking right now?"
              className="w-full rounded-2xl border border-slate-800 bg-[#060911] p-4 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2 text-xs font-bold text-white hover:brightness-110 shadow-lg shadow-purple-500/25 transition"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Release into Orbit</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CreateSparkModal;

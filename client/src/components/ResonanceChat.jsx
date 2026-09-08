import { useState, useEffect } from 'react';
import { X, Send, Heart, MessageCircle, Lock, ShieldCheck } from 'lucide-react';
import { orbitStore } from '../services/orbitStore';

const ResonanceChat = ({ isOpen, onClose, sparkId }) => {
  const [selectedSparkId, setSelectedSparkId] = useState(sparkId);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const sparks = orbitStore.getSparks();
  const mutualSparks = sparks.filter((s) => s.resonanceStatus === 'mutual');
  
  const currentSparkId = selectedSparkId || sparkId || mutualSparks[0]?.id;
  const activeSpark = mutualSparks.find((s) => s.id === currentSparkId) || mutualSparks[0];

  useEffect(() => {
    if (sparkId) {
      setSelectedSparkId(sparkId);
    }
  }, [sparkId]);

  useEffect(() => {
    if (activeSpark?.id) {
      const chats = orbitStore.getChats();
      setMessages(chats[activeSpark.id] || []);
    }
  }, [activeSpark?.id]);

  if (!isOpen) return null;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeSpark) return;
    orbitStore.sendMessage(activeSpark.id, inputText.trim());
    setMessages((prev) => [...prev, { sender: 'You', text: inputText.trim(), time: 'Just now' }]);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="flex h-[85vh] w-full max-w-3xl flex-col rounded-3xl border border-emerald-500/30 bg-[#070b14] shadow-2xl text-slate-100 overflow-hidden md:flex-row">
        
        {/* Left Sidebar: Mutual Connections List */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800 bg-[#04060d] p-4 flex flex-col shrink-0">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-300">
              Mutual Resonances
            </h3>
          </div>

          <div className="space-y-1.5 flex-1 overflow-y-auto">
            {mutualSparks.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSparkId(s.id)}
                className={`w-full flex items-center gap-3 rounded-xl p-3 text-left transition ${
                  s.id === activeSpark?.id
                    ? 'bg-emerald-950/40 border border-emerald-500/40 text-white'
                    : 'hover:bg-slate-900/60 text-slate-400'
                }`}
              >
                {s.avatar?.startsWith('http') ? (
                  <img src={s.avatar} alt={s.author} className="h-7 w-7 rounded-full object-cover border border-emerald-400" />
                ) : (
                  <span className="text-lg font-bold">{s.avatar}</span>
                )}
                <div className="overflow-hidden flex-1">
                  <span className="text-xs font-bold text-slate-200 block truncate">{s.author}</span>
                  <span className="text-[10px] text-slate-500 block truncate">{s.content}</span>
                </div>
              </button>
            ))}

            {mutualSparks.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-500">
                No mutual resonances yet. Tap Resonate on Sparks in Orbit!
              </div>
            )}
          </div>
        </div>

        {/* Right Chat Area */}
        {activeSpark ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900/30">
              <div className="flex items-center gap-3">
                {activeSpark.avatar?.startsWith('http') ? (
                  <img src={activeSpark.avatar} alt={activeSpark.author} className="h-9 w-9 rounded-full object-cover border border-emerald-400" />
                ) : (
                  <span className="text-2xl font-bold">{activeSpark.avatar}</span>
                )}
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    {activeSpark.author}
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/30">
                      Mutual Reciprocity Unlocked
                    </span>
                  </h4>
                  <span className="text-[10px] text-slate-400">{activeSpark.constellationTag}</span>
                </div>
              </div>

              <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Spark Context Bar */}
            <div className="border-b border-slate-800/60 bg-[#090d19] px-6 py-2.5 text-xs text-slate-300 font-medium italic truncate">
              "{activeSpark.content}"
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.sender === 'You' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md rounded-2xl p-3.5 text-xs leading-relaxed ${
                      m.sender === 'You'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none'
                        : 'bg-slate-800 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    <p>{m.text}</p>
                  </div>
                  <span className="text-[9px] text-slate-500 mt-1 px-1">{m.time}</span>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="border-t border-slate-800 p-4 flex gap-2 bg-[#050810]">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a private message..."
                className="flex-1 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-center text-xs text-slate-500">
            Select a mutual connection thread from the sidebar.
          </div>
        )}

      </div>
    </div>
  );
};

export default ResonanceChat;

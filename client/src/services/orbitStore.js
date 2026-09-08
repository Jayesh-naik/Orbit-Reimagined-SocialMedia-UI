// Orbit Anti-Feed Store & Data Engine
// 3D Orbital space state with decaying Sparks, Resonance, and Private Sky Anchoring.

const STORAGE_KEYS = {
  SPARKS: 'orbit_sparks_data',
  SKY: 'orbit_sky_anchored',
  RESONANCES: 'orbit_resonances',
  CHATS: 'orbit_chats',
};

export const CONSTELLATIONS = [
  {
    id: 'solitude',
    name: 'Quiet Horizon',
    tag: '#SolitudeSynced',
    icon: '✨',
    color: 'from-indigo-900 via-purple-950 to-[#080b18]',
    accentColor: '#f97316',
    description: 'A quiet shared silence lingering between distant skies.',
    prompt: 'What quiet thought is floating through your mind right now?',
  },
  {
    id: 'latenight',
    name: 'Late Night Thoughts',
    tag: '#LateNightThoughts',
    icon: '🌌',
    color: 'from-indigo-600 via-purple-600 to-slate-900',
    accentColor: '#8b5cf6',
    description: 'Raw, unfiltered midnight introspections floating in deep dark space.',
    prompt: 'What keeps you awake when the world goes quiet?',
  },
  {
    id: 'coffeebreak',
    name: 'Coffee Break',
    tag: '#CoffeeBreak',
    icon: '☕',
    color: 'from-amber-600 via-orange-600 to-stone-900',
    accentColor: '#f59e0b',
    description: 'Pause, step back from the screen, and take a deep breath.',
    prompt: 'What small thing brought you peace today?',
  },
  {
    id: 'codingflow',
    name: 'Coding Flow',
    tag: '#CodingFlow',
    icon: '⚡',
    color: 'from-cyan-600 via-blue-600 to-slate-900',
    accentColor: '#06b6d4',
    description: 'In the zone, shipping code against the ticking clock.',
    prompt: 'What elegant solution or bug solver did you just crack?',
  },
  {
    id: 'vinylvibes',
    name: 'Vinyl Vibes',
    tag: '#VinylVibes',
    icon: '🎵',
    color: 'from-rose-600 via-pink-600 to-stone-900',
    accentColor: '#ec4899',
    description: 'Obscure tracks, analog warmth, and late-night music discoveries.',
    prompt: 'What song is playing on repeat in your head right now?',
  },
];

const INITIAL_SPARKS = [
  {
    id: 'spark-maya',
    author: 'Maya',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    statusTag: 'creating',
    content: 'watching the rain tap the window...',
    constellationId: 'solitude',
    constellationTag: '#SolitudeSynced',
    minsRemaining: 4,
    maxMins: 60,
    orbitRingIndex: 1,
    orbitRadiusX: 180,
    orbitRadiusY: 90,
    angleDeg: 310, // top-left orbit position
    glowColor: '#06b6d4', // cyan glow
    resonanceStatus: 'none',
    isMutualPreset: true,
    isAnchored: false,
    createdAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
  },
  {
    id: 'spark-kal',
    author: 'Kal',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    statusTag: 'reading',
    content: 'Deep in Chapter 4 of Philosophy of Mind. The concept of subjective experience feels unreal.',
    constellationId: 'latenight',
    constellationTag: '#LateNightThoughts',
    minsRemaining: 24,
    maxMins: 60,
    orbitRingIndex: 2,
    orbitRadiusX: 260,
    orbitRadiusY: 130,
    angleDeg: 35, // top-right outer
    glowColor: '#a855f7', // purple
    resonanceStatus: 'none',
    isMutualPreset: true,
    isAnchored: false,
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
  {
    id: 'spark-elena',
    author: 'Elena',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    statusTag: 'closer • 2h',
    content: 'Elena drifted closer 2 hours ago. A quiet shared silence lingers between your skies.',
    constellationId: 'solitude',
    constellationTag: '#SolitudeSynced',
    minsRemaining: 48,
    maxMins: 90,
    orbitRingIndex: 1,
    orbitRadiusX: 190,
    orbitRadiusY: 95,
    angleDeg: 125, // bottom-right inner
    glowColor: '#f97316', // glowing copper/orange
    resonanceStatus: 'none',
    isMutualPreset: true,
    isAnchored: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'spark-jun',
    author: 'Jun',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    statusTag: 'listening',
    content: 'Lo-fi beats and warm tea while reviewing 3D rotation math.',
    constellationId: 'vinylvibes',
    constellationTag: '#VinylVibes',
    minsRemaining: 18,
    maxMins: 45,
    orbitRingIndex: 2,
    orbitRadiusX: 270,
    orbitRadiusY: 135,
    angleDeg: 215, // bottom-left outer
    glowColor: '#10b981', // emerald
    resonanceStatus: 'none',
    isMutualPreset: false,
    isAnchored: false,
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
  {
    id: 'spark-lyra',
    author: 'Lyra',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    statusTag: 'stargazing',
    content: 'Counting shooting stars from the roof.',
    constellationId: 'deepspace',
    constellationTag: '#DeepSpace',
    minsRemaining: 32,
    maxMins: 60,
    orbitRingIndex: 3,
    orbitRadiusX: 340,
    orbitRadiusY: 170,
    angleDeg: 295, // outer top left
    glowColor: '#3b82f6', // blue
    resonanceStatus: 'none',
    isMutualPreset: true,
    isAnchored: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'spark-astrid',
    author: 'Astrid',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    statusTag: 'dreaming',
    content: 'The quiet before dawn is where real clarity lives.',
    constellationId: 'solitude',
    constellationTag: '#SolitudeSynced',
    minsRemaining: 55,
    maxMins: 90,
    orbitRingIndex: 3,
    orbitRadiusX: 350,
    orbitRadiusY: 175,
    angleDeg: 155, // outer bottom right
    glowColor: '#ec4899', // pink
    resonanceStatus: 'none',
    isMutualPreset: false,
    isAnchored: false,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
];

const INITIAL_CHATS = {
  'spark-elena': [
    { sender: 'Elena', text: 'Drifted into your orbit. A quiet shared silence lingers... ✨', time: '2 hours ago' },
    { sender: 'You', text: 'Glad you resonated! Rain feels peaceful tonight.', time: '1 hour ago' },
  ],
};

class OrbitStore {
  constructor() {
    this.listeners = new Set();
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.SPARKS)) {
      localStorage.setItem(STORAGE_KEYS.SPARKS, JSON.stringify(INITIAL_SPARKS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SKY)) {
      localStorage.setItem(STORAGE_KEYS.SKY, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CHATS)) {
      localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(INITIAL_CHATS));
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((fn) => fn());
  }

  getSparks() {
    const raw = localStorage.getItem(STORAGE_KEYS.SPARKS);
    const sparks = raw ? JSON.parse(raw) : INITIAL_SPARKS;
    return sparks.filter((s) => s.isAnchored || s.minsRemaining > 0);
  }

  getSky() {
    const raw = localStorage.getItem(STORAGE_KEYS.SKY);
    return raw ? JSON.parse(raw) : [];
  }

  getChats() {
    const raw = localStorage.getItem(STORAGE_KEYS.CHATS);
    return raw ? JSON.parse(raw) : INITIAL_CHATS;
  }

  sendPulse() {
    const sparks = this.getSparks();
    sparks.forEach((s) => {
      if (s.resonanceStatus === 'none' && Math.random() > 0.3) {
        s.resonanceStatus = s.isMutualPreset ? 'mutual' : 'pending';
      }
    });
    localStorage.setItem(STORAGE_KEYS.SPARKS, JSON.stringify(sparks));
    this.notify();
  }

  toggleResonance(sparkId) {
    const sparks = this.getSparks();
    const spark = sparks.find((s) => s.id === sparkId);
    if (!spark) return;

    if (spark.resonanceStatus === 'none') {
      if (spark.isMutualPreset) {
        spark.resonanceStatus = 'mutual';
        const chats = this.getChats();
        if (!chats[sparkId]) {
          chats[sparkId] = [
            { sender: spark.author, text: `Mutual signal confirmed! Connected on ${spark.constellationTag}.`, time: 'Just now' },
          ];
          localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
        }
      } else {
        spark.resonanceStatus = 'pending';
      }
    } else {
      spark.resonanceStatus = 'none';
    }

    localStorage.setItem(STORAGE_KEYS.SPARKS, JSON.stringify(sparks));
    this.notify();
    return spark;
  }

  toggleAnchor(sparkId) {
    const sparks = this.getSparks();
    const sky = this.getSky();
    const spark = sparks.find((s) => s.id === sparkId);
    if (!spark) return;

    spark.isAnchored = !spark.isAnchored;

    if (spark.isAnchored) {
      if (!sky.some((item) => item.id === sparkId)) {
        sky.unshift({
          ...spark,
          anchoredAt: new Date().toISOString(),
        });
      }
    } else {
      const idx = sky.findIndex((item) => item.id === sparkId);
      if (idx !== -1) sky.splice(idx, 1);
    }

    localStorage.setItem(STORAGE_KEYS.SPARKS, JSON.stringify(sparks));
    localStorage.setItem(STORAGE_KEYS.SKY, JSON.stringify(sky));
    this.notify();
    return spark;
  }

  fastForwardTime(minsToSubtract = 15) {
    const sparks = this.getSparks();
    sparks.forEach((s) => {
      if (!s.isAnchored) {
        s.minsRemaining = Math.max(0, s.minsRemaining - minsToSubtract);
      }
    });
    localStorage.setItem(STORAGE_KEYS.SPARKS, JSON.stringify(sparks));
    this.notify();
  }

  createSpark({ content, constellationId, glowColor }) {
    const sparks = this.getSparks();
    const constell = CONSTELLATIONS.find((c) => c.id === constellationId) || CONSTELLATIONS[0];

    const newSpark = {
      id: `spark-${Date.now()}`,
      content,
      author: 'You',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      statusTag: 'radiating',
      constellationId: constell.id,
      constellationTag: constell.tag,
      minsRemaining: 60,
      maxMins: 60,
      orbitRingIndex: 2,
      orbitRadiusX: 260,
      orbitRadiusY: 130,
      angleDeg: Math.random() * 360,
      glowColor: glowColor || constell.accentColor,
      resonanceStatus: 'none',
      isMutualPreset: Math.random() > 0.4,
      isAnchored: false,
      createdAt: new Date().toISOString(),
    };

    sparks.unshift(newSpark);
    localStorage.setItem(STORAGE_KEYS.SPARKS, JSON.stringify(sparks));
    this.notify();
    return newSpark;
  }

  sendMessage(sparkId, messageText) {
    const chats = this.getChats();
    if (!chats[sparkId]) chats[sparkId] = [];
    chats[sparkId].push({
      sender: 'You',
      text: messageText,
      time: 'Just now',
    });
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
    this.notify();
  }

  resetDemo() {
    localStorage.setItem(STORAGE_KEYS.SPARKS, JSON.stringify(INITIAL_SPARKS));
    localStorage.setItem(STORAGE_KEYS.SKY, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(INITIAL_CHATS));
    this.notify();
  }
}

export const orbitStore = new OrbitStore();

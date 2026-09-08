// Orbit Sound Effects Synthesizer using Web Audio API
// Generates crystal-clear cosmic audio tones without external MP3 asset dependencies.

class SoundEffectsEngine {
  constructor() {
    this.audioCtx = null;
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // 1. Resonate Chime Sound (Warm 2-tone harmonic chime)
  playResonateSound() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      // Harmonic interval (A4 -> E5)
      osc1.frequency.setValueAtTime(440, now);
      osc2.frequency.setValueAtTime(659.25, now + 0.05);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.exponentialRampToValueAtTime(0.25, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now + 0.05);

      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  // 2. Anchor Sound (Deep cosmic lock chime)
  playAnchorSound() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';

      // Lock frequency drop & resonate (C4 -> C5)
      osc.frequency.setValueAtTime(261.63, now);
      osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.1);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.exponentialRampToValueAtTime(0.3, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.75);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  // 3. Pulse Burst Sound (Cosmic warp sweep)
  playPulseSound() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(720, now + 0.25);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.exponentialRampToValueAtTime(0.2, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  // 4. Time Pass / Decay Sound
  playTimePassSound() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.3);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }
}

export const soundFx = new SoundEffectsEngine();

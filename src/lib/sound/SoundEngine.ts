/**
 * SoundEngine — pure Web Audio API synthesizer.
 *
 * No audio files, no external libraries. Every effect is generated on the fly
 * from oscillators + noise buffers. This keeps bundle size tiny and matches
 * the site's synthetic / tech aesthetic.
 *
 * All methods are no-ops before `unlock()` is called — browsers require a
 * user gesture before an AudioContext can produce sound.
 */

export type SoundName =
  | "hover"
  | "click"
  | "clickPrimary"
  | "whoosh"
  | "chime"
  | "menuOpen"
  | "menuClose"
  | "projectA"
  | "projectB"
  | "projectC"
  | "success"
  | "descend";

export class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private unlocked = false;
  private noiseBuffer: AudioBuffer | null = null;

  /** Minimum ms between consecutive hover ticks so rapid mousemove doesn't machine-gun. */
  private lastHoverAt = 0;
  private static HOVER_DEBOUNCE_MS = 55;

  /** Call this from a user gesture (pointerdown / keydown). */
  unlock(): void {
    if (this.unlocked) return;
    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctx) return;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.35; // global volume cap
      this.master.connect(this.ctx.destination);
      this.noiseBuffer = this.createNoiseBuffer(1.0);
      this.unlocked = true;
    } catch {
      // Silently fail — sound is a progressive enhancement
    }
  }

  isUnlocked(): boolean {
    return this.unlocked;
  }

  setMasterVolume(v: number): void {
    if (this.master) this.master.gain.value = Math.max(0, Math.min(1, v));
  }

  play(name: SoundName): void {
    if (!this.unlocked || !this.ctx || !this.master) return;

    switch (name) {
      case "hover":
        this.playHover();
        break;
      case "click":
        this.playClick();
        break;
      case "clickPrimary":
        this.playClickPrimary();
        break;
      case "whoosh":
        this.playWhoosh();
        break;
      case "chime":
        this.playChime();
        break;
      case "menuOpen":
        this.playMenu(true);
        break;
      case "menuClose":
        this.playMenu(false);
        break;
      case "projectA":
        this.playProjectTone(523.25); // C5
        break;
      case "projectB":
        this.playProjectTone(659.25); // E5
        break;
      case "projectC":
        this.playProjectTone(783.99); // G5
        break;
      case "success":
        this.playSuccess();
        break;
      case "descend":
        this.playDescend();
        break;
    }
  }

  // ─────────────────────────────────────────────────────────
  // Individual synthesizer voices
  // ─────────────────────────────────────────────────────────

  private playHover(): void {
    const now = performance.now();
    if (now - this.lastHoverAt < SoundEngine.HOVER_DEBOUNCE_MS) return;
    this.lastHoverAt = now;

    const ctx = this.ctx!;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1800, t);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.06, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    osc.connect(gain).connect(this.master!);
    osc.start(t);
    osc.stop(t + 0.09);
  }

  private playClick(): void {
    const ctx = this.ctx!;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(900, t);
    osc.frequency.exponentialRampToValueAtTime(450, t + 0.08);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.18, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    osc.connect(gain).connect(this.master!);
    osc.start(t);
    osc.stop(t + 0.13);
  }

  private playClickPrimary(): void {
    // Richer CTA sound — two oscillators + slight pitch dive
    const ctx = this.ctx!;
    const t = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "sawtooth";
    osc2.type = "sine";
    osc1.frequency.setValueAtTime(180, t);
    osc1.frequency.exponentialRampToValueAtTime(90, t + 0.18);
    osc2.frequency.setValueAtTime(540, t);
    osc2.frequency.exponentialRampToValueAtTime(270, t + 0.18);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1200, t);
    filter.frequency.exponentialRampToValueAtTime(400, t + 0.2);

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.22, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain).connect(this.master!);
    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.23);
    osc2.stop(t + 0.23);
  }

  private playWhoosh(): void {
    // Filtered noise sweep — classic UI whoosh
    const ctx = this.ctx!;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 1.2;
    filter.frequency.setValueAtTime(300, t);
    filter.frequency.exponentialRampToValueAtTime(2400, t + 0.35);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.12, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);

    src.connect(filter).connect(gain).connect(this.master!);
    src.start(t);
    src.stop(t + 0.42);
  }

  private playChime(): void {
    // Two-note ascending perfect fifth — cinematic resolve
    const ctx = this.ctx!;
    const t = ctx.currentTime;
    const notes = [659.25, 987.77]; // E5, B5
    notes.forEach((freq, i) => {
      const start = t + i * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.18, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.9);
      osc.connect(gain).connect(this.master!);
      osc.start(start);
      osc.stop(start + 0.95);
    });
  }

  private playMenu(opening: boolean): void {
    const ctx = this.ctx!;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 0.8;
    if (opening) {
      filter.frequency.setValueAtTime(500, t);
      filter.frequency.exponentialRampToValueAtTime(3000, t + 0.28);
    } else {
      filter.frequency.setValueAtTime(3000, t);
      filter.frequency.exponentialRampToValueAtTime(500, t + 0.28);
    }

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.14, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);

    src.connect(filter).connect(gain).connect(this.master!);
    src.start(t);
    src.stop(t + 0.34);
  }

  private playProjectTone(freq: number): void {
    const ctx = this.ctx!;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.09, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    osc.connect(gain).connect(this.master!);
    osc.start(t);
    osc.stop(t + 0.38);
  }

  private playSuccess(): void {
    // Triad arpeggio — C, E, G
    const ctx = this.ctx!;
    const t = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99];
    freqs.forEach((f, i) => {
      const start = t + i * 0.07;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(f, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.15, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.4);
      osc.connect(gain).connect(this.master!);
      osc.start(start);
      osc.stop(start + 0.45);
    });
  }

  private playDescend(): void {
    // Descending chime — signals "file coming down"
    const ctx = this.ctx!;
    const t = ctx.currentTime;
    const freqs = [783.99, 659.25, 523.25]; // G5 → E5 → C5
    freqs.forEach((f, i) => {
      const start = t + i * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.15, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.38);
      osc.connect(gain).connect(this.master!);
      osc.start(start);
      osc.stop(start + 0.42);
    });
  }

  private createNoiseBuffer(seconds: number): AudioBuffer {
    const ctx = this.ctx!;
    const sampleRate = ctx.sampleRate;
    const buffer = ctx.createBuffer(1, Math.floor(sampleRate * seconds), sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }
}

// Singleton — one engine per tab
export const soundEngine = new SoundEngine();

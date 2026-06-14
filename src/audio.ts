/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class KageAudioContext {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
  }

  /**
   * Synthesize a crisp sword clash sound effect using noise and dual filter band passes
   */
  public playSwordClash() {
    try {
      this.init();
      if (!this.ctx) return;
      
      const now = this.ctx.currentTime;
      
      // Crack/impact: oscillator pulse
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.15);
      
      oscGain.gain.setValueAtTime(0.3, now);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      
      // Resonance ring: high pitched sine waves
      const ring = this.ctx.createOscillator();
      const ringGain = this.ctx.createGain();
      ring.type = "sine";
      ring.frequency.setValueAtTime(3200, now);
      ring.frequency.exponentialRampToValueAtTime(2800, now + 0.6);
      
      const ring2 = this.ctx.createOscillator();
      const ring2Gain = this.ctx.createGain();
      ring2.type = "sine";
      ring2.frequency.setValueAtTime(4500, now);
      ring2.frequency.exponentialRampToValueAtTime(3900, now + 0.4);

      ringGain.gain.setValueAtTime(0.15, now);
      ringGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      ring2Gain.gain.setValueAtTime(0.08, now);
      ring2Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      // Low scrape white noise
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(2000, now);
      filter.Q.setValueAtTime(5, now);
      
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.15, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      // Connections
      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      
      ring.connect(ringGain);
      ringGain.connect(this.ctx.destination);
      
      ring2.connect(ring2Gain);
      ring2Gain.connect(this.ctx.destination);
      
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      // Trigger
      osc.start(now);
      ring.start(now);
      ring2.start(now);
      noise.start(now);

      osc.stop(now + 0.2);
      ring.stop(now + 0.8);
      ring2.stop(now + 0.6);
      noise.stop(now + 0.4);
    } catch (e) {
      console.warn("Audio Context init failed on interaction or is unsupported", e);
    }
  }

  /**
   * Play elevator holographic buzz or futuristic chime on button hover/tap
   */
  public playHologramTap() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.15);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch (error) { console.warn('[Audio] playback failed:', error); }
  }

  /**
   * Sound indicating achievement and medals unlocked
   */
  public playEvolveChime() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Beautiful pentatonic chime arpeggio
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C Pentatonic Scale
      notes.forEach((freq, index) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const delay = index * 0.08;

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + delay);
        gain.gain.setValueAtTime(0.12, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 0.35);
      });
    } catch (error) { console.warn('[Audio] playback failed:', error); }
  }

  /**
   * Deep zen drone loop for general immersive ambiance during meditation check-ins
   */
  public playZenHum() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc1.frequency.value = 110; // A2 note
      osc2.frequency.value = 110.5; // Detuned deep harmonic
      osc1.type = "triangle";
      osc2.type = "sawtooth";

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(180, now);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 2.5);
      osc2.stop(now + 2.5);
    } catch (error) { console.warn('[Audio] playback failed:', error); }
  }
}

export const KageAudio = new KageAudioContext();

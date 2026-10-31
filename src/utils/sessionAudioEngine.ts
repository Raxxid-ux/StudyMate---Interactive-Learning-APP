/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * StudyMate Session Audio Engine
 * Procedural Web Audio API sound generator for Frequency Tones & Lo-Fi Beats.
 * Requires 0 external audio files, operates offline, zero 404s.
 */

export type AudioTrackId = '432hz' | '528hz' | '40hz' | 'lofi-beats' | 'rain-library';

export interface AudioTrackInfo {
  id: AudioTrackId;
  name: string;
  nameMl: string;
  description: string;
  category: 'frequency' | 'lofi';
}

export const AUDIO_TRACKS: AudioTrackInfo[] = [
  {
    id: '432hz',
    name: '432 Hz Alpha Waves',
    nameMl: '432 Hz ആൽഫ തരംഗങ്ങൾ',
    description: 'Calm harmonic frequency tuned to promote relaxed, deep cognitive flow.',
    category: 'frequency',
  },
  {
    id: '528hz',
    name: '528 Hz Clarity Tone',
    nameMl: '528 Hz മനസ്സ് തെളിയുന്ന ഈണം',
    description: 'Solfeggio frequency associated with mental clarity, grounding, and reducing stress.',
    category: 'frequency',
  },
  {
    id: '40hz',
    name: '40 Hz Gamma Focus',
    nameMl: '40 Hz ഗാമ ഏകാഗ്രത',
    description: 'Rhythmic binaural pulse designed for high-alert problem solving and memory retention.',
    category: 'frequency',
  },
  {
    id: 'lofi-beats',
    name: 'Lo-Fi Study Beats',
    nameMl: 'ലോ-ഫൈ ശാന്ത ഈണങ്ങൾ',
    description: 'Warm procedural Rhodes chords, gentle bass pulses, and subtle vinyl crackle.',
    category: 'lofi',
  },
  {
    id: 'rain-library',
    name: 'Rainy Campus Library',
    nameMl: 'മഴയൊച്ചയുള്ള ലൈബ്രറി',
    description: 'Gentle ambient rain noise blended with soft harmonic study notes.',
    category: 'lofi',
  },
];

class SessionAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentTrack: AudioTrackId | null = null;
  private isRunning = false;
  private volume = 0.5;

  // Active audio nodes tracker for cleanup
  private activeNodes: { stop?: () => void; disconnect: () => void }[] = [];
  private loopTimer: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.masterGain) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getCurrentTrack(): AudioTrackId | null {
    return this.currentTrack;
  }

  public isPlaying(): boolean {
    return this.isRunning;
  }

  public play(trackId: AudioTrackId) {
    this.stop();
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.currentTrack = trackId;
    this.isRunning = true;

    switch (trackId) {
      case '432hz':
        this.start432Hz();
        break;
      case '528hz':
        this.start528Hz();
        break;
      case '40hz':
        this.start40Hz();
        break;
      case 'lofi-beats':
        this.startLofiBeats();
        break;
      case 'rain-library':
        this.startRainLibrary();
        break;
    }
  }

  public stop() {
    if (this.loopTimer !== null) {
      window.clearInterval(this.loopTimer);
      this.loopTimer = null;
    }
    this.activeNodes.forEach((node) => {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch {}
    });
    this.activeNodes = [];
    this.isRunning = false;
  }

  // 1. 432 Hz Alpha Binaural Waves
  private start432Hz() {
    if (!this.ctx || !this.masterGain) return;

    // Left channel: 432 Hz
    const oscL = this.ctx.createOscillator();
    oscL.type = 'sine';
    oscL.frequency.setValueAtTime(432, this.ctx.currentTime);

    // Right channel: 442 Hz (gives 10 Hz alpha wave binaural beat)
    const oscR = this.ctx.createOscillator();
    oscR.type = 'sine';
    oscR.frequency.setValueAtTime(442, this.ctx.currentTime);

    // Sub-bass warmth at 108 Hz (harmonic 4th suboctave)
    const oscSub = this.ctx.createOscillator();
    oscSub.type = 'triangle';
    oscSub.frequency.setValueAtTime(108, this.ctx.currentTime);

    const gainL = this.ctx.createGain();
    const gainR = this.ctx.createGain();
    const gainSub = this.ctx.createGain();

    gainL.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gainR.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gainSub.gain.setValueAtTime(0.08, this.ctx.currentTime);

    oscL.connect(gainL);
    oscR.connect(gainR);
    oscSub.connect(gainSub);

    gainL.connect(this.masterGain);
    gainR.connect(this.masterGain);
    gainSub.connect(this.masterGain);

    oscL.start();
    oscR.start();
    oscSub.start();

    this.activeNodes.push(oscL, oscR, oscSub, gainL, gainR, gainSub);
  }

  // 2. 528 Hz Solfeggio Clarity Frequency
  private start528Hz() {
    if (!this.ctx || !this.masterGain) return;

    const osc528 = this.ctx.createOscillator();
    osc528.type = 'sine';
    osc528.frequency.setValueAtTime(528, this.ctx.currentTime);

    const oscHarmonic = this.ctx.createOscillator();
    oscHarmonic.type = 'sine';
    oscHarmonic.frequency.setValueAtTime(264, this.ctx.currentTime); // octave down

    // Gentle LFO tremolo for soothing bell shimmer
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.15, this.ctx.currentTime); // 0.15 Hz slow breath

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    lfo.connect(lfoGain);

    const mainGain = this.ctx.createGain();
    mainGain.gain.setValueAtTime(0.22, this.ctx.currentTime);
    lfoGain.connect(mainGain.gain);

    osc528.connect(mainGain);
    oscHarmonic.connect(mainGain);
    mainGain.connect(this.masterGain);

    osc528.start();
    oscHarmonic.start();
    lfo.start();

    this.activeNodes.push(osc528, oscHarmonic, lfo, lfoGain, mainGain);
  }

  // 3. 40 Hz Gamma Wave
  private start40Hz() {
    if (!this.ctx || !this.masterGain) return;

    // Carrier frequency 200 Hz pulsed at 40 Hz
    const carrier = this.ctx.createOscillator();
    carrier.type = 'sine';
    carrier.frequency.setValueAtTime(200, this.ctx.currentTime);

    const pulse = this.ctx.createOscillator();
    pulse.type = 'sine';
    pulse.frequency.setValueAtTime(40, this.ctx.currentTime); // 40 Hz gamma amplitude modulation

    const pulseGain = this.ctx.createGain();
    pulseGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    pulse.connect(pulseGain);

    const carrierGain = this.ctx.createGain();
    carrierGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    pulseGain.connect(carrierGain.gain);

    carrier.connect(carrierGain);
    carrierGain.connect(this.masterGain);

    carrier.start();
    pulse.start();

    this.activeNodes.push(carrier, pulse, pulseGain, carrierGain);
  }

  // 4. Generative Lo-Fi Study Beats
  private startLofiBeats() {
    if (!this.ctx || !this.masterGain) return;

    // A. Subtle vinyl crackle generator (filtered white noise with sporadic pops)
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.015;
      if (Math.random() < 0.001) {
        output[i] = (Math.random() * 2 - 1) * 0.15; // vintage crackle pop
      }
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1400, this.ctx.currentTime);
    noiseFilter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    whiteNoise.start();

    this.activeNodes.push(whiteNoise, noiseFilter, noiseGain);

    // B. Procedural Lo-Fi Chords progression: Cmaj9 -> Am9 -> Dm7 -> G7sus
    const chords = [
      [261.63, 329.63, 392.0, 493.88, 587.33], // Cmaj9
      [220.0, 261.63, 329.63, 392.0, 440.0],  // Am9
      [293.66, 349.23, 440.0, 523.25],        // Dm7
      [196.0, 261.63, 293.66, 392.0],         // G7sus
    ];

    let chordIdx = 0;
    const playChordStep = () => {
      if (!this.ctx || !this.masterGain || !this.isRunning) return;

      const freqs = chords[chordIdx % chords.length];
      chordIdx++;

      freqs.forEach((freq, fIdx) => {
        const osc = this.ctx!.createOscillator();
        osc.type = 'triangle'; // warm electric piano timbre
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);

        const filter = this.ctx!.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800 + Math.random() * 100, this.ctx!.currentTime);

        const gain = this.ctx!.createGain();
        const now = this.ctx!.currentTime;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.045 / (fIdx + 1), now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(now);
        osc.stop(now + 3.3);
      });

      // Mellow muffled kick beat
      const kickOsc = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();
      const kickNow = this.ctx.currentTime;
      kickOsc.frequency.setValueAtTime(95, kickNow);
      kickOsc.frequency.exponentialRampToValueAtTime(35, kickNow + 0.25);
      kickGain.gain.setValueAtTime(0.18, kickNow);
      kickGain.gain.exponentialRampToValueAtTime(0.001, kickNow + 0.3);
      kickOsc.connect(kickGain);
      kickGain.connect(this.masterGain);
      kickOsc.start(kickNow);
      kickOsc.stop(kickNow + 0.35);
    };

    playChordStep();
    this.loopTimer = window.setInterval(playChordStep, 3600);
  }

  // 5. Rainy Campus Library
  private startRainLibrary() {
    if (!this.ctx || !this.masterGain) return;

    // Filtered pink noise for continuous soft rain sound
    const bufferSize = this.ctx.sampleRate * 2;
    const rainBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = rainBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      data[i] = (b0 + b1 + b2) * 0.08;
    }

    const rainSource = this.ctx.createBufferSource();
    rainSource.buffer = rainBuffer;
    rainSource.loop = true;

    const rainFilter = this.ctx.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.setValueAtTime(1100, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    rainSource.connect(rainFilter);
    rainFilter.connect(rainGain);
    rainGain.connect(this.masterGain);
    rainSource.start();

    this.activeNodes.push(rainSource, rainFilter, rainGain);

    // Occasional gentle ambient library piano note
    const notes = [261.63, 329.63, 392.0, 523.25, 587.33];
    const playRainNote = () => {
      if (!this.ctx || !this.masterGain || !this.isRunning) return;
      const noteFreq = notes[Math.floor(Math.random() * notes.length)];
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(noteFreq, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.04, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.0);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      osc.stop(now + 4.1);
    };

    playRainNote();
    this.loopTimer = window.setInterval(playRainNote, 4800);
  }
}

export const sessionAudio = new SessionAudioEngine();

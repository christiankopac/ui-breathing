class BreathingSoundGenerator {
  constructor(audioContext) {
      this.audioContext = audioContext;
      this.oscillators = [];
      this.gainNode = null;
      this.filterNode = null;
  }

  init() {
      const frequencies = [174.6, 174.6 * 2, 174.6 * 3];
      const gains = [0.6, 0.3, 0.1];

      this.gainNode = this.audioContext.createGain();
      this.filterNode = this.audioContext.createBiquadFilter();
      
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.value = 400;
      this.filterNode.Q.value = 0.3;

      frequencies.forEach((freq, i) => {
          const osc = this.audioContext.createOscillator();
          const oscGain = this.audioContext.createGain();
          
          osc.type = 'sine';
          osc.frequency.value = freq;
          oscGain.gain.value = gains[i];
          
          osc.connect(oscGain);
          oscGain.connect(this.filterNode);
          
          this.oscillators.push({ osc, gain: oscGain });
      });
      
      this.filterNode.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = 0;
      
      if (this.audioContext.state === 'suspended') {
          this.audioContext.resume();
      }
      
      for (const { osc } of this.oscillators) {
          osc.start();
      }
  }

  cleanup() {
      this.gainNode.gain.value = 0;
  }

  breathingCycle(pattern) {
      const { inhale, holdAfterInhale, exhale, holdAfterExhale } = pattern;
      const now = this.audioContext.currentTime;
      let currentTime = now + 0.05;

      this.gainNode.gain.cancelScheduledValues(now);
      this.gainNode.gain.setValueAtTime(0, now);

      const curveLength = 44100;
      const fadeInCurve = new Float32Array(curveLength);
      const fadeOutCurve = new Float32Array(curveLength);
      
      for (let i = 0; i < curveLength; i++) {
          const x = i / curveLength;
          fadeInCurve[i] = 1 / (1 + Math.exp(-12 * (x - 0.5)));
          fadeOutCurve[i] = 1 - fadeInCurve[i];
      }

      try {
          this.gainNode.gain.setValueCurveAtTime(fadeInCurve, currentTime, inhale);
          currentTime += inhale;

          if (holdAfterInhale > 0) {
              this.gainNode.gain.setValueAtTime(0.03, currentTime);
              currentTime += holdAfterInhale;
          }

          this.gainNode.gain.setValueCurveAtTime(fadeOutCurve, currentTime, exhale);
          currentTime += exhale;

          if (holdAfterExhale > 0) {
              this.gainNode.gain.setValueAtTime(0.01, currentTime);
          }
      } catch (error) {
          console.error('Error scheduling audio:', error);
          this.cleanup();
      }
  }

  stop() {
      try {
          this.gainNode.gain.value = 0;
          for (const { osc } of this.oscillators) {
              osc.stop(this.audioContext.currentTime + 0.1);
          }
      } catch (error) {
          console.error('Error stopping audio:', error);
      }
  }
}

export default BreathingSoundGenerator;
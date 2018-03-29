import Component from '@ember/component';
import { empty, equal, gte, reads } from '@ember/object/computed';

const DEFAULT_FREQ = 240;

export default Component.extend({
  classNames: ['demo-one'],
  attributeBindings: ['tabindex'],

  maxNumberOfTonesCreated: gte('numOfTones', 4),
  noTones: equal('tones.length', 0),
  numOfTones: reads('tones.length'),

  init() {
    this._super(...arguments);
    this.set('audioCtx', new (window.AudioContext || window.webkitAudioContext)());
    this.set('gainNode', this.get('audioCtx').createGain());
    this.get('gainNode').gain.setValueAtTime(0.2, this.get('audioCtx').currentTime);
    this.set('tones', []);
  },

  didInsertElement() {
    this._super(...arguments);
  //  this._loadBg();
  //  this._loadTrack();
    this._loadMyMic();
    this.element.focus();
  },

  _loadBg() {
    let audioCtx = this.get('audioCtx');
    let gainNode = this.get('gainNode');
    let freqs = [340, 510];
    freqs.forEach((freq) => {
      let oscillator = audioCtx.createOscillator();
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime); // value in hertz // 340, 510
      oscillator.detune.setValueAtTime(100, audioCtx.currentTime);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
    });
  },

  _loadMyMic() {
    var audioCtx = this.get('audioCtx');
    // Webkit/blink browsers need prefix, Safari won't work without window.
    var analyser = audioCtx.createAnalyser();
    var distortion = audioCtx.createWaveShaper();
    var gainNode = audioCtx.createGain();
    var biquadFilter = audioCtx.createBiquadFilter();

    function makeDistortionCurve(amount) {
      var k = typeof amount === 'number' ? amount : 50,
        n_samples = 44100,
        curve = new Float32Array(n_samples),
        deg = Math.PI / 180,
        i = 0,
        x;
      for ( ; i < n_samples; ++i ) {
        x = i * 2 / n_samples - 1;
        curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
      }
      return curve;
    }

    function voiceChange(type) {
      distortion.oversample = '24x';
    //  biquadFilter.gain.value = 0; // reset the effects each time the voiceChange function is run

      var voiceSetting = type;

      if(voiceSetting == "distortion") {
        distortion.curve = makeDistortionCurve(4200);
      } else if(voiceSetting == "biquad") {
        biquadFilter.type = "lowshelf";
        biquadFilter.frequency.value = 1000;
        biquadFilter.gain.value = 25; // apply lowshelf filter to sounds using biquad
      } else if(voiceSetting == "off") {
        return;
      }

    }


    navigator.mediaDevices.getUserMedia({ audio: true, })
      .then((stream) => {
        var source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.connect(distortion);
        distortion.connect(biquadFilter);
        biquadFilter.connect(gainNode);
        gainNode.connect(audioCtx.destination); // connecting the different audio graph nodes together

        voiceChange("distortion");
      })
      // Error callback
      .catch((err) => {
        console.log('The following gUM error occured: ' + err);
    });
  },

  _loadTrack() {
    if (this.get('noTones') || !this.get('maxNumberOfTonesCreated')) {
      let factor = this.get('numOfTones') + 1;
      let audioCtx = this.get('audioCtx');
      let gainNode = this.get('gainNode');
      let oscillator = audioCtx.createOscillator();
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(factor * 2 * 85, audioCtx.currentTime); // value in hertz // 340, 510
      oscillator.detune.setValueAtTime(100, audioCtx.currentTime);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      this.get('tones').pushObject(oscillator);
    } else {
      console.log({ len: this.get('tones.length')});
      console.log("max number of tones");
    }
  },

  /* keyUp(ev) {
    let tones = this.get('tones');
    if (ev.keyCode === 8) {
      if (tones.get('length')) {
        tones.popObject().stop();
      }
    }
    if (ev.keyCode === 13) {
      this._loadTrack();
    }
  }, */

  createTone(freq) {
    let audioCtx = this.get('audioCtx');
    let gainNode = this.get('gainNode');
    let oscillator = audioCtx.createOscillator();
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime); // value in hertz // 340, 510
    oscillator.detune.setValueAtTime(100, audioCtx.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    this.set('tone', oscillator);
  },

  createCustomTone(freq) {
    var real = new Float32Array([0,0,0,0,0,1]);
    var imag = new Float32Array([1,1,0.5,2,1,-1]);
    var ac = this.get('audioCtx');
    let gainNode = this.get('gainNode');
    var osc = ac.createOscillator();
    var wave = ac.createPeriodicWave(real, imag);

    osc.setPeriodicWave(wave);
    osc.frequency.setValueAtTime(freq, ac.currentTime); // value in hertz // 340, 510
    osc.connect(gainNode);
    gainNode.connect(ac.destination);

    osc.start();
    this.set('tone', osc);
  },

  keyUp(ev) {
    let tone = this.get('tone');
    if (tone) {
      tone.stop();
    }
    this.set('tone', null);
  },

  keyDown(ev) {
    if (!this.get('tone')) {
      let frequency = ev.keyCode ? (ev.keyCode * 110) / 50 : DEFAULT_FREQ;
      this.createTone(frequency);
      return;
    }
    return;
  }
});

import * as Tone from 'tone';

export const makeSynth = () =>
    new Tone.FMSynth({
        harmonicity: 3,
        modulationIndex: 2,
        detune: 0,
        envelope: {
            attack: 0.01,
            decay: 0.1,
            sustain: 0.5,
            release: 1,
        },
        modulation: {
            type: 'sine',
        },
        modulationEnvelope: {
            attack: 0.01,
            decay: 0.1,
            sustain: 0.5,
            release: 1,
        },
    }).toDestination();

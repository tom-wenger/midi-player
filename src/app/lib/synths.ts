import * as Tone from 'tone';
import { RecursivePartial } from 'tone/build/esm/core/util/Interface';

export const makeFMSynth = () =>
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

export const makeSynth = () =>
    new Tone.Synth({
        oscillator: {
            type: 'sine',
        },
        envelope: {
            attack: 0.01,
            decay: 0.1,
            sustain: 0.5,
            release: 1,
        },
    }).toDestination();

export const niceSineSynthOptions: RecursivePartial<Tone.SynthOptions> = {
    oscillator: {
        type: 'sine',
    },
    envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.5,
        release: 1,
    },
};

export const polySynthOptions: RecursivePartial<Tone.SynthOptions> = {
    detune: 0,
    portamento: 0,
    volume: 0,
    envelope: {
        attack: 0.005,
        attackCurve: 'linear',
        decay: 0.1,
        decayCurve: 'exponential',
        sustain: 0.3,
        release: 1,
        releaseCurve: 'exponential',
    },
    oscillator: {
        type: 'triangle',
        partialCount: 0,
        phase: 0,
    },
};

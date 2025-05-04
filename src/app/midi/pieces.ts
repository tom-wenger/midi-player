import { C_MAJOR, CHROMATIC } from '../lib/notes';

const PIECES = {
    NEVER: {
        file: 'assets/never-gonna-give-you-up.mid',
        tones: CHROMATIC,
        octaveStart: 2,
        octaveEnd: 5,
    },

    CMAJ: {
        file: 'assets/c-major.mid',
        tones: C_MAJOR,
        octaveStart: 2,
        octaveEnd: 5,
    },

    VIVA: {
        file: 'assets/viva-la-vida.mid',
        tones: CHROMATIC,
        octaveStart: 2,
        octaveEnd: 5,
    },

    MERULO: {
        file: 'assets/merulo-canzon-quinta.midi',
        tones: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'A', 'A#', 'B'],
        octaveStart: 2,
        octaveEnd: 5,
    },
    SHAPE: {
        file: 'assets/shape-of-you.mid',
        tones: CHROMATIC,
        octaveStart: 2,
        octaveEnd: 5,
    },
    SHERIFF: {
        file: 'assets/sheriff.mid',
        tones: CHROMATIC,
        octaveStart: 2,
        octaveEnd: 5,
    },
};

export default PIECES;

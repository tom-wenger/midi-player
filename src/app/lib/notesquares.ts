import { Notesquare } from './notes';

export type NotesquareConfig = {
    octaves: number;
    startOctave: number;
    noteNames: string[];
    canvas: HTMLCanvasElement;
};

export const initializeNoteSquares = (config: NotesquareConfig) => {
    const { octaves, startOctave, noteNames, canvas } = config;
    const notesPerOctave = noteNames.length;
    const squareWidth = canvas.width / notesPerOctave;
    const squareHeight = canvas.height / octaves;

    const noteSquares: Notesquare[] = [];

    for (let i = 0; i < octaves; i++) {
        for (let j = 0; j < notesPerOctave; j++) {
            const x = j * squareWidth;
            const y = i * squareHeight;
            noteSquares.push({
                ocatave: startOctave + octaves - 1 - i,
                note: noteNames[j],
                x: x,
                y: y,
                width: squareWidth,
                height: squareHeight,
            });
        }
    }
    return noteSquares;
};

export const drawNotesSquares = (noteSquares: Notesquare[], ctx: CanvasRenderingContext2D) => {
    noteSquares.forEach(noteSquare => {
        console.log('noteSquare', noteSquare);
        ctx.fillStyle = 'rgb(9, 9, 9)';
        ctx.fillRect(noteSquare.x, noteSquare.y, noteSquare.width, noteSquare.height);
    });
};

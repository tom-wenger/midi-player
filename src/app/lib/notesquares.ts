export type NotesquareConfig = {
    startOctave: number;
    endOctave: number;
    noteNames: string[];
    canvas: HTMLCanvasElement;
};

export type Notesquare = {
    ocatave: number;
    pitch: string;
    x: number;
    y: number;
    width: number;
    height: number;
    noteColor: string;
};

export const initializeNoteSquares = (config: NotesquareConfig) => {
    const { startOctave, endOctave, noteNames, canvas } = config;
    const notesPerOctave = noteNames.length;
    const octaves = endOctave - startOctave + 1;
    console.log('🚀 ~ octaves:', octaves);

    // Subtract the total gap space from the canvas dimensions
    const gap = 1; // 1px gap
    const squareWidth = (canvas.width - (notesPerOctave - 1) * gap) / notesPerOctave;
    const squareHeight = (canvas.height - (octaves - 1) * gap) / octaves;

    const noteSquares: Notesquare[] = [];

    for (let i = 0; i < octaves; i++) {
        for (let j = 0; j < notesPerOctave; j++) {
            const x = j * (squareWidth + gap); // Add gap to x position
            const y = i * (squareHeight + gap); // Add gap to y position

            // Generate a gradient-like color based on position
            const red = Math.floor((x / canvas.width) * 255); // Normalize x to [0, 255]
            const green = Math.floor((y / canvas.height) * 255); // Normalize y to [0, 255]
            const blue = Math.floor(((i + j) / (octaves + notesPerOctave)) * 255); // Combine i and j for variation

            const noteColor = `${red}, ${green}, ${blue}`;

            noteSquares.push({
                ocatave: startOctave + octaves - 1 - i,
                pitch: noteNames[j],
                x: x,
                y: y,
                width: squareWidth,
                height: squareHeight,
                noteColor: noteColor, // Assign the generated color
            });
        }
    }
    return noteSquares;
};

export const drawNotesSquares = (noteSquares: Notesquare[], ctx: CanvasRenderingContext2D) => {
    noteSquares.forEach(noteSquare => {
        ctx.fillStyle = 'rgb(9, 9, 9)';
        ctx.fillRect(noteSquare.x, noteSquare.y, noteSquare.width, noteSquare.height);
    });
};

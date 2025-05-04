import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, inject, viewChild } from '@angular/core';
import * as Tone from 'tone';
import { TransportClass } from 'tone/build/esm/core/clock/Transport';
import { Note, Notesquare } from '../lib/notes';
import { drawNotesSquares, initializeNoteSquares } from '../lib/notesquares';
import { makeSynth } from '../lib/synths';

const NOTE_COLORS_RGB = {
    //https://coolors.co/219ebc
    1: '142, 202, 230',
    2: '33, 158, 188',
    3: '2, 48, 71',
    4: '255, 183, 3',
    5: '251, 133, 0',
};

const NOTES_HEIGHTS = {
    1: 0,
    2: 100,
    3: 200,
    4: 300,
    5: 400,
};

const NOTE_NAMES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

// interface DrawNote {
//     x: number;
//     y: number;
//     color: string;
// }

@Component({
    selector: 'app-loop',
    imports: [],
    templateUrl: './loop.component.html',
    styleUrl: './loop.component.scss',
})
export class LoopComponent {
    private readonly document = inject(DOCUMENT);
    private window = this.document.defaultView!;

    canvasElement = viewChild.required<ElementRef<HTMLCanvasElement>>('canvasElement');
    canvas!: HTMLCanvasElement;
    private ctx!: CanvasRenderingContext2D;

    isPlaying = false;

    synthA!: Tone.FMSynth;
    synthB!: Tone.FMSynth;

    transport!: TransportClass;

    notesToDraw: Note[] = [];
    noteSquares: Notesquare[] = [];

    xMiddleScrreen = this.window.innerWidth / 2;
    yTopOffset = 200;

    ngAfterViewInit(): void {
        this.canvas = this.canvasElement().nativeElement;

        console.log('canvas', this.canvas);
        this.canvas.width = this.window.innerWidth;
        this.canvas.height = this.window.innerHeight;

        this.ctx = this.canvas.getContext('2d')!;

        this.window.addEventListener('resize', () => {
            console.log('resize', this.window.innerWidth, this.window.innerHeight);
            this.canvas.width = this.window.innerWidth;
            this.canvas.height = this.window.innerHeight;
        });

        this.noteSquares = initializeNoteSquares({
            octaves: 3,
            startOctave: 2,
            noteNames: NOTE_NAMES,
            canvas: this.canvas,
        });

        drawNotesSquares(this.noteSquares, this.ctx);
    }

    public async playSomething() {
        await Tone.start();

        this.initialize();

        this.initializeSynths();

        if (this.isPlaying) {
            this.isPlaying = false;
            Tone.getTransport().stop();
            return;
        }
        this.isPlaying = true;
        const draw = Tone.getDraw();

        const loopA = new Tone.Loop(time => {
            this.synthA.triggerAttackRelease('C2', '0:3:0', time);
            const duration = Tone.Time('0:3:0').toSeconds();
            const noteEndTime = time + duration;

            const noteSquare = this.noteSquares.find(noteSquare => noteSquare.note === 'C' && noteSquare.ocatave === 2);
            if (noteSquare) {
                const drawNote = new Note({
                    name: 'C2',
                    duration: duration,
                    noteStartTime: time,
                    noteEndTime: noteEndTime,
                    note: 'C',
                    octave: 2,
                    x: noteSquare.x,
                    y: noteSquare.y,
                    width: noteSquare.width,
                    height: noteSquare.height,
                    color: NOTE_COLORS_RGB[1],
                });

                this.notesToDraw.push(drawNote);
            }
            // draw.schedule(() => {
            // }, time);
        }, '1m').start(0);

        const loopB = new Tone.Loop(time => {
            this.synthB.triggerAttackRelease('E3', '4n', time);

            const duration = Tone.Time('4n').toSeconds();
            const noteEndTime = time + duration;
            const noteSquare = this.noteSquares.find(noteSquare => noteSquare.note === 'E' && noteSquare.ocatave === 3);
            if (noteSquare) {
                const drawNote = new Note({
                    name: 'E3',
                    duration: duration,
                    noteStartTime: time,
                    noteEndTime: noteEndTime,
                    note: 'E',
                    octave: 3,
                    x: noteSquare.x,
                    y: noteSquare.y,
                    width: noteSquare.width,
                    height: noteSquare.height,
                    color: NOTE_COLORS_RGB[4],
                });
                this.notesToDraw.push(drawNote);
            }
        }, '1m').start('0:2:0');

        const loopC = new Tone.Loop(time => {
            this.synthB.triggerAttackRelease('D4', '8n', time);

            const duration = Tone.Time('8n').toSeconds();
            const noteEndTime = time + duration;

            const noteSquare = this.noteSquares.find(noteSquare => noteSquare.note === 'D' && noteSquare.ocatave === 4);
            if (noteSquare) {
                const drawNote = new Note({
                    name: 'D4',
                    duration: duration,
                    noteStartTime: time,
                    noteEndTime: noteEndTime,
                    note: 'D',
                    octave: 4,
                    x: noteSquare.x,
                    y: noteSquare.y,
                    width: noteSquare.width,
                    height: noteSquare.height,
                    color: NOTE_COLORS_RGB[2],
                });
                this.notesToDraw.push(drawNote);
            }
        }, '0:2:0').start('8n');

        const loopD = new Tone.Loop(time => {
            this.synthB.triggerAttackRelease('A3', '2n', time); // Set duration to 2 quarter notes (half a bar)

            const duration = Tone.Time('2n').toSeconds();
            const noteEndTime = time + duration;

            const noteSquare = this.noteSquares.find(noteSquare => noteSquare.note === 'A' && noteSquare.ocatave === 3);
            if (noteSquare) {
                const drawNote = new Note({
                    name: 'A3',
                    duration: duration,
                    noteStartTime: time,
                    noteEndTime: noteEndTime,
                    note: 'A',
                    octave: 3,
                    x: noteSquare.x,
                    y: noteSquare.y,
                    width: noteSquare.width,
                    height: noteSquare.height,
                    color: NOTE_COLORS_RGB[3],
                });
                this.notesToDraw.push(drawNote);
            }
        }, '1m').start('0:3:0'); // Start at the third quarter note of the bar

        this.drawLoop();

        Tone.getTransport().start();
        // ramp up to 800 bpm over 10 seconds
        // Tone.getTransport().bpm.rampTo(800, 10);
    }

    draw() {
        if (this.ctx) {
            this.notesToDraw = this.notesToDraw.filter(n => n.noteEndTime > Tone.now());
            this.notesToDraw.forEach(note => {
                note.draw(this.ctx, Tone.now());
            });
        }
    }

    drawLoop = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        drawNotesSquares(this.noteSquares, this.ctx);
        this.draw();
        requestAnimationFrame(this.drawLoop);
    };

    initialize() {
        this.transport = Tone.getTransport();
        this.transport.bpm.value = 120; // or any number you want
        this.transport.timeSignature = [4, 4];
        this.transport.scheduleRepeat(time => {
            console.log('tick');
        }, '1m');
    }

    initializeSynths() {
        this.synthA = makeSynth();
        this.synthB = makeSynth();
    }

    initializeNoteSquares() {
        const OCTAVES = 3;
        const START_OCTAVE = 2;
        const NOTE_NAMES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const NOTES_PER_OCTAVE = 7;
        const NOTE_WIDTH = this.canvas.width / NOTES_PER_OCTAVE;
        const NOTE_HEIGHT = this.canvas.height / OCTAVES;

        for (let i = 0; i < OCTAVES; i++) {
            for (let j = 0; j < NOTES_PER_OCTAVE; j++) {
                const x = j * NOTE_WIDTH;
                const y = i * NOTE_HEIGHT;
                this.noteSquares.push({
                    ocatave: START_OCTAVE + OCTAVES - 1 - i,
                    note: NOTE_NAMES[j],
                    x: x,
                    y: y,
                    width: NOTE_WIDTH,
                    height: NOTE_HEIGHT,
                });
            }
        }
    }
}

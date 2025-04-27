import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, inject, viewChild } from '@angular/core';
import * as Tone from 'tone';
import { TransportClass } from 'tone/build/esm/core/clock/Transport';
import Note from '../types/Note';

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

// interface DrawNote {
//     x: number;
//     y: number;
//     color: string;
// }

@Component({
    selector: 'app-midi-visualization',
    imports: [],
    templateUrl: './midi-visualization.component.html',
    styleUrl: './midi-visualization.component.scss',
})
export class MidiVisualizationComponent {
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

    xMiddleScrreen = this.window.innerWidth / 2;
    yTopOffset = 200;

    ngAfterViewInit(): void {
        this.canvas = this.canvasElement().nativeElement;
        this.canvas.width = this.window.innerWidth;
        this.canvas.height = this.window.innerHeight;
        this.ctx = this.canvas.getContext('2d')!;

        // this.drawRect();

        this.window.addEventListener('resize', () => {
            this.canvas.width = this.window.innerWidth;
            this.canvas.height = this.window.innerHeight;
        });
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
        // let i = 50;
        const loopA = new Tone.Loop(time => {
            this.synthA.triggerAttackRelease('C2', '0:3:0', time);
            const duration = Tone.Time('0:3:0').toSeconds();
            const noteEndTime = time + duration;

            const drawNote = new Note({
                name: 'C2',
                duration: duration,
                noteStartTime: time,
                noteEndTime: noteEndTime,
                pitch: 'C',
                octave: 2,
                x: this.xMiddleScrreen,
                y: this.yTopOffset + NOTES_HEIGHTS[5],
                color: NOTE_COLORS_RGB[5],
            });

            this.notesToDraw.push(drawNote);
            // draw.schedule(() => {
            // }, time);
        }, '1m').start(0);

        const loopB = new Tone.Loop(time => {
            this.synthB.triggerAttackRelease('G2', '4n', time);

            const duration = Tone.Time('4n').toSeconds();
            const noteEndTime = time + duration;
            const drawNote = new Note({
                name: 'G2',
                duration: duration,
                noteStartTime: time,
                noteEndTime: noteEndTime,
                pitch: 'G',
                octave: 2,
                x: this.xMiddleScrreen,
                y: this.yTopOffset + NOTES_HEIGHTS[4],
                color: NOTE_COLORS_RGB[4],
            });
            this.notesToDraw.push(drawNote);

            // draw.schedule(() => {
            //     // the callback synced to the animation frame at the given time
            //     i += 10;
            //     this.drawRect(i, NOTES_HEIGHTS[3], NOTE_COLORS_RGBA[3]);
            // }, time);
        }, '1m').start('0:2:0');

        const loopC = new Tone.Loop(time => {
            this.synthB.triggerAttackRelease('E2', '8n', time);

            const duration = Tone.Time('8n').toSeconds();
            const noteEndTime = time + duration;
            const drawNote = new Note({
                name: 'E2',
                duration: duration,
                noteStartTime: time,
                noteEndTime: noteEndTime,
                pitch: 'E',
                octave: 2,
                x: this.xMiddleScrreen,
                y: this.yTopOffset + NOTES_HEIGHTS[2],
                color: NOTE_COLORS_RGB[2],
            });
            this.notesToDraw.push(drawNote);
        }, '4n').start('8n');

        const loopD = new Tone.Loop(time => {
            this.synthB.triggerAttackRelease('A2', '2n', time); // Set duration to 2 quarter notes (half a bar)

            const duration = Tone.Time('2n').toSeconds(); // Calculate the duration in seconds
            const noteEndTime = time + duration;
            const drawNote = new Note({
                name: 'A2',
                duration: duration,
                noteStartTime: time,
                noteEndTime: noteEndTime,
                pitch: 'A',
                octave: 2,
                x: this.xMiddleScrreen,
                y: this.yTopOffset + NOTES_HEIGHTS[3],
                color: NOTE_COLORS_RGB[3],
            });
            this.notesToDraw.push(drawNote);
        }, '1m').start('0:2:0'); // Start at the third quarter note of the bar

        this.drawLoop();

        Tone.getTransport().start();
        // ramp up to 800 bpm over 10 seconds
        // Tone.getTransport().bpm.rampTo(800, 10);
    }

    drawRect(x: number, y: number, color: string) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.ctx) {
            this.ctx.fillStyle = 'rgba(' + color + ')';
            this.ctx.fillRect(x, y, 100, 100);
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.ctx) {
            this.notesToDraw = this.notesToDraw.filter(n => n.noteEndTime > Tone.now());
            this.notesToDraw.forEach(note => {
                note.draw(this.ctx, Tone.now());
            });
        }
    }
    drawLoop = () => {
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
        this.synthA = new Tone.FMSynth({
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

        this.synthB = new Tone.FMSynth({
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
    }
}

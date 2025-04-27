import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, inject, viewChild } from '@angular/core';
import * as Tone from 'tone';
import { TransportClass } from 'tone/build/esm/core/clock/Transport';

const NOTE_COLORS_RGBA = {
    //https://coolors.co/219ebc
    1: '142, 202, 230,1',
    2: '33, 158, 188,1',
    3: '2, 48, 71,1',
    4: '255, 183, 3,1',
    5: '251, 133, 0,1',
};

const NOTES_HEIGHTS = {
    1: 0,
    2: 100,
    3: 200,
    4: 300,
    5: 400,
};

interface DrawNote {
    x: number;
    y: number;
    color: string;
}

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

    objectsToDraw: DrawNote[] = [];

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
        let i = 50;
        const loopA = new Tone.Loop(time => {
            this.synthA.triggerAttackRelease('C2', '0:3:0', time);
            const duration = Tone.Time('0:3:0').toSeconds();
            const noteEndTime = time + duration;

            const drawNote: DrawNote = {
                x: i,
                y: NOTES_HEIGHTS[5],
                color: NOTE_COLORS_RGBA[5],
            };

            this.objectsToDraw.push(drawNote);

            // Schedule removal of the note after noteEndTime
            setTimeout(() => {
                this.objectsToDraw = this.objectsToDraw.filter(obj => obj !== drawNote);
            }, duration * 1000); // Convert duration to milliseconds

            draw.schedule(() => {
                i += 10;
            }, time);
        }, '1m').start(0);
        const loopB = new Tone.Loop(time => {
            this.synthB.triggerAttackRelease('G2', '4n', time);
            draw.schedule(() => {
                // the callback synced to the animation frame at the given time
                i += 10;
                this.drawRect(i, NOTES_HEIGHTS[3], NOTE_COLORS_RGBA[3]);
            }, time);
        }, '1m').start('0:2:0');

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
            this.objectsToDraw.forEach(object => {
                this.ctx.fillStyle = 'rgba(' + object.color + ')';
                this.ctx.fillRect(object.x, object.y, 100, 100);
            });
        }
    }
    drawLoop = () => {
        this.draw();
        requestAnimationFrame(this.drawLoop);
    };

    initialize() {
        this.transport = Tone.getTransport();
        this.transport.bpm.value = 60; // or any number you want
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

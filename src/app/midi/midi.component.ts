import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { Midi } from '@tonejs/midi';
import * as Tone from 'tone';
import { TransportClass } from 'tone/build/esm/core/clock/Transport';
import { Note } from '../lib/notes';
import { drawNotesSquares, initializeNoteSquares, Notesquare } from '../lib/notesquares';
import { polySynthOptions } from '../lib/synths';
import PIECES from './pieces';

const CURRENT_PIECE = PIECES.SHERIFF;

@Component({
    selector: 'app-midi',
    imports: [],
    templateUrl: './midi.component.html',
    styleUrl: './midi.component.scss',
})
export class MidiComponent {
    private readonly document = inject(DOCUMENT);
    private window = this.document.defaultView!;

    canvasElement = viewChild.required<ElementRef<HTMLCanvasElement>>('canvasElement');
    canvas!: HTMLCanvasElement;
    private ctx!: CanvasRenderingContext2D;

    synthA!: Tone.FMSynth;
    transport!: TransportClass;

    isPlaying = false;

    notesToDraw: Note[] = [];
    noteSquares: Notesquare[] = [];

    ngAfterViewInit(): void {
        this.canvas = this.canvasElement().nativeElement;
        this.canvas.width = this.window.innerWidth;
        this.canvas.height = this.window.innerHeight;

        this.ctx = this.canvas.getContext('2d')!;

        this.noteSquares = initializeNoteSquares({
            startOctave: CURRENT_PIECE.octaveStart,
            endOctave: CURRENT_PIECE.octaveEnd,
            noteNames: CURRENT_PIECE.tones,
            canvas: this.canvas,
        });

        drawNotesSquares(this.noteSquares, this.ctx);
    }

    public async playSomething() {
        if (this.isPlaying) {
            this.isPlaying = false;
            this.transport.stop();
            return;
        }
        await Tone.start();

        this.initializeToneJS();

        const midi = await Midi.fromUrl(CURRENT_PIECE.file);

        //the file name decoded from the first track
        const name = midi.name;

        // const synths = midi.tracks.map(track => makeSynth());
        // console.log('🚀 ~ synths:', synths);
        //to make a 4 voice MonoSynth

        const synth = new Tone.PolySynth(Tone.Synth, polySynthOptions).toDestination();

        const uniqueNoteNames = new Set<string>(); // Create a Set to store unique note names

        //get the tracks
        midi.tracks
            .filter(track => track.notes.length > 0)
            .forEach((track, index) => {
                //tracks have notes and controlChanges
                console.log('🚀 ~ track:', track);

                const part = new Tone.Part(
                    (time, value) => {
                        // the value is an object which contains both the note and the velocity
                        synth.triggerAttackRelease(value.note, value.duration, time, value.velocity);

                        const noteSquare = this.noteSquares.find(
                            noteSquare => noteSquare.pitch === value.pitch && noteSquare.ocatave === value.octave,
                        );
                        const noteEndTime = time + value.duration;

                        if (noteSquare) {
                            const drawNote = new Note({
                                name: value.note,
                                duration: value.duration,
                                noteStartTime: time,
                                noteEndTime: noteEndTime,
                                pitch: value.pitch,
                                octave: value.octave,
                                x: noteSquare.x,
                                y: noteSquare.y,
                                width: noteSquare.width,
                                height: noteSquare.height,
                                color: noteSquare.noteColor,
                            });
                            this.notesToDraw.push(drawNote);
                        }
                    },
                    track.notes.map(note => ({
                        time: note.time,
                        note: note.name,
                        octave: note.octave,
                        pitch: note.pitch,
                        duration: note.duration,
                        velocity: note.velocity,
                    })),

                    // [
                    //     { time: 0, note: 'C3', velocity: 0.9 },
                    //     { time: '0:2', note: 'C4', velocity: 0.5 },
                    // ],
                ).start(0);

                const notes = track.notes;

                notes.forEach(note => {
                    // remove the number from the note name
                    // const noteName = note.name.substring(0, note.name.length - 1);
                    if (!uniqueNoteNames.has(note.name)) {
                        uniqueNoteNames.add(note.name); // Add the note name to the Set
                    }
                });
            });

        // log unique note names
        console.log('Unique note names:', uniqueNoteNames);

        this.drawLoop();

        this.transport.start('4s');
        this.isPlaying = true;
    }

    initializeToneJS() {
        this.transport = Tone.getTransport();
        this.transport.bpm.value = 60; // or any number you want
        this.transport.timeSignature = [4, 4];
        this.transport.scheduleRepeat(time => {
            console.log('tick');
        }, '1m');
    }

    drawLoop = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        drawNotesSquares(this.noteSquares, this.ctx);
        this.notesToDraw = this.notesToDraw.filter(n => n.noteEndTime > Tone.now());
        this.notesToDraw.forEach(note => {
            note.draw(this.ctx, Tone.now());
        });
        requestAnimationFrame(this.drawLoop);
    };
}

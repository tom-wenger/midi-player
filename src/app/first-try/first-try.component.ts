import { Component, ElementRef, viewChild } from '@angular/core';
import { Midi } from '@tonejs/midi';
import * as Tone from 'tone';

@Component({
    selector: 'app-first-try',
    imports: [],
    templateUrl: './first-try.component.html',
    styleUrl: './first-try.component.scss',
})
export class FirstTryComponent {
    title = 'midi-player';

    canvasElement = viewChild.required<ElementRef<HTMLCanvasElement>>('canvasElement');

    private ctx!: CanvasRenderingContext2D;

    ngAfterViewInit(): void {
        const canvas = this.canvasElement().nativeElement;
        this.ctx = canvas.getContext('2d')!;

        // Example: draw a red rectangle
        this.ctx.fillStyle = 'red';
        // this.ctx.fillRect(50, 50, 100, 100);

        // this.loadMidi();

        // this.playSomething();
    }

    private async loadMidi() {
        const midiFilePath = '/assets/c-major.mid'; // Adjust the path as needed
        // load a midi file in the browser
        const midi = await Midi.fromUrl(midiFilePath);
        //the file name decoded from the first track
        const name = midi.name;
        //get the tracks
        midi.tracks.forEach(track => {
            //tracks have notes and controlChanges

            //notes are an array
            const notes = track.notes;
            console.log('notes', notes);
            notes.forEach(note => {
                //note.midi, note.time, note.duration, note.name
            });

            // //the control changes are an object
            // //the keys are the CC number
            // track.controlChanges[64];
            // //they are also aliased to the CC number's common name (if it has one)
            // track.controlChanges.sustain.forEach(cc => {
            //     // cc.ticks, cc.value, cc.time
            // });

            //the track also has a channel and instrument
            //track.instrument.name
        });
    }

    public async playSomething() {
        // create two monophonic synths
        const synthA = new Tone.FMSynth().toDestination();
        const synthB = new Tone.AMSynth().toDestination();
        //play a note every quarter-note

        const draw = Tone.getDraw();

        let i = 50;

        const loopA = new Tone.Loop(time => {
            synthA.triggerAttackRelease('C2', '8n', time);
            draw.schedule(() => {
                // the callback synced to the animation frame at the given time
                this.ctx.fillStyle = 'red';
                i += 10;
                this.ctx.clearRect(0, 0, 200, 200);
                this.ctx.fillRect(i, 50, 100, 100);
                console.log('draw', time);
            }, time);
        }, '4n').start(0);
        //play another note every off quarter-note, by starting it "8n"
        // const loopB = new Tone.Loop(time => {
        //     synthB.triggerAttackRelease('C4', '8n', time);
        // }, '4n').start('8n');
        // all loops start when the Transport is started
        await Tone.start();
        Tone.getTransport().start();
        // ramp up to 800 bpm over 10 seconds
        // Tone.getTransport().bpm.rampTo(800, 10);
    }
    public async playNote() {
        //play the first note of the first track
        //create a synth and connect it to the main output (your speakers)
        await Tone.start();
        const synth = new Tone.Synth().toDestination();

        //play a middle 'C' for the duration of an 8th note
        synth.triggerAttackRelease('C4', '8n');
    }

    public async loadAndPlayMidi(filePath: string, tempoBPM = 120) {
        // Load MIDI
        const midi = await Midi.fromUrl(filePath);

        // Set up synth (polyphonic so we can play chords)
        const synth = new Tone.PolySynth(Tone.Synth).toDestination();

        // Set BPM
        const transport = Tone.getTransport();
        transport.bpm.value = tempoBPM;

        const draw = Tone.getDraw();
        let i = 50;

        // Schedule notes using Tone.Part
        midi.tracks.forEach(track => {
            const part = new Tone.Part(
                (time, note) => {
                    synth.triggerAttackRelease(note.note.name, note.note.duration, time, note.note.velocity);
                    draw.schedule(() => {
                        // the callback synced to the animation frame at the given time
                        this.ctx.fillStyle = 'red';
                        i += 10;
                        this.ctx.clearRect(0, 0, 200, 200);
                        this.ctx.fillRect(i, 50, 100, 100);
                        console.log('draw', time);
                    }, time);
                },
                track.notes.map(note => ({
                    time: note.time,
                    note: {
                        name: note.name,
                        duration: note.duration,
                        velocity: note.velocity,
                    },
                })),
            );

            part.start(0); // Start at beginning of the transport
        });

        // Start audio context (user gesture required)
        await Tone.start();
        console.log('Audio is ready');

        // Start transport
        transport.start();
    }

    public async learning() {
        const transport = Tone.getTransport();
        transport.bpm.value = 120;
        // transport.schedule(function (time) {
        //     //time = sample accurate time of the event
        //     console.log('event', time);
        // }, 0);
        //play a note every eighth note starting from the first measure

        const synth = new Tone.Synth().toDestination();
        // transport.scheduleRepeat(
        //     function (time) {
        //         synth.triggerAttackRelease('C3', '8n');
        //     },
        //     '4n',
        //     0,
        // );
        // transport.scheduleRepeat(
        //     function (time) {
        //         synth.triggerAttackRelease('G3', '8n');
        //     },
        //     '4n',
        //     '4n',
        // );
        // transport.start();
        const part = new Tone.Part(
            (time, value) => {
                // This callback is triggered at scheduled times
                synth.triggerAttackRelease(value.note, value.duration, time);
            },
            [
                { time: '0:0', note: 'C4', duration: '8n' },
                { time: '0:1', note: 'E4', duration: '8n' },
                { time: '0:2', note: 'G4', duration: '8n' },
                { time: '0:3', note: 'D4', duration: '8n' },
                { time: '1:0', note: 'C4', duration: '2n' },
            ],
        );
        await Tone.start();

        part.start(0); // start at beginning
        transport.start(); // start the transport
    }
}

export type NoteConfig = {
    name: string;
    duration: number;
    noteStartTime: number;
    noteEndTime: number;
    pitch: string;
    octave: number;
    x: number;
    y: number;
    color: string;
};

class Note {
    name: string;
    duration: number;
    noteStartTime: number;
    noteEndTime: number;
    pitch: string;
    octave: number;
    x: number;
    y: number;
    color: string;
    opacity = 1;

    constructor(config: NoteConfig) {
        this.name = config.name;
        this.duration = config.duration;
        this.noteStartTime = config.noteStartTime;
        this.noteEndTime = config.noteEndTime;
        this.pitch = config.pitch;
        this.octave = config.octave;
        this.x = config.x;
        this.y = config.y;
        this.color = config.color;
    }

    draw(ctx: CanvasRenderingContext2D, now: number) {
        // Calculate the remaining time as a fraction
        const remainingTime = Math.max(0, this.noteEndTime - now);
        const totalTime = this.noteEndTime - this.noteStartTime;

        // Update opacity based on the remaining time
        this.opacity = totalTime > 0 ? remainingTime / totalTime : 0;

        ctx.fillStyle = 'rgba(' + this.color + ', ' + this.opacity + ')';

        ctx.fillRect(this.x, this.y, 100, 100);
    }
}

export default Note;

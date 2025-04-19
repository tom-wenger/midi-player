import { Component, ElementRef, viewChild } from '@angular/core';

@Component({
    selector: 'app-midi-visualization',
    imports: [],
    templateUrl: './midi-visualization.component.html',
    styleUrl: './midi-visualization.component.scss',
})
export class MidiVisualizationComponent {
    canvasElement = viewChild.required<ElementRef<HTMLCanvasElement>>('canvasElement');
    canvas!: HTMLCanvasElement;
    private ctx!: CanvasRenderingContext2D;

    ngAfterViewInit(): void {
        this.canvas = this.canvasElement().nativeElement;
        this.ctx = this.canvas.getContext('2d')!;

        this.ctx.fillStyle = 'red';
        // this.drawRect();
    }

    public play() {
        console.log('play');
        // this.playSomething();
    }

    drawRect() {
        console.log('drawRect');

        if (this.ctx) {
            this.ctx.fillRect(50, 50, 100, 100);
        }
    }
}

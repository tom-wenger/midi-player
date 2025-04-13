import { Component, ElementRef, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'midi-player';

  // @ViewChild('canvasElement', { static: true })
  // canvasRef!: ElementRef<HTMLCanvasElement>;

  canvasElement =
    viewChild.required<ElementRef<HTMLCanvasElement>>('canvasElement');

  private ctx!: CanvasRenderingContext2D;

  ngAfterViewInit(): void {
    const canvas = this.canvasElement().nativeElement;
    this.ctx = canvas.getContext('2d')!;

    // Example: draw a red rectangle
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(50, 50, 100, 100);
  }
}

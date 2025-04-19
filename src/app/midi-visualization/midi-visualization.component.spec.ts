import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MidiVisualizationComponent } from './midi-visualization.component';

describe('MidiVisualizationComponent', () => {
  let component: MidiVisualizationComponent;
  let fixture: ComponentFixture<MidiVisualizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MidiVisualizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MidiVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

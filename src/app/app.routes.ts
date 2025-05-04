import { Routes } from '@angular/router';
import { MidiVisualizationComponent } from './midi-visualization/midi-visualization.component';
import { TestComponent } from './test/test.component';

export const routes: Routes = [
    { path: '', component: MidiVisualizationComponent },
    {
        path: 'test',
        component: TestComponent,
    },
];

import { Routes } from '@angular/router';
import { FirstTryComponent } from './first-try/first-try.component';
import { MidiVisualizationComponent } from './midi-visualization/midi-visualization.component';

export const routes: Routes = [
    { path: 'midi-visualization', component: MidiVisualizationComponent },
    {
        path: '',
        component: FirstTryComponent,
    },
];

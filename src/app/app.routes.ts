import { Routes } from '@angular/router';
import { LoopComponent } from './loop/loop.component';
import { MidiComponent } from './midi/midi.component';

export const routes: Routes = [
    { path: '', component: MidiComponent },
    {
        path: 'loop',
        component: LoopComponent,
    },
];

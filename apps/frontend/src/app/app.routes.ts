import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/main/main.component').then(m => m.MainComponent),
    },
    {
        path: 'game',
        loadComponent: () => import('./pages/game/game.component').then(m => m.GameComponent),
    },
];

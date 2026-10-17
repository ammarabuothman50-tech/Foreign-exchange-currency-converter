import { Routes } from '@angular/router';

import { FxPage } from './features/fx/fx-page/fx-page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'fx-checker' },
  { path: 'fx-checker', title: 'FX Checker', component: FxPage },
  {
    path: '**',
    title: 'Page not found',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
  },
];

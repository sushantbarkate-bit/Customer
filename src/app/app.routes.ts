import { Routes } from '@angular/router';
import { MainComponent } from './main-component/main-component';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./main-component/main-component')
            .then(m => m.MainComponent),
    },
    {
        path: 'add-contact',
        loadComponent: () => import('./add-edit-contact-component/add-edit-contact-component')
            .then(m => m.AddEditContactComponent),
    },
     {
        path: 'contact/:id/:mode',
        loadComponent: () => import('./add-edit-contact-component/add-edit-contact-component')
            .then(m => m.AddEditContactComponent),
    },
];

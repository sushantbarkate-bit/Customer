import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth-guard/auth-guard.service';

export const routes: Routes = [
    { path: '',
        loadComponent: () => import('./login/login.component')
            .then(m => m.LoginComponent)
    },
    {
        path: 'contact',
        loadComponent: () => import('./main-component/main-component')
            .then(m => m.MainComponent), canActivate: [AuthGuard]
    },
    {
        path: 'add-contact',
        loadComponent: () => import('./add-edit-contact-component/add-edit-contact-component')
            .then(m => m.AddEditContactComponent), canActivate: [AuthGuard]
    },
     {
        path: 'contact/:id/:mode',
        loadComponent: () => import('./add-edit-contact-component/add-edit-contact-component')
            .then(m => m.AddEditContactComponent), canActivate: [AuthGuard]
    },
];

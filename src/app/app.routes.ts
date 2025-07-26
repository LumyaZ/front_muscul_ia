import { Routes } from '@angular/router';
import { LoginComponent } from './views/auth/login/login.component';
import { SignupComponent } from './views/auth/signup/signup.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { TrainingInfoFormComponent } from './views/training-info/training-info-form.component';
import { ProfileComponent } from './views/profile/profile.component';

// Import des nouvelles pages du dashboard
import { HomeComponent } from './views/dashboard/home/home.component';
import { TrainingsComponent } from './views/dashboard/trainings/trainings.component';
import { RecordComponent } from './views/dashboard/record/record.component';
import { ProgramsComponent } from './views/dashboard/programs/programs.component';
import { ProfileComponent as DashboardProfileComponent } from './views/dashboard/profile/profile.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard/home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./views/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./views/auth/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'dashboard',
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./views/dashboard/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'trainings',
        loadComponent: () => import('./views/dashboard/trainings/trainings.component').then(m => m.TrainingsComponent)
      },
      {
        path: 'record',
        loadComponent: () => import('./views/dashboard/record/record.component').then(m => m.RecordComponent)
      },
      {
        path: 'programs',
        loadComponent: () => import('./views/dashboard/programs/programs.component').then(m => m.ProgramsComponent)
      },
      {
        path: 'programs/:id',
        loadComponent: () => import('./views/dashboard/program-details/program-details.component').then(m => m.ProgramDetailsComponent)
      },
      {
        path: 'programs/:id/add-exercise',
        loadComponent: () => import('./views/dashboard/add-exercise-to-program/add-exercise-to-program.component').then(m => m.AddExerciseToProgramComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./views/dashboard/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },
  {
    path: 'profile',
    loadComponent: () => import('./views/profile/profile.component').then(m => m.ProfileComponent)
  }
];

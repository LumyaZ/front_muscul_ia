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
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'training-info', component: TrainingInfoFormComponent },
  { path: 'profile', component: ProfileComponent },
  
  // Routes du dashboard
  { path: 'dashboard/home', component: HomeComponent },
  { path: 'dashboard/trainings', component: TrainingsComponent },
  { path: 'dashboard/record', component: RecordComponent },
  { path: 'dashboard/programs', component: ProgramsComponent },
  { path: 'dashboard/profile', component: DashboardProfileComponent },
  
  // Redirection par défaut du dashboard vers home
  { path: 'dashboard', redirectTo: '/dashboard/home', pathMatch: 'full' },
];

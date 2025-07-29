import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserTrainingsComponent } from './trainings/user-trainings.component';
import { UserProgramsComponent } from './programs/user-programs.component';
import { AuthService } from '../../../services/auth.service';
import { HeaderComponent } from '../../../components/header/header.component';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-you',
  standalone: true,
  imports: [
    CommonModule, 
    UserTrainingsComponent, 
    UserProgramsComponent, 
    HeaderComponent, 
    NavBarComponent
  ],
  templateUrl: './you.component.html',
  styleUrls: ['./you.component.scss']
})
export class YouComponent implements OnInit {
  private authService = inject(AuthService);
  
  user: any;
  joinDate: Date = new Date();
  selectedTab: 'trainings' | 'programs' = 'trainings';

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
  }

  selectTab(tab: 'trainings' | 'programs') {
    this.selectedTab = tab;
  }
} 
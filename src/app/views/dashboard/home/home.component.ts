import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { HeaderComponent } from '../../../components/header/header.component';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, NavBarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);

  currentUser: User | null = null;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }
} 
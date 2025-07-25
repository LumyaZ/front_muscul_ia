import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
  isActive?: boolean;
}

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  @Input() currentRoute: string = '';

  navItems: NavItem[] = [
    {
      label: 'Accueil',
      icon: 'fas fa-home',
      route: '/dashboard'
    },
    {
      label: 'Entraînements',
      icon: 'fas fa-dumbbell',
      route: '/workouts'
    },
    {
      label: 'Progression',
      icon: 'fas fa-chart-line',
      route: '/progress'
    },
    {
      label: 'Profil',
      icon: 'fas fa-user',
      route: '/profile'
    },
    {
      label: 'Plus',
      icon: 'fas fa-ellipsis-h',
      route: '/more'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateActiveState();
  }

  ngOnChanges(): void {
    this.updateActiveState();
  }

  private updateActiveState(): void {
    this.navItems.forEach(item => {
      item.isActive = this.currentRoute === item.route;
    });
  }

  onNavItemClick(item: NavItem): void {
    // Navigation vers les pages correspondantes
    console.log(`Navigation vers: ${item.route}`);
    
    // Navigation active pour les routes existantes
    if (item.route === '/dashboard' || item.route === '/profile') {
      this.router.navigate([item.route]);
    } else {
      // Pour les autres routes, afficher un message temporaire
      console.log(`Page ${item.label} en cours de développement`);
    }
  }

  getActiveClass(item: NavItem): string {
    return item.isActive ? 'active' : '';
  }
} 
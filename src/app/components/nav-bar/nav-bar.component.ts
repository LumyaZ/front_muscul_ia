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
      route: '/dashboard/home'
    },
    {
      label: 'Entraînements',
      icon: 'fas fa-dumbbell',
      route: '/dashboard/trainings'
    },
    {
      label: 'Enregistrer',
      icon: 'fas fa-plus-circle',
      route: '/dashboard/record'
    },
    {
      label: 'Programmes',
      icon: 'fas fa-list-alt',
      route: '/dashboard/programs'
    },
    {
      label: 'Vous',
      icon: 'fas fa-user',
      route: '/dashboard/profile'
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
    
    // Navigation vers toutes les pages du dashboard
    this.router.navigate([item.route]);
  }

  getActiveClass(item: NavItem): string {
    return item.isActive ? 'active' : '';
  }
} 
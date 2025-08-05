import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../components/header/header.component';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';
import { TrainingProgramService } from '../../../services/training-program.service';
import { TrainingProgram } from '../../../models/training-program.model';

/**
 * Interface representing a group of programs by category.
 * Interface représentant un groupe de programmes par catégorie.
 */
interface CategoryGroup {
  category: string;
  icon: string;
  programs: TrainingProgram[];
}

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, NavBarComponent],
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss']
})
export class ProgramsComponent implements OnInit, AfterViewInit {
  
  programs: TrainingProgram[] = [];
  
  categoryGroups: CategoryGroup[] = [];
  
  loading = false;
  
  error = '';

  searchTerm = '';
  
  selectedDifficulty = '';
  
  selectedAudience = '';
  
  showOnlyPublic = true;

  difficultyLevels = ['Débutant', 'Intermédiaire', 'Avancé'];
  
  audiences = ['Débutants', 'Sportifs confirmés', 'Athlètes expérimentés', 'Sportifs de compétition', 'Tous niveaux'];

  isAnimating = false;

  constructor(
    private trainingProgramService: TrainingProgramService,
    private router: Router
  ) {}

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   * Hook de cycle de vie appelé après l'initialisation des propriétés liées aux données.
   */
  ngOnInit(): void {
    this.loadPrograms();
  }

  /**
   * Lifecycle hook that is called after the view is initialized.
   * Hook de cycle de vie appelé après l'initialisation de la vue.
   */
  ngAfterViewInit(): void {
    this.initializeAnimations();
  }

  /**
   * Initialize smooth animations for the component.
   * Initialise les animations fluides pour le composant.
   */
  private initializeAnimations(): void {
    setTimeout(() => {
      const categorySections = document.querySelectorAll('.category-section');
      categorySections.forEach((section, index) => {
        (section as HTMLElement).style.animationDelay = `${0.3 + index * 0.1}s`;
      });
    }, 100);
  }

  /**
   * Load training programs from the service.
   * Charger les programmes d'entraînement depuis le service.
   */
  loadPrograms(): void {
    this.loading = true;
    this.error = '';
    this.isAnimating = true;

    this.trainingProgramService.getPublicPrograms().subscribe({
      next: (programs) => {
        this.programs = programs;
        this.groupProgramsByCategory();
        this.loading = false;
        this.isAnimating = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des programmes';
        this.loading = false;
        this.isAnimating = false;
        console.error('Erreur chargement programmes:', err);
      }
    });
  }

  /**
   * Groupe les programmes par catégorie
   * Group programs by category
   */
  groupProgramsByCategory(): void {
    const filteredPrograms = this.programs.filter(program => {
      const matchesSearch = !this.searchTerm || 
        program.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        program.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesDifficulty = !this.selectedDifficulty || 
        program.difficultyLevel === this.selectedDifficulty;
      
      const matchesAudience = !this.selectedAudience || 
        program.targetAudience === this.selectedAudience;
      
      const matchesVisibility = true; // Tous les programmes sont visibles maintenant

      return matchesSearch && matchesDifficulty && matchesAudience && matchesVisibility;
    });

    const categoryMap = new Map<string, TrainingProgram[]>();
    
    filteredPrograms.forEach(program => {
      const category = program.category || 'Autre';
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category)!.push(program);
    });

    this.categoryGroups = Array.from(categoryMap.entries()).map(([category, programs]) => ({
      category,
      icon: this.getCategoryIcon(category),
      programs: programs.sort((a, b) => a.name.localeCompare(b.name))
    }));

    this.categoryGroups.sort((a, b) => {
      const categoryOrder = ['Musculation', 'Cardio', 'Mixte', 'Flexibilité'];
      const aIndex = categoryOrder.indexOf(a.category);
      const bIndex = categoryOrder.indexOf(b.category);
      return aIndex - bIndex;
    });
  }

  /**
   * Apply filters and update the display.
   * Appliquer les filtres et mettre à jour l'affichage.
   */
  applyFilters(): void {
    this.isAnimating = true;
    setTimeout(() => {
      this.groupProgramsByCategory();
      this.isAnimating = false;
    }, 150);
  }

  /**
   * Clear all filters and reset to default state.
   * Effacer tous les filtres et réinitialiser à l'état par défaut.
   */
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedDifficulty = '';
    this.selectedAudience = '';
    this.showOnlyPublic = true;
    this.applyFilters();
  }

  /**
   * Get color for difficulty level badge.
   * Obtenir la couleur pour le badge de niveau de difficulté.
   * 
   * @param difficulty - The difficulty level
   * @returns Color string for the badge
   */
  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'Débutant': return '#10B981'; 
      case 'Intermédiaire': return '#F59E0B'; 
      case 'Avancé': return '#EF4444'; 
      default: return '#6B7280'; 
    }
  }

  /**
   * Get icon for category.
   * Obtenir l'icône pour la catégorie.
   * 
   * @param category - The category name
   * @returns Icon string
   */
  getCategoryIcon(category: string): string {
    switch (category) {
      case 'Musculation': return '💪';
      case 'Cardio': return '❤️';
      case 'Flexibilité': return '🧘';
      case 'Mixte': return '⚡';
      default: return '🏋️';
    }
  }

  /**
   * Get gradient color for category background.
   * Obtenir la couleur de gradient pour l'arrière-plan de la catégorie.
   * 
   * @param category - The category name
   * @returns Gradient string
   */
  getCategoryColor(category: string): string {
    switch (category) {
      case 'Musculation': return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'Cardio': return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
      case 'Flexibilité': return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
      case 'Mixte': return 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
      default: return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  }

  /**
   * Get color for program cards based on category.
   * Obtenir la couleur pour les cartes de programmes selon la catégorie.
   * 
   * @param category - The category name
   * @returns Color string for the card background
   */
  getCardColor(category: string): string {
    switch (category) {
      case 'Musculation': return 'rgba(102, 126, 234, 0.15)';
      case 'Cardio': return 'rgba(240, 147, 251, 0.15)';
      case 'Flexibilité': return 'rgba(79, 172, 254, 0.15)';
      case 'Mixte': return 'rgba(67, 233, 123, 0.15)';
      default: return 'rgba(102, 126, 234, 0.15)';
    }
  }

  /**
   * Format duration from minutes to readable string.
   * Formater la durée en minutes en chaîne lisible.
   * 
   * @param minutes - Duration in minutes
   * @returns Formatted duration string
   */
  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h${remainingMinutes}` : `${hours}h`;
  }

  /**
   * Handle search input changes.
   * Gérer les changements de l'entrée de recherche.
   */
  onSearchChange(): void {
    this.applyFilters();
  }

  /**
   * Handle filter changes.
   * Gérer les changements de filtres.
   */
  onFilterChange(): void {
    this.applyFilters();
  }

  /**
   * Scroll category container to the left.
   * Faire défiler le conteneur de catégorie vers la gauche.
   * 
   * @param categoryIndex - Index of the category
   */
  scrollLeft(categoryIndex: number): void {
    const container = document.getElementById(`category-${categoryIndex}`);
    if (container) {
      container.scrollBy({ left: -320, behavior: 'smooth' });
    }
  }

  /**
   * Scroll category container to the right.
   * Faire défiler le conteneur de catégorie vers la droite.
   * 
   * @param categoryIndex - Index of the category
   */
  scrollRight(categoryIndex: number): void {
    const container = document.getElementById(`category-${categoryIndex}`);
    if (container) {
      container.scrollBy({ left: 320, behavior: 'smooth' });
    }
  }

  /**
   * Get total number of programs across all categories.
   * Obtenir le nombre total de programmes dans toutes les catégories.
   * 
   * @returns Total number of programs
   */
  getTotalPrograms(): number {
    return this.categoryGroups.reduce((total, group) => total + group.programs.length, 0);
  }

  /**
   * Navigate to program details page.
   * Naviguer vers la page de détails du programme.
   * 
   * @param programId - The program ID
   */
  viewProgram(programId: number): void {
    this.router.navigate(['/dashboard/programs', programId]);
  }

  /**
   * Add a training program to the user's programs.
   * Ajouter un programme d'entraînement aux programmes de l'utilisateur.
   * 
   * @param programId - The program ID to add to user
   */
  addProgramToUser(programId: number): void {
    
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.error('Utilisateur non connecté');
      return;
    }
    
    this.trainingProgramService.addProgramToUser(programId).subscribe({
      next: (response: any) => {
        
      },
      error: (error: any) => {
        console.error('Erreur lors de l\'ajout du programme:', error);
        
        if (error.status === 401) {
          console.error('Non autorisé - Token expiré ou invalide');
        } else if (error.status === 409) {
          console.error('Le programme est déjà dans vos programmes');
        } else {
          console.error('Erreur serveur:', error.message);
        }
      }
    });
  }
} 
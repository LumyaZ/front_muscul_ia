import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../components/header/header.component';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';
import { TrainingProgramService, TrainingProgram } from '../../../services/training-program.service';

/**
 * Interface representing a group of programs by category.
 * Interface représentant un groupe de programmes par catégorie.
 */
interface CategoryGroup {
  /** Category name */
  category: string;
  /** Icon for the category */
  icon: string;
  /** Programs in this category */
  programs: TrainingProgram[];
}

/**
 * Component for displaying and managing training programs.
 * Composant pour afficher et gérer les programmes d'entraînement.
 * 
 * This component handles the display, filtering, and organization of training
 * programs. It provides functionality to search programs, filter by difficulty
 * and audience, group programs by category, and navigate to program details.
 * 
 * Ce composant gère l'affichage, le filtrage et l'organisation des programmes
 * d'entraînement. Il fournit des fonctionnalités pour rechercher des programmes,
 * filtrer par difficulté et audience, grouper les programmes par catégorie et
 * naviguer vers les détails des programmes.
 * 
 * @author Muscul IA Team
 * @version 1.0
 * @since 2024-01-01
 */
@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, NavBarComponent],
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss']
})
export class ProgramsComponent implements OnInit, AfterViewInit {
  
  /**
   * List of all training programs.
   * Liste de tous les programmes d'entraînement.
   */
  programs: TrainingProgram[] = [];
  
  /**
   * Programs grouped by category for display.
   * Programmes groupés par catégorie pour l'affichage.
   */
  categoryGroups: CategoryGroup[] = [];
  
  /**
   * Loading state indicator.
   * Indicateur d'état de chargement.
   */
  loading = false;
  
  /**
   * Error message if any operation fails.
   * Message d'erreur si une opération échoue.
   */
  error = '';

  /**
   * Search term for filtering programs.
   * Terme de recherche pour filtrer les programmes.
   */
  searchTerm = '';
  
  /**
   * Selected difficulty level filter.
   * Filtre de niveau de difficulté sélectionné.
   */
  selectedDifficulty = '';
  
  /**
   * Selected target audience filter.
   * Filtre d'audience cible sélectionnée.
   */
  selectedAudience = '';
  
  /**
   * Flag to show only public programs.
   * Indicateur pour afficher uniquement les programmes publics.
   */
  showOnlyPublic = true;

  /**
   * Available difficulty levels for filtering.
   * Niveaux de difficulté disponibles pour le filtrage.
   */
  difficultyLevels = ['Débutant', 'Intermédiaire', 'Avancé'];
  
  /**
   * Available target audiences for filtering.
   * Audiences cibles disponibles pour le filtrage.
   */
  audiences = ['Débutants', 'Sportifs confirmés', 'Athlètes expérimentés', 'Sportifs de compétition', 'Tous niveaux'];

  /**
   * Animation state for smooth transitions.
   * État d'animation pour les transitions fluides.
   */
  isAnimating = false;

  /**
   * Constructor for ProgramsComponent.
   * Constructeur pour ProgramsComponent.
   * 
   * @param trainingProgramService - Service for training program operations
   * @param router - Angular router for navigation
   */
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
   * 
   * This method fetches public training programs and organizes them by category.
   * It handles loading states and error management.
   * 
   * Cette méthode récupère les programmes d'entraînement publics et les organise
   * par catégorie. Elle gère les états de chargement et la gestion des erreurs.
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
   * Group programs by category and apply filters.
   * Grouper les programmes par catégorie et appliquer les filtres.
   * 
   * This method filters programs based on search term, difficulty, audience,
   * and visibility settings, then groups them by category for display.
   * 
   * Cette méthode filtre les programmes selon le terme de recherche, la difficulté,
   * l'audience et les paramètres de visibilité, puis les groupe par catégorie
   * pour l'affichage.
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

      const matchesVisibility = !this.showOnlyPublic || program.isPublic;

      return matchesSearch && matchesDifficulty && matchesAudience && matchesVisibility;
    });

    const categoryMap = new Map<string, TrainingProgram[]>();
    
    filteredPrograms.forEach(program => {
      if (!categoryMap.has(program.category)) {
        categoryMap.set(program.category, []);
      }
      categoryMap.get(program.category)!.push(program);
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
    console.log('Ajout du programme à l\'utilisateur:', programId);
    
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
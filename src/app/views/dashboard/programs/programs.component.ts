import { Component, OnInit } from '@angular/core';
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
export class ProgramsComponent implements OnInit {
  
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

    this.trainingProgramService.getPublicPrograms().subscribe({
      next: (programs) => {
        this.programs = programs;
        this.groupProgramsByCategory();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des programmes';
        this.loading = false;
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
    // Filter programs according to criteria
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

    // Group by category
    const categoryMap = new Map<string, TrainingProgram[]>();
    
    filteredPrograms.forEach(program => {
      if (!categoryMap.has(program.category)) {
        categoryMap.set(program.category, []);
      }
      categoryMap.get(program.category)!.push(program);
    });

    // Create category groups
    this.categoryGroups = Array.from(categoryMap.entries()).map(([category, programs]) => ({
      category,
      icon: this.getCategoryIcon(category),
      programs: programs.sort((a, b) => a.name.localeCompare(b.name))
    }));

    // Sort categories by importance
    this.categoryGroups.sort((a, b) => {
      const categoryOrder = ['Musculation', 'Cardio', 'Mixte', 'Flexibilité'];
      const aIndex = categoryOrder.indexOf(a.category);
      const bIndex = categoryOrder.indexOf(b.category);
      return aIndex - bIndex;
    });
  }

  applyFilters(): void {
    this.groupProgramsByCategory();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedDifficulty = '';
    this.selectedAudience = '';
    this.showOnlyPublic = true;
    this.applyFilters();
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'Débutant': return '#4CAF50';
      case 'Intermédiaire': return '#FF9800';
      case 'Avancé': return '#F44336';
      default: return '#757575';
    }
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'Musculation': return '💪';
      case 'Cardio': return '❤️';
      case 'Flexibilité': return '🧘';
      case 'Mixte': return '⚡';
      default: return '🏋️';
    }
  }

  getCategoryColor(category: string): string {
    switch (category) {
      case 'Musculation': return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'Cardio': return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
      case 'Flexibilité': return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
      case 'Mixte': return 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
      default: return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h${remainingMinutes}` : `${hours}h`;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  scrollLeft(categoryIndex: number): void {
    const container = document.getElementById(`category-${categoryIndex}`);
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(categoryIndex: number): void {
    const container = document.getElementById(`category-${categoryIndex}`);
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  getTotalPrograms(): number {
    return this.categoryGroups.reduce((total, group) => total + group.programs.length, 0);
  }

  viewProgram(programId: number): void {
    this.router.navigate(['/dashboard/programs', programId]);
  }

  /**
   * Navigates to the create new program page.
   * Navigue vers la page de création d'un nouveau programme.
   * 
   * This method navigates to a page where users can create
   * a new training program from scratch.
   * 
   * Cette méthode navigue vers une page où les utilisateurs peuvent
   * créer un nouveau programme d'entraînement à partir de zéro.
   */
  createNewProgram(): void {
    this.router.navigate(['/dashboard/programs/create']);
  }

  startProgram(programId: number): void {
    // TODO: Implémenter la logique pour démarrer le programme
    console.log('Démarrage du programme:', programId);
  }
} 
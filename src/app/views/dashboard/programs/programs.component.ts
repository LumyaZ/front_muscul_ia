import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../components/header/header.component';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';
import { TrainingProgramService, TrainingProgram } from '../../../services/training-program.service';

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
export class ProgramsComponent implements OnInit {
  programs: TrainingProgram[] = [];
  categoryGroups: CategoryGroup[] = [];
  loading = false;
  error = '';

  // Filtres
  searchTerm = '';
  selectedDifficulty = '';
  selectedAudience = '';
  showOnlyPublic = true;

  // Options de filtres
  difficultyLevels = ['Débutant', 'Intermédiaire', 'Avancé'];
  audiences = ['Débutants', 'Sportifs confirmés', 'Athlètes expérimentés', 'Sportifs de compétition', 'Tous niveaux'];

  constructor(
    private trainingProgramService: TrainingProgramService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPrograms();
  }

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

  groupProgramsByCategory(): void {
    // Filtrer les programmes selon les critères
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

    // Grouper par catégorie
    const categoryMap = new Map<string, TrainingProgram[]>();
    
    filteredPrograms.forEach(program => {
      if (!categoryMap.has(program.category)) {
        categoryMap.set(program.category, []);
      }
      categoryMap.get(program.category)!.push(program);
    });

    // Créer les groupes de catégories
    this.categoryGroups = Array.from(categoryMap.entries()).map(([category, programs]) => ({
      category,
      icon: this.getCategoryIcon(category),
      programs: programs.sort((a, b) => a.name.localeCompare(b.name))
    }));

    // Trier les catégories par ordre d'importance
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

  startProgram(programId: number): void {
    // TODO: Implémenter la logique pour démarrer le programme
    console.log('Démarrage du programme:', programId);
  }
} 
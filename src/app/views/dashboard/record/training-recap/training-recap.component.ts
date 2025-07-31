import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../../../components/header/header.component';
import { NavBarComponent } from '../../../../components/nav-bar/nav-bar.component';
import { TrainingSessionService } from '../../../../services/training-session.service';

interface TrainingRecap {
  sessionId?: number;
  duration: number;
  completed: boolean;
  title?: string;
  rating?: number;
  notes?: string;
  exercises: any[];
}

@Component({
  selector: 'app-training-recap',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, NavBarComponent],
  templateUrl: './training-recap.component.html',
  styleUrls: ['./training-recap.component.scss']
})
export class TrainingRecapComponent implements OnInit {
  
  recap: TrainingRecap | null = null;
  loading = false;
  error = '';
  
  // Form data
  title: string = '';
  rating: number = 5;
  notes: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private trainingSessionService: TrainingSessionService
  ) {}

  ngOnInit(): void {
    this.loadRecapData();
  }

  loadRecapData(): void {
    this.loading = true;
    
    // Récupérer les données depuis les query params
    this.route.queryParams.subscribe(params => {
      this.recap = {
        sessionId: params['sessionId'] ? Number(params['sessionId']) : undefined,
        duration: Number(params['duration']) || 0,
        completed: params['completed'] === 'true',
        exercises: []
      };
      
      this.loading = false;
    });
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  onRatingChange(rating: number): void {
    this.rating = rating;
  }

  saveRecap(): void {
    if (this.recap) {
      this.recap.title = this.title;
      this.recap.rating = this.rating;
      this.recap.notes = this.notes;
      
      // TODO: Sauvegarder via le service
      console.log('Sauvegarde du récapitulatif:', this.recap);
      
      // Rediriger vers la page d'accueil
      this.router.navigate(['/dashboard']);
    }
  }

  onBack(): void {
    this.router.navigate(['/dashboard']);
  }

  getRatingStars(): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < this.rating);
  }

  getCompletionMessage(): string {
    if (this.recap?.completed) {
      return 'Félicitations ! Vous avez terminé votre entraînement.';
    } else {
      return 'Vous avez arrêté votre entraînement. Votre progression a été sauvegardée.';
    }
  }

  getCompletionIcon(): string {
    return this.recap?.completed ? 'fas fa-trophy' : 'fas fa-pause-circle';
  }

  getCompletionColor(): string {
    return this.recap?.completed ? '#4CAF50' : '#FF9800';
  }
} 
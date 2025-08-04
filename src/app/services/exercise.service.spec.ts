import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ExerciseService } from './exercise.service';
import { Exercise } from '../models/exercise.model';
import { environment } from '../../environments/environment';

describe('ExerciseService', () => {
  let service: ExerciseService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/exercises`;

  const mockExercise: Exercise = {
    id: 1,
    name: 'Push-ups',
    description: 'Classic bodyweight exercise for chest and triceps',
    category: 'Bodyweight',
    muscleGroup: 'Chest',
    equipment: 'None',
    difficultyLevel: 'Beginner',
    instructions: 'Perform push-ups with proper form',
    tips: 'Keep your body straight',
    mediaUrl: 'https://example.com/pushups',
    isActive: true,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExerciseService]
    });
    service = TestBed.inject(ExerciseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllExercises', () => {
    it('should get all exercises successfully', () => {
      const mockExercises = [mockExercise];
      
      service.getAllExercises().subscribe(response => {
        expect(response).toEqual(mockExercises);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockExercises);
    });
  });

  describe('getExerciseById', () => {
    it('should get exercise by ID successfully', () => {
      const exerciseId = 1;
      
      service.getExerciseById(exerciseId).subscribe(response => {
        expect(response).toEqual(mockExercise);
      });

      const req = httpMock.expectOne(`${apiUrl}/${exerciseId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockExercise);
    });
  });

  describe('getExercisesByCategory', () => {
    it('should get exercises by category successfully', () => {
      const category = 'Bodyweight';
      const mockExercises = [mockExercise];
      
      service.getExercisesByCategory(category).subscribe(response => {
        expect(response).toEqual(mockExercises);
      });

      const req = httpMock.expectOne(`${apiUrl}/category/${category}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockExercises);
    });
  });

  describe('getExercisesByMuscleGroup', () => {
    it('should get exercises by muscle group successfully', () => {
      const muscleGroup = 'Chest';
      const mockExercises = [mockExercise];
      
      service.getExercisesByMuscleGroup(muscleGroup).subscribe(response => {
        expect(response).toEqual(mockExercises);
      });

      const req = httpMock.expectOne(`${apiUrl}/muscle-group/${muscleGroup}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockExercises);
    });
  });

  describe('getExercisesByDifficulty', () => {
    it('should get exercises by difficulty level successfully', () => {
      const difficultyLevel = 'Beginner';
      const mockExercises = [mockExercise];
      
      service.getExercisesByDifficulty(difficultyLevel).subscribe(response => {
        expect(response).toEqual(mockExercises);
      });

      const req = httpMock.expectOne(`${apiUrl}/difficulty/${difficultyLevel}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockExercises);
    });
  });

  describe('searchExercises', () => {
    it('should search exercises successfully', () => {
      const searchTerm = 'push';
      const mockExercises = [mockExercise];
      
      service.searchExercises(searchTerm).subscribe(response => {
        expect(response).toEqual(mockExercises);
      });

      const req = httpMock.expectOne(`${apiUrl}/search?q=${encodeURIComponent(searchTerm)}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockExercises);
    });
  });
}); 
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserProfileService } from './user-profile.service';
import { UserProfile, CreateUserProfileRequest, UpdateUserProfileRequest, CreateUserProfileWithEmailRequest } from '../models/user-profile.model';
import { environment } from '../../environments/environment';

describe('UserProfileService', () => {
  let service: UserProfileService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/profiles`;

  const mockUserProfile: UserProfile = {
    id: 1,
    userId: 1,
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
    phoneNumber: '+33123456789',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  };

  const mockCreateRequest: CreateUserProfileRequest = {
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
    phoneNumber: '+33123456789'
  };

  const mockCreateWithEmailRequest: CreateUserProfileWithEmailRequest = {
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
    age: 34,
    phoneNumber: '+33123456789'
  };

  const mockUpdateRequest: UpdateUserProfileRequest = {
    firstName: 'Jane',
    lastName: 'Smith',
    phoneNumber: '+33987654321'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserProfileService]
    });
    service = TestBed.inject(UserProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createProfile', () => {
    it('should create profile successfully', () => {
      service.createProfile(mockCreateRequest).subscribe(response => {
        expect(response).toEqual(mockUserProfile);
        expect(response.id).toBe(1);
        expect(response.firstName).toBe('John');
        expect(response.lastName).toBe('Doe');
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCreateRequest);
      req.flush(mockUserProfile);
    });

    it('should handle invalid request data', () => {
      const invalidRequest = { ...mockCreateRequest, firstName: '' };

      service.createProfile(invalidRequest).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush({ message: 'Invalid request data' }, { status: 400, statusText: 'Bad Request' });
    });

    it('should handle server error', () => {
      service.createProfile(mockCreateRequest).subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush({ message: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('createProfileByEmail', () => {
    it('should create profile by email successfully', () => {
      service.createProfileByEmail(mockCreateWithEmailRequest).subscribe(response => {
        expect(response).toEqual(mockUserProfile);
        expect(response.id).toBe(1);
        expect(response.userId).toBe(1);
      });

      const req = httpMock.expectOne(`${apiUrl}/public`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCreateWithEmailRequest);
      req.flush(mockUserProfile);
    });

    it('should handle invalid email', () => {
      const invalidRequest = { ...mockCreateWithEmailRequest, email: 'invalid-email' };

      service.createProfileByEmail(invalidRequest).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/public`);
      req.flush({ message: 'Invalid email format' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('getMyProfile', () => {
    it('should get my profile successfully', () => {
      service.getMyProfile().subscribe(response => {
        expect(response).toEqual(mockUserProfile);
        expect(response.id).toBe(1);
        expect(response.userId).toBe(1);
      });

      const req = httpMock.expectOne(`${apiUrl}/me`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUserProfile);
    });

    it('should handle profile not found', () => {
      service.getMyProfile().subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/me`);
      req.flush({ message: 'Profile not found' }, { status: 404, statusText: 'Not Found' });
    });

    it('should handle server error', () => {
      service.getMyProfile().subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/me`);
      req.flush({ message: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getProfileById', () => {
    it('should get profile by ID successfully', () => {
      const userId = 1;
      
      service.getProfileById(userId).subscribe(response => {
        expect(response).toEqual(mockUserProfile);
        expect(response.userId).toBe(userId);
        expect(response.firstName).toBe('John');
      });

      const req = httpMock.expectOne(`${apiUrl}/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUserProfile);
    });

    it('should handle user not found', () => {
      const userId = 999;

      service.getProfileById(userId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${userId}`);
      req.flush({ message: 'User not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('updateMyProfile', () => {
    it('should update my profile successfully', () => {
      service.updateMyProfile(mockUpdateRequest).subscribe(response => {
        expect(response).toEqual(mockUserProfile);
        expect(response.id).toBe(1);
        expect(response.firstName).toBe('John');
      });

      const req = httpMock.expectOne(`${apiUrl}/me`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockUpdateRequest);
      req.flush(mockUserProfile);
    });

    it('should handle profile not found for update', () => {
      service.updateMyProfile(mockUpdateRequest).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/me`);
      req.flush({ message: 'Profile not found' }, { status: 404, statusText: 'Not Found' });
    });

    it('should handle invalid update data', () => {
      const invalidUpdate = { firstName: '' };

      service.updateMyProfile(invalidUpdate).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/me`);
      req.flush({ message: 'Invalid update data' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('deleteMyProfile', () => {
    it('should delete my profile successfully', () => {
      service.deleteMyProfile().subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${apiUrl}/me`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle profile not found for deletion', () => {
      service.deleteMyProfile().subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/me`);
      req.flush({ message: 'Profile not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('hasProfile', () => {
    it('should return true when user has profile', () => {
      service.hasProfile().subscribe(response => {
        expect(response).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/me`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUserProfile);
    });

    it('should return false when user does not have profile', () => {
      service.hasProfile().subscribe(response => {
        expect(response).toBe(false);
      });

      const req = httpMock.expectOne(`${apiUrl}/me`);
      req.flush({ error: 'Profile not found' }, { status: 404, statusText: 'Not Found' });
    });

    it('should handle server error', () => {
      service.hasProfile().subscribe(response => {
        expect(response).toBe(false);
      });

      const req = httpMock.expectOne(`${apiUrl}/me`);
      req.flush({ message: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('Service Integration', () => {
    it('should inject required dependencies', () => {
      expect(service).toBeDefined();
      expect(httpMock).toBeDefined();
    });

    it('should use correct API base URL', () => {
      expect(apiUrl).toBe(`${environment.apiUrl}/profiles`);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', () => {
      service.getMyProfile().subscribe({
        error: (error) => {
          expect(error.status).toBe(0);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/me`);
      req.error(new ErrorEvent('Network error'));
    });

    it('should handle timeout errors', () => {
      service.createProfile(mockCreateRequest).subscribe({
        error: (error) => {
          expect(error.status).toBe(408);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush({ message: 'Request timeout' }, { status: 408, statusText: 'Request Timeout' });
    });

    it('should handle unauthorized errors', () => {
      service.getMyProfile().subscribe({
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/me`);
      req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
    });
  });
}); 
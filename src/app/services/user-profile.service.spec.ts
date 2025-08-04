import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserProfileService, CreateUserProfileWithEmailRequest } from './user-profile.service';
import { UserProfile, CreateUserProfileRequest, UpdateUserProfileRequest } from '../models/user-profile.model';
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
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCreateRequest);
      req.flush(mockUserProfile);
    });
  });

  describe('createProfileByEmail', () => {
    it('should create profile by email successfully', () => {
      service.createProfileByEmail(mockCreateWithEmailRequest).subscribe(response => {
        expect(response).toEqual(mockUserProfile);
      });

      const req = httpMock.expectOne(`${apiUrl}/public`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCreateWithEmailRequest);
      req.flush(mockUserProfile);
    });
  });

  describe('getMyProfile', () => {
    it('should get my profile successfully', () => {
      service.getMyProfile().subscribe(response => {
        expect(response).toEqual(mockUserProfile);
      });

      const req = httpMock.expectOne(`${apiUrl}/me`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUserProfile);
    });
  });

  describe('getProfileById', () => {
    it('should get profile by ID successfully', () => {
      const userId = 1;
      
      service.getProfileById(userId).subscribe(response => {
        expect(response).toEqual(mockUserProfile);
      });

      const req = httpMock.expectOne(`${apiUrl}/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUserProfile);
    });
  });

  describe('updateMyProfile', () => {
    it('should update my profile successfully', () => {
      service.updateMyProfile(mockUpdateRequest).subscribe(response => {
        expect(response).toEqual(mockUserProfile);
      });

      const req = httpMock.expectOne(`${apiUrl}/me`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockUpdateRequest);
      req.flush(mockUserProfile);
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
      expect(req.request.method).toBe('GET');
      req.flush({ error: 'Profile not found' }, { status: 404, statusText: 'Not Found' });
    });
  });
}); 
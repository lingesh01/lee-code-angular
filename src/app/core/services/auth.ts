import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators'

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
  createdAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}


@Injectable({
  providedIn: 'root'
})
export class Auth {

   private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Mock users for development (replace with real API)
  private mockUsers: User[] = [
    {
      id: '1',
      email: 'lingesh@leecode.dev',
      name: 'Lingesh (Lee Code)',
      role: 'admin',
      avatar: 'assets/images/lingesh-profile.jpg',
      createdAt: new Date('2023-01-01')
    },
    {
      id: '2', 
      email: 'admin@leecode.dev',
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date('2023-01-01')
    },
    {
      id: '3',
      email: 'user@example.com',
      name: 'Regular User',
      role: 'user',
      createdAt: new Date('2024-01-01')
    }
  ];

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('currentUser');
    const token = localStorage.getItem('authToken');
    
    if (storedUser && token) {
      const user = JSON.parse(storedUser);
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  // Login method
  login(credentials: LoginCredentials): Observable<{ user: User; token: string }> {
    // Mock authentication (replace with real API call)
    const user = this.mockUsers.find(u => u.email === credentials.email);
    
    if (user && this.validatePassword(credentials.password)) {
      const token = this.generateMockToken();
      const loginResult = { user, token };

      return of(loginResult).pipe(
        delay(1000), // Simulate API delay
        tap(result => {
          // Store in localStorage
          localStorage.setItem('currentUser', JSON.stringify(result.user));
          localStorage.setItem('authToken', result.token);
          
          // Update subjects
          this.currentUserSubject.next(result.user);
          this.isAuthenticatedSubject.next(true);
        })
      );
    } else {
      throw new Error('Invalid credentials');
    }
  }

  // Register method
  register(data: RegisterData): Observable<{ user: User; token: string }> {
    // Check if user already exists
    const existingUser = this.mockUsers.find(u => u.email === data.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      role: 'user', // Default role
      createdAt: new Date()
    };

    const token = this.generateMockToken();
    const registerResult = { user: newUser, token };

    // Add to mock users (in real app, this would be API call)
    this.mockUsers.push(newUser);

    return of(registerResult).pipe(
      delay(1000),
      tap(result => {
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        localStorage.setItem('authToken', result.token);
        
        this.currentUserSubject.next(result.user);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  // Logout method
  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Check if user is admin
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin' || false;
  }

  // Check if user can edit articles
  canEditArticles(): boolean {
    return this.isAdmin();
  }

  // Get auth token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Validate password (mock - implement proper validation)
  private validatePassword(password: string): boolean {
    // For development, accept simple passwords
    // In production, implement proper password validation
    return password.length >= 6;
  }

  // Generate mock JWT token (replace with real token from API)
  private generateMockToken(): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ 
      sub: Date.now().toString(),
      iat: Date.now(),
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    }));
    const signature = 'mock-signature';
    
    return `${header}.${payload}.${signature}`;
  }

  // Update user profile
  updateProfile(updates: Partial<User>): Observable<User> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('No user logged in');
    }

    const updatedUser = { ...currentUser, ...updates };

    return of(updatedUser).pipe(
      delay(500),
      tap(user => {
        // Update in mock users array
        const userIndex = this.mockUsers.findIndex(u => u.id === user.id);
        if (userIndex > -1) {
          this.mockUsers[userIndex] = user;
        }

        // Update localStorage and subjects
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  // Change password
  changePassword(currentPassword: string, newPassword: string): Observable<boolean> {
    // Mock password change (implement real validation)
    if (!this.validatePassword(currentPassword) || !this.validatePassword(newPassword)) {
      throw new Error('Invalid password');
    }

    return of(true).pipe(delay(500));
  }
  
}

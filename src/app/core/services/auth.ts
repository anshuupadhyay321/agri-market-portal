import { Injectable } from '@angular/core';
import { User } from '../../shared/models/user.model';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly USERS_KEY = 'portal-users';

  // 1. BehaviorSubject banayein jo current user ki state hold karega
  // Iska initial value localStorage se uthayenge
  private readonly currentUserSubject = new BehaviorSubject<User | null>(
    JSON.parse(localStorage.getItem('currentUser') || 'null')
  );

  // 2. Iska observable banayein jise components subscribe karenge
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private readonly router: Router) { }



  register(userData: User): Observable<any> {
    const users = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    if (users.some((u: any) => u.email === userData.email)) {
      return throwError(() => new Error('User already exists!'));
    }
    users.push(userData);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    return of({ success: true });
  }

  login(credentials: any): Observable<User> { // Ise User return karne de
    const users = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    const user = users.find(
      (u: any) => u.email === credentials.email && u.password === credentials.password
    );

    if (user) {
      // Zaroori Step: Poora user object save karein taaki fullName mil sake
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(user));

      // Subject ko naye user ke baare mein batayein
      this.currentUserSubject.next(user);

      return of(user);
    }
    return throwError(() => new Error('Invalid email or password'));
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');

    // Subject ko null kar dein
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
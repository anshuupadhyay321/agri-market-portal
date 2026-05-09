import { Component, OnInit } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  displayName: string = 'Guest';
  isLoggedIn: boolean = false;

  constructor(private authService: Auth, private router: Router) { }

  ngOnInit() {
    // Sabse behtar tarika: AuthService ke observable se hi status lein
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.displayName = user.fullName;
        this.isLoggedIn = true; // Agar user object hai toh logged in hai
      } else {
        this.displayName = 'Guest';
        // Yahan double check karein token ke liye
        this.isLoggedIn = !!localStorage.getItem('userToken');
      }
    });
  }

  onLogout() {
    // 1. Local Storage clear karein
    localStorage.removeItem('userToken');
    localStorage.removeItem('isLoggedIn');

    // 2. UI variables reset karein
    this.isLoggedIn = false;
    this.displayName = 'Guest';

    // 3. AuthService ko notify karein (agar logout method hai)
    this.authService.logout();

    // 4. Redirect
    this.router.navigate(['/login']);
  }
}

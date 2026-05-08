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
  constructor(private authService: Auth, private router: Router) { }
  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.displayName = user.fullName; // Ab yahan real name aayega
      } else {
        this.displayName = 'Guest';
      }
    });
  }

  onLogout() {
    localStorage.removeItem('currentUser'); // Session clear
    localStorage.removeItem('isLoggedIn');

    // Variable ko reset karein (Sabse zaroori step)

    this.displayName = 'User';
    this.router.navigate(['/login']); // Login page par bhejein
  }
}

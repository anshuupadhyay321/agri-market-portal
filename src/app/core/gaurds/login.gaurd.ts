import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class LoginGaurd implements CanActivate {
    constructor(private readonly router: Router) { }

    canActivate(): boolean {
        // Yahan bhi wahi 'currentUser' check karein jo upar kiya hai
        const user = localStorage.getItem('currentUser');

        if (user) {
            this.router.navigate(['/dashboard']); // Login hai, toh login page mat dikhao
            return false;
        }
        return true; // Login nahi hai, toh login page par rehne do
    }
}
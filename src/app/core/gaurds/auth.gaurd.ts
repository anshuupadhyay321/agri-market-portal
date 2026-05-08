import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    // Check karein 'currentUser' (Dhyan rahe key name same ho)
    const user = localStorage.getItem('currentUser');

    if (user) {
        return true; // Login hai, andar jaane do
    } else {
        router.navigate(['/login']); // Login nahi hai, bahar nikalo
        return false;
    }
};
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../../core/services/auth';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  // login.ts mein variable add karein
  showPassword: boolean = false;

  constructor(private fb: FormBuilder, private authService: Auth, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }
  // Toggle karne ke liye function
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          console.log('Login Successful', res);

          // Sabse zaroori: Navigate karne se pehle user data save karein
          // Taaki AuthGuard ko 'currentUser' mil sake
          localStorage.setItem('currentUser', JSON.stringify(res));

          // Ab navigate karein
          this.router.navigate(['/dashboard'])
        },
        error: (err) => {
          console.error(err);
          alert('Galat Email ya Password!');
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}

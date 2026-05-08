import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../../core/services/auth';
import { RouterLink, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => alert('Registration Successful!'),
        error: (err) => alert(err.message)
      });
    }
  }
  // Ye raha wo method jo miss ho raha tha
  onRegister() {
    if (this.registerForm.valid) {
      const userData = this.registerForm.value;

      this.authService.register(userData).subscribe({
        next: (res) => {
          alert('Registration Successful! Ab login karein.');
          this.router.navigate(['/login']); // Success ke baad login page par bhejein
        },
        error: (err) => {
          alert(err.message || 'Registration fail ho gaya!');
        }
      });
    } else {
      // Agar form invalid hai toh saare fields ko touch karein taaki error dikhe
      this.registerForm.markAllAsTouched();
    }
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  returnUrl = '';
  
  // Template binding properties
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    if (this.authService.isAuthenticated()) {
      this.redirectUser();
    }
  }

  login(): void {
    this.onSubmit();
  }

  onSubmit(): void {
     console.log('1. onSubmit method started.'); // 👈 ADD THIS
    if (this.loginForm.invalid) {
       console.error('Form is invalid.'); // 👈 ADD THIS
      this.markFormGroupTouched();
      return;
    }
    this.isLoading = true;
    this.loading = true;
    this.errorMessage = '';
    this.error = '';
    const credentials = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };
     console.log('2. Calling authService.login with:', credentials); // 👈 ADD THIS
    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.loading = false;
        this.toastr.success('Login successful!', 'Welcome back');
        
        // Wait a moment for the auth service to update the current user
        setTimeout(() => {
         this.redirectUser(response.userType);
        }, 100);
      },
      error: (error) => {
         console.error('4. Login failed! API Error:', error); // 👈 ADD THIS
        this.isLoading = false;
        this.loading = false;
        this.errorMessage = error.message || 'Login failed. Please try again.';
        this.error = this.errorMessage;
        this.toastr.error(this.errorMessage, 'Login Failed');
      }
    });
  }

 
  private redirectUser(userType?: string): void {
    // Use the userType from response first, then fall back to auth service methods
    if (userType === 'ADMIN' || this.authService.isAdmin()) {
      this.router.navigate(['/admin/dashboard']);
    } else if (userType === 'CUSTOMER' || this.authService.isCustomer()) {
      this.router.navigate(['/customer/dashboard']);
    } else {
      this.router.navigate(['/home']);
    }
  }

   togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }


  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
}
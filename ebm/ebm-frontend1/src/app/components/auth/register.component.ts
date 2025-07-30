import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  error = '';
  success = '';
  selectedRole: 'CUSTOMER' | 'ADMIN' = 'CUSTOMER';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }

    this.initializeForm();
  }

  initializeForm(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      
      // Customer specific fields
      consumerId: ['', this.selectedRole === 'CUSTOMER' ? [Validators.required] : []],
      address: ['', this.selectedRole === 'CUSTOMER' ? [Validators.required] : []],
      city: ['', this.selectedRole === 'CUSTOMER' ? [Validators.required] : []],
      pincode: ['', this.selectedRole === 'CUSTOMER' ? [Validators.required, Validators.pattern(/^[0-9]{6}$/)] : []],
      
      // Shared fields
      state: ['', (this.selectedRole === 'CUSTOMER' || this.selectedRole === 'ADMIN') ? [Validators.required] : []],
      
      // Admin specific fields
      department: ['', this.selectedRole === 'ADMIN' ? [Validators.required] : []]
    }, { validators: this.passwordMatchValidator });
  }

  get f() { return this.registerForm.controls; }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      if (confirmPassword?.hasError('passwordMismatch')) {
        confirmPassword.setErrors(null);
      }
    }
    return null;
  }

  onRoleChange(role: 'CUSTOMER' | 'ADMIN'): void {
    this.selectedRole = role;
    this.initializeForm();
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const formData = this.registerForm.value;
    
    if (this.selectedRole === 'CUSTOMER') {
      const customerData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        consumerId: formData.consumerId,
        name: formData.firstName + ' ' + formData.lastName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        mobile: formData.phone
      };

      this.authService.registerCustomer(customerData).subscribe({
        next: (response) => {
          this.loading = false;
          this.success = 'Customer registration successful! You can now login.';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Registration failed. Please try again.';
          console.error('Registration error:', error);
        }
      });
    } else {
      const adminData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        department: formData.department,
        state: formData.state
      };
      this.authService.registerAdmin(adminData).subscribe({
        next: (response) => {
          this.loading = false;
          this.success = 'Admin registration successful! You can now login.';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Registration failed. Please try again.';
          console.error('Registration error:', error);
        }
      });
    }
  }
}
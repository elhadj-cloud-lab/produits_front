import {Component, OnInit} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {User} from '../model/user.model';
import {AuthService} from '../services/auth-service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  myForm!: FormGroup;
  err: string | null = null;
  loading = false;

  constructor(private formBuilder: FormBuilder,
              private authService : AuthService,
              private router: Router,
              private toastr: ToastrService
  ) {}

  private static passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const pw = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return pw === confirm ? null : {passwordMismatch: true};
  }

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, {validators: Register.passwordMatchValidator});
  }

  onRegister() {
    if (this.myForm.invalid) return;
    this.loading = true;
    const {username, email, password} = this.myForm.value;
    const payload = {username, email, password};
    this.authService.registerUser(payload).subscribe({
      next: () => {
        this.authService.setPendingRegistration({username, email});
        this.loading = false;
        this.toastr.success('Veuillez confirmer votre email', 'Confirmation');
        this.router.navigate(['/verif-email']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.err = err.error?.errorCode === 'USER_EMAIL_ALREADY_EXISTS'
          ? 'Cet email est déjà utilisé.'
          : 'Une erreur est survenue. Veuillez réessayer.';
      },
    });
  }
}

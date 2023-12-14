import { Component,OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent implements OnInit {

  user = {
    name: '',
    email: '',
    password: ''
  }

  registrationErrorMessages: string[] = [];
  loginErrorMessages: string[] = [];
  submitted: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {

  }

  isValidEmail(email: string): boolean {
    // Lógica de validación básica de correo electrónico con expresión regular
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPassword(password: string): boolean {
    // Lógica de validación básica de contraseña (mínimo 6 caracteres)
    return password.length >= 6;
  }

  signUp() {
    this.submitted = true; // Marcar que se ha intentado enviar el formulario
    this.registrationErrorMessages = []; // Reiniciar mensajes de error

    if (!this.isValidEmail(this.user.email)) {
      this.registrationErrorMessages.push('Ingrese un correo electrónico válido.');
    }

    if (!this.isValidPassword(this.user.password)) {
      this.registrationErrorMessages.push('La contraseña debe tener al menos 6 caracteres.');
    }

    if (this.registrationErrorMessages.length === 0) {
      // Solo intentar registrar si no hay errores de validación
      this.authService.signUp(this.user)
        .subscribe(
          res => {
            console.log(res);
            localStorage.setItem('token', res.token);
            this.router.navigate(['/home']);
          },
          err => {
            console.log(err);
            this.registrationErrorMessages.push('Error en el registro. Inténtelo de nuevo.');
          }
        );
    }
  }

  signIn() {
    this.submitted = true; // Marcar que se ha intentado enviar el formulario
    this.loginErrorMessages = []; // Reiniciar mensajes de error

    if (!this.isValidEmail(this.user.email)) {
      this.loginErrorMessages.push('Ingrese un correo electrónico válido.');
    }

    if (!this.isValidPassword(this.user.password)) {
      this.loginErrorMessages.push('La contraseña debe tener al menos 6 caracteres.');
    }

    if (this.loginErrorMessages.length === 0) {
      // Solo intentar iniciar sesión si no hay errores de validación
      this.authService.signIn(this.user)
        .subscribe(
          res => {
            console.log(res);
            localStorage.setItem('token', res.token);
            this.router.navigate(['/home']);
          },
          err => {
            console.log(err);
            this.loginErrorMessages.push('Error al iniciar sesión. Verifique sus credenciales.');
          }
        );
    }
  }

  isSignUp: boolean = true;

  toggleForm() {
    if (!this.isSignUp) {
      // Solo cambiar a inicio de sesión si actualmente está en registro
      this.isSignUp = true;
    }
    const container = document.getElementById('container')!;
    container.classList.toggle('right-panel-active');
  }

}

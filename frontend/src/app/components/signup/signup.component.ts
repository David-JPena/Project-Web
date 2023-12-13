import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {

  user = {
    email: '',
    password: ''
  }

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {

  }
  signIn() {
    this.authService.signIn(this.user)
      .subscribe(
        res => {
          console.log(res)
          localStorage.setItem('token', res.token);
          this.router.navigate(['/private']);
        },
        err => console.log(err)
    )
  }
  isSignUp: boolean = true;
  signUp() {
    this.authService.signUp(this.user)
      .subscribe(
        res => {
          console.log(res)
          localStorage.setItem('token', res.token);
          this.router.navigate(['/private']);
        },
        err => console.log(err)
    )
  }
  toggleForm() {
    if (!this.isSignUp) {
      // Solo cambiar a inicio de sesión si actualmente está en registro
      this.isSignUp = true;
    }
    const container = document.getElementById('container')!;
    container.classList.toggle('right-panel-active');
  }
}

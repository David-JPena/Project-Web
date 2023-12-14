import { CanActivate } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})

export class authGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean{
    if (this.authService.loggedIn()) {
      return true;
    }

    this.router.navigate(['/signin']);
    return false
  }

}

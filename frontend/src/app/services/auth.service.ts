import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL = 'http://localhost:3000/api';
  private userId: string | null = null;

  constructor(private http: HttpClient, private router: Router) { }

  signUp(user: { email: string, password: string }) {
    return this.http.post<any>(this.URL + '/signup', user)
      .pipe(
        catchError(error => {
          // Puedes manejar el error aquí, por ejemplo, mostrando un mensaje de error
          console.error('Error during sign up:', error);
          throw error; // Lanzar el error nuevamente para que el componente también pueda manejarlo
        })
      );
  }

  signIn(user: { email: string, password: string }) {
    return this.http.post<any>(this.URL + '/signin', user)
      .pipe(
        catchError(error => {
          console.error('Error during sign in:', error);
          throw error;
        })
      );
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/signin'])
  }

  getUserId(): string | null {
    return this.userId;
  }

  getProfile() {
    return this.http.get<any>(this.URL + '/profile')
      .pipe(
        catchError(error => {
          console.error('Error al obtener el perfil:', error);
          throw error;
        })
      );
  }

  followUser(userId: string) {
    return this.http.post<any>(`${this.URL}/follow/${userId}`, {})
      .pipe(
        catchError(error => {
          console.error('Error al seguir al usuario:', error);
          throw error;
        })
      );
  }

  unfollowUser(userId: string): Observable<any> {
    const url = `${this.URL}/unfollow/${userId}`;
    return this.http.post<any>(url, {});
  }

}

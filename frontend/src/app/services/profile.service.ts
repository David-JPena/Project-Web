import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getUserDetails(userId: string): Observable<any> {
    const url = `${this.apiUrl}/profile/${userId}`;
    return this.http.get<any>(url)
      .pipe(
        catchError(error => {
          console.error('Error al obtener detalles del perfil:', error);
          throw error;
        })
      );
  }

  // Modifica la función para aceptar un ID de usuario
  getUserProfile(userId?: string): Observable<any> {
    // Usa la URL correspondiente según si se proporciona un ID de usuario
    const url = userId ? `${this.apiUrl}/profile/${userId}` : `${this.apiUrl}/profile`;
    return this.http.get<any>(url)
      .pipe(
        catchError(error => {
          console.error('Error al obtener detalles del perfil:', error);
          throw error;
        })
      );
  }

  getUsersToFollow(): Observable<any> {
    const url = `${this.apiUrl}/followers`;
    return this.http.get<any>(url)
      .pipe(
        catchError(error => {
          console.error('Error al obtener usuarios para seguir:', error);
          throw error;
        })
      );
  }

  getFollowingUsers(): Observable<any> {
    const url = `${this.apiUrl}/following`;
    return this.http.get<any>(url)
      .pipe(
        catchError(error => {
          console.error('Error al obtener usuarios seguidos:', error);
          throw error;
        })
      );
  }

  getAllUsers(): Observable<any> {
    const url = `${this.apiUrl}/all-users`;
    return this.http.get<any>(url)
      .pipe(
        catchError(error => {
          console.error('Error al obtener todos los usuarios:', error);
          throw error;
        })
      );
  }

}

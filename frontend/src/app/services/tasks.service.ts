// tasks.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private URL = 'http://localhost:3000/api';
  private recipeUrl = 'http://localhost:3000/api/services';

  constructor(private http: HttpClient) {}

  searchByCategories(selectedCategories: string[]): Observable<any> {
    const url = `${this.recipeUrl}/searchByCategories`;
    return this.http.post(url, { categories: selectedCategories });
  }

  getTasks(): Observable<any> {
    return this.http.get<any>(this.URL + '/tasks');
  }

  getPrivate(): Observable<any> {
    return this.http.get<any>(this.URL + '/private');
  }

  createService(data: any): Observable<any> {
    return this.http.post<any>(this.recipeUrl, data);
  }

  getAllServices(): Observable<any[]> {
    return this.http.get<any[]>(this.recipeUrl);
  }
<<<<<<< HEAD
  getServicesAll(): Observable<any[]> {
    const url = `${this.recipeUrl}/all`;
    return this.http.get<any[]>(url);
}

=======
>>>>>>> e238eaebfafb01e34435408fb8f07dc88f10ab88

  getServiceById(id: string): Observable<any> {
    return this.http.get<any>(`${this.recipeUrl}/${id}`);
  }

  deleteService(id: string): Observable<any> {
    return this.http.delete<any>(`${this.recipeUrl}/${id}`);
  }

  updateService(id: string, data: FormData): Observable<any> {
    return this.http.put<any>(`${this.recipeUrl}/${id}`, data);
  }

  addComment(serviceId: string, text: string): Observable<any> {
    const commentData = { text };
    return this.http.post(`${this.recipeUrl}/${serviceId}/comments`, commentData);
  }

<<<<<<< HEAD
  
  // Nuevo método para obtener comentarios
  getComments(serviceId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.recipeUrl}/${serviceId}/comments`);
=======
  getComentarios(idServicio: string): Observable<any> {
    const url = `${this.recipeUrl}/${idServicio}/comments`;
    return this.http.get(url);
>>>>>>> e238eaebfafb01e34435408fb8f07dc88f10ab88
  }

  addLike(serviceId: string): Observable<any> {
    const url = `${this.recipeUrl}/${serviceId}/like`;
    return this.http.post(url, {});
  }

  removeLike(serviceId: string): Observable<any> {
    const url = `${this.recipeUrl}/${serviceId}/like`;
    return this.http.delete(url);
  }

  getLikes(idServicio: string): Observable<any> {
    const url = `${this.recipeUrl}/${idServicio}/likes`;
    return this.http.get(url);
  }

  searchServices(searchTerm: string): Observable<any> {
    const url = `${this.recipeUrl}/search?name=${searchTerm}`;
    return this.http.get<any>(url);
  }

  searchByCategory(category: string): Observable<any> {
    const url = `${this.recipeUrl}/searchByCategory?category=${category}`;
    return this.http.get<any>(url);
  }
}

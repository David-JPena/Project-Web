import { HttpClient , HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private URL = 'http://localhost:3000/api'
  
  private recipeUrl = 'http://localhost:3000/api/services';

  constructor(private http: HttpClient) { }

  getTasks() {
    return this.http.get<any>(this.URL + '/tasks');
  }



  getPrivate() {
    return this.http.get<any>(this.URL + '/private');
  }

  createService(data: any): Observable<any> {
    return this.http.post<any>(this.recipeUrl , data);
  }

  getAllServices(): Observable<any[]> {
    return this.http.get<any[]>(this.recipeUrl);
  }
  getServicesAll(): Observable<any[]> {
    const url = `${this.recipeUrl}/all`;
    return this.http.get<any[]>(url);
}


  getServiceById(id: string): Observable<any> {
    return this.http.get<any>(`${this.recipeUrl }/${id}`);
  }

  deleteService(id: string): Observable<any> {
    return this.http.delete<any>(`${this.recipeUrl }/${id}`);
    
  }

  updateService(id: string, data: FormData): Observable<any> {
    return this.http.put<any>(`${this.recipeUrl }/${id}`, data);
  }

  addComment(serviceId: string, text: string): Observable<any> {
    const commentData = { text };
    return this.http.post(`${this.recipeUrl}/${serviceId}/comments`, commentData);
  }

  
  // Nuevo método para obtener comentarios
  getComments(serviceId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.recipeUrl}/${serviceId}/comments`);
  }

  // En el servicio Angular
// addLike(idServicio: string): Observable<any> {
//   const url = `${this.recipeUrl}/${idServicio}/like`;
//   return this.http.post(url, {});
// }
addLike(serviceId: string): Observable<any> {
  const url = `${this.recipeUrl}/${serviceId}/like`;
  return this.http.post(url, {});
}
removeLike(serviceId: string): Observable<any> {
  const url = `${this.recipeUrl}/${serviceId}/like`;
  return this.http.delete(url);
}

// En el servicio Angular
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

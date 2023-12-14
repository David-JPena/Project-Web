// home.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  services: any[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';
  categories: { name: string; checked: boolean }[] = [
    { name: 'Desayuno', checked: false },
    { name: 'Almuerzo', checked: false },
    { name: 'Cena', checked: false },
    { name: 'Vegetariana', checked: false },
    { name: 'Postres', checked: false },
  ];

  constructor(private apiService: TasksService, private router: Router) {}

  ngOnInit(): void {
    // Obtener todos los servicios
    this.getServicesAll();

    // Obtener servicios del usuario (puedes llamar a esto en otra parte según tus necesidades)
    // this.getUserServices();
  }
  getServicesAll(): void {
    this.apiService.getServicesAll().subscribe(response => {
      this.services = response;
    });
  }

  getImageUrl(imageName: string): string {
    // Construye la URL completa para la imagen
    return `http://localhost:3000/uploads/${imageName}`;
  }

  navigateToDetails(serviceId: string): void {
    if (serviceId) {
      // Navegar al detalle del servicio usando la ID del servicio
      this.router.navigate(['/details', serviceId]);
    }
  }

  restoreLikesFromStorage(): void {
    // Recupera el estado de "Me gusta" desde el almacenamiento local o de sesión
    this.services.forEach(service => {
      const liked = sessionStorage.getItem(`liked_${service._id}`);
      service.liked = liked === 'true';
    });
  }
  addLike(serviceId: string): void {
    const service = this.services.find(s => s._id === serviceId);
    if (service) {
      if (service.liked) {
        // Si ya le diste "Me gusta", quítalo
        this.apiService.removeLike(serviceId).subscribe(() => {
          service.likes--;
          service.liked = false;
          sessionStorage.setItem(`liked_${service._id}`, 'false');
        });
      } else {
        // Si aún no le has dado "Me gusta", agrégalo
        this.apiService.addLike(serviceId).subscribe(() => {
          service.likes++;
          service.liked = true;
          sessionStorage.setItem(`liked_${service._id}`, 'true');
        });
      }
    }
  }
  toggleSave(service: any) {
    service.saved = !service.saved;
    // Puedes agregar la lógica necesaria para guardar o desguardar el servicio
  }
  toggleLike(service: any) {
    service.liked = !service.liked;
    service.likes += service.liked ? 1 : -1;
  }

  removeLike(serviceId: string): void {
    this.apiService.removeLike(serviceId).subscribe(
      (respuesta) => {
        const service = this.services.find(s => s._id === serviceId);
        if (service) {
          service.likes = respuesta.likes;
          service.liked = false; // Desmarcado como "Me gusta" localmente
          sessionStorage.setItem(`liked_${service._id}`, 'false'); // Actualiza el almacenamiento local o de sesión
        }
      },
      (error) => {
        console.error('Error al quitar "Me gusta"', error);
      }
    );
  }
  
  

  search(): void {
    console.log('Término de búsqueda:', this.searchTerm);
    // Llama al servicio para realizar la búsqueda
    if (this.searchTerm.trim() !== '') {
      this.apiService.searchServices(this.searchTerm).subscribe(
        (response) => {
          this.services = response;
        },
        (error) => {
     
          console.error('Error al realizar la búsqueda', error);
        }
      );
    } else {
      // Si el término de búsqueda está vacío, obtén todos los servicios
      this.getServicesAll();
    }
  }
  searchByCategory(): void {
    const selectedCategories = this.categories
      .filter((category) => category.checked)
      .map((category) => category.name);

    if (selectedCategories.length > 0) {
      this.apiService.searchByCategory(selectedCategories.join(',')).subscribe(
        (response) => {
          this.services = response;
        },
        (error) => {
          console.error('Error al realizar la búsqueda por categoría', error);
        }
      );
    } else {
      this.getServicesAll();
    }
  }
  
  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.searchByCategory();  // Llama a la función de búsqueda con la nueva categoría seleccionada
  }

  
 
}



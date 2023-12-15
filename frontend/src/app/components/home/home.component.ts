
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TasksService } from '../../services/tasks.service';

import { AuthService } from '../../services/auth.service';

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

  constructor(private apiService: TasksService, private router: Router, private authService: AuthService) {}


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
  
  

  removeLike(serviceId: string): void {
    this.apiService.removeLike(serviceId).subscribe(
      (response) => {
        const service = this.services.find(s => s._id === serviceId);
        if (service) {
          service.likes = response.likes;
          service.liked = false;
          sessionStorage.setItem(`liked_${service._id}`, 'false');
          console.log(`Me gusta eliminado para el servicio ${service._id}`);
        }
      },
      (error) => {
        console.error('Error al quitar "Me gusta"', error);
        // Puedes agregar una notificación o mensaje de error para informar al usuario sobre el problema.
      }
    );
  }
  
  
  toggleLike(service: any): void {
    // Verifica si el usuario está autenticado antes de permitir "Me gusta"
    if (this.authService.loggedIn()) {
      if (service.liked) {
        // Si ya le diste "Me gusta", quítalo
        this.apiService.removeLike(service._id).subscribe(() => {
          service.likes--;
          service.liked = false;
          sessionStorage.setItem(`liked_${service._id}`, 'false');
        });
      } else {
        // Si aún no le has dado "Me gusta", agrégalo
        this.apiService.addLike(service._id).subscribe(() => {
          service.likes++;
          service.liked = true;
          sessionStorage.setItem(`liked_${service._id}`, 'true');
        });
      }
    } else {
      alert('Por favor, inicia sesión para dar "Me gusta".');
      this.router.navigate(['/signin']);
    }
  }


  search(): void {
    console.log('Término de búsqueda:', this.searchTerm);
  
    if (this.searchTerm.trim() !== '') {
      this.apiService.searchServices(this.searchTerm).subscribe(
        (response) => {
          console.log('Respuesta de búsqueda:', response);
          this.services = response;
        },
        (error) => {
          console.error('Error al realizar la búsqueda', error);
        }
      );
    } else {
      console.log('Término de búsqueda vacío, obteniendo todos los servicios.');
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
        if (response.length > 0) {
          this.services = response;
        } else {
          // Si no hay recetas encontradas, puedes asignar un mensaje o manejarlo según tus necesidades.
          this.services = [];
          console.log('No se encontraron recetas con el nombre buscado.');
        }
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



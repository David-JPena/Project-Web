import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../services/tasks.service';
import { Router } from '@angular/router';  // Importa Router



@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  services: any[] = [];

  constructor(
    private serviceService: TasksService,
    private router: Router,  // Inyecta Router
   
  ) {}

  ngOnInit(): void {
    this.getAllServices();
  }

  getAllServices(): void {
    this.serviceService.getAllServices().subscribe(response => {
      this.services = response;
    });
  }

  getImageUrl(imageName: string): string {
    // Construye la URL completa para la imagen
    return `http://localhost:3000/uploads/${imageName}`;
  }

  deleteService(id: string): void {
    this.serviceService.deleteService(id).subscribe(
      () => {
        // Actualizar la lista después de eliminar
        this.getAllServices();
      },
      (error) => {
        console.error('Error al eliminar el servicio', error);
        // Manejar el error según sea necesario
      }
    );
  }

  navigateToEdit(serviceId: string): void {
    // Navegar al componente de edición con el ID del servicio
    this.router.navigate(['/edit', serviceId]);
  }
  navigateToAdd(): void {
    // Navegar al formulario de agregar
    this.router.navigate(['/add']);
  }
  isString(value: any): value is string {
    return typeof value === 'string';
  }
  getIngredientsArray(ingredients: string): string[] {
    return ingredients ? ingredients.split(',') : [];
  }

  getStepsArray(steps: string): string[] {
    return steps ? steps.split(',') : [];
  }
  navigateToDetails(serviceId: string): void {
    // Navegar al detalle del servicio con comentarios usando la ID del servicio
    this.router.navigate(['/details', serviceId]);
  }
  
}

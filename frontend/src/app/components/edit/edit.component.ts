import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../services/tasks.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  formData: any = {
    name: '',
    description: '',
    ingredients: [''],
    steps: [''],
    categories: '',
    image: null
  };

  nuevoIngrediente: string = '';
  nuevoPaso: string = '';

  categoryOptions: string[] = ['Desayuno', 'Almuerzo', 'Cena', 'Vegetariana', 'Postres'];

  constructor(
    private serviceService: TasksService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const serviceId = this.route.snapshot.paramMap.get('id');
    if (serviceId) {
      this.getServiceDetails(serviceId);
    }
  }

  private getServiceDetails(serviceId: string): void {
    this.serviceService.getServiceById(serviceId).subscribe(
      (service) => {
        this.formData = {
          name: service.name,
          description: service.description,
          ingredients: service.ingredients,
          steps: service.steps,
          categories: service.categories,
          image: service.image || null
        };
      },
      (error) => {
        console.error('Error al obtener detalles del servicio', error);
      }
    );
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.formData.image = file;
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('name', this.formData.name);
    formData.append('description', this.formData.description);
    formData.append('ingredients', this.formData.ingredients.join(',')); // Convierte a cadena separada por comas
    formData.append('steps', this.formData.steps.join(',')); // Convierte a cadena separada por comas
    formData.append('categories', this.formData.categories);
  
    // Solo añade la nueva imagen si se proporciona
    if (this.formData.image instanceof File) {
      formData.append('file', this.formData.image);
    }
  
    const serviceId = this.route.snapshot.paramMap.get('id');
  
    if (serviceId) {
      this.serviceService.updateService(serviceId, formData).subscribe(
        (response) => {
          console.log('Servicio actualizado con éxito', response);
          this.router.navigate(['/list']);
        },
        (error) => {
          console.error('Error al actualizar el servicio', error);
        }
      );
    } else {
      console.error('No se proporcionó un ID para la edición');
    }
  }
  

  agregarIngrediente(): void {
    if (this.nuevoIngrediente.trim() !== '') {
      this.formData.ingredients.push(this.nuevoIngrediente);
      this.nuevoIngrediente = '';
    }
  }

  agregarPaso(): void {
    if (this.nuevoPaso.trim() !== '') {
      this.formData.steps.push(this.nuevoPaso);
      this.nuevoPaso = '';
    }
  }

  eliminarIngrediente(index: number): void {
    this.formData.ingredients.splice(index, 1);
  }

  eliminarPaso(index: number): void {
    this.formData.steps.splice(index, 1);
  }

  navigateToList(): void {
    this.router.navigate(['/list']);
  }

  // Función para obtener la URL completa de la imagen
  getImageUrl(imageName: string): string {
    return `http://localhost:3000/uploads/${imageName}`;
  }
}

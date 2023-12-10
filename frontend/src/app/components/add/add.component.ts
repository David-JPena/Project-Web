import { Component } from '@angular/core';
import {  TasksService } from '../../services/tasks.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddComponent {
  categoryOptions: string[] = ['Desayuno', 'Almuerzo', 'Cena', 'Vegetariana', 'Postres'];
  formData: any = {
    name: '',
    description: '',
    // price: null,
    ingredients: [''], // Inicializado con un ingrediente vacío
    steps: [''] ,
    categories: "",
    image: null // Cambiado a null para manejar archivos
  };

  constructor(private serviceService: TasksService, private router: Router) { }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.formData.image = file;
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('name', this.formData.name);
    formData.append('description', this.formData.description);
    // formData.append('price', this.formData.price.toString());
    formData.append('ingredients', this.formData.ingredients);
    formData.append('steps', this.formData.steps);
    formData.append('categories', this.formData.categories);
    formData.append('file', this.formData.image);

    this.serviceService.createService(formData).subscribe(response => {
      console.log(response);
      // Realiza cualquier lógica adicional después de registrar el servicio
    });
  }

  nuevoIngrediente: string = '';
  nuevoPaso: string = '';

  agregarIngrediente() {
    if (this.nuevoIngrediente.trim() !== '') {
      this.formData.ingredients.push(this.nuevoIngrediente);
      this.nuevoIngrediente = '';  // Limpiar el campo después de agregar
    }
  }

  eliminarIngrediente(index: number) {
    this.formData.ingredients.splice(index, 1);
  }

  agregarPaso() {
    if (this.nuevoPaso.trim() !== '') {
      this.formData.steps.push(this.nuevoPaso);
      this.nuevoPaso = '';  // Limpiar el campo después de agregar
    }
  }

  eliminarPaso(index: number) {
    this.formData.steps.splice(index, 1);
  }
  
  navigateToList(): void {
    // Navegar a la lista después de hacer clic en el botón
    this.router.navigate(['/list']);
  }
}


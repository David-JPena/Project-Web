// home.component.ts

import { Component, OnInit } from '@angular/core';

import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  services: any[] = [];

  constructor(private apiService: TasksService) { }

  ngOnInit(): void {
    this.getAllServices();
  }

  getAllServices(): void {
    this.apiService.getAllServices().subscribe(response => {
      this.services = response;
    });
  }



  getIngredientsArray(ingredients: string): string[] {
    if (typeof ingredients !== 'string') {
      console.error('Ingredients is not a string:', ingredients);
      return [];
    }
    console.log('Ingredients raw:', ingredients);
    const result = ingredients.split(',');
    console.log('Ingredients array:', result);
    return result;
  }

// home.component.ts

getStepsArray(steps: string): string[] {
  if (typeof steps !== 'string') {
    console.error('Steps is not a string:', steps);
    return [];
  }
  console.log('Steps raw:', steps);
  const result = steps.split(',');
  console.log('Steps array:', result);
  return result;
}

  navigateToEdit(serviceId: string): void {
    // Implementa la lógica para la navegación a la edición si es necesario
  }

  getImageUrl(imageName: string): string {
    return `http://localhost:3000/uploads/${imageName}`;
  }
}

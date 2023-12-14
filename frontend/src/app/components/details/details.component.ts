// details.component.ts

import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../services/tasks.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  serviceId: string | null = null; // Inicializa como nulo
  comments: any[] = [];
  newCommentText: string = ''; // Agrega la propiedad 'newCommentText'
  likes: number = 0;
  services: any[] = [];

  constructor(private serviceService: TasksService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.serviceId = params.get('id') ?? null;
      this.loadComments();
    });

    // Recupera la información del servicio al inicializar
    this.loadServiceInfo();
  }

  loadServiceInfo(): void {
    if (this.serviceId) {
      this.serviceService.getServiceById(this.serviceId).subscribe(
        (data) => {
          this.services = [data]; // Puedes necesitar ajustar esto según la estructura de tu servicio
          this.loadComments();
          // this.updateLikes();
        },
        (error) => {
          console.error('Error al obtener información del servicio', error);
        }
      );
    }
  }

  loadComments(): void {
    if (this.serviceId) {
      this.serviceService.getComments(this.serviceId).subscribe(data => {
        this.comments = data;
      });
    }
  }

  addComment(): void {
    if (this.serviceId && this.newCommentText) {
      this.serviceService.addComment(this.serviceId, this.newCommentText).subscribe(() => {
        this.loadComments();
        this.newCommentText = ''; // Limpiar el campo después de agregar el comentario
      });
    }
  }

  // updateLikes(): void {
  //   this.serviceService.getLikes(this.serviceId).subscribe(
  //     (respuesta) => {
  //       this.likes = respuesta.likes;
  //     },
  //     (error) => {
  //       console.error('Error al obtener la cantidad de me gusta', error);
  //     }
  //   );
  // }

  getImageUrl(imageName: string): string {
    const imageUrl = `http://localhost:3000/uploads/${imageName}`;
    console.log('Image URL:', imageUrl);
    return imageUrl;
  }
}

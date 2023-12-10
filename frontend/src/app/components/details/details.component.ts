// details.component.ts

import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../services/tasks.service';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { NgForm } from '@angular/forms';  // Importa NgForm

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  idServicio: string = ''; // Asigna un valor predeterminado
  nuevoComentario: any = { user: '', text: '' };
  comentarios: any[] = [];
  likes: number = 0;

  constructor( public apiService: TasksService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Recupera la ID del servicio de la ruta
    this.route.paramMap.subscribe(params => {
      this.idServicio = params.get('id') || ''; // Utiliza el valor predeterminado si no se encuentra la ID
      if (this.idServicio) {
        this.cargarComentarios();
        this.actualizarLikes();
      }
    });
  }

  cargarComentarios(): void {
    this.apiService.getComentarios(this.idServicio).subscribe(
      (data) => {
        this.comentarios = data;
      },
      (error) => {
        console.error('Error al cargar comentarios', error);
      }
    );
  }
 // En el método agregarComentario()
agregarComentario(): void {
  this.apiService.agregarComentario(this.idServicio, this.nuevoComentario).subscribe(
      (respuesta) => {
          console.log('Comentario agregado con éxito', respuesta);
          // Limpiar el formulario y recargar los comentarios y likes
          this.nuevoComentario = { user: '', text: '' };
          this.cargarComentarios();
      
      },
      (error) => {
          console.error('Error al agregar comentario', error);
      }
  );
}

  // En el componente Angular
  darMeGusta(): void {
    this.apiService.addLike(this.idServicio).subscribe(
        (respuesta) => {
            console.log('Me gusta agregado con éxito', respuesta);
            this.actualizarLikes();
        },
        (error) => {
            console.error('Error al agregar me gusta', error);
        }
    );
}

actualizarLikes(): void {
    this.apiService.getLikes(this.idServicio).subscribe(
        (respuesta) => {
            this.likes = respuesta.likes;
        },
        (error) => {
            console.error('Error al obtener la cantidad de me gusta', error);
        }
    );
}
}

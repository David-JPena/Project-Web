import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrl: './profile-details.component.css'
})
export class ProfileDetailsComponent implements OnInit {

  user: any;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    // Obtener el ID de usuario de los parámetros de la ruta
    this.route.params.subscribe(params => {
      const userId = params['userId'];

      // Obtener detalles del perfil del usuario específico usando ProfileService
      this.profileService.getUserProfile(userId).subscribe(
        (userDetails: any) => {
          this.user = userDetails.user;
        },
        error => {
          console.error('Error al obtener detalles del perfil:', error);
        }
      );
    });
  }

}

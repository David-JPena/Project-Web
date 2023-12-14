import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-perfil',
  templateUrl: './edit-perfil.component.html',
  styleUrl: './edit-perfil.component.css'
})
export class EditPerfilComponent implements OnInit {

  editedUser: any = {}; // Este objeto contendrá los detalles editados
  userId: string | null = null; // Asegúrate de asignar el valor correcto según tu lógica

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener detalles del usuario actual al cargar el componente
    this.userId = this.authService.getUserId();
    if (this.userId) {
      this.profileService.getUserDetails(this.userId).subscribe(
        (res: any) => {
          // Asignar los detalles del usuario actual a editedUser
          this.editedUser = { ...res };
        },
        (err: any) => {
          console.error(err);
          // Puedes manejar el error según sea necesario
        }
      );
    }
  }

  // Agrega un método para guardar los cambios
  saveChanges() {
    // Lógica para guardar los cambios en el servidor (usando tu servicio)
    this.profileService.updateUserProfile(this.editedUser).subscribe(
      (res) => {
        console.log('Cambios guardados correctamente');
        // Puedes redirigir al perfil u otra página después de guardar los cambios
        this.router.navigate(['/profile']);
      },
      (err) => {
        console.error('Error al guardar cambios:', err);
        // Manejar el error según sea necesario
      }
    );
  }
  
}

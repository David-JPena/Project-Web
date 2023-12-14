import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-following-users',
  templateUrl: './following-users.component.html',
  styleUrl: './following-users.component.css'
})
export class FollowingUsersComponent {

  followingUsers: any[] = [];

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profileService.getFollowingUsers().subscribe(
      (res: any) => {
        this.followingUsers = res.users;
      },
      (err: any) => console.error(err)
    );
  }

  // Método para dejar de seguir a un usuario
  unfollowUser(userId: string) {
    this.authService.unfollowUser(userId).subscribe(
      (res: any) => {
        console.log(res.message);
        // Actualiza la lista de usuarios seguidos después de dejar de seguir
        this.followingUsers = this.followingUsers.filter(user => user._id !== userId);
      },
      (err: any) => console.error(err)
    );
  }

  // Método para ver el perfil de un usuario
  viewProfile(userId: string) {
    // Redirige a la página de perfil del usuario
    // Puedes implementar la navegación según tus rutas y estructura de la aplicación
    this.router.navigate(['/profile', userId]);
  }

}

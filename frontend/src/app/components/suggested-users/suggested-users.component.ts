import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-suggested-users',
  templateUrl: './suggested-users.component.html',
  styleUrl: './suggested-users.component.css'
})
export class SuggestedUsersComponent {

  usersToFollow: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.profileService.getUsersToFollow().subscribe(
      (res: any) => {
        this.usersToFollow = res.users;
      },
      (err: any) => console.error(err)
    );
  }

  followOrUnfollowUser(userToToggle: any) {
    const userId = userToToggle._id;

    if (userToToggle.isFollowingStatus) { // Cambiar de 'isFollowing' a 'isFollowingStatus'
      // Dejar de seguir al usuario
      this.authService.unfollowUser(userId).subscribe(
        (res: any) => {
          console.log(res.message);
          userToToggle.isFollowingStatus = false;
        },
        (err: any) => console.error(err)
      );
    } else {
      // Seguir al usuario
      this.authService.followUser(userId).subscribe(
        (res: any) => {
          console.log(res.message);
          userToToggle.isFollowingStatus = true;
        },
        (err: any) => console.error(err)
      );
    }
  }

  goToProfile(userId: string) {
    // Navegar a la página de perfil del usuario con el ID como parámetro
    this.router.navigate(['/profile', userId]);
  }

  canFollowUser(userId: string): boolean {
    // Puedes personalizar la lógica aquí según tus requisitos
    return true;
  }

}

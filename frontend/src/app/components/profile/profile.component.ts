import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  user: any;
  isFollowing: boolean = false;
  isOwnProfile: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private profileService: ProfileService
  ) {}

  // Cambia la parte relevante de tu ProfileComponent
  ngOnInit(): void {
    this.profileService.getUserProfileDetails().subscribe(
      (res: any) => {
        this.user = res;
        this.isOwnProfile = this.authService.getUserId() === this.user._id;

        // Verifica si la propiedad 'followers' existe antes de usarla
        if (this.user.followers) {
          console.log('Seguidores: ', this.user.followers.length);
        }
      },
      (err: any) => console.log(err)
    );
  }

  goToProfile(userId: string) {
    // Navegar a la página de perfil del usuario seguido
    this.router.navigate(['/profile', userId]);
  }

  followUser(event: Event, userToFollow: any) {
    event.stopPropagation();
    const userId = this.user._id;
    this.authService.followUser(userId).subscribe(
      (res) => {
        console.log(res.message);
        this.isFollowing = true;
      },
      (err) => console.error(err)
    );
  }

  canFollowUser(userId: string): boolean {
    return !this.isOwnProfile && !this.isFollowing && userId !== this.authService.getUserId();
  }

  navigateToUsersList() {
    this.router.navigate(['/users-list']);
  }

  navigateToSuggestedUsers() {
    this.router.navigate(['/suggested-users']);
  }

  showFollowingUsers() {
    // Redirigir a la página que muestra los usuarios seguidos
    this.router.navigate(['/following-users']);
  }

}

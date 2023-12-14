import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth.guard';

//Components
import { TasksComponent } from './components/tasks/tasks.component';
import { PrivateComponent } from './components/private/private.component';
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { AddComponent } from './components/add/add.component';
import { ListComponent } from './components/list/list.component';
import { EditComponent } from './components/edit/edit.component';
import { DetailsComponent } from './components/details/details.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileDetailsComponent } from './components/profile-details/profile-details.component';
import { SuggestedUsersComponent } from './components/suggested-users/suggested-users.component';
import { FollowingUsersComponent } from './components/following-users/following-users.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/tasks',
    pathMatch: 'full'
  },
  {
    path: 'tasks',
    component: TasksComponent
  },
  {
    path: 'private',
    component: PrivateComponent,
    canActivate: [authGuard]
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'signin',
    component: SigninComponent
  },
  {
    path: 'add',
    component: AddComponent
  },
  {
    path: 'list',
    component: ListComponent

  },
  {
    path: 'edit/:id',
    component: EditComponent
  },
  {
    path: 'details/:id',
    component: DetailsComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'profile/:userId',
    component: ProfileDetailsComponent
  },
  {
    path: 'suggested-users',
    component: SuggestedUsersComponent
  },
  {
    path: 'following-users',
    component: FollowingUsersComponent  // Asegúrate de crear este componente
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

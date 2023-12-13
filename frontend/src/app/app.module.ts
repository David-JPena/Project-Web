import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpInterceptor } from '@angular/common/http';
import { authGuard } from './auth.guard';
import { TokenService } from './services/token.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { PrivateComponent } from './components/private/private.component';

import { AddComponent } from './components/add/add.component';
import { EditComponent } from './components/edit/edit.component';
import { HomeComponent } from './components/home/home.component';
import { ListComponent } from './components/list/list.component';
import { DetailsComponent } from './components/details/details.component';
import { FooderComponent } from './components/fooder/fooder.component';


@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    TasksComponent,
    PrivateComponent,
    AddComponent,
    EditComponent,
    HomeComponent,
    ListComponent,
    DetailsComponent,
    FooderComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    authGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

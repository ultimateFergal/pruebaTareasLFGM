import { Component } from '@angular/core';
import {UserService} from '../adminShared/Services/user.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
 })
 
export class LoginComponent { 
  email: string;
  password: string;
  loggedIn;
  
  constructor( private userService: UserService,  private router: Router){

    this.userService.loggedIn.subscribe(loggedIn =>
      {
        this.loggedIn = loggedIn;
      })
  }

/*   login(){
    this.userService.login(this.email, this.password1);
    this.userService.verifyUser();
  }
 */

login() {
  this.userService.login(this.email, this.password)
}

signup(){
  this.router.navigate(['/admin/signup']);
}

cancel(){
  this.router.navigate(['']);
}

}
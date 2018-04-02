import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../adminShared/Services/user.service';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.css']
 })
 
export class AdminMenuComponent implements OnInit { 
  theUser: string;
  
  constructor( private userService: UserService, private router: Router ){}

  ngOnInit(){
    this.theUser = this.userService.loggedInUser;
  }

  logout(){
    this.userService.logout();
    this.router.navigate(['']);
  }
}

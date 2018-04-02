import { Injectable, OnInit } from '@angular/core';
import {  
    CanActivate, 
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import 'rxjs';
//import 'rxjs/Rx';
import 'rxjs/add/operator/map'
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Task } from '../Models/Task';


@Injectable()
export class TaskService  {

    apiUrl: string = 'http://localhost:3000/';

    taskList: Task[];
    selectedTask: Task = new Task();

    userLoggedIn: boolean = false;
    loggedInUser: string;
    authUser: any;
    
    constructor( private router: Router, 
                 private http: HttpClient, 
                 private toastr: ToastrService) {
    }

    getTasks(){
        return this.http.get<Task[]>(`${this.apiUrl}tasks`, )
            .map(res => res);
    }

    createTask(task: Task){
       return this.http.post<Task>(`${this.apiUrl}/users`, task)
            .map(res => res);
    }

    updateTask(){
    }

    deleteTask(id){
        return this.http.delete(`${this.apiUrl}/tasks${id}`)     
            .map(res => res);
    }

    verifyUser() {
/*         this.authUser = firebase.auth().currentUser;
        if (this.authUser) {

            alert(`Welcome ${this.authUser.email}`);
            this.loggedInUser = this.authUser.email;
            this.userLoggedIn = true;
            this.router.navigate(['/admin']);
        } */
    }

/*     login(loginEmail: string, loginPassword: string) {
        firebase.auth().signInWithEmailAndPassword(loginEmail, loginPassword)
            .catch(function(error) {
                alert(`${error.message} Unable to login. Try again!`);
        });
    } */

/*     logout(){
        this.userLoggedIn = false;
        firebase.auth().signOut().then(function() {
            alert(`Logged Out!`);

        }, function(error) {
            alert(`${error.message} Unable to logout. Try again!`);
        });
    } */


    //api = 'http://localhost:5000/api';
    loggedIn = new BehaviorSubject<boolean>(false);
    token;
  
    login(email: string, password: string) {
      this.http.post(this.apiUrl + 'user/login', {
        email: email,
        password: password
      }).subscribe((resp: any) => {
        this.loggedIn.next(true);
        this.token = resp.token;
        //onsole.log(this.token);
        this.saveToken(resp.token);
        this.toastr.success(resp && resp.user && resp.user.name ? `Bienvenido ${resp.user.name}` : 'Sesión iniciada!');        
        
        this.loggedInUser = email;
        this.userLoggedIn = true;
        this.router.navigate(['/admin']);

      }, (errorResp) => {
        this.loggedIn.next(undefined);
        errorResp.error ? this.toastr.error(errorResp.error.errorMessage) : this.toastr.error('Ha ocurrido un erro inesperado.');
      });
    }

    logout() {
        this.userLoggedIn = false;
        this.destroyToken();
        this.loggedIn.next(false);
    } 

    saveToken(token: string){
        window.localStorage['jwtToken'] = token;
    }

    destroyToken(){
        window.localStorage.removeItem('jwtToken');
    }

    getToken(){
        return window.localStorage['jwtToken'];
    }

    buildHeaders(): HttpHeaders {
        const headersConfig = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        if (this.getToken()){
            headersConfig['Authorization'] = `Token ${this.getToken()}`;
        }

        return new HttpHeaders(headersConfig);
    }
}
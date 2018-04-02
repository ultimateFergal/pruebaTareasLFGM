import { Injectable } from '@angular/core';
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
import { User } from '../Models/User';


@Injectable()
export class UserService implements CanActivate {

    apiUrl: string = 'http://localhost:3000/';

    userLoggedIn: boolean = false;
    loggedInUser: string;
    authUser: any;

    userList: User[];
    selectedUser: User = new User();  
    
    constructor( private router: Router, 
                 private http: HttpClient, 
                 private toastr: ToastrService
    ) {
        const jwtToken = this.getToken();
        this.loggedIn = new BehaviorSubject<boolean>(jwtToken ? true: false)
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean { 
        let url: string = state.url;
        return this.verifyLogin(url);
    }   

    verifyLogin(url: string): boolean {
        if (this.userLoggedIn) { return true; }
                
        this.router.navigate(['/admin/login']);
        return false;
    }

    getUsers(){
        return this.http.get<User[]>(`${this.apiUrl}users`)
        .map(res => res);
    }

    createUser(user: User){console.log("user");console.log(user)
       return this.http.post<any>(`${this.apiUrl}users`, user)
        .map(res => res);
    }

    updateUser(user){
        return this.http.put<any>(`${this.apiUrl}users/${user.id}`, user)
    }

    deleteUser(id){
        return this.http.delete<any>(`${this.apiUrl}users/${id}`)     
            .map(res => res);
    }

/*     getUsers() {
        return this.http.get(`${this.domain}/users`)
            .map(res => )
    } */

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

    loggedIn = new BehaviorSubject<boolean>(false);
    
  
    login(email: string, password: string) {
      this.http.post(this.apiUrl + 'user/login', {
        email: email,
        password: password
      }).subscribe((resp: any) => {
        this.loggedIn.next(true);
        //this.token = resp.token;
        //onsole.log(this.token);
        this.saveToken(resp.token);
        this.toastr.success(resp && resp.user && resp.user.name ? `Bienvenido ${resp.user.name}` :  `Bienvenido ${email} Sesión iniciada!`);        
        
        this.loggedInUser = email;
        this.userLoggedIn = true;
        this.router.navigate(['/admin/users']);

      }, (errorResp) => {
        this.loggedIn.next(undefined);console.log("errorResp");console.log(errorResp)
        errorResp.error ? this.toastr.error(errorResp.error.msg) : this.toastr.error('Ha ocurrido un erro inesperado.');
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
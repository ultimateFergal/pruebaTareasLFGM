import { Component, OnInit } from '@angular/core';
import { Router } from  '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { UserService } from '../adminShared/Services/user.service';
import { User } from '../adminShared/Models/User';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[];

  email: string;
  password: string;
  id: string;
  isEdit: boolean = false;
  crearEditar: string = "Crear";

  userList: User[];
  selectedUser: User = new User();  
  
  constructor(private userService: UserService, private toastr: ToastrService) { 
  }

  ngOnInit() {
    this.userService.getUsers()
    .subscribe(users => {
      console.log(users);
      this.users = users
    })
    this.resetForm();
  }

  addUser(event, userForm: NgForm){
    event.preventDefault();
    const newUser: User={
      id : "",
      email: this.email,
      password: this.password,
      isDone: false,
    };

    //Se determina si se está creando o editando un usuario
    if (!this.isEdit){
    //Método del servicio para crear un usuario
    this.userService.createUser(newUser)
      .subscribe(res => {
        console.log(res);

        if (res.data && res.data.msg == "user created") {
          newUser.id = res.data.insertId;

          //Se agrega el usuario creado a la lista local de usuarios que se muestra en el Front end
          this.users.push(newUser);

          this.resetForm(userForm);
          this.toastr.success('Operación exitosa', "Usuario creado");
        }
        
        if (res.msg) {
          //this.resetForm(userForm);
          this.toastr.error('Operación fallida', res.msg);
        }
      })
    } else {

      const editUser: User={
        id : this.id,
        email: this.email,
        password: this.password,
        isDone: false,
      };
      const users = this.users;
      
      const response = confirm("Está seguro que desea eliminar el usuario?");
      console.log(editUser)
      if (response){
        this.userService.updateUser(editUser)
        .subscribe(res => {
          console.log(res);
  
          if (res.msg && res.msg == "Usuario actualizado") {
  
            //Se elimina el usuario borrado de la lista local de usuarios que se muestra en el Front end
            for(let i=0; i < users.length; i++){
              if(users[i].id == editUser.id){
                users[i] = editUser
              }
            }
  
            this.resetForm(userForm);
            this.toastr.success('Operación exitosa', res.msg);
          } else {
            //this.resetForm(userForm);
            this.toastr.error('Operación fallida', res.msg);
          }
        })
      }
      //this.crearEditar = "Crear";
      return;
    }

  }

  editUser(user){
    this.id = user.id;
    this.email = user.email;
    this.password = user.password;
    this.isEdit = true;
    this.crearEditar = "Editar";
  }

  //Método del servicio para borrar un usuario
  deleteUser(id){
    const response = confirm("Está seguro que desea eliminar el usuario?");

    if (response){
      const users = this.users;
      this.userService.deleteUser(id)
        .subscribe(data =>{
  
          if (data && data.msg == "Usuario borrado") {
  
            //Se elimina el usuario borrado de la lista local de usuarios que se muestra en el Front end
            for(let i=0; i < users.length; i++){
              if(users[i].id == id){
                users.splice(i, 1); 
              }
            }
            this.toastr.success('Operación exitosa', data.msg);
          } else {
            //this.resetForm(userForm);
            this.toastr.error('Operación fallida', "");
          }
        })
    }
    return;
  }


  resetForm(productForm?: NgForm)
  {
    if(productForm != null)
      productForm.reset();
      this.userService.selectedUser = new User();
  }
  
}

import { NgModule }                     from '@angular/core';
import { CommonModule }                 from '@angular/common';
import { RouterModule, Routes }         from '@angular/router';
import { FormsModule }                  from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule }      from '@angular/platform-browser/animations'; 
import { ToastrModule }                 from 'ngx-toastr';

import { AdminComponent }           from './adminComponent/admin.component';
import { AdminMenuComponent }       from './adminMenu/admin-menu.component';
import { LoginComponent }           from './login/login.component';
import { UsersComponent }           from './users/users.component';
import { TasksComponent }            from './tasks/tasks.component';

import { UserService }              from './adminShared/Services/user.service';
import { TaskService }              from './adminShared/Services/task.service';
import { TasksListComponent }       from './tasks-list/tasks-list.component';

const AdminRoutes: Routes = [
    { 
        path: 'admin',  
        //component: AdminComponent, 
        children: [
            { path: 'tasks', component: TasksComponent, canActivate: [UserService] },//RoutGard. para que usuarios no autorizados no accedan a esta área
            { path: 'users', component: UsersComponent, canActivate: [UserService] },//RoutGard. para que usuarios no autorizados no accedan a esta área
            { path: 'login', component: LoginComponent },
            { path: '', component: LoginComponent }
            //{ path: '', component: AdminMenuComponent, canActivate: [UserService] }
        ]
    },
];
@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        RouterModule.forChild(AdminRoutes),
        BrowserAnimationsModule, // required animations module
        ToastrModule.forRoot(), // ToastrModule added
    ],
    exports: [
        RouterModule,
        //TruncatePipe
    ],
    declarations: [
        AdminComponent,
        AdminMenuComponent,
        LoginComponent,
        UsersComponent,
        TasksComponent,
        TasksListComponent,/*
        BlogAdminComponent,
        BlogAddComponent,
        TruncatePipe,
        ProductAdminComponent,
        ProductAddComponent */
    ],
    providers: [
        UserService,
        TaskService,
        HttpClientModule/*
        BlogAdminService,
        ProductAdminService,
        ShoppingCartService */
    ]
})
export class AdminModule {}


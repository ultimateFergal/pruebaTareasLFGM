import { Component, OnInit } from '@angular/core';

import { TaskService } from '../adminShared/Services/task.service';
import { Task } from '../adminShared/Models/Task';
import { Router } from  '@angular/router';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  tasks: Task[];
  title: string;
  description: string;
  status: string;
  dueDate: string;

  taskList: Task[];
  selectedTask: Task = new Task();

  constructor(private taskService: TaskService) { 
    this.taskService.getTasks()
      .subscribe(tasks => {
        console.log("tasks1");
        console.log(tasks);
        this.tasks = tasks
      })
  }

  ngOnInit() {
    this.taskService.getTasks()
    .subscribe(tasks => {
      console.log(tasks);
      this.tasks = tasks
    })
  }

  addTask(event) {
    event.preventDedault();
    console.log(this.title)
    const newTask: Task = {
      title: this.title,
      description: this.description,
      status: this.status,
      dueDate: this.dueDate,
      isDone: false,
      id: ""
    };
    this.taskService.createTask(newTask)
      .subscribe(task =>{
        this.tasks.push(task)
      })
  } 

}

import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit {

  tasks = [];

  constructor( private tasksService: TasksService){}

  ngOnInit(): void {
    this.tasksService.getTasks()
      .subscribe(
        res => {
          console.log(res)
          this.tasks = res.tasks;
        },
        err => console.log(err)
    )
  }
}

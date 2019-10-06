import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main-app',
  templateUrl: './main-app.component.html',
  styleUrls: ['./main-app.component.css']
})
export class MainAppComponent implements OnInit {

  todosDB: Observable<any[]>;
  todoList: any = [];
  todoListString: String;
  todo: String = "";
  todoClass = "row alert alert-info"

  constructor(public db: AngularFirestore){
    this.todosDB = db.collection('todos').valueChanges();
  }

  ngOnInit() {
    (<any>this.todosDB).subscribe(data => {
      this.todoList = JSON.parse(data[0].todo)
    })
  }


  cloudUpdate = () => {
    this.todoListString = JSON.stringify(this.todoList);
    this.db.doc('todos/AcVWR10Q9UOpHovjzgko').update({todo: this.todoListString});
  }

  addTodo = () => {
    console.log(this.todo)

    this.todoList.push({
      todo: this.todo,
      done: true,
      todoClass: "row alert alert-info",
      notdone: false,
      low: false,
      mid: false,
      high: true,
      assigned: true,
      assignAdd: false,
      assignedTo: "",
    })
    this.todo = ""

    this.cloudUpdate()
  }



  filterTodo = (value, index, array) => {
    return value.done
  }

  filterTodoHigh = (value, index, array) => {
    return value.high
  }

  filterTodoMid = (value, index, array) => {
    return value.mid
  }

  filterTodoLow = (value, index, array) => {
    return value.low
  }

  clearTodos = () => {
    this.todoList = this.todoList.filter(this.filterTodo)
    this.cloudUpdate()
  }

  clearAllTodos = () => {
    this.todoList = []
    this.cloudUpdate()
  }

  disableAssignTo = (todo) => {
    todo.assigned = false
    todo.assignAdd = true
    this.cloudUpdate()
  }

  addAssignedTo = (todo) => {
    // todo.assignedTo = 
    todo.assignAdd = false
    todo.assigned = false
    this.cloudUpdate()
  }

  sortTodos = () => {
    let x = this.todoList.filter(this.filterTodoHigh)
    let y = this.todoList.filter(this.filterTodoMid)
    let z = this.todoList.filter(this.filterTodoLow)

    this.todoList = []
    x.forEach(element => {
      this.todoList.push(element) 
    });

    y.forEach(element => {
      this.todoList.push(element) 
    });

    z.forEach(element => {
      this.todoList.push(element) 
    });

    this.cloudUpdate()
  }

  toggleDone = (todo) => {
    if (todo.done) {
      todo.done = false
      todo.notdone = true
      todo.todoClass = "row alert alert-secondary"
    } else {
      todo.done = true
      todo.notdone = false
      todo.todoClass = "row alert alert-info"
    }

    this.cloudUpdate()
  }

  togglePriority = (todo,prior) => {
    if (!todo.low && prior == 'low') {
      todo.low = true
      todo.mid = false
      todo.high = false
    }

    if (!todo.mid && prior == 'mid') {
      todo.mid = true
      todo.low = false
      todo.high = false
    }

    if (!todo.high && prior == 'high') {
      todo.high = true
      todo.mid = false
      todo.low = false
    }
    this.cloudUpdate()
  }

  deleteTodo = (todo) => {
    let x = this.todoList.indexOf(todo)
    this.todoList.splice(x, 1);
    this.cloudUpdate()
  }
}




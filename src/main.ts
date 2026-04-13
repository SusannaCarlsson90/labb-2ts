import './style.css'
import { setupCounter } from './counter.ts'

interface Todo { //Interface/mall för definiering av kontraktat
task: string; //texten för uppgiften

completed: boolean; //är uppgift klar eller ej

priority: 1 | 2 | 3; //en heltalsvariabel för prioritering där 1 är viktigast
}

class TodoList {
  todos: Todo[] = []; //en array av Todo-projekt

  constructor() { //Constructor som initierar todos-arrayen och laddar todos från LocalStorage vid skapandet av ett nytt ToDoList-objekt
    this.todos = []; 
  }

  //Metod för att lägga till en uppgift
  addTodo(task:string, priority: number): boolean {
    
    if (task !== "" && priority >= 1 && priority <= 3) {
      const newTodo: Todo = {
        task: task,
        priority: priority as 1 | 2 | 3,
        completed: false
      };

      //Skapar nytt objekt:
      this.todos.push(newTodo); //Stoppa in i listan
      return: true;
    } else {
      return false; //Om något var fel exempelvis ej ifylld text
    }
  }


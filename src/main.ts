import './style.css'
import { setupCounter } from './counter.ts'
import { StorageUtility, StorageKeys } from "./utils/storage";


interface Todo { //Interface/mall för definiering av kontraktat
task: string; //texten för uppgiften

completed: boolean; //är uppgift klar eller ej

priority: 1 | 2 | 3; //en heltalsvariabel för prioritering där 1 är viktigast
}

class TodoList {
  todos: Todo[] = []; //en array av Todo-projekt

  constructor() { //Constructor som initierar todos-arrayen och laddar todos från LocalStorage vid skapandet av ett nytt ToDoList-objekt
    this.todos = []; 
    //anropar local storage
    this.loadFromLocalStorage();
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
      this.saveToLocalStorage();
      return true;
    } else {
      return false; //Om något var fel exempelvis ej ifylld text
    }
  }

//Metod för att bocka av saker i listan
markTodoCompleted(todoIndex:number): void {
  this.todos[todoIndex].completed = true;
  this.saveToLocalStorage(); 
}

//Metod för att ångra (gör uppgiften ej avklarad igen)
undoTodo(todoIndex: number): void {
  this.todos[todoIndex].completed = false;
  this.saveToLocalStorage();
}

//Metod för att radera en uppgift
deleteTodo(todoIndex: number): void {
  this.todos.splice(todoIndex, 1);
  this.saveToLocalStorage();
}

//Metod för att kunna rita ut listan
getTodos(): Todo[] {
  return this.todos;
}

//Local storage 
saveToLocalStorage(): void {
 //Spara min lista (this.todos) under namnet TODOS
  StorageUtility.setItem(StorageKeys.TODOS, this.todos);
}

loadFromLocalStorage(): void {
  // Hämtar datan och berättar säger att vi vill ha en Todo-lista <Todo[]>
  const savedData = StorageUtility.getItem<Todo[]>(StorageKeys.TODOS);

  // Om något fanns sparat så fyller vi vår lista
  if (savedData) {
    this.todos = savedData;
  }
}
}
  
const myTodoList = new TodoList(); //Kör min constructor

//Hämtar mina html element med DOM 
const taskInput = document.getElementById("taskInput") as HTMLInputElement;
const priorityInput = document.getElementById("priorityInput") as HTMLSelectElement;
const addBtn = document.getElementById("addBtn") as HTMLButtonElement;
const errorMsg = document.getElementById("errorMsg") as HTMLParagraphElement;
const todoList = document.getElementById("todoList") as HTMLUListElement;

//Händelselyssnare för knapp
addBtn.addEventListener("click", () => {
  const task = taskInput.value; 
const priority = Number(priorityInput.value); //Number så en siffra skickas med
const success = myTodoList.addTodo(task, priority); //Anropar myTodoList, kör addTodo och skicka med priority och task
if (success) {
  errorMsg.style.display = "none"; //Göm felmeddelandet
  taskInput.value = ""; //Töm rutan
  printList(); //Kör funktion för att skriva ut
} else {
  //Om det gick dåligt visa felmeddelandet
  errorMsg.style.display = "block";
}
});

function printList() {
  //Hämtar alla todos från min klass
const todos = myTodoList.getTodos();
//Töm listan i html
todoList.innerHTML = "";
//Looopar varje todos i listan
todos.forEach((todo, index) => {
  //Skapa ett nytt li-element
  const li = document.createElement("li");
  let buttonHtml = "";

  if (todo.completed) {
    li.classList.add("completed");
    //Om klar visa ångra eller radera 
    buttonHtml = `
    <button class="undo-btn">Ångra</button>
    <button class="delete-btn">Radera</button>
  `; } else {
    //Om ej klar visa ångra eller radera
    buttonHtml = `
      <button class="done-btn">Klar</button>
      <button class="delete-btn">Radera</button>
    `;
  }
  //Lägg in texten, prio och knapp för avklarad uppgift
  li.innerHTML = `
  <span>${todo.task} (Prio: ${todo.priority})</span>
  <div class="button-group">
  ${buttonHtml} 
  </div>
`;
//Hämta knapparna och lägg till händelselyssnare
li.querySelector(".done-btn")?.addEventListener("click", () => {
  myTodoList.markTodoCompleted(index);
  printList();
});

li.querySelector(".undo-btn")?.addEventListener("click", () => {
  myTodoList.undoTodo(index);
  printList();
});

li.querySelector(".delete-btn")?.addEventListener("click", () => {
  myTodoList.deleteTodo(index);
  printList();
} );
  //Lägg till i min ul-lista
  todoList.appendChild(li);
});
}

printList();
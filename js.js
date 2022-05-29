// Tasks Class Which represent all the Class
class Task {
  constructor(input, date, time, dis) {
    this.input = input;
    this.date = date;
    this.time = time;
    this.dis = dis;
  }
}

// Design User Handler
class UI {
  static displayTask() {
    const listTask = DB.getTask();
    listTask.forEach((eachTask) => UI.createTask(eachTask));
  }
  static createTask(eachTask) {
    let Taskdiv = document.querySelector("#todoTask");
    const row = document.createElement("div");
    row.className = `custom-style`;
    row.innerHTML = `
<div class="card mt-2" style="width: 330px;">
  <div class="card-header bg-success">Title: ${eachTask.input}</div>
  <div class="card-body bg-info">Discription: ${eachTask.dis}</div>
  <div class="card-footer bg-danger">
     <div class="card-text">Date: ${eachTask.date}</div>
    <div class="card-time">Time:<div>${eachTask.time.toString()}</div></div>
    <a href="#" class="btn btn-primary delete">Delete Task</a>
    </div>
</div>`;
    Taskdiv.appendChild(row);
  }

  // Delete a task function
  static deleteTask(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#task-form");
    container.insertBefore(div, form);
    // Disapper Alerts
    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 1000);
  }
  static ClearInput() {
    document.querySelector("#task").value = " ";
    document.querySelector("#date").value = " ";
    document.querySelector("#time").value = " ";
    document.querySelector("#comment").value = " ";
  }
}

class DB {
  // Getting Item From Store
  static getTask() {
    let tasks;
    const getItem = localStorage.getItem("tasks");
    if (getItem === null) {
      // if getItem is nothing, let tasks be an empty Array
      tasks = [];
    } else {
      // To get a data from the browser you need to use JSON.Parse
      tasks = JSON.parse(getItem);
    }
    // This should return Task
    return tasks;
  }
  // Adding Tasks to LocalStore
  static addTask(eachTask) {
    // adding the required task to the browswe Storage
    const tasks = DB.getTask();
    tasks.push(eachTask);
    // Using the setItem Function on local Storage to Save Item
    // To Store a data in the browser you convert the data into strings using JSON.stringnify

    localStorage.setItem("tasks", JSON.stringify(tasks));
    return tasks;
  }
  // Remove Taks From  LocalStorage
  static removeTask(time) {
    const tasks = DB.getTask();
    // Using the Unique time Paramitives to remove task from localstorge
    tasks.forEach((eachTask, index) => {
      // Test if task.time is equal to the stated time
      if (eachTask.time === time) {
        tasks.splice(index, 1);
      }
    });
    // Set our new Task in the local Storage after removing
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

// Display Tasks
document.addEventListener("DOMContentLoaded", UI.displayTask());

// Event listener  for inputs

document.querySelector("#task-form").addEventListener("submit", (e) => {
  e.preventDefault();
  // Get the value of the input field
  const task = document.querySelector("#task").value;
  const date = document.querySelector("#date").value;
  const time = document.querySelector("#time").value;
  const comment = document.querySelector("#comment").value;

  // Validate Input field
  if (task === "" || date === "" || comment === "" || time === "") {
    UI.showAlert("Please fill in all Field", "danger");
  } else {
    const eachTask = new Task(task, date, time, comment);
    //  Adding task to Ui
    UI.createTask(eachTask);
    // add tasks to store
    DB.addTask(eachTask);

    // Added Task Alert
    UI.showAlert("Task Added Successfully", "success");
    //   Clearing the input after inserting data
    UI.ClearInput();
  }
});
// Event listner For Deleting Task

document.querySelector("#todoTask").addEventListener("click", (e) => {
  UI.deleteTask(e.target);
  // Remove Data from local store

  DB.removeTask(e.target.parentElement.querySelector(".card-time >div").innerText);

  UI.showAlert("Task Deleted Successfully", "success");
});

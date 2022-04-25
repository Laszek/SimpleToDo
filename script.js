let taskIterator = 0;

class Task {
    constructor(title, status){
        this.title = title;
        this.id = ++taskIterator;
        this.isDone = status;
    }

    changeStatus(el){
        if(el.isDone == false)
            el.isDone = true;
        else
            el.isDone = false

        updateLocalStorage();
    }
    
    deleteTask(taskID){
        const newTaskArr = taskArr.filter((el)=>{
            return el.id != taskID;
        });
        taskArr = newTaskArr;
        updateLocalStorage();
    }
    
    createTaskObj(){
        const taskObject = document.createElement('div');
        taskObject.classList = "task " + (this.isDone==true ? "done" : "");
        taskObject.setAttribute("draggable", "true");
        
        const taskMargin = document.createElement('label');
        taskMargin.classList = "task-margin";
        taskMargin.setAttribute("for", `checkbox${this.id}`);
        taskObject.append(taskMargin);
        
        const taskCheckbox = document.createElement('input');
        taskCheckbox.type = "checkbox";
        taskCheckbox.id = `checkbox${this.id}`;
        taskCheckbox.classList = "task-checkbox";
        taskMargin.append(taskCheckbox);
        taskCheckbox.addEventListener("click", () => this.changeStatus(this) );
        
        const taskContent = document.createElement('div');
        taskContent.classList = "task-content";
        taskObject.append(taskContent);
        
        const taskTitle = document.createElement('p');
        taskTitle.classList = "task-title";
        taskTitle.innerHTML = this.title;
        taskContent.append(taskTitle);
        
        const taskDelete = document.createElement('button')
        taskDelete.classList = "task-delete";
        taskContent.append(taskDelete);
        taskDelete.addEventListener("click", () => this.deleteTask(this.id) );
        
        const deleteImage = document.createElement('img');
        deleteImage.src = "https://icons.getbootstrap.com/assets/icons/trash.svg";
        taskDelete.append(deleteImage);

        document.getElementsByClassName("todo-list")[0].append(taskObject);
    }
}

let taskArr = [];

function updateLocalStorage(){
    localStorage.setItem("taskStorage", JSON.stringify(taskArr));
    loadTasks();
}

function loadTasks(){
    taskArr = [];
    const taskStorage = JSON.parse(localStorage.getItem("taskStorage"));
    if(taskStorage!=undefined)
        createTaskObjects(taskStorage);
}

function createTaskObjects(arr){
    for(let task of arr){
        let taskEl = new Task(task.title, task.isDone);
        taskArr.push(taskEl);
    }
    loadTasksOnScreen(taskArr);
}

function loadTasksOnScreen(arr){
    const allTasksElements = document.querySelectorAll(".task");

    for(let el of allTasksElements) {
        el.remove();
    }

    arr.forEach((task)=>{
        task.createTaskObj();
    });

    markDoneTasks();
    addTaskCreator();
}

function markDoneTasks(){
    const doneTasks = document.getElementsByClassName("done");

    for (let item of doneTasks) {
        item.firstChild.firstChild.checked = true;
    }
}

function addTaskCreator(){
    const taskObject = document.createElement('div');
    taskObject.classList = "task creator";

    const taskMargin = document.createElement('label');
    taskMargin.setAttribute("for", `add`);
    taskMargin.classList = "task-margin";
    taskObject.append(taskMargin);

    const taskAddButton = document.createElement('button');
    taskAddButton.id = `add`;
    taskAddButton.classList = "task-add";
    taskAddButton.innerHTML = "+";
    taskMargin.append(taskAddButton);
    taskAddButton.addEventListener('click', addNewTask);

    const taskContent = document.createElement('label');
    taskContent.setAttribute("for", `task-create`);
    taskContent.classList = "task-content";
    taskObject.append(taskContent);

    const taskTitle = document.createElement('input');
    taskTitle.classList = "task-title";
    taskTitle.id = "task-create";
    taskContent.append(taskTitle);

    document.getElementsByClassName("todo-list")[0].append(taskObject);
}

function addNewTask() {
    const titleInput = document.getElementById("task-create");

    if(titleInput.value == ""){
        titleInput.classList.add("empty");
    }
    else {
        titleInput.classList.remove("empty");
        const task = new Task(titleInput.value, false);

        taskArr.push(task);
        updateLocalStorage();
        console.log("Added new Task!");
    }
}

function deleteAllTasks(){
    taskArr = [];
    updateLocalStorage();
    console.log("Hihi")
}
const deleteAllButton = document.querySelectorAll(".delete-all")[0];
console.log(deleteAllButton);
deleteAllButton.addEventListener('click', deleteAllTasks);


loadTasks();

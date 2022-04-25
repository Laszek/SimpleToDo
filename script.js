
class Task {
    constructor(title, status, taskIterator){
        this.title = title;
        this.id = taskIterator;
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
        const taskObject = document.createElement('li');
        taskObject.classList = "task " + (this.isDone==true ? "done" : "");
        taskObject.setAttribute("draggable", "true");
        taskObject.setAttribute("data-index", this.id);
        
        const taskContainer = document.createElement('div');
        taskContainer.classList = "task-container";
        taskObject.append(taskContainer);
        
        const taskMargin = document.createElement('label');
        taskMargin.classList = "task-margin";
        taskMargin.setAttribute("for", `checkbox${this.id}`);
        taskContainer.append(taskMargin);
        
        const taskCheckbox = document.createElement('input');
        taskCheckbox.type = "checkbox";
        taskCheckbox.id = `checkbox${this.id}`;
        taskCheckbox.classList = "task-checkbox";
        taskMargin.append(taskCheckbox);
        taskCheckbox.addEventListener("click", () => this.changeStatus(this) );
        
        const taskContent = document.createElement('div');
        taskContent.classList = "task-content";
        taskContainer.append(taskContent);
        
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
    if(taskStorage!=undefined){
        console.log(taskStorage)
        createTaskObjects(taskStorage);}

    addEventListeners();
    addTaskCreator();
}

function createTaskObjects(arr){
    let taskIterator = 0;
    for(let task of arr){
        let taskEl = new Task(task.title, task.isDone, taskIterator++);
        taskArr.push(taskEl);
    }
    loadTasksOnScreen(taskArr);
}

function loadTasksOnScreen(arr){
    const allTasksElements = document.querySelectorAll(".task, .task-creator");

    for(let el of allTasksElements) {
        el.remove();
    }

    arr.forEach((task)=>{
        task.createTaskObj();
    });

    markDoneTasks();
}

function markDoneTasks(){
    const doneTasks = document.getElementsByClassName("done");

    for (let item of doneTasks) {
        item.querySelector(".task-checkbox").checked = true;
    }
}

function addTaskCreator(){
    const taskObject = document.createElement('div');
    taskObject.classList = "task-creator";

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
        const task = new Task(titleInput.value, false, taskArr.length);

        taskArr.push(task);
        updateLocalStorage();
        console.log("Added new Task!");
    }
}

function deleteAllTasks(){
    taskArr = [];
    updateLocalStorage();
}
// Drag and Drop

const placeholder = document.createElement('div');
placeholder.classList.add('over');

let dragStartIndex;
function dragStart() {
    dragStartIndex = +this.closest('li').getAttribute("data-index");
    console.log(dragStartIndex)
}

function dragOver(e) {
    e.stopPropagation();
    e.preventDefault();
}

function dragDrop() {
    const dragEndIndex = +this.getAttribute('data-index');
    let _tmp = new Task;
    _tmp = taskArr.splice(dragStartIndex,1)[0];
    taskArr.splice(dragEndIndex, 0, _tmp);

    placeholder.classList.toggle("over-show");
    updateLocalStorage();
    addEventListeners();
}

function dragEnter() {
    placeholder.classList.toggle("over-show");
    
    if(dragStartIndex > +this.closest('li').getAttribute("data-index")){
        this.firstChild.before(placeholder);
    }else{
        this.firstChild.after(placeholder);
    }
}

function dragLeave() {
}

function addEventListeners(){
    const draggables = document.querySelectorAll('[draggable="true"]');
    const dragListItems = document.querySelectorAll('.todo-list li')
    
    draggables.forEach(draggable => {
       draggable.addEventListener('dragstart', dragStart) 
    });
    
    dragListItems.forEach(item => {
       item.addEventListener('dragover', dragOver);
       item.addEventListener('drop', dragDrop);
       item.addEventListener('dragenter', dragEnter);
       item.addEventListener('dragleave', dragLeave);
    });
}

const deleteAllButton = document.querySelectorAll(".delete-all")[0];
deleteAllButton.addEventListener('click', deleteAllTasks);

loadTasks();
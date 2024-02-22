let tasks = [];
const tasksContainerElement = document.querySelector('.tasks-container'); // parent of all tasks
const taskInput = document.querySelector('#task-title-input');
const addButtonElement = document.querySelector('.add-btn');


loadFromLocalStorage = () => {
    try {
        const storedTasks = JSON.parse(localStorage.getItem('tasks'));
        if (storedTasks) {
            tasks = storedTasks;
        }
    } catch (ex) {
        console.log(ex, 'Sorry! an error occurred while fetching data from local storage');
    }
}

loadToLocalStorage = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

displayTasks = () => {

    tasksContainerElement.replaceChildren();
    loadFromLocalStorage();

    if (!tasks || tasks.length == 0) {
        tasksContainerElement.textContent = 'NO TASKS';
        return;
    }

    tasks.forEach((task) => {
        const taskElement = document.createElement('div');
        const titleElement = document.createElement('p');
        const checkElement = document.createElement('input');
        const deleteButtonElement = document.createElement('button');
        const editButtonElement = document.createElement('button');


        taskElement.className = 'task';
        titleElement.className = 'title';
        titleElement.textContent = task.title;
        checkElement.type = 'checkbox';
        checkElement.checked = task.checked;
        deleteButtonElement.textContent = 'delete';
        editButtonElement.textContent = 'edit';

        taskElement.appendChild(checkElement);
        taskElement.appendChild(titleElement);
        taskElement.appendChild(deleteButtonElement);
        taskElement.appendChild(editButtonElement);

        // ? checkForChange() => button.onclick
        // ? createTaskElement() => append to task container
        tasksContainerElement.appendChild(taskElement);

        taskOptions(task, deleteButtonElement, editButtonElement)
        // TODO: create and add delete button to task (event listener + append)
        // TODO: create and add edit button to task
        // TODO: show tasks count
    });

    loadToLocalStorage(tasks);
}

addTask = () => {
    try {
        const taskTitle = taskInput.value.trim();
        taskInput.value = '';

        if (!taskTitle) return console.log('Oops no title specified');

        const task = {
            id: tasks.length,
            title: taskTitle,
            checked: false,
        };

        tasks.push(task);
        loadToLocalStorage(tasks);
        displayTasks();

    } catch (ex) {
        console.log(ex);
    }
}

deleteTask = (id) => {
    try {
        tasks.splice(tasks.indexOf(tasks.find((task) => task.id === id)), 1);
        loadToLocalStorage(tasks);
        displayTasks(tasks);
    } catch (error) {
        console.log('Oops couldn\'t delete that!');
    }
}

editTask = (id) => {

    newTitle = prompt('enter the new title');
    
    if (newTitle === null) return;
    else if (!newTitle.trim()){
        if(confirm('you entered an empty title, do you want to delete the task?'))
            deleteTask(id);
        return;
    }

    tasks.find((task) => task.id == id).title = newTitle;
    loadToLocalStorage(tasks);
    displayTasks(tasks);

} 

taskOptions = (task, deleteButtonElement, editButtonElement) => {
    deleteButtonElement.addEventListener('click', (ev) => {
        deleteTask(task.id);
    })
    editButtonElement.addEventListener('click', (ev) => {
        editTask(task.id);
    })
}

checkForChange = () => {
    addButtonElement.addEventListener('click', (ev) => {
        addTask();
    });
}
// when landing
displayTasks();
checkForChange();

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

        taskElement.className = 'task';
        titleElement.className = 'title';
        titleElement.textContent = task.title;
        checkElement.type = 'checkbox';
        checkElement.checked = task.checked;

        taskElement.appendChild(checkElement);
        taskElement.appendChild(titleElement);

        // ? checkForChange() => button.onclick
        // ? createTaskElement() => append to task container
        tasksContainerElement.appendChild(taskElement);

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

checkForChange = () => {
    addButtonElement.addEventListener('click', (ev) => {
        addTask();
    });
}

// when landing
displayTasks();
checkForChange();

let tasks = [];
const tasksContainerElement = document.querySelector('.tasks-container'); // parent of all tasks
const taskInput = document.querySelector('#task-title-input');
const addButtonElement = document.querySelector('.add-btn');
const searchInput = document.querySelector('#search-input');
const searchButtonElement = document.querySelector('.search-btn');

loadFromLocalStorage = () => {
    try {
        const storedTasks = JSON.parse(localStorage.getItem('tasks'));
        if (storedTasks) {
            tasks = storedTasks;
        }
        renderTasks(tasks);
    } catch (ex) {
        console.log(ex, 'Sorry! an error occurred while fetching data from local storage');
    }
}

loadToLocalStorage = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

renderTasks = (tasks) => {
    let checkedTasks = 0;
    tasksContainerElement.replaceChildren();

    if (!tasks || tasks.length == 0) {
        tasksContainerElement.textContent = 'NO TASKS';
        return;
    }

    tasks.forEach((task) => {
        createTaskElement(task);
        task.checked ? checkedTasks++ : '';
          
    });
    const countElement = document.createElement('p');
    countElement.textContent = 'remaining tasks:' + (tasks.length - checkedTasks);
    tasksContainerElement.appendChild(countElement);
}

addTask = () => {
    try {
        const taskTitle = taskInput.value.trim();
        taskInput.value = '';

        if (!taskTitle) return console.log('Oops no title specified');

        const task = {
            id: Date.now().toString(32),
            title: taskTitle,
            checked: false,
        };

        tasks.push(task);
        loadToLocalStorage(tasks);
        renderTasks(tasks);

    } catch (ex) {
        console.log(ex);
    }
}

deleteTask = (id) => {
    try {
        tasks.splice(tasks.indexOf(tasks.find((task) => task.id === id)), 1);
        loadToLocalStorage(tasks);
        renderTasks(tasks);
    } catch (error) {
        console.log('Oops couldn\'t delete that!');
    }
}

editTask = (id) => {

    let newTitle = prompt('enter the new title');

    if (newTitle === null) return;
    else if (!newTitle.trim()) {
        if (confirm('you entered an empty title, do you want to delete the task?'))
            deleteTask(id);
        return;
    }

    tasks.find((task) => task.id == id).title = newTitle;
    loadToLocalStorage(tasks);
    renderTasks(tasks);

}

taskOptions = (task, checkElement, deleteButtonElement, editButtonElement) => {
    checkElement.addEventListener('click', (ev) => {
        task.checked = checkElement.checked;
        loadToLocalStorage(tasks);
        renderTasks(tasks);
    });
    deleteButtonElement.addEventListener('click', (ev) => {
        deleteTask(task.id);
    });
    editButtonElement.addEventListener('click', (ev) => {
        editTask(task.id);
    });
}

searchTasks = () => {
    const searchTitle = searchInput.value.trim().toLowerCase();
    foundTasks = tasks.filter((task) => task.title.toLowerCase().includes(searchTitle));
    renderTasks(foundTasks);
}

checkForChange = () => {
    addButtonElement.addEventListener('click', (ev) => {
        addTask(tasks);
    });
    searchButtonElement.addEventListener('click', (ev) => {
        searchTasks(tasks);
    })
}

createTaskElement = (task) => {
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

    styleTask(taskElement, checkElement, deleteButtonElement, editButtonElement);

    taskElement.appendChild(checkElement);
    taskElement.appendChild(titleElement);
    taskElement.appendChild(deleteButtonElement);
    taskElement.appendChild(editButtonElement);

    tasksContainerElement.appendChild(taskElement);

    taskOptions(task, checkElement, deleteButtonElement, editButtonElement)

}

styleTask = (taskElement, checkElement, deleteButtonElement, editButtonElement) => {
    
}
// when landing
loadFromLocalStorage();
checkForChange();

let tasks = [];
const tasksContainerElement = document.querySelector('.tasks-list-container'); // parent of all tasks
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

    const index = tasks.map(task => task.id).indexOf(id);

    const taskElements = tasksContainerElement.children[index].children[0];

    const editContainer = document.createElement('div');
    const newTitleInput = document.createElement('input');
    const okButton = document.createElement('button');

    okButton.textContent = 'Ok';
    okButton.classList = 'btn';
    editContainer.classList = 'task'

    editContainer.appendChild(newTitleInput);
    editContainer.appendChild(okButton);
    tasksContainerElement.children[index].appendChild(editContainer);

    taskElements.style.display = 'none';
    newTitleInput.value = taskElements.children[1].textContent;


    okButton.addEventListener('click', (ev) => {
        let newTitle = newTitleInput.value.trim();

        if (!newTitle) {
            if (confirm('you entered an empty title, do you want to delete the task?')) {
                deleteTask(id);
                return;
            }

            newTitle = taskElements.children[1].textContent;

        }

        else {
            const checked = newTitle === taskElements.children[1].textContent;
            tasks.find((task) => task.id == id).title = newTitle;
            tasks.find((task) => task.id == id).checked = checked;
        }

        editContainer.style.display = 'none';
        taskElements.style.display = '';
        loadToLocalStorage(tasks);
        renderTasks(tasks);
    })

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
    const foundTasks = tasks.filter((task) => task.title.toLowerCase().includes(searchTitle));
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
    const taskItem = document.createElement('div');
    const titleElement = document.createElement('p');
    const checkElement = document.createElement('input');
    const deleteButtonElement = document.createElement('button');
    const editButtonElement = document.createElement('button');

    styleTask(task, taskElement, taskItem, checkElement, titleElement, deleteButtonElement, editButtonElement);

    taskItem.appendChild(checkElement);
    taskItem.appendChild(titleElement);
    taskItem.appendChild(deleteButtonElement);
    taskItem.appendChild(editButtonElement);

    taskElement.appendChild(taskItem);
    tasksContainerElement.appendChild(taskElement);

    taskOptions(task, checkElement, deleteButtonElement, editButtonElement)

}

styleTask = (task, taskElement, taskItem, checkElement, titleElement, deleteButtonElement, editButtonElement) => {

    titleElement.textContent = task.title;
    checkElement.type = 'checkbox';
    checkElement.checked = task.checked;
    deleteButtonElement.textContent = 'delete';
    editButtonElement.textContent = 'edit';

    taskElement.classList.add('task');
    taskItem.classList.add('task');
    checkElement.classList.add('checkbox');
    titleElement.classList.add('task-title', checkElement.checked ? 'done-task' : 'todo-task');
    deleteButtonElement.classList.add('btn', 'delete-btn');
    editButtonElement.classList.add('btn', 'edit-btn');

}
// when landing
loadFromLocalStorage();
renderTasks(tasks);
checkForChange();


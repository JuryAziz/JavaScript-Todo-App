let tasks = [];
const tasksContainerElement = document.querySelector('.tasks-list-container'); // parent of all tasks
const taskInput = document.querySelector('#task-title-input');
const addButtonElement = document.querySelector('.add-btn');
const searchInput = document.querySelector('#search-input');

loadFromLocalStorage = () => {
    try {
        const storedTasks = JSON.parse(localStorage.getItem('tasks'));
        if (storedTasks) {
            tasks = storedTasks;
        }
    } catch (ex) {
        console.log('Sorry! an error occurred while fetching data from local storage');
    }
}

loadToLocalStorage = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

renderTasks = (tasks) => {
    let checkedTasks = 0;
    tasksContainerElement.replaceChildren();

    const imgElement = document.createElement('img');
    const textElement = document.createElement('p');
    imgElement.classList = 'task-img';
    imgElement.alt = 'cat status image';
    if (tasks.length == 0) {

        imgElement.src = './src/images/no-tasks.png';
        textElement.textContent = 'we have no tasks';

        tasksContainerElement.appendChild(imgElement);
        tasksContainerElement.appendChild(textElement);

        return;
    }

    tasksContainerElement.appendChild(imgElement);

    tasks.sort((task1, task2) => task1.checked - task2.checked);

    tasks.forEach((task) => {

        createTaskElement(task);
        task.checked ? checkedTasks++ : checkedTasks;

    });

    imgElement.src = checkedTasks !== tasks.length ? './src/images/remaining-tasks.png' : './src/images/finished-tasks.png';
    if (checkedTasks === 0) imgElement.src = './src/images/no-finished-tasks.png'

    textElement.textContent = 'we have \'' + (tasks.length - checkedTasks) + '\' tasks remaining';
    tasksContainerElement.appendChild(textElement);

}

addTask = () => {
    const taskTitle = taskInput.value.trim();
    taskInput.value = '';

    if (!taskTitle) {
        popUp('You can\'t add a task with no title');
        return;
    }

    const task = {
        id: Date.now().toString(32),
        title: taskTitle,
        checked: false,
    };

    tasks.push(task);
    loadToLocalStorage(tasks);
    renderTasks(tasks);
}

deleteTask = (id) => {
    tasks.splice(tasks.findIndex((task) => task.id === id), 1);
    loadToLocalStorage(tasks);
    renderTasks(tasks);
}

editTask = (id) => {

    const index = tasks.map(task => task.id).indexOf(id);

    const taskElements = tasksContainerElement.children[index + 1].children[0];

    const editContainer = document.createElement('div');
    const newTitleInput = document.createElement('input');
    const okButton = document.createElement('button');

    okButton.textContent = 'Ok';
    okButton.classList = 'btn';

    editContainer.classList = 'task-contents';
    newTitleInput.classList = 'new-title-input';

    editContainer.appendChild(newTitleInput);
    editContainer.appendChild(okButton);
    tasksContainerElement.children[index + 1].appendChild(editContainer);

    taskElements.style.display = 'none';
    newTitleInput.value = taskElements.children[1].textContent;


    okButton.addEventListener('click', (ev) => {
        let newTitle = newTitleInput.value.trim();

        if (!newTitle) {
            popUp();
        }
        else {
            const checked = newTitle === taskElements.children[1].textContent;
            const taskCheckValue = tasks.find((task) => task.id === id).checked;
            tasks.find((task) => task.id === id).title = newTitle;
            tasks.find((task) => task.id === id).checked = checked ? taskCheckValue : false;
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
    searchInput.addEventListener('input', (ev) => {
        searchTasks(tasks);
    })
}

createTaskElement = (task) => {

    const taskElement = document.createElement('div');
    const taskItem = document.createElement('div');
    const titleElement = document.createElement('label');
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

    taskOptions(task, checkElement, deleteButtonElement, editButtonElement);

}

styleTask = (task, taskElement, taskItem, checkElement, titleElement, deleteButtonElement, editButtonElement) => {

    titleElement.textContent = task.title;
    checkElement.type = 'checkbox';
    checkElement.checked = task.checked;
    deleteButtonElement.textContent = 'DEL';
    editButtonElement.textContent = 'EDIT';

    taskElement.classList.add('task');
    taskItem.classList.add('task-contents');
    checkElement.classList.add('checkbox');
    titleElement.classList.add('task-title', checkElement.checked ? 'done-task' : 'todo-task');
    deleteButtonElement.classList.add('btn', 'delete-btn');
    editButtonElement.classList.add('btn', 'edit-btn');

}

popUp = () => {

    const popUpContainer = document.createElement('div');
    const popUpContent = document.createElement('div');
    const popUpText = document.createElement('p');
    const popUpImg = document.createElement('img');
    const closeButton = document.createElement('button');

    closeButton.textContent = 'CLOSE';
    popUpText.textContent = 'how are you going to do a task that has no title?';
    popUpImg.src = './src/images/no-title.png';

    closeButton.classList.add('btn');
    popUpImg.classList.add('popup-img');
    popUpContent.classList.add('popup-content');
    popUpContainer.classList.add('popup-container');


    popUpContent.appendChild(popUpText);
    popUpContent.appendChild(popUpImg);
    popUpContent.appendChild(closeButton);
    popUpContainer.appendChild(popUpContent);

    document.body.appendChild(popUpContainer);

    closeButton.addEventListener('click', (ev) => {
        document.body.removeChild(popUpContainer);
    })

}
// when landing
loadFromLocalStorage();
renderTasks(tasks);
checkForChange();
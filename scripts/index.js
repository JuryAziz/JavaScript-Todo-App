let tasks = [
    { title: 'Display feature', checked: true },
    { title: 'local storage', checked: false },
    { title: 'add feature', checked: false }
];

const tasksContainerElement = document.querySelector(".tasks-container"); // parent of all tasks
const taskInput = document.querySelector("#task-title-input");

displayTasks = (tasks) => {

    tasks.forEach((task) => {

        const taskElement = document.createElement("div");
        const titleElement = document.createElement("p");
        const checkElement = document.createElement("input");

        taskElement.className = "task";
        titleElement.className = "title";
        titleElement.textContent = task.title;
        checkElement.type = "checkbox";
        checkElement.checked = task.checked;
        
        taskElement.appendChild(checkElement);
        taskElement.appendChild(titleElement);
        tasksContainerElement.appendChild(taskElement);

        // TODO: create and add delete button to task (event listener + append)
        // TODO: create and add edit button to task
        // TODO: show tasks count
    });
};

displayTasks(tasks);

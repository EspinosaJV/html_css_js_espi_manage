document.addEventListener("DOMContentLoaded", () => {
    // ELEMENT VARIABLES
    const createTaskModal = document.getElementById("createTaskModal");
    const cancelCreateTaskModal = document.getElementById("cancelCreateTaskButton");
    const openCreateTaskModal = document.getElementById("openCreateTaskModal");
    const createTaskForm = document.getElementById("createTaskForm");
    const taskListContainer = document.getElementById("taskListContainer");

    // ON INITIALIZATION 
    loadTasksToDashboard();

    // EVENT LISTENERS
    // opens create task modal
    openCreateTaskModal.addEventListener("click", (event) => {
        event.preventDefault();
        console.log("Opening the Create Task Modal now!");
        createTaskModal.classList.remove("hidden");
    });

    // closes create task modal
    cancelCreateTaskModal.addEventListener("click", (event) => {
        event.preventDefault();
        console.log("Closing the Create Task Modal now!");
        createTaskModal.classList.add("hidden");
    });

    // handles create task form submission
    createTaskForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const task = {
            title: document.getElementById("createTaskTitle").value,
            description: document.getElementById("createTaskDescription").value,
            dueDate: document.getElementById("createTaskDate").value,
            assignee: document.getElementById("createTaskAssignees").value,
            createdAt: new Date().toISOString(),
            id: crypto.randomUUID(),
        };

        const existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        existingTasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(existingTasks));

        console.log("The task has been saved:", task);

        createTaskForm.reset();
        createTaskModal.classList.add("hidden");

        loadTasksToDashboard();
    });

    // handles display/read of task data in localStorage
    function loadTasksToDashboard() {
        taskListContainer.innerHTML = "";

        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        tasks.forEach(task => {
            const taskElement = document.createElement("div");
            taskElement.classList.add("task-card");

            taskElement.innerHTML = `
                <div class="taskcard__col">
                    <h4 class="taskcard__h4">${task.title}</h4>
                    <p class="taskcard__p"><span class="bold uppercase">Description:</span> ${task.description}</p>
                </div>
                <div class="taskcard__col">
                    <p class="taskcard__p"><span class="bold uppercase">Due:</span> ${task.dueDate}</p>
                    <p class="taskcard__p"><span class="bold uppercase">Assignee:</span> ${task.assignee}</p>
                </div>
                <hr />
            `;

            taskListContainer.appendChild(taskElement);
        });
    };
});


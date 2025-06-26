document.addEventListener("DOMContentLoaded", () => {
    // ELEMENT VARIABLES
    const createTaskModal = document.getElementById("createTaskModal");
    const cancelCreateTaskModal = document.getElementById("cancelCreateTaskButton");
    const openCreateTaskModal = document.getElementById("openCreateTaskModal");
    const createTaskForm = document.getElementById("createTaskForm");
    const taskListContainer = document.getElementById("taskListContainer");
    const editTaskModal = document.getElementById("editTaskModal");
    const editTaskForm = document.getElementById("editTaskForm");
    const usersDashboardButton = document.getElementById("usersDashboardButton");
    const tasksDashboardButton = document.getElementById("tasksDashboardButton");
    const tasksDashboard = document.getElementById("tasksDashboard");
    const usersDashboard = document.getElementById("usersDashboard");

    let currentEditingTaskId = null;

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
                <div class="taskcard__buttons">
                    <button class="edit-task-button bold" data-id="${task.id}">Edit</button>
                    <button class="delete-task-button bold" data-id="${task.id}">Delete</button>
                </div>
                <hr />
            `;

            taskListContainer.appendChild(taskElement);
        });
    };

    // handles opening of edit task modal when clicking edit button of a specific task
    document.getElementById("taskListContainer").addEventListener("click", (event) => {
        if (event.target.classList.contains("edit-task-button")) {
            const taskId = event.target.dataset.id;
            const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            const task = tasks.find(t => t.id === taskId);

            if (!task) return;

            const editTitleInput = document.getElementById("editTaskTitle");
            const editDescriptionInput = document.getElementById("editTaskDescription");
            const editDueDateInput = document.getElementById("editTaskDueDate");
            const editAssigneeSelect = document.getElementById("editTaskAssignees");

            currentEditingTaskId = taskId;

            editTitleInput.value = task.title;
            editDescriptionInput.value = task.description;
            editTaskDate.value = task.dueDate;
            editAssigneeSelect.value = task.assignee;

            document.getElementById("editTaskModal").classList.remove("hidden");
        }

        else if (event.target.classList.contains("delete-task-button")) {
            const taskIdToDelete = event.target.dataset.id;

            let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

            tasks = tasks.filter(task => task.id !== taskIdToDelete);

            localStorage.setItem("tasks", JSON.stringify(tasks));

            loadTasksToDashboard();
        }
    })

    //handles saving of the inputted data into the edit task form
    editTaskForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const updatedTitle = document.getElementById("editTaskTitle").value;
        const updatedDescription = document.getElementById("editTaskDescription").value;
        const updatedDueDate = document.getElementById("editTaskDate").value;
        const updatedAssignee = document.getElementById("editTaskAssignees").value;

        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        const taskIndex = tasks.findIndex(t => t.id === currentEditingTaskId);

        if (taskIndex !== -1) {
            tasks[taskIndex] = {
            ...tasks[taskIndex],
            title: updatedTitle,
            description: updatedDescription,
            dueDate: updatedDueDate,
            assignee: updatedAssignee
            };

            localStorage.setItem("tasks", JSON.stringify(tasks));
        };

        document.getElementById("editTaskModal").classList.add("hidden");

        currentEditingTaskId = null;

        loadTasksToDashboard();
    });

    // handles changing of view from tasks dashboard to users dashboard
    usersDashboardButton.addEventListener("click", (event) => {
        tasksDashboard.classList.add("hidden");
        usersDashboard.classList.remove("hidden");
    })

    // handles changing of view from users dashboard to tasks dashboard
    tasksDashboardButton.addEventListener("click", (event) => {
        tasksDashboard.classList.remove("hidden");
        usersDashboard.classList.add("hidden");
    })
});


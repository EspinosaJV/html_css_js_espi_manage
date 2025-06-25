document.addEventListener("DOMContentLoaded", () => {
    // Element Variables
    const createTaskModal = document.getElementById("createTaskModal");
    const cancelCreateTaskModal = document.getElementById("cancelCreateTaskButton");
    const openCreateTaskModal = document.getElementById("openCreateTaskModal");
    const createTaskForm = document.getElementById("createTaskForm");

    // Event Listeners

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
    });
});


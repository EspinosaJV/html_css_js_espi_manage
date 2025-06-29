document.addEventListener("DOMContentLoaded", () => {
    // ELEMENT VARIABLES
    const createTaskModal = document.getElementById("createTaskModal");
    const cancelCreateTaskModal = document.getElementById("cancelCreateTaskButton");
    const openCreateTaskModal = document.getElementById("openCreateTaskModal");
    const createTaskForm = document.getElementById("createTaskForm");
    const taskListContainer = document.getElementById("taskListContainer");
    const editTaskModal = document.getElementById("editTaskModal");
    const editTaskForm = document.getElementById("editTaskForm");
    const createUserModal = document.getElementById("createUserModal");
    const createDepartmentModal = document.getElementById("createDepartmentModal");
    const openCreateUserModal = document.getElementById("openCreateUserModal");
    const usersDashboardButton = document.getElementById("usersDashboardButton");
    const tasksDashboardButton = document.getElementById("tasksDashboardButton");
    const cancelCreateDepartmentModal = document.getElementById("cancelCreateDepartmentButton");
    const openCreateDepartmentModal = document.getElementById("openCreateDepartmentModal");
    const editDepartmentForm = document.getElementById("editDepartmentForm");

    // Dashboard Views
    const tasksDashboard = document.getElementById("tasksDashboard");
    const usersDashboard = document.getElementById("usersDashboard");
    const departmentsDashboard = document.getElementById("departmentsDashboard");

    // Navigation Buttons
    const departmentsDashboardButton = document.getElementById("departmentsDashboardButton");

    const cancelCreateUserButton = document.getElementById("cancelCreateUserButton");
    const createUserForm = document.getElementById("createUserForm");
    const editUserForm = document.getElementById("editUserForm");
    const createDepartmentForm = document.getElementById("createDepartmentForm");
    const cancelEditUserButton = document.getElementById("cancelEditUserButton");
    const editUserModal = document.getElementById("editUserModal");

    let currentEditingTaskId = null;
    let currentEditingUserId = null;
    let currentEditingDepartmentId = null;

    // ON INITIALIZATION 
    loadTasksToDashboard();
    loadUsersToDashboard();
    loadDepartmentsToDashboard();

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

    // handles create user form submission
    createUserForm.addEventListener("submit", (event) => {
        event.preventDefault();

        console.log("Saving User Data!");

        const user = {
            name: document.getElementById("createUserName").value,
            email: document.getElementById("createUserEmail").value,
            department: document.getElementById("createUserDepartment").value,
            id: crypto.randomUUID(),
        };

        const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
        existingUsers.push(user);
        localStorage.setItem("users", JSON.stringify(existingUsers));

        console.log("Saved User Data!", user);

        createUserForm.reset();
        createUserModal.classList.add("hidden");

        loadUsersToDashboard();
    })

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

    // handles display/read of user data in localStorage
    function loadUsersToDashboard() {
        userListContainer.innerHTML = "";

        const users = JSON.parse(localStorage.getItem("users")) || [];

        users.forEach(user => {
            const userElement = document.createElement("div");
            userElement.classList.add("user-card");

            userElement.innerHTML = `
                <div class="usercard__col">
                    <h4 class="usercard__h4">${user.name}</h4>
                    <p class="usercard__p"><span class="bold uppercase">Email:</span> ${user.email}</p>
                </div>
                <div class="usercard__col">
                    <p class="usercard__p"><span class="bold uppercase">Department:</span> ${user.department}</p>
                </div>
                <div class="usercard__buttons">
                    <button class="edit-user-button bold" data-id="${user.id}">Edit</button>
                    <button class="delete-user-button bold" data-id="${user.id}">Delete</button>
                </div>
                <hr />
            `;

            userListContainer.appendChild(userElement);
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

    // handles OPEN > USER DASHBOARD
    usersDashboardButton.addEventListener("click", (event) => {
        event.preventDefault();

        tasksDashboard.classList.add("hidden");
        departmentsDashboard.classList.add("hidden");
        usersDashboard.classList.remove("hidden");
    })

    // handles OPEN > TASK DASHBOARD
    tasksDashboardButton.addEventListener("click", (event) => {
        event.preventDefault();

        tasksDashboard.classList.remove("hidden");
        departmentsDashboard.classList.add("hidden");
        usersDashboard.classList.add("hidden");
    })

    // handles OPEN > DEPARTMENT DASHBOARD
    departmentsDashboardButton.addEventListener("click", (event) => {
        event.preventDefault();

        tasksDashboard.classList.add("hidden");
        departmentsDashboard.classList.remove("hidden");
        usersDashboard.classList.add("hidden");
    })

    // handles opening of create user modal
    openCreateUserModal.addEventListener("click", (event) => {
        event.preventDefault();

        createUserModal.classList.remove("hidden");
    })

    // handles cancel button when in create user modal
    cancelCreateUserButton.addEventListener("click", (event) => {
        event.preventDefault();

        console.log("Canceling creation of a user!");

        createUserModal.classList.add("hidden");
    })

    // handles opening of edit user modal & delete user
    document.getElementById("userListContainer").addEventListener("click", (event) => {
        if (event.target.classList.contains("edit-user-button")) {
            console.log("Edit User Button has been clicked.");
            const userId = event.target.dataset.id;
            const users = JSON.parse(localStorage.getItem("users")) || [];
            const user = users.find(u => u.id === userId);

            if (!user) return;

            const editUserName = document.getElementById("editUserName");
            const editUserEmail = document.getElementById("editUserEmail");
            const editUserDepartment = document.getElementById("editUserDepartment");
        
            currentEditingUserId = userId;

            editUserName.value = user.name;
            editUserEmail.value = user.email;
            editUserDepartment.value = user.department;

            document.getElementById("editUserModal").classList.remove("hidden");
        }

        else if (event.target.classList.contains("delete-user-button")) {
            const userIdToDelete = event.target.dataset.id;

            let users = JSON.parse(localStorage.getItem("users")) || [];

            users = users.filter(user => user.id !== userIdToDelete);

            localStorage.setItem("users", JSON.stringify(users));

            loadUsersToDashboard();
        }
    })

    editUserForm.addEventListener("submit", (event) => {
        event.preventDefault();

        console.log("Now saving edited user data!");

        const updatedName = document.getElementById("editUserName").value;
        const updatedEmail = document.getElementById("editUserEmail").value;
        const updatedDepartment = document.getElementById("editUserDepartment").value;

        const users = JSON.parse(localStorage.getItem("users")) || [];

        const userIndex = users.findIndex(u => u.id === currentEditingUserId);

        if (userIndex !== -1) {
            users[userIndex] = {
                ...users[userIndex],
                name: updatedName,
                email: updatedEmail,
                department: updatedDepartment
            };

            localStorage.setItem("users", JSON.stringify(users));
        };

        document.getElementById("editUserModal").classList.add("hidden");

        currentEditingUserId = null;

        loadUsersToDashboard();
    });

    // handles closing of edit user modal
    cancelEditUserButton.addEventListener("click", (event) => {
        event.preventDefault();

        console.log("Canceling Edit of User!");

        editUserModal.classList.add("hidden");
    })

    // closes create department modal
    cancelCreateDepartmentModal.addEventListener("click", (event) => {
        event.preventDefault();
        console.log("Closing the Create Department Modal now!");
        createDepartmentModal.classList.add("hidden");
    })

    // opens create department modal
    openCreateDepartmentModal.addEventListener("click", (event) => {
        event.preventDefault();
        console.log("Opening Create Department Modal");
        createDepartmentModal.classList.remove("hidden");
    })

    // handles display/read of department data in localStorage
    function loadDepartmentsToDashboard() {
        console.log("Will now be rendering the tasks!");
        departmentListContainer.innerHTML = "";

        const departments = JSON.parse(localStorage.getItem("department")) || [];

        departments.forEach(department => {
            const departmentElement = document.createElement("div");
            departmentElement.classList.add("department-card");

            departmentElement.innerHTML = `
                <div class="departmentcard__col">
                    <h4 class="departmentcard__h4">${department.name}</h4>
                    <p class="departmentcard__p"><span class="bold uppercase">Description:</span> ${department.description}</p>
                </div>
                <div class="departmentcard__buttons">
                    <button class="edit-department-button bold" data-id="${department.id}">Edit</button>
                    <button class="delete-department-button bold" data-id="${department.id}">Delete</button>
                </div>  
            `;

            departmentListContainer.appendChild(departmentElement);
        })
    }

    // handles create department form submission
    createDepartmentForm.addEventListener("submit", (event) => {
        event.preventDefault();

        console.log("Saving Department Data!");

        const department = {
            name: document.getElementById("createDepartmentName").value,
            description: document.getElementById("createDepartmentDescription").value,
            assignees: document.getElementById("createDepartmentAssignees").value,
            id: crypto.randomUUID(),
        };

        const existingDepartments = JSON.parse(localStorage.getItem("departments")) || [];
        existingDepartments.push(department);
        localStorage.setItem("department", JSON.stringify(existingDepartments));

        console.log("Saved Department Data!", department);

        createDepartmentForm.reset();
        createDepartmentModal.classList.add("hidden");

        loadDepartmentsToDashboard();
    })

    // handles opening of edit department modal & delete department
    document.getElementById("departmentListContainer").addEventListener("click", (event) => {
        // handles open of edit department modal
        if (event.target.classList.contains("edit-department-button")) {
            console.log("Edit Department Button has been clicked.");

            const departmentId = event.target.dataset.id;
            const departments = JSON.parse(localStorage.getItem("department")) || [];
            const department = departments.find(d => d.id === departmentId);

            if (!department) return;

            const editDepartmentName = document.getElementById("editDepartmentName");
            const editDepartmentDescription = document.getElementById("editDepartmentDescription");
            const editDepartmentAssignees = document.getElementById("editDepartmentAssignees");

            currentEditingDepartmentId = departmentId;

            editDepartmentName.value = department.name;
            editDepartmentDescription.value = department.description;
            editDepartmentAssignees.value = department.assignees;

            document.getElementById("editDepartmentModal").classList.remove("hidden");
        }
    })

    // handles edit department modal form submission
    editDepartmentForm.addEventListener("submit", (event) => {
        event.preventDefault();
        
        console.log("Now saving the edited department data!");

        const updatedDepartmentName = document.getElementById("editDepartmentName").value;
        const updatedDepartmentDescription = document.getElementById("editDepartmentDescription").value;
        const updatedDepartmentAssignees = document.getElementById("editDepartmentAssignees").value;

        const departments = JSON.parse(localStorage.getItem("department")) || [];

        const departmentIndex = departments.findIndex(d => d.id === currentEditingDepartmentId);

        if (departmentIndex !== -1) {
            departments[departmentIndex] = {
                ...departments[departmentIndex],
                name: updatedDepartmentName,
                description: updatedDepartmentDescription,
                assignees: updatedDepartmentAssignees,
            };

            localStorage.setItem("department", JSON.stringify(departments));
        };

        document.getElementById("editDepartmentModal").classList.add("hidden");

        currentEditingDepartmentId = null;

        loadDepartmentsToDashboard();
    });
});


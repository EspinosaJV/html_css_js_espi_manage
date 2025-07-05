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
    const createTaskAssigneesContainer = document.getElementById("createTaskAssignees");
    const createTaskAssigneesDropdown = document.getElementById("createTaskAssigneesDropdown");
    const createTaskAssigneesHiddenInput = document.getElementById("createTaskAssigneesHiddenInput");
    const createTaskAssigneesDisplayText = document.getElementById("createTaskAssigneesDisplayText");
    const createTaskAssigneesArrow = createTaskAssigneesContainer.querySelector(".arrow-icon");
    const editTaskAssigneesContainer = document.getElementById("editTaskAssignees");
    const editTaskAssigneesDropdown = document.getElementById("editTaskAssigneesDropdown");
    const editTaskAssigneesHiddenInput = document.getElementById("editTaskAssigneesHiddenInput");
    const editTaskAssigneesDisplayText = document.getElementById("editTaskAssigneesDisplayText");
    const editTaskTitle = document.getElementById("editTaskTitle");
    const editTaskDescription = document.getElementById("editTaskDescription");
    const editTaskDate = document.getElementById("editTaskDate");
    const cancelEditTaskButton = document.getElementById("cancelEditTaskButton");
    const completeTaskButton = document.getElementById("completeTaskButton");
    const unassignedFilterButton = document.getElementById("unassignedFilterButton");
    const assignedFilterButton = document.getElementById("assignedFilterButton");
    const overdueFilterButton = document.getElementById("overdueFilterButton");
    const noTasksAssignedModal = document.getElementById("noTasksAssignedModal");
    const noTasksOverdueModal = document.getElementById("noTasksOverdueModal");

    // Dashboard Views
    const tasksDashboard = document.getElementById("tasksDashboard");
    const usersDashboard = document.getElementById("usersDashboard");
    const departmentsDashboard = document.getElementById("departmentsDashboard");

    // Navigation Buttons
    const departmentsDashboardButton = document.getElementById("departmentsDashboardButton");

    // Modal Buttons
    const allTasksAssignedModalCloseButton = document.getElementById("allTasksAssignedModalCloseButton");

    const cancelCreateUserButton = document.getElementById("cancelCreateUserButton");
    const createUserForm = document.getElementById("createUserForm");
    const editUserForm = document.getElementById("editUserForm");
    const createDepartmentForm = document.getElementById("createDepartmentForm");
    const cancelEditUserButton = document.getElementById("cancelEditUserButton");
    const editUserModal = document.getElementById("editUserModal");

    // Modals
    const allTasksAssignedModal = document.getElementById("allTasksAssignedModal");

    let currentEditingTaskId = null;
    let currentEditingUserId = null;
    let currentEditingDepartmentId = null;
    let unassignedTasks = [];
    let assignedTasks = [];


    // HELPER FUNCTIONS
    // Handles task assignees dropdown population in create task modal
    function populateCreateTaskAssigneesChecklist() {
        console.log("Will now populate the create task assignees dropdown list");
        createTaskAssigneesDropdown.innerHTML = ''; // clear checkbox contents first

        const usersString = localStorage.getItem("users");
        let users = [];

        // parses users localStorage to then be cached into users
        if (usersString) {
            try {
                users = JSON.parse(usersString);
            } catch (e) {
                console.error("Error parsing users from localStorage:", e);
                createTaskAssigneesDropdown.innerHTML = '<span style="padding: 8px 15px; display: block; color: red;">Error loading users</span>';
                return;
            }
        }

        // after parsing localStorage, if no users are returned
        if (users.length === 0) {
            createTaskAssigneesDropdown.innerHTML = '<span style="padding: 8px 15px; display: block; color: #888;">No users available</span>';
            return;
        }

        // iterates through each user, creating select cards for each one in the dropdown list
        users.forEach(user => {
            if (user && user.name) {
                const label = document.createElement("label");
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.value = user.name;
                checkbox.dataset.name = user.name;

                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(user.name));
                createTaskAssigneesDropdown.appendChild(label);
            }
        });

        updateAssigneesHeader();
    }

    // Handles task assignees dropdown population in edit task modal
    function populateEditTaskAssigneesChecklist(assignedUserIds = []) {
        console.log("Here are the assigned user IDs for the currently editing task:", assignedUserIds);
        console.log("Will now populate the edit task modal with users!");

        editTaskAssigneesDropdown.innerHTML = '';

        // fetch users localStorage
        const usersString = localStorage.getItem("users");
        let users = [];

        // parse users localStorage
        if (usersString) {
            try {
                users = JSON.parse(usersString);
            } catch (e) {
                console.error("Error parsing users from localStorage:", e);
                editTaskAssigneesDropdown.innerHTML = '<span style="padding: 8px 15px; display: block; color: red;">Error loading users</span>';
                return;
            }
        }

        // if no users in localStorage
        if (users.length === 0) {
            editTaskAssigneesDropdown.innerHTML = '<span style="padding: 8px 15px; display: block; color: #888;">No users available</span>';
            return;
        }

        // iterate through each user in users localStorage and render in dropdown list
        users.forEach(user => {
            const label = document.createElement("label");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = user.name;
            checkbox.dataset.name = user.name;

            // pre-selects already assigned users
            if (assignedUserIds.includes(user.name)) {
                checkbox.checked = true;
            }

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(user.name));
            editTaskAssigneesDropdown.appendChild(label);
        });

        updateEditAssigneesHeader();
    }

    // Updates main container's text & hidden input based on selected checkboxes
    function updateAssigneesHeader() {
        const selectedCheckboxes = createTaskAssigneesDropdown.querySelectorAll('input[type="checkbox"]:checked');
        const selectedNames = Array.from(selectedCheckboxes).map(cb => cb.dataset.name);
        const selectedValues = Array.from(selectedCheckboxes).map(cb => cb.value);

        // handles case if no selected users from the dropdown list
        if (selectedNames.length === 0) {
            createTaskAssigneesDisplayText.textContent = "Select Assignees";
            createTaskAssigneesDisplayText.classList.add("placeholder-text");
            createTaskAssigneesHiddenInput.value = '';
        } else {
            createTaskAssigneesDisplayText.textContent = selectedNames.join(', ');
            createTaskAssigneesDisplayText.classList.remove("placeholder-text");
            createTaskAssigneesHiddenInput.value = JSON.stringify(selectedValues);
        }

        // handles arrow icon rotation
        if (createTaskAssigneesArrow) {
            if (createTaskAssigneesContainer.classList.contains("active")) {
                createTaskAssigneesArrow.computedStyleMap.transform = "rotate(180deg)";
            } else {
                createTaskAssigneesArrow.computedStyleMap.transform = "rotate(0deg)";
            }
        }
    }

    // handles updating of edit modal assignees header
    function updateEditAssigneesHeader() {
        const selectedCheckboxes = editTaskAssigneesDropdown.querySelectorAll('input[type="checkbox"]:checked');
        const selectedNames = Array.from(selectedCheckboxes).map(cb => cb.dataset.name);
        const selectedValues = Array.from(selectedCheckboxes).map(cb => cb.value);

        // IF no users fetched, display placedholder ELSE, join all users 
        if (selectedNames.length === 0) {
            editTaskAssigneesDisplayText.textContent = 'Select Assignees';
            editTaskAssigneesDisplayText.classList.add('placeholder-text');
            editTaskAssigneesHiddenInput.value = '';
        } else {
            editTaskAssigneesDisplayText.textContent = selectedNames.join(', ');
            editTaskAssigneesDisplayText.classList.remove('placeholder-text');
            editTaskAssigneesHiddenInput.value = JSON.stringify(selectedValues);
        }
    }


    // ON INITIALIZATION 
    loadTasksToDashboard();
    loadUsersToDashboard();
    loadDepartmentsToDashboard();

    // EVENT LISTENERS

    // handles close button in all tasks assigned modal
    allTasksAssignedModalCloseButton.addEventListener("click", (event) => {
        console.log("Close Modal button has been clicked!");
        allTasksAssignedModal.classList.add("hidden");
    })

    // close edit task modal
    if (cancelEditTaskButton) {
        cancelEditTaskButton.addEventListener("click", (event) => {
            event.preventDefault();
            console.log("Closing the Edit Task Modal now!");
            editTaskModal.classList.add("hidden");
            editTaskForm.reset();
            if (editTaskAssigneesHiddenInput) {
                editTaskAssigneesHiddenInput.value = '';
            }
            updateEditAssigneesHeader();
            currentEditingTaskId = null;
        })
    }
    // handles toggling of the multi-user select for edit modal
    if (editTaskAssigneesContainer) {
        editTaskAssigneesContainer.addEventListener("click", (event) => {
            // makes it so that clicks inside the dropdown do not trigger this
            if (event.target.closest("#editTaskAssigneesDropdown") || event.target === editTaskAssigneesHiddenInput) {
                return;
            }
            editTaskAssigneesContainer.classList.toggle("active");
        })
    }

    // update header text & hidden input when a checkbox is changed in edit modal
    if (editTaskAssigneesDropdown) {
        editTaskAssigneesDropdown.addEventListener("change", (event) => {
            if (event.target.type === "checkbox") {
                updateEditAssigneesHeader();
            }
        })
    }

    // handles the open & close of task assignees container
    if (createTaskAssigneesContainer) {
        createTaskAssigneesContainer.addEventListener("click", (event) => {
            console.log("Task Assignees Dropdown is clicked!");
            // prevents closing of the dropdown when clicking inside, strictly only the container or display text is clicked to open
            if (event.target.closest("#createTaskAssigneesDropdown") || event.target === createTaskAssigneesHiddenInput) {
                return;
            }

            // opens & closes the container itself
            createTaskAssigneesContainer.classList.toggle("active");
            updateAssigneesHeader(); // called to update arrow-icon
        })
    }

    // updates header text & hidden input when a checkbox is changed
    if (createTaskAssigneesDropdown) {
        createTaskAssigneesDropdown.addEventListener("change", (event) => {
            if (event.target.type === "checkbox") {
                updateAssigneesHeader();
            }
        });
    }

    // closes both the create task & edit task assignees dropdown
    document.addEventListener('click', (event) => {
        // Handle create task assignees dropdown
        if (createTaskAssigneesContainer && !createTaskAssigneesContainer.contains(event.target)) {
            createTaskAssigneesContainer.classList.remove('active');
        }
        // Handle edit task assignees dropdown
        if (editTaskAssigneesContainer && !editTaskAssigneesContainer.contains(event.target)) {
            editTaskAssigneesContainer.classList.remove('active');
        }
    });

    // opens create task modal
    openCreateTaskModal.addEventListener("click", (event) => {
        event.preventDefault();
        console.log("Opening the Create Task Modal now!");

        populateCreateTaskAssigneesChecklist(); // populates the task assignees checklist

        // ensures that the task assignees dropdown is initially closed when opening the create task modal
        if (createTaskAssigneesContainer) {
            createTaskAssigneesContainer.classList.remove("active");
            updateAssigneesHeader();
        }
        
        createTaskModal.classList.remove("hidden");
    });

    // closes create task modal
    cancelCreateTaskModal.addEventListener("click", (event) => {
        event.preventDefault();
        console.log("Closing the Create Task Modal now!");
        createTaskModal.classList.add("hidden");

        // resets form input values when closing create task modal
        createTaskForm.reset();
        if (createTaskAssigneesHiddenInput) {
            createTaskAssigneesHiddenInput.value = '';
        }
        updateAssigneesHeader();
    });

    // closes edit task modal
    cancelEditTaskButton.addEventListener("click", (event) => {
        event.preventDefault();
        console.log("Closing the Edit Task Modal now!");
        editTaskModal.classList.add("hidden");

        // reset form input values when closing edit task modal
        editTaskForm.reset();
        if (editTaskAssigneesHiddenInput) {
            editTaskAssigneesHiddenInput.value = '';
        }
        updateAssigneesHeader();
    })

    // handles create task form submission
    createTaskForm.addEventListener("submit", (event) => {
        event.preventDefault();

        // acquires selected assignes from the hidden input value fields
        let selectedAssigneeIds = [];
        try {
            const hiddenValue = document.getElementById("createTaskAssigneesHiddenInput").value;
            if (hiddenValue) {
                selectedAssigneeIds = JSON.parse(hiddenValue);
            }
            if (!Array.isArray(selectedAssigneeIds)) {
                selectedAssigneeIds = [];
            }
        } catch (e) {
            console.warn("No assignees selected or error parsing hidden input:", e);
            selectedAssigneeIds = [];
        }

        const task = {
            title: document.getElementById("createTaskTitle").value,
            description: document.getElementById("createTaskDescription").value,
            dueDate: document.getElementById("createTaskDate").value,
            assignee: selectedAssigneeIds,
            createdAt: new Date().toISOString(),
            id: crypto.randomUUID(),
            isCompleted: false
        };

        const existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        existingTasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(existingTasks));

        console.log("The task has been saved:", task);

        // input form reset
        createTaskForm.reset();
        createTaskModal.classList.add("hidden");
        if (createTaskAssigneesHiddenInput) {
            createTaskAssigneesHiddenInput.value = '';
        }
        
        updateAssigneesHeader();
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
        console.log("Now refreshing the tasks dashboard!");

        taskListContainer.innerHTML = "";
        const allTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const users = JSON.parse(localStorage.getItem("users")) || [];

        // determine which set of tasks to display
        let tasksToRender
        
        // taskToRender assignment of unassigned tasks, assigned tasks, overdue tasks, all tasks
        if (unassignedFilterButton.classList.contains("active")) {
            // Re-filter list from fresh data
            tasksToRender = allTasks.filter(task => !task.assignee || task.assignee.length === 0);
            console.log("Re-filtering & rendering all unassigned tasks!");
        } else if (assignedFilterButton.classList.contains("active")) {
            tasksToRender = allTasks.filter(task => task.assignee && task.assignee.length > 0);
            console.log("Re-filtering and rendering all assigned tasks!");
        } else if (overdueFilterButton.classList.contains("active")) {
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            tasksToRender = allTasks.filter(task => {
                if (!task.dueDate) {
                    return false;
                }
                const dueDate = new Date(task.dueDate);
                return dueDate < currentDate && !task.isCompleted;
            });
            console.log("Re-filtering and rendering all overdue tasks!");
        } else {
            tasksToRender = allTasks;
            console.log("Rendering all tasks!");
        }

        // Checks if filters are empty arrays to be handle respective modal displays
        if (unassignedFilterButton.classList.contains("active") && tasksToRender.length === 0) {
            allTasksAssignedModal.classList.remove("hidden");
        }
        if (assignedFilterButton.classList.contains("active") && tasksToRender.length === 0) {
            noTasksAssignedModal.classList.remove("hidden");
        }
        if (overdueFilterButton.classList.contains("active") && tasksToRender.length === 0) {
            noTasksOverdueModal.classList.remove("hidden");
        }

        // renders tasks
        tasksToRender.forEach(task => {
            console.log("Here is the currently rendered task:", task);
            const taskElement = document.createElement("div");
            taskElement.classList.add("task-card");

            if (task.isCompleted) {
                taskElement.classList.add("task-completed");
            }

            let assigneeNames = "No Assignee";
            if (task.assignee && Array.isArray(task.assignee) && task.assignee.length > 0) {
                const foundAssignees = users.filter(user => {
                    const trimmedUserName = user.name ? user.name.trim() : '';
                    return task.assignee.some(taskAssignee => taskAssignee.trim() === trimmedUserName);
                })
                console.log("Here are the found assignees:", foundAssignees);
                assigneeNames = foundAssignees.map(user => user.name).join(', ') || "Unknown Assignees";
                console.log("Here are the assigneeNames:", assigneeNames);
            }

            taskElement.innerHTML = `
                <div class="taskcard__col">
                    <h4 class="taskcard__h4">${task.title}</h4>
                    <p class="taskcard__p"><span class="bold uppercase">Description:</span>${task.description}</p>
                </div>
                <div class="taskcard__col">
                    <p class="taskcard__p"><span class="bold uppercase">Due:</span>${task.dueDate}</p>
                    <p class="taskcard__p"><span class="bold uppercase">Assignees:</span>${assigneeNames}</p>
                </div>
                <div class="taskcard__buttons">
                    <button class="complete-task-button bold" data-id="${task.id}">Done</button>
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

    // handles task filters
    document.getElementById("tasks__filter").addEventListener("click", (event) => {
        const target = event.target;

        // Deactive other filters if one filter is clicked.
        if (target !== unassignedFilterButton) unassignedFilterButton.classList.remove("active");
        if (target !== assignedFilterButton) assignedFilterButton.classList.remove("active");

        // Unassigned Filter Logic
        if (target.classList.contains("unassigned__filter__button")) {
            console.log("Unassigned Filter Button has been toggled.");
            unassignedFilterButton.classList.toggle("active");
        }

        // Assigned Filter Logic
        else if (target.classList.contains("assigned__filter__button")) {
            console.log("Assigned Filter button has been toggled.");
            assignedFilterButton.classList.toggle("active");
        }

        // Overdue Filter Logic
        else if (target.classList.contains("overdue__filter__button")) {
            console.log("Overdue Filter button has been toggled.");
            overdueFilterButton.classList.toggle("active");
        }

        loadTasksToDashboard();
    });

    // handles opening of edit task modal when clicking edit button of a specific task
    document.getElementById("taskListContainer").addEventListener("click", (event) => {
        if (event.target.classList.contains("edit-task-button")) {
            const taskId = event.target.dataset.id;
            const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            const task = tasks.find(t => t.id === taskId);

            if (!task) {
                console.error("Task not found for editing:", taskId);
                return;
            } 

            currentEditingTaskId = taskId;

            editTaskTitle.value = task.title;
            editTaskDescription.value = task.description;
            editTaskDate.value = task.dueDate;

            populateEditTaskAssigneesChecklist(task.assignee || []);

            if (editTaskAssigneesContainer) {
                editTaskAssigneesContainer.classList.remove("active");
            }

            editTaskModal.classList.remove("hidden");
        } else if (event.target.classList.contains("delete-task-button")) {
            const taskIdToDelete = event.target.dataset.id;

            let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            tasks = tasks.filter(task => task.id !== taskIdToDelete);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            loadTasksToDashboard();
            console.log("Task has been deleted!");
        } else if (event.target.classList.contains("complete-task-button")) {
            console.log("Now marking the task as complete/incomplete!");

            const taskIdToToggle = event.target.dataset.id;
            const taskCard = event.target.closest(".task-card");

            let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            const taskIndex = tasks.findIndex(task => task.id === taskIdToToggle);

            if (taskIndex !== -1) {
                tasks[taskIndex].isCompleted = !tasks[taskIndex].isCompleted;
                localStorage.setItem("tasks", JSON.stringify(tasks));
                loadTasksToDashboard();
                console.log("Task complete status has been updated!");
            }
        } 
    });

    //handles saving of the inputted data into the edit task form
    editTaskForm.addEventListener("submit", (event) => {
        event.preventDefault();

        console.log("Submitting edit task form values!");

        if (!currentEditingTaskId) {
            console.error("No task ID found for editing. Cannot save.");
            return;
        }

        let selectedAssigneeIds = [];
        try {
            const hiddenValue = editTaskAssigneesHiddenInput.value;
            if (hiddenValue) {
                selectedAssigneeIds = JSON.parse(hiddenValue);
            }
            if (!Array.isArray(selectedAssigneeIds)) {
                selectedAssigneeIds = [];
            }
        } catch (e) {
            console.warn("No assignees selected or error parsing hidden input for edit task:", e);
            selectedAssigneeIds = [];
        }

        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const taskIndex = tasks.findIndex(task => task.id === currentEditingTaskId);

        if (taskIndex !== -1) {
            tasks[taskIndex].title = editTaskTitle.value;
            tasks[taskIndex].description = editTaskDescription.value;
            tasks[taskIndex].dueDate = editTaskDate.value;
            tasks[taskIndex].assignee = selectedAssigneeIds;

            localStorage.setItem("tasks", JSON.stringify(tasks));
            console.log("Task is updated:", tasks[taskIndex]);

            editTaskModal.classList.add("hidden");
            editTaskForm.reset();
            if (editTaskAssigneesHiddenInput) {
                editTaskAssigneesHiddenInput.value = '';
            }
            updateEditAssigneesHeader();
            currentEditingTaskId = null;
            loadTasksToDashboard();
        } else {
            console.error("Task not found for updating:", currentEditingTaskId);
        }
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
        console.log("Now moving to task dashboard");
        loadTasksToDashboard();

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

        // handles delete department if delete button in card is clicked
        else if (event.target.classList.contains("delete-department-button")) {
            console.log("Delete Department Button is clicked!");

            const departmentIdToDelete = event.target.dataset.id;

            let departments = JSON.parse(localStorage.getItem("department")) || [];

            departments = departments.filter(department => department.id !== departmentIdToDelete);

            localStorage.setItem("department", JSON.stringify(departments));

            loadDepartmentsToDashboard();
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


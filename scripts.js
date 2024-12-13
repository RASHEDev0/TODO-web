document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const editTaskModal = document.getElementById('editTaskModal');
    const editTaskForm = document.getElementById('editTaskForm');
    const editTaskTitle = document.getElementById('editTaskTitle');
    const editTaskDescription = document.getElementById('editTaskDescription');
    const editTaskDueDate = document.getElementById('editTaskDueDate');
    const editTaskPriority = document.getElementById('editTaskPriority');
    const closeModal = document.getElementsByClassName('close')[0];

    const filterStatus = document.getElementById('filterStatus');
    const filterPriority = document.getElementById('filterPriority');
    const sortDueDate = document.getElementById('sortDueDate');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentEditIndex = null;

    const renderTasks = () => {
        console.log('Rendering tasks...');
        const filteredTasks = tasks.filter(task => {
            let statusMatch = filterStatus.value === 'all' ||
                (filterStatus.value === 'completed' && task.completed) ||
                (filterStatus.value === 'pending' && !task.completed);
            let priorityMatch = filterPriority.value === 'all' ||
                task.priority === filterPriority.value;

            return statusMatch && priorityMatch;
        });

        const sortedTasks = filteredTasks.sort((a, b) => {
            if (sortDueDate.value === 'asc') return new Date(a.dueDate) - new Date(b.dueDate);
            if (sortDueDate.value === 'desc') return new Date(b.dueDate) - new Date(a.dueDate);
        });

        taskList.innerHTML = '';
        sortedTasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.className = task.completed ? 'completed' : '';

            const taskDetails = document.createElement('div');
            taskDetails.className = 'task-details';

            const taskPriority = document.createElement('span');
            taskPriority.className = `priority ${task.priority}`;
            taskPriority.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
            taskDetails.prepend(taskPriority);

            const taskTitle = document.createElement('h3');
            taskTitle.textContent = task.title;
            taskDetails.appendChild(taskTitle);

            const taskDescription = document.createElement('p');
            taskDescription.textContent = task.description;
            taskDetails.appendChild(taskDescription);

            const taskDueDate = document.createElement('p');
            taskDueDate.textContent = `Due: ${task.dueDate}`;
            taskDetails.appendChild(taskDueDate);

            taskItem.appendChild(taskDetails);

            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'task-actions';
            taskItem.appendChild(buttonContainer);

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => {
                currentEditIndex = index;
                editTaskTitle.value = task.title;
                editTaskDescription.value = task.description;
                editTaskDueDate.value = task.dueDate;
                editTaskPriority.value = task.priority;
                editTaskModal.style.display = 'block';
            });
            buttonContainer.appendChild(editButton);

            const completeButton = document.createElement('button');
            completeButton.textContent = 'Mark as Completed';
            completeButton.className = 'complete';
            completeButton.addEventListener('click', () => {
                tasks[index].completed = !tasks[index].completed;
                saveTasks();
                renderTasks();
            });
            buttonContainer.appendChild(completeButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete';
            deleteButton.addEventListener('click', () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });
            buttonContainer.appendChild(deleteButton);

            taskList.appendChild(taskItem);
        });
    };

    const saveTasks = () => {
        console.log('Saving tasks to local storage...');
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();
        console.log('Add task form submitted...');
        const taskTitle = document.getElementById('taskTitle').value;
        const taskDescription = document.getElementById('taskDescription').value;
        const taskDueDate = document.getElementById('taskDueDate').value;
        const taskPriority = document.getElementById('taskPriority').value;

        const newTask = {
            title: taskTitle,
            description: taskDescription,
            dueDate: taskDueDate,
            priority: taskPriority,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();

        taskForm.reset();
    });

    editTaskForm.addEventListener('submit', (event) => {
        event.preventDefault();
        console.log('Edit task form submitted...');

        tasks[currentEditIndex] = {
            title: editTaskTitle.value,
            description: editTaskDescription.value,
            dueDate: editTaskDueDate.value,
            priority: editTaskPriority.value,
            completed: tasks[currentEditIndex].completed
        };

        saveTasks();
        renderTasks();
        editTaskModal.style.display = 'none';
    });

    closeModal.addEventListener('click', () => {
        editTaskModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == editTaskModal) {
            editTaskModal.style.display = 'none';
        }
    });

    filterStatus.addEventListener('change', renderTasks);
    filterPriority.addEventListener('change', renderTasks);
    sortDueDate.addEventListener('change', renderTasks);

    renderTasks();
});

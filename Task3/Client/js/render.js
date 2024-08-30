var tasksCache = {};

function cacheTasks(tasks) {
    tasks.forEach(function(task) {
        tasksCache[task.id] = task;
    });
}

function renderTasks(tasks) {
    var taskList = $("#task-list");
    taskList.empty();

    const groupedTasks = groupTasksByDate(tasks);

    const sortedDates = Object.keys(groupedTasks).sort((a, b) => {
        if (isDescending) {
            return new Date(b) - new Date(a);
        } else {
            return new Date(a) - new Date(b);
        }
    });

    sortedDates.forEach(function(date) {
        var tasksForDate = groupedTasks[date];
        var dateElement = `<div class="task-group"><h3>${formatDate(new Date(date))}</h3></div>`;
        taskList.append(dateElement);

        tasksForDate.forEach(function(task) {
            var taskElement = `
                <div class="task" data-id="${task.id}">
                    <div>
                        <h3>${task.name}</h3>
                        <p>${task.shortDesc}</p>
                    </div>
                    <div class="status">
                        <input type="checkbox" ${task.status ? "checked" : ""}>
                    </div>
                    <div class="time">${formatTime(new Date(task.date))}</div>
                </div>`;
            taskList.append(taskElement);
        });
    });
}

function groupTasksByDate(tasks) {
    return tasks.reduce((groups, task) => {
        const date = task.date.split('T')[0];
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(task);
        return groups;
    }, {});
}

function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(date) {
    return date.toLocaleDateString();
}

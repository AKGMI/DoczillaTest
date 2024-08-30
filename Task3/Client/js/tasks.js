var showIncompleteTasks = false;
var isDescending = true;

function loadAllTasks() {
    $.ajax({
        url: BASE_URL + "/api/todos",
        type: 'GET',
        success: function(data) {
            if (showIncompleteTasks) {
                data = data.filter(function(task) {
                    return task.status === false;
                });
            }
            cacheTasks(data);
            renderTasks(data);
        },
        error: function() {
            alert('Failed to load tasks');
        }
    });
}

function loadTasksByDate(from, to) {
    $.ajax({
        url: BASE_URL + "/api/todos/date",
        type: 'GET',
        data: {
            from: from,
            to: to,
            status: showIncompleteTasks ? 'false' : ''
        },
        success: function(data) {
            cacheTasks(data);
            renderTasks(data);
        },
        error: function() {
            alert('Failed to load tasks for the selected date(s)');
        }
    });
}

function filterIncompleteTasks(showIncomplete) {
    showIncompleteTasks = showIncomplete;

    if (startDate && endDate) {
        loadTasksByDate(startDate.getTime(), endDate.getTime());
    } else {
        loadAllTasks();
    }
}

function toggleSortOrder() {
    isDescending = !isDescending;
    updateSortIcon();
    if (startDate && endDate) {
        loadTasksByDate(startDate.getTime(), endDate.getTime());
    } else {
        loadAllTasks();
    }
}

function updateSortIcon() {
    var sortIcon = $("#sort-icon");
    if (isDescending) {
        sortIcon.removeClass("asc").addClass("desc");
    } else {
        sortIcon.removeClass("desc").addClass("asc");
    }
}

$("#sort-btn").click(function() {
    toggleSortOrder();
});

$(document).ready(function() {
    updateSortIcon();
});

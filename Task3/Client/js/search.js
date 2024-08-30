$(document).ready(function() {
    $("#search-input").on("input", function() {
        var query = $(this).val().toLowerCase().trim();
        if (query.length > 0) {
            searchTasks(query);
        } else {
            $("#search-results").hide();
        }
    });

    $("#search-input").on("keypress", function(e) {
        if (e.which == 13) {
            var query = $(this).val().toLowerCase().trim();
            if (query.length > 0) {
                filterTasks(query);
                $("#search-results").hide();
            }
        }
    });

    $("#search-results").on("click", ".result-item", function() {
        var taskId = $(this).data("taskId");
        openTaskModal(taskId);
    });
});

function searchTasks(query) {
    var results = Object.values(tasksCache).filter(function(task) {
        return task.name.toLowerCase().includes(query);
    });

    renderSearchResults(results);
}

function renderSearchResults(tasks) {
    var searchResults = $("#search-results");
    searchResults.empty();

    if (tasks.length > 0) {
        tasks.forEach(function(task) {
            var resultItem = `
                <div class="result-item" data-task-id="${task.id}" style="${task.status ? 'text-decoration: line-through;' : ''}">
                    ${task.name}<br>
                </div>`;
            searchResults.append(resultItem);
        });
        searchResults.show();
    } else {
        searchResults.hide();
    }
}

function filterTasks(query) {
    var filteredTasks = Object.values(tasksCache).filter(function(task) {
        return task.name.toLowerCase().includes(query);
    });
    renderTasks(filteredTasks);
}

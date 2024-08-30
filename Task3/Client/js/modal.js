$(document).ready(function() {
    $("#task-modal").dialog({
        autoOpen: false,
        modal: true,
        closeOnEscape: true,
        width: 400,
        buttons: [
            {
                text: "Готово",
                click: function() {
                    $( this ).dialog( "close" );
                }
            }
        ]
    }).dialog("widget").find(".ui-dialog-titlebar").hide();

    $("#task-list").on("click", ".task", function(event) {
        if ($(event.target).is("input[type='checkbox']")) {
            var taskId = $(this).data("id");
            updateTaskStatusInCache(taskId, $(event.target).is(":checked"));
            return;
        }

        var taskId = $(this).data("id");
        openTaskModal(taskId);
    });

    $("#task-status").change(function() {
        var taskId = $("#task-modal").data("taskId");
        var task = tasksCache[taskId];

        if (task) {
            task.status = $(this).is(":checked");
            updateTaskStatusInList(taskId, task.status);
        }
    });

    $("#close-modal").click(function() {
        $("#task-modal").dialog("close");
    });
});

function openTaskModal(taskId) {
    var task = tasksCache[taskId];

    if (task) {
        $("#task-title").text(task.name);
        $("#task-date").text(formatTaskDate(task.date));
        $("#task-description").text(task.fullDesc);
        $("#task-status").prop("checked", task.status);

        $("#task-modal").data("taskId", taskId);

        $("#task-modal").dialog("open");
    } else {
        alert('Task not found in cache');
    }
}

function updateTaskStatusInList(taskId, status) {
    var taskElement = $("#task-list .task[data-id='" + taskId + "']");
    if (taskElement.length > 0) {
        taskElement.find("input[type='checkbox']").prop("checked", status);
    }
}

function updateTaskStatusInCache(taskId, status) {
    var task = tasksCache[taskId];
    if (task) {
        task.status = status;
    }
}

function formatTaskDate(dateString) {
    var date = new Date(dateString);
    return formatDate(date) + " " + date.toLocaleTimeString();
}

function formatDate(date) {
    var day = date.getDate().toString().padStart(2, '0');
    var month = (date.getMonth() + 1).toString().padStart(2, '0');
    var year = date.getFullYear();
    return year + "-" + month + "-" + day;
}

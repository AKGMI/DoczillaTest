var startDate = null;
var endDate = null;

function initializeSidebar() {
    $("#datepicker").datepicker({
        numberOfMonths: 1,
        dateFormat: 'yy-mm-dd',
        firstDay: 1,
        beforeShowDay: function(date) {
            if (startDate && endDate) {
                var highlight = date >= startDate && date <= endDate;
                return [true, highlight ? "range" : ""];
            }
            return [true, ""];
        },
        onSelect: function() {
            var selectedDate = $(this).datepicker("getDate");

            if (!startDate || (startDate && selectedDate.getTime() === startDate.getTime())) {
                startDate = selectedDate;
                endDate = new Date(selectedDate.getTime() + (1000 * 60 * 60 * 24) - 1);
                $(this).datepicker("refresh");
                toggleResetButton(true);
                loadTasksByDate(startDate.getTime(), endDate.getTime());
            } else if (!endDate && selectedDate > startDate) {
                endDate = new Date(selectedDate.getTime() + (1000 * 60 * 60 * 24) - 1);
                $(this).datepicker("refresh");
                toggleResetButton(true);
                loadTasksByDate(startDate.getTime(), endDate.getTime());
            } else {
                startDate = selectedDate;
                endDate = null;
                $(this).datepicker("refresh");
                toggleResetButton(false);
            }
        }
    });
}

function bindSidebarEvents() {
    $("#today-btn").click(function() {
        var today = new Date();
        startDate = today;
        endDate = new Date(today.getTime() + (1000 * 60 * 60 * 24) - 1);
        $("#datepicker").datepicker("setDate", startDate);
        $("#datepicker").datepicker("refresh");
        toggleResetButton(true);
        loadTasksByDate(startDate.getTime(), endDate.getTime());
    });

    $("#week-btn").click(function() {
        var today = new Date();
        startDate = today;
        endDate = new Date(today.getTime() + (1000 * 60 * 60 * 24 * 7) - 1);
        $("#datepicker").datepicker("setDate", startDate);
        $("#datepicker").datepicker("refresh");
        toggleResetButton(true);
        loadTasksByDate(startDate.getTime(), endDate.getTime());
    });

    $("#reset-btn").click(function() {
        resetDateRange();
    });

    $("#filter-incomplete").change(function() {
        filterIncompleteTasks($(this).is(":checked"));
    });
}

function resetDateRange() {
    startDate = null;
    endDate = null;
    $("#datepicker").datepicker("setDate", null);
    $("#datepicker").datepicker("refresh");
    toggleResetButton(false);
    loadAllTasks();
}

function toggleResetButton(show) {
    if (show) {
        $("#reset-btn").show();
    } else {
        $("#reset-btn").hide();
    }
}

$(document).ready(function() {
    initializeSidebar();
    bindSidebarEvents();
    toggleResetButton(false);
});

const BASE_URL = 'http://localhost:3000';

$(function() {
    initializeSidebar();
    bindSidebarEvents();

    loadAllTasks();
});

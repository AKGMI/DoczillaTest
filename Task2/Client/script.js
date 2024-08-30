$(document).ready(function () {
    loadStudentList();

    $('#addStudentForm').on('submit', function (e) {
        e.preventDefault();

        const studentData = {
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            middleName: $('#middleName').val(),
            dateOfBirth: $('#dateOfBirth').val(),
            studentGroup: $('#studentGroup').val(),
            uniqueNumber: $('#uniqueNumber').val()
        };

        $.ajax({
            url: 'http://localhost:8080/students?action=add',
            type: 'POST',
            data: studentData,
            success: function () {
                alert('Student added successfully');
                loadStudentList();
            },
            error: function () {
                alert('Failed to add student');
            }
        });
    });

    $('#deleteStudentForm').on('submit', function (e) {
        e.preventDefault();

        const uniqueNumber = $('#deleteUniqueNumber').val();

        $.ajax({
            url: 'http://localhost:8080/students?action=delete',
            type: 'POST',
            data: { uniqueNumber: uniqueNumber },
            success: function () {
                alert('Student deleted successfully');
                loadStudentList();
            },
            error: function () {
                alert('Failed to delete student');
            }
        });
    });

    function loadStudentList() {
        $.ajax({
            url: 'http://localhost:8080/students',
            type: 'GET',
            success: function (data) {
                const studentList = $('#studentList tbody');
                studentList.empty();
                data.forEach(student => {
                    const row = `<tr>
                        <td>${student.id}</td>
                        <td>${student.firstName}</td>
                        <td>${student.lastName}</td>
                        <td>${student.middleName}</td>
                        <td>${student.dateOfBirth}</td>
                        <td>${student.studentGroup}</td>
                        <td>${student.uniqueNumber}</td>
                    </tr>`;
                    studentList.append(row);
                });
            },
            error: function () {
                alert('Failed to load student list');
            }
        });
    }
});

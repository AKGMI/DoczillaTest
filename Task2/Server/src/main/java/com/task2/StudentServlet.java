package com.task2;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Date;
import java.sql.SQLException;
import java.util.List;

@WebServlet("/students")
public class StudentServlet extends HttpServlet {
    private StudentDao studentDao;

    public void init() {
        this.studentDao = new StudentDao();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            this.listStudents(response);
        } catch (SQLException e) {
            throw new ServletException(e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            String action = request.getParameter("action");
            if ("add".equals(action)) {
                this.insertStudent(request, response);
            } else if ("delete".equals(action)) {
                this.deleteStudent(request, response);
            }
        } catch (SQLException e) {
            throw new ServletException(e);
        }
    }

    private void listStudents(HttpServletResponse response) throws SQLException, IOException {
        List<Student> listStudent = this.studentDao.listAllStudents();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        StringBuilder jsonResponseBuilder = new StringBuilder("[");
        for (int i = 0; i < listStudent.size(); i++) {
            Student student = listStudent.get(i);
            jsonResponseBuilder.append(String.format(
                    "{\"id\":%d,\"firstName\":\"%s\",\"lastName\":\"%s\",\"middleName\":\"%s\",\"dateOfBirth\":\"%s\",\"studentGroup\":\"%s\",\"uniqueNumber\":\"%s\"}",
                    student.getId(), student.getFirstName(), student.getLastName(), student.getMiddleName(),
                    student.getDateOfBirth().toString(), student.getStudentGroup(), student.getUniqueNumber()));

            if (i < listStudent.size() - 1) {
                jsonResponseBuilder.append(",");
            }
        }
        jsonResponseBuilder.append("]");

        response.getWriter().write(jsonResponseBuilder.toString());
    }

    private void insertStudent(HttpServletRequest request, HttpServletResponse response)
            throws SQLException, IOException {
        String firstName = request.getParameter("firstName");
        String lastName = request.getParameter("lastName");
        String middleName = request.getParameter("middleName");
        String dateOfBirth = request.getParameter("dateOfBirth");
        String studentGroup = request.getParameter("studentGroup");
        String uniqueNumber = request.getParameter("uniqueNumber");

        Student newStudent = new Student(firstName, lastName, middleName, Date.valueOf(dateOfBirth), studentGroup, uniqueNumber);
        this.studentDao.insertStudent(newStudent);
        response.sendRedirect("students");
    }

    private void deleteStudent(HttpServletRequest request, HttpServletResponse response)
            throws SQLException, IOException {
        String uniqueNumber = request.getParameter("uniqueNumber");
        this.studentDao.deleteStudent(uniqueNumber);
        response.sendRedirect("students");
    }
}

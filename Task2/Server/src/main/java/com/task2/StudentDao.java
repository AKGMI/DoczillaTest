package com.task2;

import java.io.IOException;
import java.sql.*;
import java.io.InputStream;
import java.util.Properties;
import java.util.ArrayList;
import java.util.List;

public class StudentDao {

    private String jdbcURL;
    private String jdbcUsername;
    private String jdbcPassword;
    private Connection jdbcConnection;

    public StudentDao() {
        try (InputStream input = getClass().getClassLoader().getResourceAsStream("db.properties")) {
            Properties prop = new Properties();
            if (input == null) {
                System.out.println("Unable to find db.properties");
                return;
            }
            prop.load(input);

            this.jdbcURL = prop.getProperty("db.url");
            this.jdbcUsername = prop.getProperty("db.username");
            this.jdbcPassword = prop.getProperty("db.password");
        } catch (IOException ex) {
            ex.printStackTrace();
            throw new RuntimeException(ex);
        }
    }

    protected void connect() throws SQLException {
        if (this.jdbcConnection == null || this.jdbcConnection.isClosed()) {
            try {
                Class.forName("com.mysql.cj.jdbc.Driver");
            } catch (ClassNotFoundException e) {
                throw new SQLException(e);
            }
            this.jdbcConnection = DriverManager.getConnection(this.jdbcURL, this.jdbcUsername, this.jdbcPassword);
        }
    }

    protected void disconnect() throws SQLException {
        if (this.jdbcConnection != null && !this.jdbcConnection.isClosed()) {
            this.jdbcConnection.close();
        }
    }

    public List<Student> listAllStudents() throws SQLException {
        List<Student> listStudent = new ArrayList<>();

        String sql = "SELECT * FROM students";
        this.connect();

        Statement statement = this.jdbcConnection.createStatement();
        ResultSet resultSet = statement.executeQuery(sql);

        while (resultSet.next()) {
            int id = resultSet.getInt("id");
            String firstName = resultSet.getString("first_name");
            String lastName = resultSet.getString("last_name");
            String middleName = resultSet.getString("middle_name");
            Date dateOfBirth = resultSet.getDate("date_of_birth");
            String studentGroup = resultSet.getString("student_group");
            String uniqueNumber = resultSet.getString("unique_number");

            Student student = new Student(firstName, lastName, middleName, dateOfBirth, studentGroup, uniqueNumber);
            student.setId(id);

            listStudent.add(student);
        }

        resultSet.close();
        statement.close();

        this.disconnect();

        return listStudent;
    }

    public boolean insertStudent(Student student) throws SQLException {
        String sql = "INSERT INTO students (first_name, last_name, middle_name, date_of_birth, student_group, unique_number) VALUES (?, ?, ?, ?, ?, ?)";
        this.connect();

        PreparedStatement statement = this.jdbcConnection.prepareStatement(sql);
        statement.setString(1, student.getFirstName());
        statement.setString(2, student.getLastName());
        statement.setString(3, student.getMiddleName());
        statement.setDate(4, new java.sql.Date(student.getDateOfBirth().getTime()));
        statement.setString(5, student.getStudentGroup());
        statement.setString(6, student.getUniqueNumber());

        boolean rowInserted = statement.executeUpdate() > 0;
        statement.close();
        this.disconnect();
        return rowInserted;
    }

    public boolean deleteStudent(String uniqueNumber) throws SQLException {
        String sql = "DELETE FROM students WHERE unique_number = ?";
        this.connect();

        PreparedStatement statement = this.jdbcConnection.prepareStatement(sql);
        statement.setString(1, uniqueNumber);

        boolean rowDeleted = statement.executeUpdate() > 0;
        statement.close();
        this.disconnect();
        return rowDeleted;
    }
}

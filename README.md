# Task Management System

A full-stack application for managing tasks with Spring Boot backend and React frontend.

## Prerequisites

- Java 17+
- Node.js 16+

## Installation

### Backend Setup
1. Clone the repository
2. Run the database stored in src/main/resources/taskSchema.sql
3. Build the backend:
```bash
mvn clean install
```
### Frontend Setup
1. cd src/main/resources/templates/dts-submission
2. Build the frontend:
```bash
npm run build
```

## Starting the application
1. If not already cd src/main/resources/templates/dts-submission
2. ```npm start```
3. Application should be available at http://localhost:3000

## Notes
- the ```npm start``` function is a concurrent operation so it may take a couple of minitues for the application to fully start up when running it for the first time
- You must click the add new task button for the task adding form to appear, which looks like this:
  ![image](https://github.com/user-attachments/assets/e431d1da-e780-463c-9cf1-cfba16a82a12)
- To delete a task you must click on the task itself dor the delete option to appear,
![image](https://github.com/user-attachments/assets/add3239f-1584-4581-b880-300d69e3b8dd)






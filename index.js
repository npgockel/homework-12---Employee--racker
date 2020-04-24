var inquirer = require("inquirer");
var mysql = require("mysql");
//
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "employee_tracker_db",
});

connection.connect();

starterQ();

function starterQ() {
  var questions = [
    {
      type: "list",
      name: "employeeType",
      message: "What would you like to do?",
      choices: ["Add Departments", "View Departments", "Delete Departments", "Add Roles", "View Roles", "Delete Roles", "Add Employees", "View Employees", "Delete Employees"],
    },
  ];

  inquirer.prompt(questions).then(function (answers) {
    console.log(answers);
    if (answers.employeeType === "Add Departments") {
      console.log("Ask Manager questions");
      departmentAdd();
    } else if (answers.employeeType === "View Departments") {
      console.log("Ask Intern Questions");
      departmentView();
    } else if (answers.employeeType === "Delete Departments") {
      console.log("Ask Engineer Questions");
      departmentDelete();
    } else if (answers.employeeType === "Add Roles") {
      console.log("Ask Employee Questions");
      rolesAdd();
    }
  });
}

function departmentAdd() {
  var questions = [
    {
      type: "input",
      name: "department",
      message: "What is the name of the department?",
    },
  ];

  inquirer.prompt(questions).then(function (answers) {
    console.log("This is the name of the department: ", answers.department);
    var query = "INSERT INTO department (name) values (?)";
    connection.query(query, [answers.department], function (err, results) {
      console.log(err, results);
    });
  });
}

function departmentView() {
  var query = "SELECT * FROM department";
  connection.query(query, function (err, result) {
    console.log(err);
    console.table(result);
  });
}

function departmentDelete() {
  var query = "SELECT * FROM department";
  connection.query(query, function (err, result) {
    var deptArray = [];
    for (var i = 0; i < result.length; i++) {
      deptArray.push(result[i].name);
    }
    var questions = [
      {
        type: "list",
        name: "Departments",
        message: "What would you like to do?",
        choices: deptArray,
      },
    ];
    inquirer.prompt(questions).then(function (answers) {
      console.log(answers);
      var query = "DELETE FROM department WHERE NAME = answers.Departments";
      connection.query(query, [answers.department], function (err, results) {
        console.log(err, results);
      });
    });
  });
}

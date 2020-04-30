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
      departmentAdd();
    } else if (answers.employeeType === "View Departments") {
      departmentView();
    } else if (answers.employeeType === "Delete Departments") {
      departmentDelete();
    } else if (answers.employeeType === "Add Roles") {
      rolesAdd();
    } else if (answers.employeeType === "View Roles") {
      rolesView();
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
    starterQ();
  });
}

function departmentDelete() {
  var query = "SELECT * FROM department";
  connection.query(query, function (err, result) {
    // var deptArray = [];
    var deptArrayDisplay = [];
    for (var i = 0; i < result.length; i++) {
      deptArrayDisplay.push("ID:" + result[i].id + " " + result[i].name);
      // deptArray.push(result[i].name);
    }
    var questions = [
      {
        type: "list",
        name: "departments",
        message: "What would you like to do?",
        choices: deptArrayDisplay,
      },
    ];
    inquirer.prompt(questions).then(function (answers) {
      console.log(answers);
      console.log(result);
      var str = answers.departments;
      var matches = str.match(/(\d+)/);
      console.log(matches[0]);
      var query = "DELETE FROM department WHERE id = " + matches[0];
      connection.query(query, function (err, results) {
        console.log(err, results);
        connection.query("SELECT * FROM department", function (errOne, resOne) {
          if (errOne) throw errOne;
          const transformed = resOne.reduce((acc, { id, ...x }) => {
            acc[id] = x;
            return acc;
          }, {});
          console.table(transformed);
        });
        var questions = [
          {
            type: "list",
            name: "finishDelete",
            message: "What would you like to do?",
            choices: ["Main Menu", "Delete Another"],
          },
        ];
        inquirer.prompt(questions).then(function (answers) {
          if (answers.finishDelete === "Delete Another") {
            departmentDelete();
          } else {
            starterQ();
          }
        });
      });
    });
  });
}

function rolesAdd() {
  var query = "SELECT * FROM department";
  connection.query(query, function (err, result) {
    // var deptArray = [];
    var deptArrayDisplay = [];
    for (var i = 0; i < result.length; i++) {
      deptArrayDisplay.push(result[i].name);
      // deptArray.push(result[i].name);
    }
    console.table(deptArrayDisplay);

    var questions = [
      {
        type: "list",
        name: "department",
        message: "To which department would you like to add a role?",
        choices: deptArrayDisplay,
      },
      {
        type: "input",
        name: "jobTitle",
        message: "What is the Title of the role?",
      },
      {
        type: "number",
        name: "salary",
        message: "What is the base pay of this role?",
      },
    ];
    inquirer.prompt(questions).then(function (answers) {
      console.log(answers);
      var department_id;
      for (var i = 0; i < result.length; i++) {
        if (result[i].name === answers.department) {
          department_id = result[i].id;
        }
      }

      var query = "INSERT INTO roles (title, salary, department_id) values (?,?,?)";
      connection.query(query, [answers.jobTitle, answers.salary, department_id], function (err, results) {
        console.log(err);
        console.table(results);

        var questions = [
          {
            type: "list",
            name: "finishRoles",
            message: "What would you like to do?",
            choices: ["Main Menu", "View Roles"],
          },
        ];
        inquirer.prompt(questions).then(function (answers) {
          if (answers.finishRoles === "View Roles") {
            rolesView();
          } else {
            starterQ();
          }
        });
      });
    });
  });
}

function rolesView() {
  var query = "SELECT * FROM roles";
  connection.query(query, function (err, result) {
    console.log(err);
    console.table(result);
    starterQ();
  });
}

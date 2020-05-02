var inquirer = require("inquirer");
var mysql = require("mysql");
const cTable = require("console.table");
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
      name: "trackerQ",
      message: "What would you like to do?",
      choices: ["Add Departments", "View Departments", "Delete Departments", "Add Roles", "View Roles", "Update Employee Role", "Delete Roles", "Add Employees", "View Employees", "Delete Employees"],
    },
  ];

  inquirer.prompt(questions).then(function (answers) {
    console.log(answers);
    if (answers.trackerQ === "Add Departments") {
      departmentAdd();
    } else if (answers.trackerQ === "View Departments") {
      departmentView();
    } else if (answers.trackerQ === "Delete Departments") {
      departmentDelete();
    } else if (answers.trackerQ === "Add Roles") {
      rolesAdd();
    } else if (answers.trackerQ === "View Roles") {
      rolesView();
    } else if (answers.trackerQ === "Delete Roles") {
      rolesDelete();
    } else if (answers.trackerQ === "Add Employees") {
      employeeAdd();
    } else if (answers.trackerQ === "View Employees") {
      employeeView();
    } else if (answers.trackerQ === "Update Employee Role") {
      employeeRolesUpdate();
    } else if (answers.trackerQ === "Delete Employees") {
      employeeDelete();
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
      departmentView();
      starterQ();
    });
  });
}

function departmentView() {
  var query = "SELECT * FROM department";
  connection.query(query, function (err, result) {
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
            departmentView();
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
            rolesView();
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

function rolesDelete() {
  var query = "SELECT * FROM roles";
  connection.query(query, function (err, result) {
    // var deptArray = [];
    var rolesArrayDisplay = [];
    for (var i = 0; i < result.length; i++) {
      rolesArrayDisplay.push("ID:" + result[i].id + " " + result[i].title);
      // deptArray.push(result[i].name);
    }
    var questions = [
      {
        type: "list",
        name: "roles",
        message: "Which role would you like to delete?",
        choices: rolesArrayDisplay,
      },
    ];
    inquirer.prompt(questions).then(function (answers) {
      console.log(answers);
      console.log(result);
      var str = answers.roles;
      var matches = str.match(/(\d+)/);
      console.log(matches[0]);
      var query = "DELETE FROM roles WHERE id = " + matches[0];
      connection.query(query, function (err, results) {
        console.log(err, results);
        connection.query("SELECT * FROM roles", function (errOne, resOne) {
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
            rolesDelete();
          } else {
            rolesView();
            starterQ();
          }
        });
      });
    });
  });
}

function employeeAdd() {
  var query = "SELECT * FROM roles";
  connection.query(query, function (err, roleResult) {
    // var deptArray = [];
    var rolesArrayDisplay = [];
    for (var i = 0; i < roleResult.length; i++) {
      rolesArrayDisplay.push("ID:" + roleResult[i].id + " " + roleResult[i].title);
      // deptArray.push(roleResult[i].name);
    }

    var query = "SELECT * FROM employee";
    connection.query(query, function (err, managerResult) {
      // var deptArray = [];
      var employeeArrayDisplay = [];
      for (var i = 0; i < managerResult.length; i++) {
        employeeArrayDisplay.push("ID:" + managerResult[i].id + " " + managerResult[i].first_name + " " + managerResult[i].last_name);
        // deptArray.push(managerResult[i].name);
      }
      employeeArrayDisplay.unshift("No Manager");

      var questions = [
        {
          type: "input",
          name: "employeeFirst",
          message: "What is the first name of the employee?",
        },
        {
          type: "input",
          name: "employeeLast",
          message: "What is the last name of the employee?",
        },
        {
          type: "list",
          name: "employeeRoles",
          message: "What is the role of the employee?",
          choices: rolesArrayDisplay,
        },
        {
          type: "list",
          name: "manager",
          message: "Does the employee have a manager",
          choices: employeeArrayDisplay,
        },
      ];

      inquirer.prompt(questions).then(function (answers) {
        var roleStr = answers.employeeRoles;
        var employeeRolesMatches = roleStr.match(/(\d+)/);
        console.log(employeeRolesMatches[0]);

        var managerStr = answers.manager;
        var employeeManagerMatches = managerStr.match(/(\d+)/);
        console.log(employeeManagerMatches[0]);

        var query = "INSERT INTO employee (first_name,last_name,role_id,manager_id) values (?,?,?,?)";
        connection.query(query, [answers.employeeFirst, answers.employeeLast, employeeRolesMatches[0], employeeManagerMatches[0]], function (err, results) {
          console.log(err, results);
          employeeView();
          starterQ();
        });
      });
    });
  });
}

function employeeView() {
  var query = "SELECT * FROM employee";
  connection.query(query, function (err, result) {
    console.log(err);
    console.table(result);
    starterQ();
  });
}

function employeeRolesUpdate() {
  var query = "SELECT * FROM roles";
  connection.query(query, function (err, result) {
    var rolesArrayDisplay = [];
    for (var i = 0; i < result.length; i++) {
      rolesArrayDisplay.push("ID:" + result[i].id + " " + result[i].title);
    }

    var query = "SELECT * FROM employee";
    connection.query(query, function (err, result) {
      var employeeArrayDisplay = [];
      for (var i = 0; i < result.length; i++) {
        employeeArrayDisplay.push("ID " + result[i].id + ": " + result[i].first_name + " " + result[i].last_name);
      }

      var questions = [
        {
          type: "list",
          name: "employee",
          message: "Which employee's role would you like to update?",
          choices: employeeArrayDisplay,
        },
        {
          type: "list",
          name: "roles",
          message: "To which role would you like to change this employee?",
          choices: rolesArrayDisplay,
        },
      ];
      inquirer.prompt(questions).then(function (answers) {
        var rolStr = answers.roles;
        var roleMatches = rolStr.match(/(\d+)/);
        console.log(roleMatches[0]);

        var empStr = answers.employee;
        var employeeMatches = empStr.match(/(\d+)/);
        console.log(employeeMatches[0]);

        var query = "UPDATE employee SET role_id = ? WHERE id = ?";
        connection.query(query, [roleMatches[0], employeeMatches[0]], function (err, results) {
          employeeView();

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
              employeeRolesUpdate();
            } else {;
              starterQ();
            }
          });
        });
      });
    });
  });
}

function employeeDelete() {
  var query = "SELECT * FROM employee";
  connection.query(query, function (err, result) {
    // var deptArray = [];
    var employeeArrayDisplay = [];
    for (var i = 0; i < result.length; i++) {
      employeeArrayDisplay.push("ID " + result[i].id + ": " + result[i].first_name + " " + result[i].last_name);
      // deptArray.push(result[i].name);
    }
    var questions = [
      {
        type: "list",
        name: "employee",
        message: "Which employee would you like to delete?",
        choices: employeeArrayDisplay,
      },
    ];

    // console.log(employeeArrayDisplay);
    inquirer.prompt(questions).then(function (answers) {
      console.log(answers);
      console.log(result);
      var str = answers.employee;
      var matches = str.match(/(\d+)/);
      console.log(matches[0]);
      var query = "DELETE FROM employee WHERE id = " + matches[0];
      connection.query(query, function (err, results) {
        connection.query("SELECT * FROM employee", function (errOne, resOne) {
          if (errOne) throw errOne;
          const transformed = resOne.reduce((acc, { id, ...x }) => {
            acc[id] = x;
            return acc;
          }, {});
        });
        employeeView();
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
            employeeDelete();
          } else {
            starterQ();
          }
        });
      });
    });
  });
}

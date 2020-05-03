var inquirer = require("inquirer");
var mysql = require("mysql");
const cTable = require("console.table");



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
      choices: ["Add Departments", "View Departments", "Delete Departments", "Add Roles", "View Roles", "Delete Roles", "Add Employees", "View Employees", "Update Employee Role", "Delete Employees"],
    },
  ];

  inquirer.prompt(questions).then(function (answers) {
    if (answers.trackerQ === "Add Departments") {
      departmentAdd();
    } else if (answers.trackerQ === "View Departments") {
      departmentViewStarter();
    } else if (answers.trackerQ === "Delete Departments") {
      departmentDelete();
    } else if (answers.trackerQ === "Add Roles") {
      rolesAdd();
    } else if (answers.trackerQ === "View Roles") {
      rolesViewStarter();
    } else if (answers.trackerQ === "Delete Roles") {
      rolesDelete();
    } else if (answers.trackerQ === "Add Employees") {
      employeeAdd();
    } else if (answers.trackerQ === "View Employees") {
      employeeViewStarter();
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
      if (err) throw err;
      departmentView();
      starterQ();
    });
  });
}

function departmentViewStarter() {
  var query = "SELECT * FROM department";
  connection.query(query, function (err, result) {
    if (err) throw err;
    console.table("***Current Departments***", result);
  });
  starterQ();
}

function departmentView() {
  var query = "SELECT * FROM department";
  connection.query(query, function (err, result) {
    if (err) throw err;
    console.table("***Current Departments***", result);
  });
}

function departmentDelete() {
  var query = "SELECT * FROM department";
  connection.query(query, function (err, result) {
    if (err) throw err;
    var deptArrayDisplay = [];
    for (var i = 0; i < result.length; i++) {
      deptArrayDisplay.push("ID:" + result[i].id + " " + result[i].name);
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
      var str = answers.departments;
      var matches = str.match(/(\d+)/);
      var query = "DELETE FROM department WHERE id = " + matches[0];
      connection.query(query, function (err, results) {
        if (err) throw err;
        departmentView();
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
    var deptArrayDisplay = [];
    for (var i = 0; i < result.length; i++) {
      deptArrayDisplay.push(result[i].name);
    }

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
      var department_id;
      for (var i = 0; i < result.length; i++) {
        if (result[i].name === answers.department) {
          department_id = result[i].id;
        }
      }

      var query = "INSERT INTO roles (title, salary, department_id) values (?,?,?)";
      connection.query(query, [answers.jobTitle, answers.salary, department_id], function (err, results) {
        if (err) throw err;

        var questions = [
          {
            type: "list",
            name: "finishRoles",
            message: "What would you like to do?",
            choices: ["Main Menu", "Add more Roles"],
          },
        ];
        rolesView();
        inquirer.prompt(questions).then(function (answers) {
          if (answers.finishRoles === "View Roles") {
            rolesAdd();
          } else {
            starterQ();
          }
        });
      });
    });
  });
}

function rolesViewStarter() {
  var query = "SELECT * FROM roles";
  connection.query(query, function (err, result) {
    if (err) throw err;
    console.table("***Current Roles***", result);
  });
  starterQ();
}

function rolesView() {
  var query = "SELECT * FROM roles";
  connection.query(query, function (err, result) {
    if (err) throw err;
    console.table("***Current Roles***", result);
  });
}

function rolesDelete() {
  var query = "SELECT * FROM roles";
  connection.query(query, function (err, result) {
    var rolesArrayDisplay = [];
    for (var i = 0; i < result.length; i++) {
      rolesArrayDisplay.push("ID:" + result[i].id + " " + result[i].title);
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
      var str = answers.roles;
      var matches = str.match(/(\d+)/);
      var query = "DELETE FROM roles WHERE id = " + matches[0];
      connection.query(query, function (err, results) {
        if (err) throw err;
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
        rolesView();
        inquirer.prompt(questions).then(function (answers) {
          if (answers.finishDelete === "Delete Another") {
            rolesDelete();
          } else {
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
    var rolesArrayDisplay = [];
    for (var i = 0; i < roleResult.length; i++) {
      rolesArrayDisplay.push("ID:" + roleResult[i].id + " " + roleResult[i].title);
    }

    var query = "SELECT * FROM employee";
    connection.query(query, function (err, managerResult) {
      var employeeArrayDisplay = [];
      for (var i = 0; i < managerResult.length; i++) {
        employeeArrayDisplay.push("ID:" + managerResult[i].id + " " + managerResult[i].first_name + " " + managerResult[i].last_name);
      }
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

        var query = "INSERT INTO employee (first_name,last_name,role_id,manager_id) values (?,?,?,?)";
        connection.query(query, [answers.employeeFirst, answers.employeeLast, employeeRolesMatches[0], employeeManagerMatches[0]], function (err, results) {
          if (err) throw err;
          var questions = [
            {
              type: "list",
              name: "finishDelete",
              message: "What would you like to do?",
              choices: ["Main Menu", "Add Another Employee"],
            },
          ];
          employeeView();
          inquirer.prompt(questions).then(function (answers) {
            if (answers.finishDelete === "Delete Another") {
              employeeAdd();
            } else {
              starterQ();
            }
          });
        });
      });
    });
  });
}

function employeeViewStarter() {
  var query = "SELECT * FROM employee";
  connection.query(query, function (err, result) {
    if (err) throw err;
    console.table("***Current Employees***", result);
  });
  starterQ();
}

function employeeView() {
  var query = "SELECT * FROM employee";
  connection.query(query, function (err, result) {
    if (err) throw err;
    console.table("***Current Employees***", result);
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
            if (answers.finishDelete === "Update Another") {
              employeeRolesUpdate();
            } else {
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
    var employeeArrayDisplay = [];
    for (var i = 0; i < result.length; i++) {
      employeeArrayDisplay.push("ID " + result[i].id + ": " + result[i].first_name + " " + result[i].last_name);
    }
    var questions = [
      {
        type: "list",
        name: "employee",
        message: "Which employee would you like to delete?",
        choices: employeeArrayDisplay,
      },
    ];

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

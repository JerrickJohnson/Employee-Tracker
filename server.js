const inquirer = require("inquirer");
const mysql = require("mysql2");

// const PORT = process.env.PORT || 3001;

//Connection to MySQL
const connection = mysql.createConnection(
    {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'Emerygrace41!$',
        database: 'employeeTracker_db',
    },
);

//Connect to the database
connection.connect((err) => {
    if (err) throw err;
    console.log("You are connected to the database!");
    start();
});


function start() {
    inquirer.prompt({
        type: 'list',
        name: "action",
        message: "What would you like to do?",
        choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            // "Add a manager",
            "Update an employee role",
            // "View Employees by Manager",
            // "View Employees by Department",
            // "Delete Departments, Roles, Employees",
            // "View the total utilized budget of a department",
            "Exit",
        ],
    }).then((answer) => {
        switch (answer.action) {
            case "View all departments": viewAllDepartments();
            break;
            case "View all roles": viewAllRoles();
            break;
            case "View all employees": viewAllEmployees();
            break;
            case "Add a department": addDepartment();
            break;
            case "Add a role": addRole();
            break;
            case "Add an employee": addEmployee();
            break;
            // case "Add a manager": addManager();
            // break;
            case "Update an employee role": updateEmployeeRole();
            break;
            // case "View Employees by Manager": viewEmployeesByManager();
            // break;
            // case "View Employees by Department": viewEmployeesByDepartment();
            // break;
            // case "Delete Departments, Roles, Employees": deleteDepartmentRolesEmployees();
            // break;
            // case "View the total utilized budget of a department": viewTotalUtilizedBudgetOfDepartment();
            // break;
            case "Exit": connection.end();
                    console.log("Goodbye!");
                    break;
        }
    });
}

//View all departments function
function viewAllDepartments() {
    const query =  "SELECT * FROM department";
    connection.query(query, (err,res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

//View all the roles
function viewAllRoles () {
    const query = "SELECT role.title, role.id, department.department_name, role.salary from role join department on role.department_id = department.id";
    connection.query(query, (err,res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

//View all the employees
function viewAllEmployees() {
    const query = `SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, r.salary, CONCAT(m.first_name, ' ' , m.last_name) AS manager_name
    FROM employee e
    LEFT JOIN role r ON e.role_id = r.id
    LEFT JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id;`;

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

//Add a department
function addDepartment() {
    inquirer.prompt({
        type: "input",
        name: "name",
        message: "Enter the name of the new department:"
    }).then((answer) =>{
        console.log(answer.name);
        const query = `INSERT INTO department (department_name) VALUES ("${answer.name}")`;
        connection.query(query, (err, res) => {
            if (err) throw err;
            console.log(`Added department ${answer.name}!`);
            start();
            console.log(answer.name);
        })
    })
}

//Add a role
function addRole() {
    const query = "SELECT * FROM department";
    connection.query(query, (err, res) => {
        if (err) throw err;
    
    inquirer.prompt([
    {
        type: "input",
        name: "title",
        message: "Enter the title of the new role:",
    },
    {
        type: "input",
        name: "salary",
        message: "Enter the salary of the new role:",
    },
    {
        type: "list",
        name: "department",
        message: "Select the department for the new role:",
        choices: res.map((department) => department.department_name),
    },

]).then((answers) => {
    const department = res.find((department) => department.name === answers.department);
    const query = "INSERT INTO role SET ?"

    connection.query(query,
        {
            title: answers.title,
            salary: answers.salary,
            department_id: department,
        },
        (err, res) => {
            if (err) throw err;
            console.log(`Added role ${answers.title} with salary ${answers.salary} to the ${answers.department} department!`);
            start();
        }
        );
  });
});
}

//Add Employee
function addEmployee() {
    connection.query("SELECT id, title FROM role", (err, results) => {
        if (err) {
            console.error(err);
            return;
        }

        const role = results.map(({ id, title }) => ({
            name: title,
            value: id,
        }));

        connection.query(`SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee`,
        (error, results) => {
            if (error) {
                console.error(error);
                return;
            }

            const managers = results.map(({ id, name }) => ({
                name,
                value: id,
            }));

            inquirer.prompt([
                {
                    type: "input",
                    name: "firstName",
                    message: "Enter the employee's first name:",
                },
                {
                    type: "input",
                    name: "lastName",
                    message: "Enter the employee's last name:",
                },
                {
                    type: "list",
                    name: "roleId",
                    message: "Select the employee role:",
                    choices: role,
                },
                {
                    type: "list",
                    name: "managerId",
                    message: "Select the employee manager:",
                    choices: [
                        { name: "Npne", value: null}, ...managers
                    ],
                },
            ]).then((answers) => {
                const sql = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                const values = [
                    answers.firstName,
                    answers.lastName,
                    answers.roleId,
                    answers.managerId,
                ];
                connection.query(sql, values, (error) => {
                    if (error) {
                        console.error(error);
                        return;
                    }
                    console.log("Employee added successfully!");
                    start();
                });
            })
            .catch((error) => {
                console.error(error);
            });
        }
        );
    });
}

//Update Employee Role
function updateEmployeeRole() {
    const queryEmployees = "SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role ON employee.role_id = role.id";
    const queryRoles = "SELECT * FROM role";
    connection.query(queryEmployees, (err, resEmployees) => {
        if (err) throw err;
        connection.query(queryRoles, (err, resRoles) => {
            if (err) throw err;
            inquirer.prompt([
                {
                    type: "list",
                    name: "employee",
                    message: "Select the employee to update:",
                    choices: resEmployees.map((employee) => `${employee.first_name} ${employee.last_name}`),
                },
                {
                    type: "list",
                    name: "role",
                    message: "Select the new role:",
                    choices: resRoles.map((role) => role.title),
                },

            ])
            .then((answers) => {
                const employee = resEmployees.find((employee) => `${employee.first_name} ${employee.last_name}` === answers.employee);
                const role = resRoles.find((role) => role.title === answers.role);
                const query = "UPDATE employee SET role_id = ? WHERE id = ?";
                connection.query(query, [role.id, employee.id], (err, res) => {
                    if (err) throw err;
                    console.log(`Updated ${employee.first_name} ${employee.last_name}'s role to ${role.title}!`);
                    start();
                }
                
              );
           });
        });
    });
}

process.on("exit", () => {
    connection.end()
});
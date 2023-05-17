INSERT INTO department (department_name)
VALUES
('Human Resources'),
('Customer Service'),
('Accounting'),
('Engineering'),
('Project Management'),
('Legal'),
('Development'),
('Marketing'),
('Maintenance'),
('Research');

INSERT INTO role (title, salary, department_id)
VALUES
('HR Director', 65500.00, 1),
('Senior Engineer', 90000.00, 2),
('Customer Service Manager', 82000.00, 3),
('IT Manager', 120000.00, 4),
('Developer', 80000.00, 5),
('Accounting Manager', 95000.00, 6),
('Project Manager', 11000.00, 7),
('Legal Manager', 140000.00, 8),
('Maintenance Manager', 65000.00, 9),
('Team Lead', 100000.00, 10);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Dirk', 'Nowitzki', 1, 1),
('Jet', 'Terry', 2, 2),
('Luca', 'Doncic', 3, 3),
('Micheal', 'Finley', 4, 4),
('Jason', 'Kidd', 5, 5),
('JJ', 'Barea', 6, 6),
('Steve', 'Nash', 7, 7),
('Josh', 'Howard', 8, 8),
('Tyson', 'Chandler', 9, 9),
('Shawn', 'Marion', 10, 10);
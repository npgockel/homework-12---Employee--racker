CREATE TABLE `employee_tracker_db`.`employee`  (
  `id` INT NOT NULL,
  `first_name` VARCHAR(45) NULL,
  `last_name` VARCHAR(45) NULL,
  `role_id` INT NULL,
  `manager_id` INT NULL,
  PRIMARY KEY (`id`)),
  FOREIGN KEY (`manager_id`)
  REFERENCES `employee_tracker_db`.`employee` (`id`),
  FOREIGN KEY (`role_id`)
  REFERENCES `employee_tracker_db`.`roles` (`id`),
  );


SELECT employeee.name, role.title, department.name
FROM employee
INNER JOIN role ON employee.role_id=role.id
INNER JOIN department ON role.department_id=department.id;
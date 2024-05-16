const mysql = require("mysql");

const conn = mysql.createConnection({
  host: "sql12.freesqldatabase.com",
  user: "sql12706929",
  password: "VgiHemvjPl",
  database: "sql12706929",
});

conn.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL server:", err);
    if (err.code === "ER_BAD_DB_ERROR") {
      createDatabase();
    }
    return;
  }
  console.log("Connected to MySQL server");
});

const createDatabase = () => {
  const sql = "CREATE DATABASE IF NOT EXISTS employee";
  conn.query(sql, (err) => {
    if (err) console.error(err);
    console.log("Database created or exists");
  });
};

createDatabase();

const createLoginTable = () => {
  const sql = `
        CREATE TABLE IF NOT EXISTS login (
            sr_no INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) UNIQUE,
            password VARCHAR(255)
        )
    `;
  conn.query(sql, (err) => {
    if (err) console.error(err);
    console.log("Login table created or exists");
  });
};

createLoginTable();

const insertLoginData = (username, password) => {
  const sql = `INSERT INTO login (username, password) VALUES (?, ?)`;
  console.log(username, password);
  conn.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return;
    }
    console.log("Data inserted successfully:", result);
  });
};

function displayEmployees(callback) {
  const sql = "SELECT * FROM employee ORDER BY id, name, email, created_date";
  conn.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      callback(err, null);
      return;
    }
    callback(null, result);
  });
}

const createEmployeeTable = () => {
  const sql = `
        CREATE TABLE IF NOT EXISTS employee (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            email VARCHAR(255),
            mobile_no VARCHAR(15),
            designation VARCHAR(255),
            gender ENUM('Male', 'Female', 'Other'),
            course VARCHAR(255),
            img_path VARCHAR(255),
            created_date DATE
        )
    `;
  conn.query(sql, (err) => {
    if (err) {
      console.error("Error creating employee table:", err);
      return;
    }
    console.log("Employee table created or exists");
  });
};

createEmployeeTable();

const insertEmployee = (
  name,
  email,
  mobile_no,
  designation,
  gender,
  course,
  img_path
) => {
  const sql = `INSERT INTO employee (name, email, mobile_no, designation, gender, course, img_path,created_date) VALUES (?, ?, ?, ?, ?, ?, ?,NOW())`;
  conn.query(
    sql,
    [
      name,
      email,
      mobile_no,
      designation,
      gender,
      course,
      (img_path =
        "https://th.bing.com/th/id/OIP.OsIQdMS0ffnElgj2IeFwtAHaHa?w=512&h=512&rs=1&pid=ImgDetMain"),
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting employee data:", err);
        return;
      }
      console.log("Employee data inserted successfully:", result);
    }
  );
};

const searchEmployeeById = (id, callback) => {
  const sql = "SELECT * FROM employee WHERE id = ?";
  conn.query(sql, id, (err, result) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      callback(err, null);
      return;
    }

    if (result.length === 0) {
      const notFoundError = new Error(`Employee with ID ${id} not found.`);
      callback(notFoundError, null);
      return;
    }
    callback(null, result);
  });
};

function searchEmployee(search, callback) {
  const sql = `SELECT * FROM employee WHERE name LIKE '%${search}%' OR email LIKE '%${search}%' OR mobile_no LIKE '%${search}%' ORDER BY name ASC`;
  const params = [`%${search[0]}%`, `%${search[1]}%`, `%${search[2]}%`];

  console.log(sql);

  conn.query(sql, (err, res) => {
    if (err) {
      console.error(err);
      callback(err, null);
      return;
    }
    callback(null, res);
  });
}

const updateEmployee = (
  name,
  email,
  mobile_no,
  designation,
  gender,
  course,
  img_path,
  id
) => {
  console.log(gender);
  const sql = `UPDATE employee SET name=?, email=?, mobile_no=?, designation=?, gender=?, course=?, img_path=?, created_date=NOW() WHERE id=?`;
  const params = [
    name,
    email,
    mobile_no,
    designation,
    gender,
    course,
    img_path ||
      "https://th.bing.com/th/id/OIP.OsIQdMS0ffnElgj2IeFwtAHaHa?w=512&h=512&rs=1&pid=ImgDetMain",
    id,
  ];

  conn.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error updating employee data:", err);
      return;
    }
    console.log("Employee data updated successfully:", result);
  });
};

function deleteEmp(id, callback) {
  let sql = "DELETE FROM employee WHERE id = ?";
  conn.query(sql, id, (err, reuslt) => {
    if (err) {
      console.log(err);
      callback(err, null);
      return;
    }
    console.log("delete successfull");
    callback(null, true);
  });
}

function checkEmail(email, callback) {
  let sql = "SELECT * FROM employee WHERE email = ?";
  conn.query(sql, [email], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results.length > 0);
  });
}

module.exports = {
  conn,
  displayEmployees,
  searchEmployeeById,
  insertEmployee,
  searchEmployee,
  updateEmployee,
  deleteEmp,
  checkEmail,
  insertLoginData,
};

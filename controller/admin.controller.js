const {
  displayEmployees,
  searchEmployee,
  insertEmployee,
  updateEmployee,
  searchEmployeeById,
  deleteEmp,
  checkEmail,
} = require("../utils/db.js");

// This is Home admin panel
module.exports.dashboard = (req, res) => {
  let user = req.session.username;
  res.render("dashboard.ejs", { user: user });
};

//   This is Employee show route
module.exports.show = (req, res) => {
  let user = req.session.username;
  displayEmployees((err, result) => {
    res.render("employee_list.ejs", { result, user });
  });
};

// Employee edit get route
module.exports.edit = (req, res) => {
  let id = req.params.id;
  let user = req.session.username;
  searchEmployeeById(id, (error, emp) => {
    console.log(emp);
    res.render("edit.ejs", { emp, error, user: user });
  });
};

// This is New Route
module.exports.new = (req, res) => {
  let user = req.session.username;
  res.render("create.ejs", { user: user });
};

// This is Delete Employee Route
module.exports.delete = (req, res) => {
  let id = req.params.id;
  deleteEmp(id, (err, reuslt) => {
    if (reuslt) {
      res.redirect("/admin/employee");
    }
  });
};

// this is logOut Route for the Admin

module.exports.logOut = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};

// This is Search Employee route
module.exports.search = (req, res) => {
  let user = req.session.username;
  let username = req.body.search;
  console.log(username);
  searchEmployee(username, (err, result) => {
    res.render("employee_list.ejs", { result: result, user: user });
  });
};

// This Is Post Route For The New Data
module.exports.newPost = (req, res) => {
  let id = req.params.id;
  let user = req.session.username;
  checkEmail(req.body.email, (err, emailExists) => {
    if (err) {
      console.log(err);
      return;
    }
    if (emailExists) {
      res.render("create.ejs", {
        error: "Email already used, use another Email",
        user,
      });
      return;
    } else {
      insertEmployee(
        req.body.name,
        req.body.email,
        req.body.number,
        req.body.designation,
        req.body.gender,
        req.body.course,
        req.body.img_path
      );

      res.redirect("/admin/employee");
    }
  });
};

// This is Edit post Route
module.exports.editPost = (req, res) => {
  const id = req.params.id;
  const { name, email, number, designation, gender, course, img_path } =
    req.body;

  updateEmployee(
    name,
    email,
    number,
    designation,
    gender,
    course,
    img_path,
    id
  );
  res.redirect("/admin/employee");
};

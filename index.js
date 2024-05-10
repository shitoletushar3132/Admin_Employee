const express = require("express");
const path = require("path");
const app = express();
const session = require("express-session");
const db = require("./utils/adminCheck.js");
const bodyParser = require("body-parser");
const ejs_mate = require("ejs-mate");
const {
  displayEmployees,
  searchEmployee,
  insertEmployee,
  updateEmployee,
  searchEmployeeById,
  deleteEmp,
  checkEmail,
  insertLoginData,
} = require("./utils/db.js");

app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.engine("ejs", ejs_mate);
app.use(
  session({
    secret: "tushar",
    resave: false,
    saveUninitialized: false,
  })
);

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("newlogin.ejs");
});

app.post("/register", (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.render("newlogin.ejs", { error: "Passwords do not match!" });
    return;
  }
  insertLoginData(username, confirmPassword);
  res.redirect("/login");
});

app.post("/login", (req, res) => {
  let { username, password } = req.body;

  db.checkUserExists(username, (err, userExists) => {
    if (err) {
      console.error("Error checking user existence:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    if (!userExists) {
      res.render("login.ejs", { error: "Username Not Found" });
      return;
    }

    db.verifyPassword(username, password, (err, passwordMatches) => {
      if (err) {
        console.error("Error verifying password:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      if (!passwordMatches) {
        res.render("login.ejs", { error: "Incorrect password" });
        return;
      }

      req.session.username = username;
      res.redirect("/admin/dashboard");
    });
  });
});

const requireLogin = (req, res, next) => {
  if (!req.session.username) {
    return res.redirect("/login");
  }
  next();
};

app.get("/admin/dashboard", requireLogin, (req, res) => {
  let user = req.session.username;
  res.render("dashboard.ejs", { user: user });
});

function usern() {
  let user = req.session.username;
  return;
}

app.get("/admin/employee", requireLogin, (req, res) => {
  let user = req.session.username;
  displayEmployees((err, result) => {
    res.render("employee_list.ejs", { result, user });
  });
});

app.post("/admin/employee/search", requireLogin, (req, res) => {
  let user = req.session.username;
  let username = req.body.search;
  console.log(username);
  searchEmployee(username, (err, result) => {
    res.render("employee_list.ejs", { result: result, user: user });
  });
});

app.get("/admin/employee/create", requireLogin, (req, res) => {
  let user = req.session.username;
  res.render("create.ejs", { user: user });
});

app.post("/admin/employee/create", requireLogin, (req, res) => {
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
});

app.get("/admin/employee/:id/edit", requireLogin, (req, res) => {
  let id = req.params.id;
  let user = req.session.username;
  searchEmployeeById(id, (error, emp) => {
    console.log(emp);
    res.render("edit.ejs", { emp, error, user: user });
  });
});

app.post("/admin/employee/:id/edit", requireLogin, (req, res) => {
  const { name, email, number, designation, gender, course, img_path } = req.body;
  const id = req.params.id; // Get employee ID from request parameters

  updateEmployee(
    name,
    email,
    number,
    designation,
    gender,
    course,
    img_path,
    id,
    (err, result) => { 
      console.log("Employee data updated successfully:", result);
      
    }
  );
  res.redirect("/admin/employee");
});


app.get("/admin/employee/:id", requireLogin, (req, res) => {
  let id = req.params.id;
  deleteEmp(id, (err, reuslt) => {
    if (reuslt) {
      res.redirect("/admin/employee");
    }
  });
});

app.get("/admin/user/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

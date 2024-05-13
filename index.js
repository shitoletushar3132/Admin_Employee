const express = require("express");
const path = require("path");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const ejs_mate = require("ejs-mate");
const adminRoute = require("./routes/admin.routes.js");
const loginRoute = require("./routes/login.route.js");
const registerRoute = require("./routes/register.route.js");

app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.engine("ejs", ejs_mate);

// Session Creation
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

// Routes For the Admin
app.use("/admin", adminRoute);

// Routes For the Login
app.use("/login", loginRoute);

// Routes For the Register
app.use("/register", registerRoute);

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

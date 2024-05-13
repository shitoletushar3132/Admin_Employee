const { insertLoginData } = require("../utils/db.js");

module.exports.register = (req, res) => {
  res.render("signup.ejs");
};

module.exports.registerPost = (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.render("signup.ejs", { error: "Passwords do not match!" });
    return;
  }
  insertLoginData(username, confirmPassword);
  res.redirect("/login");
};

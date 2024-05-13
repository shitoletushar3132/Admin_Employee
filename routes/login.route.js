const express = require("express");
const router = express.Router();
const loginController = require("../controller/login.controller.js");

router.get("/", loginController.login);

router.post("/", loginController.loginPost);

module.exports = router;

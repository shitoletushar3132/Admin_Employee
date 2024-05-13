const express = require("express");
const router = express.Router();
const { requireLogin } = require("../middleware.js");
const adminController = require("../controller/admin.controller.js");

// This Is Home Page
router.get("/dashboard", requireLogin, adminController.dashboard);

// Employee Show Route
router.get("/employee", requireLogin, adminController.show);

// Employee Edit Route
router.get("/employee/:id/edit", requireLogin, adminController.edit);

// Employee New Route
router.get("/employee/create", requireLogin, adminController.new);

// Employee Delete Route
router.get("/employee/:id", requireLogin, adminController.delete);

// admin logout Route
router.get("/user/logout", adminController.logOut);

// Search Employee
router.post("/employee/search", requireLogin, adminController.search);

// post new route
router.post("/employee/create", requireLogin, adminController.newPost);

// Post edit route

router.post("/employee/:id/edit", requireLogin, adminController.editPost);

module.exports = router;

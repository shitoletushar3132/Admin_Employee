const express = require("express");
const router = express.Router();
const registeController = require("../controller/register.controller.js");

// Get register
router.get("/", registeController.register);

// Post Register

router.post("/", registeController.registerPost);

module.exports = router;

const express = require("express");
const authCtrl = require("../controllers/auth.controller");
const run = require("../validators");
const validator = require("../validators/auth.validator");

const router = express.Router();

router
  .route("/api/signin")
  .post(validator.userLoginValidator, run.runValidation, authCtrl.signin);

router.route("/api/signout").get(authCtrl.signout);

module.exports = router;

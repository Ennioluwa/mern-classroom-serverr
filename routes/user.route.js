const express = require("express");

const router = express.Router();

// middleware
const { signIn } = require("../middlewares");
const run = require("../validators");
const validator = require("../validators/auth.validator");

// controllers
const {
  create,
  list,
  read,
  update,
  remove,
} = require("../controllers/user.controller");

// router.post("/register", register);
// router.post("/login", login);
// router.get("/logout", logout);
// router.get("/current-user", signIn, currentUser);
// router.param("userId",userById);
router
  .route("/api/user/create")
  .post(validator.userRegisterValidator, run.runValidation, create);
router.route("/api/users").get(signIn, list);

router
  .route("/api/user")
  .get(signIn, read)
  .put(signIn, update)
  .delete(signIn, remove);

module.exports = router;

const express = require("express");
const { courseById } = require("../controllers/course.controller");
const {
  complete,
  create,
  enrollmentById,
  enrollmentStats,
  isEnrollment,
  isStudent,
  listEnrolled,
  read,
} = require("../controllers/enrollment.controller");
const { signIn } = require("../middlewares");

const router = express.Router();

router.param("enrollmentId", enrollmentById);
router.param("courseId", courseById);

router.route("/api/enrollment/enrolled").get(signIn, listEnrolled);
router.route("/api/enrollment/stats/:courseId").get(enrollmentStats);
router
  .route("/api/enrollment/new/:courseId")
  .post(signIn, isEnrollment, create);
router.route("/api/enrollment/:enrollmentId").get(signIn, isStudent, read);
router
  .route("/api/enrollment/complete/:enrollmentId")
  .put(signIn, isStudent, complete);

module.exports = router;

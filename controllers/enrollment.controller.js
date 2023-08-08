const enrolled = require("../models/enrolled");

const enrollmentById = async (req, res, next, id) => {
  try {
    enrolled
      .findById(id)
      .populate("student", "_id name")
      .populate({ path: "course", populate: { path: "instructor" } })
      .exec((err, data) => {
        if (!data || err) {
          return res.status(403).json({ error: "Unable to get enrollment" });
        }
        req.enrollment = data;
        next();
      });
  } catch (error) {
    console.log(error);
  }
};

const isEnrollment = async (req, res, next) => {
  try {
    const enrollment = await enrolled.find({
      course: req.course._id,
      student: req.user._id,
    });
    if (enrollment.length == 0) {
      next();
    } else {
      return res.json(enrollment[0]);
    }
  } catch (error) {
    console.log(error);
  }
};

const create = async (req, res) => {
  console.log("We were here");
  let newEnrollment = {
    course: req.course._id,
    student: req.user._id,
  };
  newEnrollment.lessonStatus = req.course.lessons.map((lesson) => ({
    lesson: lesson,
    completed: false,
  }));
  console.log(newEnrollment);
  const enrollment = new enrolled(newEnrollment);
  try {
    let result = await enrollment.save();

    res.json(result);
  } catch (error) {
    console.log(error);
  }
};
const isStudent = (req, res, next) => {
  const isStudent =
    req.user && req.enrollment && req.user._id == req.enrollment.student._id;
  if (!isStudent) {
    return res.status(403).json({ error: "User is not enrolled" });
  }
  next();
};
const read = (req, res) => {
  return res.json(req.enrollment);
};
const complete = async (req, res) => {
  let updatedData = {};
  updatedData["lessonStatus.$.completed"] = req.body.complete;
  if (req.body.courseCompleted) {
    updatedData.completedAt = req.body.courseCompleted;
  }
  try {
    let enrollment = await enrolled.updateOne(
      { "lessonStatus._id": req.body.lessonStatusId },
      { $set: updatedData }
    );
    console.log(enrollment, updatedData);
    res.json(enrollment);
  } catch (error) {
    console.log(error);
  }
};
const listEnrolled = (req, res) => {
  try {
    enrolled
      .find({ student: req.user._id })
      .sort({ completedAt: 1 })
      .populate("course", "_id name category")
      .exec((err, result) => {
        if (err || !result) {
          return res
            .status(400)
            .json({ error: "Could not get enrolled courses" });
        }
        res.json(result);
      });
  } catch (error) {
    console.log(error);
  }
};
const enrollmentStats = async (req, res) => {
  try {
    let stats = {};
    stats.totalEnrolled = await enrolled
      .find({ course: req.course._id })
      .countDocuments();
    stats.totalCompleted = await enrolled
      .find({ course: req.course._id })
      .exists("completedAt", true)
      .countDocuments();

    res.json(stats);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  create,
  listEnrolled,
  enrolled,
  enrollmentById,
  enrollmentStats,
  listEnrolled,
  complete,
  read,
  isEnrollment,
  isStudent,
};

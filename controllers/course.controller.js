const course = require("../models/course");
const user = require("../models/user");
const lodash = require("lodash");
const errorHandler = require("./../helpers/dbErrorHandler");
const formidable = require("formidable");
const fs = require("fs");

const create = async (req, res) => {
  // console.log(req.body);
  // const newcourse = new course(req.body);
  // newcourse.instructor = req.user._id;
  // try {
  //   await newcourse.save();
  //   res.json({ data: newcourse });
  // } catch (error) {
  //   return res.status(400).json({
  //     error: errorHandler.getErrorMessage(error),
  //   });
  // }
  try {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err),
        });
      }
      const { name, description, category } = fields;
      const { image } = files;
      // console.log(image);
      let newCourse = new course({ name, description, category });
      newCourse.instructor = req.user._id;
      if (image) {
        if (image.size > 2000000) {
          return res.status(400).json({
            error: "Image should be less than 2mb",
          });
        }
        newCourse.image.data = fs.readFileSync(image.filepath);
        newCourse.image.contentType = image.mimetype;
      }

      try {
        newCourse.save((err, data) => {
          if (err || !data) {
            return res.status(400).json({ error: "Could not save course" });
          }
          return res.json(data);
        });
      } catch (error) {
        return res.status(400).json({ error: "Could not save course" });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const listByInstructor = (req, res) => {
  course
    .find({ instructor: req.user._id })
    .populate("instructor", "_id name")
    .exec((err, data) => {
      if (err || !data) {
        return res.status(400).json({ error: "Could not get links" });
      }
      res.json(data);
    });
};
const courseById = (req, res, next, id) => {
  try {
    course
      .findById(id)
      .populate("instructor", "_id name")
      .exec((err, data) => {
        if (err || !data) {
          return res.status(400).json({ error: "Could not get links" });
        }
        req.course = data;
        next();
      });
  } catch (error) {
    console.log(error);
  }
};
const read = (req, res) => {
  return res.json(req.course);
};
const isCourseAuthorized = async (req, res, next) => {
  console.log(req.user, req.course);
  try {
    const isInstructor =
      req.course && req.user && req.course.instructor._id == req.user._id;
    console.log(isInstructor);
    if (!isInstructor) {
      return res.status(400).json({ error: "User is not authorized" });
    }
    next();
  } catch (error) {
    console.log(error);
  }
};
const newLesson = (req, res) => {
  try {
    const lesson = req.body;
    course
      .findByIdAndUpdate(
        req.course._id,
        { $push: { lessons: lesson } },
        { new: true }
      )
      .populate("instructor", "_id name")
      .exec((err, data) => {
        if (err || !data) {
          return res.status(400).json({ error: "Could not create lessons" });
        }
        res.json(data);
      });
  } catch (error) {
    console.log(error);
  }
};
const photo = (req, res, next) => {
  res.set("Content-Type", req.course.image.contentType);
  return res.send(req.course.image.data);
};
// const update = (req, res) => {
//   let { name, description, category, lessons, published } = req.body;
//   if (!published) {
//     published = false;
//   }
//   course
//     .findByIdAndUpdate(
//       req.course._id,
//       { name, description, category, lessons, published },
//       { new: true }
//     )
//     .populate("instructor", "_id name")
//     .exec((err, data) => {
//       if (err || !data) {
//         return res.status(400).json({ error: "Could not update course" });
//       }
//       res.json(data);
//     });
// };
const update = async (req, res) => {
  let myCourse = await course
    .findOne({ _id: req.course._id })
    .populate("instructor", "_id name");
  if (!myCourse) {
    return res.status(400).json({ error: "Could not update course" });
  }
  myCourse = lodash.extend(myCourse, req.body);
  try {
    await myCourse.save();
    res.json(myCourse);
  } catch (error) {
    console.log(error);
  }
};
const remove = (req, res) => {
  course.findByIdAndDelete(req.params.courseId).exec((err, data) => {
    if (err || !data) {
      return res.status(400).json({ error: "Could not update course" });
    }
    res.json(data);
  });
};
const getPublished = (req, res) => {
  course
    .find({ published: true })
    .populate("instructor", "_id name")
    .exec((err, data) => {
      if (err || !data) {
        return res
          .status(400)
          .json({ error: "Could not find published courses" });
      }
      res.json(data);
    });
};

module.exports = {
  update,
  remove,
  getPublished,
  create,
  newLesson,
  read,
  listByInstructor,
  isCourseAuthorized,
  getPublished,
  photo,
  courseById,
};

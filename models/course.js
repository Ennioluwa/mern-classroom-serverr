const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema({
  title: String,
  content: String,
  resource_url: String,
});
const Lesson = mongoose.model("Lesson", LessonSchema);
const CourseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: ["Name is required"],
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      url: String,
      id: String,
    },
    category: {
      type: String,
      required: ["Category is required"],
    },
    published: {
      type: Boolean,
      default: false,
    },
    instructor: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    image: {
      data: Buffer,
      contentType: String,
    },
    lessons: [LessonSchema],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Course", CourseSchema);

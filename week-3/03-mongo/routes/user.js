const { Router } = require("express");
const mongoose = require("mongoose");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");

// User Routes
router.post("/signup", (req, res) => {
  // Implement user signup logic
  const username = req.body.username;
  const password = req.body.password;

  User.create({ username, password }).then(() => {
    res.json({ message: "User Created Successfully." });
  });
});

router.get("/courses", (req, res) => {
  // Implement listing all courses logic
  Course.find({}).then((response) => {
    res.json({
      courses: response,
    });
  });
});

router.post("/courses/:courseId", userMiddleware, (req, res) => {
  // Implement course purchase logic
  const courseId = req.params.courseId;
  const username = req.headers.username;

  User.updateOne(
    { username: username },
    {
      $push: {
        // purchasedCourses: new mongoose.Types.ObjectId(courseId),
        purchasedCourse: courseId,
      },
    }
  )
    .then(() => {
      res.json({
        message: "Purchased Complete!",
      });
    })
    .catch((e) => {
      console.log(e);
    });
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  // Implement fetching purchased courses logic
  const user = await User.findOne({
    username: req.headers.username,
  });

  console.log(user.purchasedCourse);
  const courses = await Course.find({
    _id: {
      $in: user.purchasedCourse,
    },
  });

  res.json({
    courses: courses,
  });
});

module.exports = router;

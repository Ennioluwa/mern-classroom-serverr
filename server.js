const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const userRoute = require("./routes/user.route");
const authRoute = require("./routes/auth.route");
const courseRoute = require("./routes/course.route");
const enrollmentRoute = require("./routes/enrollment.route");
require("dotenv").config();

// import cors from "cors";
// import mongoose from "mongoose";
// import cookieParser from "cookie-parser";
// import userRoute from "./routes/user.route";
// import authRoute from "./routes/auth.route";
// import courseRoute from "./routes/course.route";
// import enrollmentRoute from "./routes/enrollment.route";

// create express app
const app = express();

// db
const db = process.env.DATABASE;
mongoose
  .connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true, //make this true
    autoIndex: true,
  })
  .then(() => console.log("**DB CONNECTED**"))
  .catch((err) => console.log("DB CONNECTION ERR => ", err));

// apply middlewares
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// route
// readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));
app.use("/", userRoute);
app.use("/", authRoute);
app.use("/", courseRoute);
app.use("/", enrollmentRoute);
// csrf

// app.get("/api/csrf-token", (req, res) => {
//   res.json({ csrfToken: req.csrfToken() });
// });
// app.use((err, req, res, next) => {
//   if (err.name === "UnauthorizedError") {
//     res.status(401).json({ error: err.name });
//   } else {
//     console.log(err);
//   }
// });
// port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));

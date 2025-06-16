import express from "express";
import cookieParser from "cookie-parser";
const app = express();
import secrets from "./config/secrets.js";
const { port } = secrets;
import connectDB from "./config/db.js";
//routers
import adminRouter from "./routes/admin.js";
import userRouter from "./routes/user.js";
import registrationRouter from "./routes/registration.js";
import HomeRouter from "./routes/home.js";
//middlewares
import adminAuth from "./middlewares/adminAuth.js";
import userAuth from "./middlewares/userAuth.js";

app.use(express.static("public")); // to read static files (css ,js ,img)
app.use(express.json()); // to read req.body
app.use(express.urlencoded({ extended: true })); // to read req.body
app.use(cookieParser());
import jwt from "jsonwebtoken";
import userModel from "./models/User.js"; // make sure path is correct
import secrets from "./config/secrets.js";

app.use(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, secrets.jwtSecret);
      const user = await userModel.findById(decoded.id).lean();
      res.locals.user = user;
    } catch (err) {
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
});

app.set("view engine", "ejs"); // to set view engine to ejs

app.get("/", (req, res) => {
  res.render("./index.ejs", { title: "Home Page" });
});


app.use("/", registrationRouter);
app.use("/", HomeRouter);
app.use("/admin", adminAuth, adminRouter);
app.use("/user", userAuth, userRouter);

app.use((req, res, next) => {
  res.status(404).render("404");
});

app.listen(port, () => {
  connectDB();
  console.log(`Example app listening on port ${port}`);
});

import userChatRouter from "./routes/user.js";
app.use("/user", userChatRouter);

res.render("./index.ejs", { title: "Home Page", user });

const express = require("express");
const cookieParser = require("cookie-parser");
const dbConnect = require("./services/dbconnection");
const path = require("path");
const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const { checkForCookieAuth } = require("./middlewares/authentication");
const blog = require("./models/blog");

const app = express();
const PORT = 8001;

dbConnect();
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForCookieAuth("token"));
app.use(express.static(path.resolve("./public")))
app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.get("/", async (req, res) => {
  const allBlogs = await blog.find({})
  res.render("index",{
    user:req.user,
    blogs:allBlogs
  });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/`);
});

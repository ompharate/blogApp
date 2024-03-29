const { Router } = require("express");
const blog = require("../models/blog");
const comment = require("../models/comment");
const path = require("path");
const multer = require("multer");
const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });

router.get("/view/:id", async (req, res) => {
  const blogData = await blog.findById(req.params.id);
  const commentData = await comment.find({blogId:req.params.id}).populate("createdBy");
  console.log(commentData)
  if (!blogData) return res.send("no blog found");
  return res.render("blog", {
    blogData,
    commentData,
    user: req.user,
  });
});

router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.post("/add-new", upload.single("coverImageURL"), async (req, res) => {
  console.log(req.file);
  if (!req.body) return res.send("all filed are required");

  await blog.create({
    ...req.body,
    coverImageURL: `uploads/${req.file.filename}`,
    createdBy: req.user._id,
  });

  res.redirect("/");
});

router.post("/comment/:id", async (req, res) => {
  console.log(req.body);
  if (!req.body) return res.send("all fields are required");
  await comment.create({
    content: req.body.content,
    blogId: req.params.id,
    createdBy: req.user._id,
  });

  return res.redirect(`/blog/view/${req.params.id}`);
});

module.exports = router;

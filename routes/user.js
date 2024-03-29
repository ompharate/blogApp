const { Router } = require("express");
const user = require("../models/user");
const bcrypt = require("bcrypt");
const { createTokenForUser } = require("../services/authentication");
const router = Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});
router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.get("/logout",(req,res)=>{
  res.clearCookie("token").redirect("/")
})

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  let isUser;
  try {
    isUser = await user.findOne({ email: email });
    if (!isUser) return res.status(404).send("user not found");
  } catch (error) {
    return res.send({ err: error });
  }

  const isMatch = await bcrypt
    .compare(password, isUser.password)
    .then((result) => {
      if (result) return true;
      else return false;
    });

  if (isMatch) {
    // login user
    const token = createTokenForUser(isUser);
    return res.cookie("token", token).redirect("/");
  } else {
    // redirect to login
    res.render("signin", {
      error: "incorrect user and password or user does not exits",
    });
  }
});

router.post("/signup", async (req, res) => {
  console.log("printing req.body object ->", req.body);
  const { fullName, email, password } = req.body;

  const hashedPassword = await bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      return hashedPassword;
    });
  await user.create({
    fullName,
    email,
    password: hashedPassword,
  });

  return res.redirect("/");
});
module.exports = router;

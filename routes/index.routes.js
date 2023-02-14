const express = require('express');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


//add route to profile view
router.get("/profile", (req, res, next) => {
  const user = req.session.user
  res.render("profile", { user: user })
})





module.exports = router;

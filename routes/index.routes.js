const express = require('express');
const { isLoggedIn } = require('../middleware/route-guard');
const router = express.Router();
const User = require("../models/User.model");


/* GET home page */
router.get("/", (req, res, next) => {

  if(req.session.user){
  let user = req.session.user._id
  User.findById(user)
  .then(userFound=> {
      res.render("index", {user: userFound, layout: "layout2"});
  })
}
else{
  res.render("index", {layout: "layout"})
}
});


//add route to profile view

router.get("/profile", isLoggedIn, (req, res, next) => {
  const user = req.session.user._id
    console.log("USER:",user)
  User.findById(user)
  .populate("music")
  .then(userFromDB => {
    res.render("profile", {user: userFromDB })
  })
})





module.exports = router;

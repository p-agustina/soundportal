const router = require("express").Router()
const User = require("../models/User.model")
const bcrypt = require("bcryptjs")
const Song = require("../models/Song.model")

//upload to cloudinary
const { uploader, cloudinary } = require("../config/cloudinary.config")


router.get("/auth/signup", (req, res, next) => {
      res.render("signup")
    })

router.post("/auth/signup",uploader.single("profileImgURL"), (req, res, next) => {
        const { username, password, name, email } = req.body

let profileImgURL
    //uploaded image
    if(req.file?.path != undefined){
        profileImgURL = req.file.path}
    else{
      profileImgURL = "/images/default-profile-pic.png"
    }
        
    // Validation
    // Check if username is empty
        if (username === "") {
        res.render("signup", { message: "Username cannot be empty" })
        return
    }

    if (password.length < 4) {
        res.render("signup", { message: "Password has to be minimum 4 characters" })
        return
    }

    // Check if password is strong:
    // const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/
    // if(!regex.test(password))

    // Validation passed
    // Check if username is already taken
    User.findOne({ username })
    .then(userFromDB => {
        console.log(userFromDB)

        if (userFromDB !== null) {
        res.render("signup", { message: "Username is already taken" })
        } else {
        // Username is available
        // Hash password
        const salt = bcrypt.genSaltSync()
        const hash = bcrypt.hashSync(password, salt)
        console.log(hash)

        // Create user
        User.create({ username: username, password: hash, name, email, profileImg: profileImgURL})
            .then(createdUser => {
            console.log(createdUser)
            res.redirect("/auth/login")
            })
            .catch(err => {
            next(err)
            })
        }
    })
})

//added route to render login view
router.get("/auth/login", (req, res, next) => {
    res.render("login")
})

router.post("/auth/login", (req, res, next) => {
    const { username, password } = req.body

    // Find user in database by username
  User.findOne({ username })
  .then(userFromDB => {
    if (userFromDB === null) {
      // User not found in database => Show login form
      res.render("login", { message: "Wrong credentials" })
      return
    }

    // User found in database
    // Check if password from input form matches hashed password from database
    if (bcrypt.compareSync(password, userFromDB.password)) {
      // Password is correct => Login user
      // req.session is an object provided by "express-session"
      req.session.user = userFromDB
      res.redirect("/profile")
    } else {
      res.render("login", { message: "Wrong credentials" })
      return
    }
  })
})

router.get("/auth/logout", (req, res, next) => {
    // Logout user
    req.session.destroy()
    res.redirect("/")
  })




module.exports = router;
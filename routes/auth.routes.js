const router = require("express").Router()
const User = require("../models/User.model")
const bcrypt = require("bcryptjs")

//upload to cloudinary
const { uploader, cloudinary } = require("../config/cloudinary.config")




router.get("/auth/signup", (req, res, next) => {
    res.render("signup")
    })

router.post("/auth/signup",uploader.single("profileimage"), (req, res, next) => {
        const { username, password, name, email } = req.body


    //uploaded image
        const imgPath = req.file.path

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
        User.create({ username: username, password: hash, name, email, profileImg:imgPath  })
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



module.exports = router;
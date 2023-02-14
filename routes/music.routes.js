const express = require('express');
const router = express.Router();
//required the Song and User model to use them in the routes
const Song = require("../models/Song.model");
const User = require("../models/User.model");

//to upload to cloudinary
const { uploader,musicuploader, cloudinary } = require("../config/cloudinary.config")

//create route to render the form to add a song when the link on the index.hbs is clicked

router.get("/music/add-song", (req, res) => {
    res.render("music/add-song");
})






//set new post route to creat a new song with input from the form
//chequear como crear el author en base al username

router.post("/songs", uploader.single("songFileURL"),(req, res, next) => {
    const {title, author, genre} = req.body
    const songFileURL = req.file.path
    
    console.log(req.session)
    const id = req.session.user._id
    console.log("userid: ", req.session.user._id)
    Song.create({title, genre, songURL: songFileURL, author})
    .then(createdSong => {
        console.log("song: ", createdSong._id)
        User.findByIdAndUpdate(req.session.user._id, { $push: { music: createdSong._id } })
        .then(updatedUser => {
            res.redirect("/profile")
        })

    })  
    .catch(err => {
        next(err)
        })     
})



module.exports = router;
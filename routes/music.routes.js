const express = require('express');
const router = express.Router();
//required the Song and User model to use them in the routes
const Song = require("../models/Song.model");
const User = require("../models/User.model");

//to upload to cloudinary
const { uploader, cloudinary } = require("../config/cloudinary.config")

//create route to render the form to add a song when the link on the index.hbs is clicked

router.get("/music/add-song", (req, res) => {
    res.render("music/add-song");
})

//set new post route to creat a new song with input from the form
//chequear como crear el author en base al username

router.post("/songs", (req, res, next) => {
    const {title, author, genre, coverImgURL, songFileURL} = req.body
    const id = 

    Song.create({title, genre, coverImgURL, songFileURL, author})
    .then(createdSong => {
        res.render("profile")
    })       
})



module.exports = router;
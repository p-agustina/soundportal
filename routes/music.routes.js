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

//render a form to edit the songs

router.get("/music/edit/:id", (req, res, next) => {
    const id = req.params.id

    Song.findById(id) 
    .then(songFromDB => {
        res.render("music/edit", {song: songFromDB})
    })
    .catch(err => next(err))
})

// edit the song's details

router.post("/music/edit/:id", (req, res, next) => {
    const id = req.params.id;
    const {title, author, genre} = req.body;

    Song.findByIdAndUpdate(id, {title, author, genre},{new: true})
    .then(updatedSong => {
        res.redirect("/profile");
    })
    .catch(err => next(err));
})

// delete a song from profile

router.get("/music/:id/delete", (req, res, next) => {
    const id = req.params.id;

    Song.findByIdAndRemove(id)
    .then(deletedSong => {
        res.redirect("/profile");
    })
})

//add route to show the results from the search bar

// router.get("/music/search-song", (req, res, next) => {
//     res.render("music/search-song")
// })

//add route to find a song searched for on the search bar in the index view
//aca seguro haya que agregar algo con la id de la cancion

router.post("/music/search-song", (req, res, next) => {
    const query = req.body
    console.log(query)

    Song.find({title: {$regex: "query"}})
    .then(songsFromDB => {
        console.log("ESTO ES LO QUE ENCONTRO", songsFromDB)
        if (songsFromDB !== null) {
            res.render("music/search-song", {songs: songsFromDB})
        }
    })
    .catch(err => next(err))
    //add message if song isn't found

})

module.exports = router;
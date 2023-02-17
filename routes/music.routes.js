const express = require('express');
const router = express.Router();
//required the Song and User model to use them in the routes
const Song = require("../models/Song.model");
const User = require("../models/User.model");
const { isLoggedIn } = require('../middleware/route-guard');

//to upload to cloudinary
const { uploader,musicuploader, cloudinary } = require("../config/cloudinary.config")

//create route to render the form to add a song when the link on the index.hbs is clicked

router.get("/music/add-song",isLoggedIn, (req, res) => {
    let user = req.session.user._id

    let genre=  ["rock", "pop", "techno", "dance", "melodic", "hip-hop", "reggae", "country","folk", "indie", "house", "other"]
    
    User.findById(user)
    .then(userFound=> {
        res.render("music/add-song", {user: userFound, genre:genre});
    })

})

//set new post route to creat a new song with input from the form
//chequear como crear el author en base al username

router.post("/songs", uploader.any([{ name: "songFileURL" }, { name: "coverImgURL" }]),(req, res, next) => {
    const {title, author, genre} = req.body
    const files = req.files
    console.log("LAS FILESSS!", files)
    
    const songFileURL = files[0].path
    let coverImgURL

    if(req.files[1]?.path != undefined){
        coverImgURL = files[1].path}
    else{
        coverImgURL = "/images/song-placeholder-img.jpg"
    }


    console.log(req.session)
    const id = req.session.user._id
    console.log("userid: ", req.session.user._id)

    Song.create({title, genre, songURL: songFileURL,coverImgURL, author})
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

router.get("/music/edit/:id", isLoggedIn,(req, res, next) => {
    const id = req.params.id
    let user = req.session.user._id
    let genre=  ["rock", "pop", "techno", "dance", "melodic", "hip-hop", "reggae", "country","folk", "indie", "house", "other"]
    
    User.findById(user)
    .then(userFound=> {
        return user= userFound
    })

    Song.findById(id) 
    .then(songFromDB => {
        res.render("music/edit", { user:user, song: songFromDB, genre : genre})
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

router.get("/music/:id/delete", isLoggedIn,(req, res, next) => {
    const id = req.params.id;

    Song.findByIdAndRemove(id)
    .then(deletedSong => {
        res.redirect("/profile");
    })
})

//add route to find a song searched for on the search bar in the index view
//aca seguro haya que agregar algo con la id de la cancion


router.post("/music/search-song", (req, res, next) => {
    const {query} = req.body
    let user = req.session.user._id
    
    
    User.findById(user)
    .then(userFound=> {
        return user= userFound
    })

    Song.find({"title": {$regex: query, $options: "i" }})
    .then(songsFromDB => {
        if (songsFromDB.length !== 0) {
            res.render("music/search-song", {user:user, songs: songsFromDB})
        }
        else res.render("music/search-song", {user:user, message: "We have no match for your search. Try again:"})
    })
    .catch(err => next(err))
})

router.get("/music/all-music", (req, res,next) => {
    let user = req.session.user._id
    
    User.findById(user)
    .then(userFound=> {
        return user= userFound
    })

    Song.find()
    .then(allSongs => {
        res.render("music/all-music", {user: user, song:allSongs});
    })
    .catch(err => next(err))
})

router.post("/music/playlist", (req, res, next) => {
    const user = req.session.user._id
    const {song} = req.body

    User.findByIdAndUpdate(user, {$push: {playlist: song[0]}})
    .then(updatedUser => {
        console.log(updatedUser)
        res.redirect("/user/playlist")
    })
})

router.get("/user/playlist", isLoggedIn,(req, res, next) => {
    const user = req.session.user._id
    
    User.findById(user)
    .populate("playlist")
    .then(userFromDB => {
        res.render("music/playlist", {user: userFromDB })
    })
})   


module.exports = router;
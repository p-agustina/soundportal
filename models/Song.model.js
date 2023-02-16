const {Schema, model} = require("mongoose")

const songSchema = new Schema (
    {
        title: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true
        },
        coverImgURL: {
            type: String            
        },
        
        genre: {
            type: String,
            enum: ["rock", "pop", "techno", "dance", "melodic", "hip-hop", "reggae", "country","folk", "indie", "house", "other"],
        },
        songURL: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }

)

const Song = model("Song", songSchema);

module.exports = Song;

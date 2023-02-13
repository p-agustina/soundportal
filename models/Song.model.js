const {Schema, model} = require("mongoose")

const songSchema = new Schema (
    {
        title: {
            type: String,
            required: true
        },
        author: {
            type: Schema.Types.ObjectId,
		    ref: 'User',
        },
        coverImgURL: {
            type: String            
        },
        genre: {
            type: String,
            required: true
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

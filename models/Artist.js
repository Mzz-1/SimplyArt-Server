const mongoose = require("mongoose");

const exhibitionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
});

const artistSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    biography: {
        type: String,
        required: true,
        trim: true,
    },
    aboutArtist: {
        type: String,
        required: true,
        trim: true,
    },
    profilePhoto: {
        type: String,
    },
    email: {
        type: String,
    },
    instagram: {
        type: String,
    },
    linkedin: {
        type: String,
    },
    exhibitions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exhibition",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Exhibition = mongoose.model("Exhibition", exhibitionSchema);
const Artist = mongoose.model("Artist", artistSchema);

module.exports = { Exhibition, Artist };

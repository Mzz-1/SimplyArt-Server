require("dotenv").config();
const connectDB = require("../db/Connect");
const jwt = require("jsonwebtoken");
const connectCloudinary = require("../db/Cloudinary");
const cloudinary = require("cloudinary").v2;
const { Artist, Exhibition } = require("../models/Artist");
const Product = require("../models/Products");
const multer = require("multer");

const upload = multer({ dest: null });

const getArtistProduct = {
    path: "/api/artist-products/:id",
    method: "get",
    handler: async (req, res) => {
        const { id: artistName } = req.params;
        const product = await Product.find({ artist: artistName });
        if (!product) {
            return res.sendStatus(400);
        }
        res.status(200).json({ product });
    },
};

const addBiography = {
    path: "/api/biography",
    method: "post",
    handler: [
        upload.single("image", { dest: null }),
        async (req, res) => {
            const { userID, name, aboutContent, biography } = req.body;
            const file = req.file;
            connectCloudinary();

            const upload = await cloudinary.uploader.upload(file.path, {
                folder: "artist",
            });

            //const url = cloudinary.url(name);
            console.log("node 1");
            console.log(name, aboutContent, biography);

            const artist = await Artist.create({
                userID,
                name,
                aboutArtist: aboutContent,
                biography,
                profilePhoto: upload.secure_url,
            });
            console.log("node 2");
            res.sendStatus(200);
        },
    ],
};

const getBiography = {
    path: "/api/biography/:id",
    method: "get",
    handler: async (req, res) => {
        const { id } = req.params;
        let artist = await Artist.findOne({ _id: id });
        if (!artist) {
            artist = await Artist.findOne({ userID: id });
            if (!artist) {
                return res.sendStatus(400);
            }
        }
        res.status(200).json({ artist });
    },
};

const addArtistEvent = {
    path: "/api/add-artist-event",
    method: "post",
    handler: [
        upload.single("image", { dest: null }),
        async (req, res) => {
            const { userID, name, startDate, endDate, location } = req.body;
            const file = req.file;
            connectCloudinary();

            const upload = await cloudinary.uploader.upload(file.path, {
                folder: "artist events",
            });

            //const url = cloudinary.url(name);
            console.log("node 1");
            console.log(name, startDate, endDate, location);

            const exhibition = await Exhibition.create({
                name,
                startDate,
                endDate,
                location,
                image: upload.secure_url,
            });

            const artist = await Artist.findOne({ userID });
            artist.exhibitions.push(exhibition);
            await artist.save();
            console.log("node 2");
            res.sendStatus(200);
        },
    ],
};

const updateArtistEvent = {
    path: "/api/update-artist-event/:id",
    method: "patch",
    handler: [
        upload.single("image", { dest: null }),
        async (req, res) => {
            const { userID, name, startDate, endDate, location } = req.body;
            const file = req.file;
            const { id: eventID } = req.params;
            connectCloudinary();

            const upload = await cloudinary.uploader.upload(file.path, {
                folder: "artist events",
            });

            //const url = cloudinary.url(name);
            console.log("node 1");
            console.log(name, startDate, endDate, location);

            const exhibition = await Exhibition.findOneAndUpdate(
                { _id: eventID },
                {
                    name,
                    startDate,
                    endDate,
                    location,
                    image: upload.secure_url,
                },
                {
                    new: true,
                    runValidators: true,
                    useFindAndModify: true,
                }
            );

            console.log("node 2");
            res.status(200).json({ exhibition });
        },
    ],
};

const getAllArtists = {
    path: "/api/artists",
    method: "get",
    handler: async (req, res) => {
        const { name } = req.query;
        let query = {};
        if (name) {
            query.name = new RegExp(name, "i");
        }
        let result = Artist.find(query);

        const page = Number(req.query.page) || 1;

        const limit = Number(req.query.limit) || 6;

        const skip = (page - 1) * limit;

        result = result.skip(skip).limit(limit);

        const total = await Artist.countDocuments(query);

        const artist = await result;

        res.status(200).json({ artist, total });
    },
};

const getArtistExhibitions = {
    path: "/api/artist-exhibitions/:id",
    method: "get",
    handler: async (req, res) => {
        const { id: artistID } = req.params;

        let artist = await Artist.findOne({ _id: artistID }).populate(
            "exhibitions"
        );
        if (!artist) {
            artist = await Artist.findOne({ userID: artistID }).populate(
                "exhibitions"
            );
            if (!artist) {
                return res.sendStatus(400);
            }
        }
        const exhibitions = artist.exhibitions;
        res.status(200).json({ exhibitions });
    },
};

const getExhibitions = {
    path: "/api/exhibitions/:id",
    method: "get",
    handler: async (req, res) => {
        const { id: exhibitionID } = req.params;
        const exhibition = await Exhibition.findOne({ _id: exhibitionID });

        res.status(200).json({ exhibition });
    },
};

const deleteExhibition = {
    path: "/api/artist-exhibitions/:id",
    method: "delete",
    handler: async (req, res) => {
        const { id: exhibitionID } = req.params;
        const exhibition = await Exhibition.findOneAndDelete({
            _id: exhibitionID,
        });
        if (!exhibition) {
            return res.sendStatus(400);
        }
        res.status(200).json({ exhibition });
    },
};

const getArtist = {
    path: "/api/artist/:id",
    method: "get",
    handler: async (req, res) => {
        const { id: userID } = req.params;
        const artist = await Artist.findOne({ userID: userID });
        if (!artist) {
            return res.sendStatus(400);
        }
        res.status(200).json({ artist });
    },
};

const updateBiography = {
    path: "/api/biography/:id",
    method: "patch",
    handler: [
        upload.single("image", { dest: null }),
        async (req, res) => {
            const { id: bioID } = req.params;
            const { userID, name, aboutContent, biography } = req.body;
            console.log(name, aboutContent, biography);
            const file = req.file;
            connectCloudinary();

            const upload = await cloudinary.uploader.upload(file.path, {
                folder: "artist",
            });

            console.log(bioID);

            const bio = await Artist.findOneAndUpdate(
                { userID: bioID },
                {
                    name,
                    aboutContent,
                    biography,
                    profilePhoto: upload.secure_url,
                },
                {
                    new: true,
                    runValidators: true,
                    useFindAndModify: false,
                }
            );

            if (!bio) {
                return res.status(404);
            }

            res.status(200).json({ bio });
        },
    ],
};

module.exports = {
    addBiography,
    updateBiography,
    getAllArtists,
    getArtist,
    getArtistExhibitions,
    addArtistEvent,
    getBiography,
    deleteExhibition,
    updateArtistEvent,
    getExhibitions,
    getArtistProduct,
};

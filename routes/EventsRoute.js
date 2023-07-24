require("dotenv").config();
const connectDB = require("../db/Connect");
const jwt = require("jsonwebtoken");
const connectCloudinary = require("../db/Cloudinary");
const cloudinary = require("cloudinary").v2;
const Event = require("../models/Events");
const multer = require("multer");
const sendEventsEmail = require("../Utils/SendInBlue");
const User = require("../models/User");

const upload = multer({ dest: null });

const addEvents = {
    path: "/api/events",
    method: "post",
    handler: [
        upload.single("image", { dest: null }),
        async (req, res) => {
            const {
                name,
                place,
                location,
                image,
                startDate,
                endDate,
                startTime,
                endTime,
            } = req.body;
            const file = req.file;

            connectCloudinary();

            const upload = await cloudinary.uploader.upload(file.path, {
                folder: "events",
            });

            const event = await Event.create({
                name,
                place,
                location,
                url: upload.secure_url,
                startDate,
                endDate,
                startTime,
                endTime,
            });

            const users = await User.find({ receiveEmail: true });

            sendEventsEmail({
                users: users,
                name: name,
                location: location,
                startDate: startDate,
                endDate: endDate,
                image: upload.secure_url,
            });

            console.log("node 2");
            res.sendStatus(200);
        },
    ],
};

const getAllEvents = {
    path: "/api/events",
    method: "get",
    handler: async (req, res) => {
        const event = await Event.find({});

        res.status(200).json({ event });
    },
};

const getEvent = {
    path: "/api/events/:id",
    method: "get",
    handler: async (req, res) => {
        const { id: eventID } = req.params;
        const event = await Event.findOne({ _id: eventID });
        if (!event) {
            return res.sendStatus(400);
        }
        res.status(200).json({ event });
    },
};

const updateEvents = {
    path: "/api/events/:id",
    method: "patch",
    handler: [
        upload.single("image", { dest: null }),
        async (req, res) => {
            const { id: eventID } = req.params;
           
            const {
                name,
                place,
                location,
                startDate,
                endDate,
                startTime,
                endTime,
            } = req.body;
            const file = req.file;
            connectCloudinary();

            const upload = await cloudinary.uploader.upload(file.path, {
                folder: "events",
            });
            console.log(req.body);
         
            const event = await Event.findOneAndUpdate(
                { _id: eventID },
                {
                    name,
                    place,
                    location,
                    url: upload.secure_url,
                    startDate,
                    endDate,
                    startTime,
                    endTime,
                },
                {
                    new: true,
                    runValidators: true,
                    useFindAndModify: true,
                }
            );

            console.log(2);

            if (!event) {
                return res.status(404);
            }

            res.status(200).json({ event });
        },
    ],
};

const deleteEvent = {
    path: "/api/events/:id",
    method: "delete",
    handler: async (req, res) => {
        const { id: eventID } = req.params;
        const event = await Event.findOneAndDelete({ _id: eventID });
        if (!event) {
            return res.sendStatus(400);
        }
        res.status(200).json({ event });
    },
};

module.exports = {
    addEvents,
    getAllEvents,
    getEvent,
    updateEvents,
    deleteEvent,
};

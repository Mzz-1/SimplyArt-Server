const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const eventsSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name must be provided"],
    },
    place: {
        type: String,
        required: [true, "Place must must be provided"],
    },
    location: {
        type: String,
        required: [true, "Location must be provided"],
    },
    // description: {
    //     type: String,
    //     required: [true, "password must be provided"],
    // },
    url: {
        type: String,
    },
    startDate: {
        type: Date,
        required: [true, "Start date must be provided"],
    },
    endDate: {
        type: Date,
        required: [true, "End date must be provided"],
    },
    startTime: {
        type: String,
        required: [true, "Start time must be provided"],
    },
    endTime: {
        type: String,
        required: [true, "End time must be provided"],
    },
});

module.exports = mongoose.model("Events", eventsSchema);

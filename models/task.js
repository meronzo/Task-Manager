const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    month: {
        type: Number,
        required: true,
    },
    date: {
        type: Number,
        required: true,
    },
    content: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model("Task", TaskSchema);
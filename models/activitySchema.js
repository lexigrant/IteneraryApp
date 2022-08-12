const mongoose = require("mongoose")

const activitySchema = mongoose.Schema({
    name: String,
    description: String,
    address: String,
    cost: Number
})

const Activity = mongoose.model("Activity", activitySchema)

module.exports = Activity

const mongoose = require("mongoose")
const Trip = require("./tripSchema")


const itenerarySchema = new mongoose.Schema({
    name: String,
    trips: [Trip.schema],
    startDate: Date,
    endDate: Date,
    party: Number,
})

const Itenerary = mongoose.model("Itenerary", itenerarySchema)

module.exports = Itenerary
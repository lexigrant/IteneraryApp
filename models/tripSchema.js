const mongoose  = require("mongoose")
const Activity = require("./activitySchema")

const tripSchema = new mongoose.Schema({
    name: String,
    transportationTo: String,
    transportation: String,
    lodging: String,
    activities: [Activity.schema]
})

const Trip = mongoose.model("Trip", tripSchema);
module.exports = Trip;
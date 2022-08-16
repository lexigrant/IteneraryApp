//___________________
//Dependencies
//___________________
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Itenerary = require("./models/itenerarySchema");
const Trip = require("./models/tripSchema");
const Activity = require("./models/activitySchema");
const itenerarySeed = require("./models/itenerary");
const { response } = require('express');
const app = express();
const db = mongoose.connection;
require('dotenv').config()
//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3003;

//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI);

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

//___________________
//Middleware
//___________________

//use public folder for static assets
app.use(express.static('public'));

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: true }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project

//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form


//___________________
// Routes

// app.get("/itenerary/seed", (request, response)=> {
//     Itenerary.create(itenerarySeed, (error, data)=> {
//         console.log(error)
//         response.redirect("/itenerary")
//     })
// })
// delete for itenerary
app.delete("/itenerary/:id", (request, response) => {
    Itenerary.findByIdAndRemove(request.params.id, (error, data) => {
        response.redirect("/itenerary")
    })
})

// delete for trip
app.delete("/itenerary/:id/trip/:tripId", (request, response) => {
    Itenerary.findById(request.params.id, (error, foundItenerary) => {
        foundItenerary.trips.id(request.params.tripId).remove()
        foundItenerary.save();
        response.redirect(`/itenerary/${request.params.id}`)
    })
})

// create new trip
app.get("/itenerary/:id/trip/new", (request, response) => {
    response.render(
        "addTrip.ejs",
        {
            IteneraryId: request.params.id
        }
    )
})

app.post("/itenerary/:id/trip/new", (request, response) => {
    Itenerary.findById(request.params.id, (error, foundItenerary) => {
        foundItenerary.trips.push(request.body)
        foundItenerary.save()
        response.redirect(`/itenerary/${request.params.id}`)
    })
})

// create new activity
app.get("/itenerary/:id/trip/:tripId/activity/new", (request, response) => {
    response.render(
        "addActivity.ejs",
        {
            IteneraryId: request.params.id,
            TripId: request.params.tripId
        }
    )
})

app.post("/itenerary/:id/trip/:tripId/activity/new", (request, response) => {
    Itenerary.findById(request.params.id, (error, foundItenerary) => {
        const foundTrip = foundItenerary.trips.id(request.params.tripId)
        foundTrip.activities.push(request.body)
        foundItenerary.save()
        response.redirect(`/itenerary/${request.params.id}`)
    })
})


// Edit for trip
app.put("/itenerary/:id/trip/:tripId/", (request, response) => {
    Itenerary.findById(request.params.id, (error, foundItenerary) => {
        const foundTrip = foundItenerary.trips.id(request.params.tripId)
        foundTrip.set(request.body)
        foundItenerary.save()
        response.redirect(`/itenerary/${request.params.id}`)

    })

})


app.get("/itenerary/:id/trip/:tripId/edit", (request, response) => {
    Itenerary.findById(request.params.id, (error, foundItenerary) => {
        const foundTrip = foundItenerary.trips.id(request.params.tripId)
        response.render(
            "editTrip.ejs",
            {
                Trip: foundTrip,
                IteneraryId: foundItenerary._id
            }
        )
    })
})

// Edit Activity
app.put("/itenerary/:id/trip/:tripId/activity/:activityId/edit", (request, response) => {
    const params = request.params
    Itenerary.findById(params.id, (error, foundItenerary) => {
        const foundTrip = foundItenerary.trips.id(params.tripId)
        const foundActivity = foundTrip.activities.id(params.activityId)
        foundActivity.set(request.body)
        foundItenerary.save()
        response.redirect(`/itenerary/${params.id}`)
    })
})

app.get("/itenerary/:id/trip/:tripId/activity/:activityId/edit", (request, response)=> {

})

    // edit for itenerary
    app.put("/itenerary/:id", (request, response) => {
        Itenerary.findByIdAndUpdate(request.params.id, request.body, { new: true }, (error, updateItenerary) => {
            response.redirect("/itenerary")
        })
    })

    app.get("/itenerary/:id/edit", (request, response) => {
        Itenerary.findById(request.params.id, (error, foundItenerary) => {
            response.render(
                "editItenerary.ejs",
                {
                    Itenerary: foundItenerary
                }
            )
        })
    })
    // create new itenerary
    app.get("/itenerary/new", (request, response) => {
        response.render("new.ejs")
    })

    app.post("/itenerary/new", (request, response) => {
        Itenerary.create(request.body, (error, createItenerary) => {
            response.redirect("/itenerary")
        })
    })

    // Show Page show.ejs
    app.get("/itenerary/:id", (request, response) => {
        Itenerary.findById(request.params.id, (error, foundItenerary) => {
            response.render(
                "show.ejs",
                {
                    Itenerary: foundItenerary
                }
            )
        })
    })
    //  main page index.ejs
    app.get("/itenerary", (request, response) => {
        Itenerary.find({}, (error, allContents) => {
            console.log(allContents)
            response.render(
                "index.ejs",
                {
                    Itenerary: allContents
                }
            )
        })
    })

    //___________________
    //localhost:3000
    app.get('/', (request, response) => {
        response.redirect("/itenerary");
    });

    //___________________
    //Listener
    //___________________
    app.listen(PORT, () => console.log('Listening on port:', PORT));
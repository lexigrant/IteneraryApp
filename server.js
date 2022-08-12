//___________________
//Dependencies
//___________________
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const Itenerary = require("./models/itenerarySchema");
const Trip = require("./models/tripSchema");
const itenerarySeed = require("./models/itenerary");
const { response } = require('express');
const app = express ();
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

app.delete("/itenerary/:id", (request, response)=> {
    Itenerary.findByIdAndRemove(request.params.id, (error, data)=> {
        response.redirect("/itenerary")
    })
})

app.put("/trip/:id", (request, response)=> {
    Trip.findByIdAndUpdate(request.params.id, request.body, {new: true}, (error, updateItenerary)=> {
        console.log(error)
        response.redirect("/itenerary")
    })
})


app.get("/itenerary/:id/trip/:tripId/edit", (request, response)=> {
    Itenerary.findById(request.params.id, (error, foundItenerary)=> {
        const foundTrip = foundItenerary.trips.id(request.params.tripId)
        response.render(
            "editTrip.ejs",
            {
                Trip: foundTrip
            }
        )
    })
})

app.get("/itenerary/:id/edit", (request, response)=> {
    Itenerary.findById(request.params.id, (error, foundItenerary)=> {
        response.render(
            "edit.ejs",
            {
                Itenerary: foundItenerary
            }
        )
    })
})

app.get("/itenerary/new", (request, response)=> {
    response.render("new.ejs")
})

app.post("/itenerary/new", (request, response)=> {
    Itenerary.create(request.body, (error, createItenerary)=> {
        response.redirect("/itenerary")
    })
})


app.get("/itenerary/:id", (request, response)=> {
    Itenerary.findById(request.params.id, (error, foundItenerary)=> {
        response.render(
            "show.ejs",
            {
                Itenerary: foundItenerary
            }
        )
    })
})

app.get("/itenerary", (request, response)=> {
    Itenerary.find({}, (error, allContents)=> {
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
app.get('/' , (request, response) => {
  response.redirect("/itenerary");
});

//___________________
//Listener
//___________________
app.listen(PORT, () => console.log( 'Listening on port:', PORT));
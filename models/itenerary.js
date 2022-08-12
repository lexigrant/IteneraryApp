module.exports = [
    {
        name: "KC Trip",
        trips: [{
            name: "Kansas City, MO",
            transportationTo: "roundtrip from New York",
            transportation: "uber",
            lodging: "Loews Kansas City Hotel",
            activities: [{
                name: "Blue Sushi Sake Grill",
                description: "Dinner",
                address: "Westwood, Kansas",
                cost: 50,
            }]
        }, {
            name: "St. Louis, MO",
            transportationTo: "rent a car",
            transportation: "car",
            lodging: "Marriott St. Louis Grand",
            activities: [{
                name: "Six Flags St. Louis",
                description: "Theme Park",
                address: "Eureka, Missouri",
                cost: 73,
            }]
        }],
        startDate: new Date("08/12/2022"),
        endDate: new Date("08/15/2022"),
        party: 2,
    }
]
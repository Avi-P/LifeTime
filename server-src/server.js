const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const DayInfo = require('./DayInfo.js');

const cors = require('cors');

const app = express();

/* Middleware */
/* Used to allow CORS policy, requests from same origin */
app.use(cors({origin: 'http://localhost:3000'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* Mongo DB URL */
const mongo_url = 'mongodb://localhost/LifeTimeDB';

/* Used to enable CORS policy */
app.all("/*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/* Connects to mongodb */
mongoose.connect(mongo_url, { useNewUrlParser: true }, function(err) {
    if (err) {
        throw err;
    }
    else {
        console.log("Connected to " + mongo_url);
    }
});

/* Post method to enter information into the db */
app.post('/api/LifeTime/postInformation', async function(req, res, next) {

    let data = [];

    const {year, month, day, activityMap} = req.body;

    /* Constructs JSON array for which is inputted as part of the JSON object going into DB */
    for(let i = 0; i < activityMap.length; i++) {
        data.push({activity: activityMap[i].activity,
                    time_in: activityMap[i].time_in,
                    time_out: activityMap[i].time_out});
    }

    let newDate = new Date("" + year + "/" + month + "/" + day);

    const DayInfoVar= new DayInfo(
        {
            date: newDate,
            activityMap: data
        }
    );

    /* Saving into DB */
    DayInfoVar.save();

    console.log("Recorded " + newDate);

    res.send('Recorded');

    return;
});

/* Route to get information out of the DB for a specific day*/
app.post('/api/LifeTime/getInformation', async function(req, res, next) {

    const {year, month, day} = req.body;

    console.log("Information Single: " + new Date("" + year + "/" + month + "/" + day));

    /* Finds the data based on date and returns it */
    DayInfo.find({ date: new Date("" + year + "/" + month + "/" + day) }, function(err, ans) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(ans);
        }
    });

    return;
});

/* Route to get information out of the DB based on a range of data*/
app.post('/api/LifeTime/getDataRange', async function(req, res, next) {

    const {dateOneYear, dateOneMonth, dateOneDay, dateTwoYear, dateTwoMonth, dateTwoDay} = req.body;

    const firstDate = new Date(dateOneYear, dateOneMonth, dateOneDay, 0, 0);

    const secondDate = new Date(dateTwoYear, dateTwoMonth, dateTwoDay, 23, 59);

    console.log("Information Range: " + firstDate + " - " + secondDate);

    /* Finds the data based on date and returns it */
    DayInfo.find({ date: {$lt: secondDate, $gte: firstDate}}, function(err, ans) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(ans);
            res.send(ans);
        }
    });

    return;
});

/* Server listens on port 8080 */
app.listen(8080);
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const DayInfo = require('./DayInfo.js');

const app = express();

/* Middleware */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const mongo_url = 'mongodb://localhost/LifeTimeDB';

/* Connects to mongodb */
mongoose.connect(mongo_url, { useNewUrlParser: true }, function(err) {
    if (err) {
        throw err;
    }
    else {
        console.log("Connected to " + mongo_url);
    }
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.post('/api/LifeTime/postInformation', async function(req, res) {

    let data = [];

    const {year, month, day, activityMap} = req.body;

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

    //console.log(DayInfoVar);

    DayInfoVar.save();

    console.log("Recorded");

    res.send('Recorded');

    return;
});

app.get('/api/LifeTime/getInformation', async function(req, res) {

    console.log(req.body);

    const {year, month, day} = req.body;

    DayInfo.find({ date: new Date("" + year + "/" + month + "/" + day) }, function(err, ans) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(ans);
            res.send(ans);
        }
    });

    //res.send("No data");

    return;
});

app.listen(8080);


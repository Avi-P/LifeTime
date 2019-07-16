const mongoose = require('mongoose');

/* Schema to store information about activities */
const DayInfo = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now,
        required: true,
        unique: true
    },
    activityMap : [{
        activity: String,
        time_in: Number,
        time_out: Number
    }]
});

/* Save function into db */
DayInfo.pre('save', function(next) {
    next();
});

module.exports = mongoose.model("DayInfo", DayInfo);
import React from "react"

import NavBar from "../../Components/NavBar"
import Calendar from 'react-calendar';

import DonutSummary from "./DonutSummary"

import "./CalendarView.css"

/* Calendar View Page */
class CalendarView extends React.Component {
    /* Constructor stores state variables and binds functions */
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);

        this.state = {
            firstInitialize: false,
            date: new Date(),
            data: [],
            width: 900,
            height: 620,
            id: "root"
        }
    }

    /* Fetches with backend to get data for the day */
    fetchDayData(date){
        const URL = "http://localhost:8080/api/LifeTime/getInformation";

        /* Scheme of data being sent to backend */
        const data = {
            "year" : date.getFullYear().toString(),
            "month": (date.getMonth() + 1).toString(),
            "day" : date.getDate().toString()
        };

        /* Sets that to this for use later */
        let that = this;

        /* Fetch method and call back */
        fetch(URL, {
            credentials: 'same-origin',
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "content-type" : "application/json"
            }
        }).then(function(res) {
            return res.json();
        }).then (function (transformedRes){
            /* Handles case when there's no data for the day */
            if (transformedRes.length === 0) {
                that.setState({
                    data: "No Data for Date"
                });

                return;
            }

            let {activityMap} = transformedRes[0];

            let data = [];

            /* Creates array of JSON Objects which component class will use */
            for(let i = 0; i < activityMap.length; i++) {
                data.push({
                    time: (activityMap[i]["time_out"] - activityMap[i]["time_in"]),
                    activity: activityMap[i]["activity"]
                });
            }

            /* Sets it null so react removes the whole chart
             * before we put the new chart. If not done, overlaying of
             * SVG components happen due to React and its key detection
             * for removal of components
             */
            that.setState({
                data: null
            });

            /* Sets data, which calls a rerender with new data */
            that.setState({
                data: data
            });
        });
    }

    /* Called upon when component is displayed. Used to get for current date */
    componentDidMount() {
        this.fetchDayData(new Date());
    }

    /* Called when new date on calendar is chosen */
    onChange(date) {
        this.fetchDayData(date);
    }

    /* Used to make donut chart component */
    generateChart() {
        /* Handles case of no data */
        if (this.state.data == null || this.state.data === "No Data for Date") {
            return <h1>{this.state.data}</h1>;
        }

        /* Calls another class which handles making the chart */
        let donut =  (<DonutSummary id="forRemove" data={this.state.data} date={this.state.date} width={this.state.width} height={this.state.height} />);

        return donut;
    }

    /* Generates the list of activity */
    generateList() {
        /* Handles case of no data */
        if (this.state.data == null || this.state.data === "No Data for Date") {
            return <br></br>;
        }

        let activity = new Map();
        let total = 0;

        /* Used to map all activities in the data and the total amount of time for them */
        for (let i = 0; i < this.state.data.length; i++) {
            if (activity.has(this.state.data[i]["activity"])) {
                total = total + this.state.data[i]["time"];
                activity.set(this.state.data[i]["activity"],  activity.get(this.state.data[i]["activity"]) + this.state.data[i]["time"]);
            }
            else {
                total = total + this.state.data[i]["time"];
                activity.set(this.state.data[i]["activity"],  this.state.data[i]["time"]);
            }
        }

        let mapSize = activity.size;
        let list = [];

        /* Used to sort the data from highest to lowest percentage and makes HTML code to display it */
        for (let i = 0; i < mapSize; i++) {
            let currentSize = activity.size;
            let activityIter = activity.keys();
            let max = activityIter.next().value;

            for (let i = 1; i < currentSize; i++) {
                let item = activityIter.next().value;

                if (activity.get(item) > activity.get(max)) {
                    max = item;
                }
            }

            //Formatted string to display
            let pushString = ""+ ((activity.get(max) / total) * 100).toFixed(2).toString() + "% - " + max;

            list.push(<h5> {pushString} </h5>)

            //Removes the key so it wont be found the next time we are finding the max
            activity.delete(max);
        }

        /* Returns the list */
        return (
            <div>
                <h3> Day Overview </h3>
                {list}
            </div>
        )

    }

    /* Code for rendering the page */
    render() {
        return (
            <div>
                <NavBar />
                    <div id = "container">
                        <div id = "side">
                            <center>
                                <div className="calendar">
                                    <Calendar onChange={this.onChange} value={this.state.date}/>
                                </div>
                                {this.generateList()}
                                <br></br>
                            </center>
                        </div>

                        <div id = "main">
                            {this.generateChart()}
                        </div>
                    </div>
            </div>
        )
    }
}

export default CalendarView
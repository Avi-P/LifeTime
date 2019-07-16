import React from "react"
import * as d3 from "d3";

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import {DateRangePicker} from 'react-dates';

import StackedAreaChart from "./StackedAreaChart"
import Colors from "../../Components/Colors"

import "./Overview.css";

/* Page for range of date overview */
class RangeOverview extends React.Component {
    //Constructor
    constructor(props) {
        super(props);

        this.state = {
            startDate: null,
            endDate: null,
            focusedInput: null,
            data: null,
            map: new Map()
        }
    }

    /* Method that performs fetch to API for data based on two dates*/
    fetchRangeData(one, two) {
        //Handles case where one the dates are null */
        if (one === null || two === null) {
            return;
        }

        /* Makes first and two dates since event value is not a date object */
        one = new Date(one);
        two = new Date(two);

        const URL = "http://localhost:8080/api/LifeTime/getDataRange";

        /* Scheme of data being sent to backend */
        const data = {
            "dateOneYear" : one.getFullYear(),
            "dateOneMonth" : one.getMonth(),
            "dateOneDay": one.getDate(),
            "dateTwoYear": two.getFullYear(),
            "dateTwoMonth": two.getMonth(),
            "dateTwoDay": two.getDate()
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
                    data: "No Data for this Range",
                    map: null
                });

                return;
            }

            let activities = Colors.getActivities();
            let trackMap = new Map();

            /* Initializes map with all the activities */
            for (let k = 0; k < activities.length; k++) {
                trackMap.set(activities[k], 0);
            }

            /* Creates a entry in the map to store the total time of all the activities */
            trackMap.set("Total", 0);

            let data = [];

            /* Loop used to format data into a specific order for the D3 function
             * and to calculate the total time spent for all the activities
             */
            for (let i = 0; i < transformedRes.length; i++) {
                let {date, activityMap} = transformedRes[i];
                let map = new Map();

                /* Instantiates map with all keys */
                for (let k = 0; k < activities.length; k++) {
                    map.set(activities[k], 0);
                }

                /* Loops through data from server and tracks how long per day a activity was done
                 * and how long per week the activity was done and totals up the total time of all the activities
                 */
                for (let k = 0; k < activityMap.length; k++) {

                    /* Storing total activity time for the day */
                    map.set(activityMap[k]["activity"],
                        map.get(activityMap[k]["activity"]) + (activityMap[k]["time_out"] - activityMap[k]["time_in"]));

                    /* Storing total activity time for the week */
                    trackMap.set(activityMap[k]["activity"],
                        trackMap.get(activityMap[k]["activity"]) + map.get(activityMap[k]["activity"]));

                    /* Storing total activity time for all activities*/
                    trackMap.set("Total", trackMap.get("Total") + map.get(activityMap[k]["activity"]))
                }

                //JSON object with date
                let obj = {"date" : date};

                //Adds all the activities in the specific order to the JSON object
                for (let k = 0; k < activities.length; k++) {
                    obj[activities[k]] = map.get(activities[k]);
                }

                //Pushes into array that will be used by D3
                data.push(obj);
            }

            /* Sets it null so react removes the whole chart
             * before we put the new chart. If not done, overlaying of
             * SVG components happen due to React and its key detection
             * for removal of components
             */
            that.setState({
                data: null
            });

            /* Sets state data to data for D3 usage and state map to map */
            that.setState({
                data: data,
                map: trackMap
            });
        });
    }

    /* When page first renders, makes the chart based on the current month */
    componentDidMount() {
        let now = new Date();

        const firstDayofCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const lastDayofCurrentMonth = new Date(now.getFullYear(), now.getMonth()+1, 0);

        this.fetchRangeData(firstDayofCurrentMonth, lastDayofCurrentMonth);
    }

    /* Builds color swatches for the legend of the chart */
    buildSwatches() {
        /* Handles null case */
        if (this.state.map == null) {
            return;
        }

        let data = [];

        /* Makes color map */
        let colorMap = d3.scaleOrdinal()
            .domain(Colors.getActivities())
            .range(Colors.getColors());

        /* Makes the color swatches HTML code for all the activities */
        for (let i = 0; i < Colors.getActivities().length; i++) {
            let color = "background:" + colorMap(Colors.getActivities()[i]) + ";";

            /* HTML code for the swatch created */
            let item = (
                <div>
                    <div className="item">
                        <div className="swatch" style={{background:  colorMap(Colors.getActivities()[i])}} ></div>

                        {Colors.getActivities()[i] + " "
                        + ((this.state.map.get(Colors.getActivities()[i]) / this.state.map.get("Total")) * 100).toFixed(2).toString().toString() + "%"}
                    </div>
                </div>
            );

            data.push(item);
        }

        return data;
    }

    /* Code used for rendering the page */
    render() {
        return (
            <div>
                <div className = "centered">
                    <DateRangePicker
                        startDateId="startDate"
                        isOutsideRange= {() => false}
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                        onDatesChange={({ startDate, endDate }) => { this.setState({ startDate, endDate });
                                                                    this.fetchRangeData(startDate, endDate);}}
                        focusedInput={this.state.focusedInput}
                        onFocusChange={(focusedInput) => { this.setState({ focusedInput })}}
                    />
                </div>

                <StackedAreaChart data={this.state.data}/>
                <div className = "formatSwatches">
                    {this.buildSwatches()}
                </div>
            </div>
        )
    }
}

export default RangeOverview;
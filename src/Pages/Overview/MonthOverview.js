import React from "react"
import StackedAreaChart from "./StackedAreaChart"

import Colors from "../../Components/Colors"
import * as d3 from "d3";

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import {SingleDatePicker} from 'react-dates';

import "./MonthOverview.css";

class MonthOverview extends React.Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);

        this.state = {
            date: null,
            data: null,
            map: new Map(),
            focusedInput: null,
        }
    }

    onChange(date) {
        if (date === null) {
            return;
        }

        this.setState({
            date: date
        });

        let now = new Date(date);

        const firstDayofCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const lastDayofCurrentMonth = new Date(now.getFullYear(), now.getMonth()+1, 0);

        console.log(firstDayofCurrentMonth + " - " + lastDayofCurrentMonth);

        this.fetchRangeData(firstDayofCurrentMonth, lastDayofCurrentMonth);
    }

    fetchRangeData(one, two) {
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
                    data: "No Data for Month",
                    map: null
                });

                return;
            }

            let activities = Colors.getActivities();

            let trackMap = new Map();

            for (let k = 0; k < activities.length; k++) {
                trackMap.set(activities[k], 0);
            }

            trackMap.set("Total", 0);

            let data = [];

            for (let i = 0; i < transformedRes.length; i++) {
                let {date, activityMap} = transformedRes[i];
                let map = new Map();

                for (let k = 0; k < activities.length; k++) {
                    map.set(activities[k], 0);
                }

                for (let k = 0; k < activityMap.length; k++) {

                    map.set(activityMap[k]["activity"],
                        map.get(activityMap[k]["activity"]) + (activityMap[k]["time_out"] - activityMap[k]["time_in"]));

                    trackMap.set(activityMap[k]["activity"],
                        trackMap.get(activityMap[k]["activity"]) + map.get(activityMap[k]["activity"]));

                    trackMap.set("Total", trackMap.get("Total") + map.get(activityMap[k]["activity"]))
                }

                let obj = {"date" : date};

                for (let k = 0; k < activities.length; k++) {
                    obj[activities[k]] = map.get(activities[k]);
                }

                data.push(obj);
            }

            that.setState({
                data: null
            });

            that.setState({
                data: data,
                map: trackMap
            });
        });
    }

    componentDidMount() {

        let now = new Date();

        const firstDayofCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const lastDayofCurrentMonth = new Date(now.getFullYear(), now.getMonth()+1, 0);

        console.log(firstDayofCurrentMonth + " - " + lastDayofCurrentMonth);

        this.fetchRangeData(firstDayofCurrentMonth, lastDayofCurrentMonth);
    }

    buildSwatches() {
        if (this.state.map == null) {
            return;
        }

        let data = [];

        let colorMap = d3.scaleOrdinal()
            .domain(Colors.getActivities())
            .range(Colors.getColors());

        for (let i = 0; i < Colors.getActivities().length; i++) {
            let color = "background:" + colorMap(Colors.getActivities()[i]) + ";";

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

    render() {
        return (
            <div>
                <div className = "centered">
                    <SingleDatePicker
                        date={this.state.date} // momentPropTypes.momentObj or null
                        isOutsideRange= {() => false}
                        onDateChange={this.onChange} // PropTypes.func.isRequired
                        focused={this.state.focused} // PropTypes.bool
                        onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
                        id="your_unique_id" // PropTypes.string.isRequired,
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

export default MonthOverview;
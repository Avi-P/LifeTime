import React from "react"
import DatePicker from 'react-date-picker';
import StackedAreaChart from "./StackedAreaChart"

import Colors from "../../Components/Colors"

class MonthOverview extends React.Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);

        this.state = {
            date: new Date(),
            data: null
        }
    }

    onChange(date) {
        if (date === null) {
            return;
        }

        this.setState({
            date: date
        });

        let now = date;

        //console.log(now);

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
            "dateOneMonth" : one.getMonth() + 1,
            "dateOneDay": one.getDate(),
            "dateTwoYear": two.getFullYear(),
            "dateTwoMonth": two.getMonth() + 1,
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
                    data: "No Data for Month"
                });

                return;
            }
            
            let data = [];

            for (let i = 0; i < transformedRes.length; i++) {
                let {date, activityMap} = transformedRes[i];
                let map = new Map();
                let activities = Colors.getActivities();

                for (let k = 0; k < activities.length; k++) {
                    map.set(activities[k], 0);
                }

                for (let k = 0; k < activityMap.length; k++) {
                    map.set(activityMap[k]["activity"],
                        map.get(activityMap[k]["activity"]) + (activityMap[k]["time_out"] - activityMap[k]["time_in"]));
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
                data: data
            });
        });
    }



    componentDidMount() {

        let now = new Date();

        const firstDayofCurrentMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const lastDayofCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        this.fetchRangeData(firstDayofCurrentMonth, lastDayofCurrentMonth);
    }

    render() {
        return (
            <div>
                <DatePicker onChange={this.onChange} value = {this.state.date}/>
                <StackedAreaChart data={this.state.data}/>
            </div>
        )
    }
}

export default MonthOverview;
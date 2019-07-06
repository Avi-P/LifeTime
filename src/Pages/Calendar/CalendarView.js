import React from "react"

import NavBar from "../../Components/NavBar"
import Calendar from 'react-calendar';

import DonutSummary from "./DonutSummary"

import "./CalendarView.css"

class CalendarView extends React.Component {
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

    componentDidMount() {
        let data = [];

        data.push(JSON.parse('{"time_in" : 0, "time_out" : 12, "name" : "Sleep"}'));
        data.push(JSON.parse('{"time_in" : 12, "time_out" : 13, "name" : "Class"}'));
        data.push(JSON.parse('{"time_in" : 13, "time_out" : 14, "name" : "Eating"}'));
        data.push(JSON.parse('{"time_in" : 14, "time_out" : 19, "name" : "Class"}'));
        data.push(JSON.parse('{"time_in" : 19, "time_out" : 24, "name" : "Work"}'));

        this.setState({
            data: data
        })
    }

    onChange(date) {
        this.setState({
            date: date
        })
    }

    generateChart() {
        let donut =  (<DonutSummary id="forRemove" date={this.state.date} width={this.state.width} height={this.state.height} />);

        return donut;
    }

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
                                <h3> Day Overview </h3>
                                <br></br>
                                <h5> 37.5% - Sleeping</h5>
                                <h5> 16.7% - Class</h5>
                                <h5> 16.7% - Eating</h5>
                                <h5> 29.2% - Work</h5>
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
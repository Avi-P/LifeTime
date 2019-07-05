import React from "react"

import NavBar from "../../Components/NavBar"
import Calendar from 'react-calendar';

import * as d3 from "d3";

import DonutSummary from "./DonutSummary"

import "./CalendarView.css"

class CalendarView extends React.Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);

        let dataX = this.generateData();

        this.state = {
            date: new Date(),
            data: [5,6,7,8],
            width: 900,
            height: 550,
            id: "root"
        }
    }

    generateData (value, length = 5){
        d3.range(length).map((item, index) => ({
            date: index,
            value: value === null || value === undefined ? Math.random() * 100 : value
        }))};

    onChange(date) {
        this.setState({
            date: date
        })
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
                                <h4> 37.5% - Sleeping</h4>
                                <h4> 16.7% - Class</h4>
                                <h4> 16.7% - Eating</h4>
                                <h4> 29.2% - Work</h4>
                            </center>
                        </div>

                        <div id = "main">
                                <DonutSummary data={this.state.data} width={this.state.width} height={this.state.height} />
                        </div>

                    </div>
            </div>
        )
    }

}

export default CalendarView
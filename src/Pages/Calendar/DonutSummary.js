import React from "react"

import { scaleOrdinal } from 'd3-scale';
import { arc as d3Arc, pie as d3Pie } from 'd3-shape';

class DonutSummary extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            width: this.props.width,
            height: this.props.height,
            radius: Math.min(this.props.width, this.props.height) / 2.5,
            colors: scaleOrdinal().range([
                                                '#3c6fc2',
                                                '#8a89a6',
                                                '#7b6888',
                                                '#6b486b',
                                                '#a05d56',
                                                '#d0743c',
                                                '#ff8c00',
                                            ]),
        };
    }

    generateRandomData() {
        let data = [];
        let activity = ["Sleep", "Work", "Class", "Food", "Exercise"];
        let startNumber = 0;
        let rand = Math.floor(Math.random() * 5) + 1;

        for(let i = 0; i < rand; i++) {
            let num = startNumber;
            let numTwo = Math.floor(Math.random() * 24 - num) + num;
            startNumber = numTwo;

            let numThree =  Math.floor(Math.random() * 4);

            let obj = '{"time_in" :' + num.toString() + ', "time_out" :' + numTwo.toString() + ', "name" : "' + activity[i] + '"}';

            data.push(JSON.parse(obj));
        }

        return data;
    }

    componentDidMount() {

        // data.push(JSON.parse('{"time_in" : 0, "time_out" : 9, "name" : "Sleep"}'));
        // data.push(JSON.parse('{"time_in" : 9, "time_out" : 12, "name" : "Class"}'));
        // data.push(JSON.parse('{"time_in" : 12, "time_out" : 14, "name" : "Eating"}'));
        // data.push(JSON.parse('{"time_in" : 14, "time_out" : 15, "name" : "Class"}'));
        // data.push(JSON.parse('{"time_in" : 15, "time_out" : 19, "name" : "Work"}'));
        // data.push(JSON.parse('{"time_in" : 19, "time_out" : 21, "name" : "Eating"}'));
        // data.push(JSON.parse('{"time_in" : 21, "time_out" : 24, "name" : "Work"}'));

        this.setState({
            data: this.generateRandomData()
        })
    }

    componentDidUpdate(prevProps) {
        if (this.shouldUpdate(prevProps, this.props)) {
           this.update();
        }
    }

    shouldUpdate(prevProps, props) {
        if (prevProps.date !== props.date) {
            return true;
        }

        return false;
    }

    update() {
        this.setState({
            data: this.generateRandomData(),
        });
    }

    midAngle(d){
        return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    render() {
        let dataCleaned = [];

        for (let i = 0; i < this.state.data.length; i++) {
            let cleaned = '{"time" :' + (this.state.data[i]["time_out"] - this.state.data[i]["time_in"])
                            + ', "activity": "' + this.state.data[i]["name"] + '"}';

            dataCleaned.push(JSON.parse(cleaned));
        }

        const arc = d3Arc()
            .outerRadius(this.state.radius - 10)
            .innerRadius(this.state.radius - 100)
            .padAngle(0.01);

        let outerArc = d3Arc()
            .innerRadius(this.state.radius)
            .outerRadius(this.state.radius);

        const pie = d3Pie()
            .sort(null)
            .value(function(d) { return d.time; });

        const data = pie(dataCleaned);

        return (
                <svg id = "visual" width={this.state.width} height={this.state.height}>
                    <g transform={`translate(${this.state.width / 2}, ${this.state.height / 2})`}>
                        {data.map(d => {
                            let SVGpos = outerArc.centroid(d);
                            let textPos = outerArc.centroid(d);

                            SVGpos[0] = this.state.radius * .90 * (this.midAngle(d) < Math.PI ? 1 : -1);
                            textPos[0] = this.state.radius * (this.midAngle(d) < Math.PI ? 1 : -1);

                            let retString = arc.centroid(d)+ " " + outerArc.centroid(d) + " " + textPos;

                            return (
                                <g className="arc" key={`a${d.data.activity}`}>
                                    <path d={arc(d)} fill={this.state.colors(d.data.activity)} />
                                    <polyline points={retString} fill="none" stroke="black" strokeWidth= "1px" opacity = ".3"/>

                                    {(textPos[0] < 0 ? textPos[0] = textPos[0] * 1.2 : textPos[0])}

                                    <text transform={`translate(${textPos/*arc.centroid(d)*/})`} dy=".35em">
                                        {d.data.activity}
                                    </text>
                                </g>
                            )
                        })}
                    </g>
                </svg>
        );
    }
}

export default DonutSummary;
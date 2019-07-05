import React from "react"

import { scaleOrdinal } from 'd3-scale';
import { arc as d3Arc, pie as d3Pie } from 'd3-shape';
import { csvParse } from 'd3-dsv';

class DonutSummary extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            width: this.props.width,
            height: this.props.height,
            radius: Math.min(this.props.width, this.props.height) / 2,
            colors: scaleOrdinal().range([
                                                '#3c6fc2',
                                                '#8a89a6',
                                                '#7b6888',
                                                '#6b486b',
                                                '#a05d56',
                                                '#d0743c',
                                                '#ff8c00',
                                            ]),

        }
    }

    midAngle(d){
        return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    render() {
        let dataTest =
            `time,name
            540,Sleeping
            180,Class
            120,Eating
            60,Class
            240,Work
            120,Eating
            180,Work`;

        const arc = d3Arc()
            .outerRadius(this.state.radius - 10)
            .innerRadius(this.state.radius - 100)
            .padAngle(0.01);

        let outerArc = d3Arc()
            .innerRadius(this.state.radius)
            .outerRadius(this.state.radius);

        const pie = d3Pie()
            .sort(null)
            .value(function(d) {
                return d.time//d.population;
            });

        const data = pie( //dataTest
            csvParse(dataTest, d => {
                d.time = +d.time;
                return d;
            })
        );

        return (
            <svg id = "visual" width={this.state.width} height={this.state.height}>
                <g transform={`translate(${this.state.width / 2}, ${this.state.height / 2})`}>
                    {data.map(d => {
                        let SVGpos = outerArc.centroid(d);
                        let textPos = outerArc.centroid(d);

                        SVGpos[0] = this.state.radius * .90 * (this.midAngle(d) < Math.PI ? 1 : -1);
                        textPos[0] = this.state.radius * (this.midAngle(d) < Math.PI ? 1 : -1);

                        let retString = arc.centroid(d)+ " " + outerArc.centroid(d) + " " + textPos;

                        //console.log(d.data.name + " " + retString);

                        return (
                            <g className="arc" key={`a${d.data.time}`}>
                                <path d={arc(d)} fill={this.state.colors(d.data.time)} />
                                <polyline points={retString} fill="none" stroke="black" stroke-width= "1px" opacity = ".3"/>

                                {(textPos[0] < 0 ? textPos[0] = textPos[0] * 1.19 : textPos[0])}

                                <text transform={`translate(${textPos/*arc.centroid(d)*/})`} dy=".35em">
                                    {d.data.name}
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
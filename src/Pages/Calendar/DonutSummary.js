import React from "react"

import { arc as d3Arc, pie as d3Pie } from 'd3-shape';
import * as d3 from "d3";
import Colors from "../../Components/Colors";

/* Donut chart class */
class DonutSummary extends React.Component{

    /* Contains state variables */
    constructor(props) {
        super(props);

        /* Data is null and not from props for proper source of truth */
        this.state = {
            data: [],
            width: this.props.width,
            height: this.props.height,
            radius: Math.min(this.props.width, this.props.height) / 2.5,
            colors: d3.scaleOrdinal()
                        .domain(Colors.getActivities())
                        .range(Colors.getColors())
        };
    }

    /* Called when component is mounted. */
    componentDidMount() {
        this.setState({
            data: this.props.data,
        })
    }

    /* Called when new props are passed in */
    componentDidUpdate(prevProps) {
        if (DonutSummary.shouldUpdate(prevProps, this.props)) {
           this.update();
        }
    }

    /* Checks if previous props data is the same as the new data */
    static shouldUpdate(prevProps, props) {
        return prevProps.data !== props.data;
    }

    /* Called if state has to be updated due to new props */
    update() {
        this.setState({
            data: this.props.data,
        })
    }

    /* Computes mid angle */
    static midAngle(d){
        return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    /* Code to render the chart */
    render() {
        let dataCleaned = this.state.data;

        /* Handles case where the data is empty */
        if (dataCleaned === null) {
            return (<br/>);
        }

        /* Used for colored slices of donut chart */
        const arc = d3Arc()
            .outerRadius(this.state.radius - 10)
            .innerRadius(this.state.radius - 100)
            .padAngle(0.01);

        /* Used for radius where text branches off from */
        let outerArc = d3Arc()
            .innerRadius(this.state.radius)
            .outerRadius(this.state.radius);

        /* Pie is used to transform the data for SVG rendering */
        const pie = d3Pie()
            .sort(null)
            .value(function(d) { return d.time; });

        /* Transforms data */
        const data = pie(dataCleaned);

        return (
                <svg id = "visual" width={this.state.width} height={this.state.height}>
                    <g transform={`translate(${this.state.width / 2}, ${this.state.height / 2})`}>

                        /* Used to create text and slice elements for all the data pieces */
                        {data.map(d => {
                            let SVGpos = outerArc.centroid(d);
                            let textPos = outerArc.centroid(d);

                            /* Computes position of slice and text */
                            SVGpos[0] = this.state.radius * .90 * (DonutSummary.midAngle(d) < Math.PI ? 1 : -1);
                            textPos[0] = this.state.radius * (DonutSummary.midAngle(d) < Math.PI ? 1 : -1);

                            let retString = arc.centroid(d)+ " " + outerArc.centroid(d) + " " + textPos;

                            /* Returns code that is used for rendering the donut chart, lines to text, and text*/
                            return (
                                <g className="arc" key={`a${this.props.date.toString() + d.data.time}`}>
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
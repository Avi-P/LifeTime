import React from "react"

import * as d3 from "d3";
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

            // {
            //                 nums: [1, 1, 3],
            //                 activity: ["Testing", "Testing One", "Testing Two"]
            //             };


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
                        let retString = "";

                        let SVGpos = outerArc.centroid(d);
                        let textPos = outerArc.centroid(d);

                        SVGpos[0] = this.state.radius * .90 * (this.midAngle(d) < Math.PI ? 1 : -1);
                        textPos[0] = this.state.radius * (this.midAngle(d) < Math.PI ? 1 : -1);

                        retString = arc.centroid(d)+ " " + outerArc.centroid(d) + " " + textPos;

                        console.log(d.data.name + " " + retString);

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


    // constructor(props) {
    //     super(props);
    //
    //     this.ref = createRef();
    //
    //     this.createPie = d3.pie()
    //         .value(d => d.value)
    //         .sort(null);
    //
    //     this.createArc = d3
    //         .arc()
    //         .innerRadius(props.innerRadius)
    //         .outerRadius(props.outerRadius);
    //
    //     this.colors = d3.scaleOrdinal(d3.schemeCategory10);
    //     this.format = d3.format(".2f");
    // }
    //
    // componentDidMount() {
    //     this.drawChart();
    // }
    //
    // drawChart() {
    //     const data = [1, 1, 2, 3, 5, 8, 13, 21];
    //     //
    //     // //let arc = d3.pie()(data);
    //     //
    //     const svg = d3.select("body").append("svg")
    //         .attr("width", this.props.width)
    //         .attr("height", this.props.height);
    //     //
    //     //
    //     // let arc = d3.arc()
    //     //     .innerRadius(0)
    //     //     .outerRadius(100)
    //     //     .startAngle(0)
    //     //     .endAngle(Math.PI / 2);
    //     //
    //     //
    //     svg.selectAll("rect")
    //         .data(data)
    //         .enter()
    //         .append("rect")
    //         .attr("x", (d, i) => i * 70)
    //         .attr("y", (d, i) => this.props.height - 10 * d)
    //         .attr("width", 65)
    //         .attr("height", (d, i) => d * 10)
    //         .attr("fill", "green")
    //     //
    //     // return <path d = {arc} />
    //
    //     // const svg = d3.select(this.ref.current);
    //     //
    //     // const data = this.createPie(this.props.data);
    //     //
    //     // const {width, height, innerRadius, outerRadius} = this.props;
    //     //
    //     // svg.attr("class", "chart")
    //     //     .attr("width", width)
    //     //     .attr("height", height);
    //     //
    //     // const group = svg.append("g")
    //     //                 .attr("transform", `translate(${innerRadius} ${outerRadius}`);
    //     //
    //     // const groupWithEnter = group.selectAll("g.arc").data(data).enter();
    //     //
    //     // const path = groupWithEnter.append("g").attr("class", "arc");
    //     //
    //     // path.append("path")
    //     //     .attr("class", "arc")
    //     //     .attr("d", this.createArc)
    //     //     .attr("fill", (d, i) => this.colors(d.index));
    //     //
    //     // path.append("text")
    //     //     .attr("text-anchor", "middle")
    //     //     .attr("alignment-baseline", "middle")
    //     //     .attr("transform", d => `translate(${this.createArc.centroid(d)})`)
    //     //     .style("fill", "white")
    //     //     .style("font-size", 10)
    //     //     .text(d => this.format(d.value));
    // }
    //
    // render() {
    //     // const arc = d3
    //     //     .arc()
    //     //     .innerRadius(0)
    //     //     .outerRadius(100)
    //     //     .padAngle(0.01)
    //     //     .cornerRadius(2);
    //     //
    //     // let height = this.props.height;
    //     // let width = this.props.width;
    //     //
    //     // return (
    //     // <svg height={height} width={width}>
    //     //     <g transform={`translate(${width / 2},${height / 2})`}>
    //     //         <path d={arc(this.state.data)} />
    //     //     </g>
    //     // </svg>)
    //
    //     return <svg ref={this.ref} />;
    // }
}

export default DonutSummary;
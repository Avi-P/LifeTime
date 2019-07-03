import React, { createRef } from "react"

import * as d3 from "d3";

class DonutSummary extends React.Component{

    constructor(props) {
        super(props);

        this.ref = createRef();

        this.createPie = d3.pie()
            .value(d => d.value)
            .sort(null);

        this.createArc = d3
            .arc()
            .innerRadius(props.innerRadius)
            .outerRadius(props.outerRadius);

        this.colors = d3.scaleOrdinal(d3.schemeCategory10);
        this.format = d3.format(".2f");
    }

    componentDidMount() {
        this.drawChart();
    }

    drawChart() {
        const data = [1, 1, 2, 3, 5, 8, 13, 21];
        //
        // //let arc = d3.pie()(data);
        //
        const svg = d3.select("body").append("svg")
            .attr("width", this.props.width)
            .attr("height", this.props.height);
        //
        //
        // let arc = d3.arc()
        //     .innerRadius(0)
        //     .outerRadius(100)
        //     .startAngle(0)
        //     .endAngle(Math.PI / 2);
        //
        //
        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d, i) => i * 70)
            .attr("y", (d, i) => this.props.height - 10 * d)
            .attr("width", 65)
            .attr("height", (d, i) => d * 10)
            .attr("fill", "green")
        //
        // return <path d = {arc} />

        // const svg = d3.select(this.ref.current);
        //
        // const data = this.createPie(this.props.data);
        //
        // const {width, height, innerRadius, outerRadius} = this.props;
        //
        // svg.attr("class", "chart")
        //     .attr("width", width)
        //     .attr("height", height);
        //
        // const group = svg.append("g")
        //                 .attr("transform", `translate(${innerRadius} ${outerRadius}`);
        //
        // const groupWithEnter = group.selectAll("g.arc").data(data).enter();
        //
        // const path = groupWithEnter.append("g").attr("class", "arc");
        //
        // path.append("path")
        //     .attr("class", "arc")
        //     .attr("d", this.createArc)
        //     .attr("fill", (d, i) => this.colors(d.index));
        //
        // path.append("text")
        //     .attr("text-anchor", "middle")
        //     .attr("alignment-baseline", "middle")
        //     .attr("transform", d => `translate(${this.createArc.centroid(d)})`)
        //     .style("fill", "white")
        //     .style("font-size", 10)
        //     .text(d => this.format(d.value));
    }

    render() {
        // const arc = d3
        //     .arc()
        //     .innerRadius(0)
        //     .outerRadius(100)
        //     .padAngle(0.01)
        //     .cornerRadius(2);
        //
        // let height = this.props.height;
        // let width = this.props.width;
        //
        // return (
        // <svg height={height} width={width}>
        //     <g transform={`translate(${width / 2},${height / 2})`}>
        //         <path d={arc(this.state.data)} />
        //     </g>
        // </svg>)

        return <svg ref={this.ref} />;
    }
}

export default DonutSummary;
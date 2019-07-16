import React from "react"
import * as d3 from "d3"

import Colors from "../../Components/Colors";

/* Stacked Area Chart component */
class StackedAreaChart extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            height : this.props.height,
            width : this.props.width,
            data : null
        }
    }

    /* Sets the data after the component mounts and not during construction due to source of truth */
    componentDidMount() {
        this.setState({
            data: this.props.data
        })
    }

    /* Called when new props are passed in */
    componentDidUpdate(prevProps) {
        if (this.shouldUpdate(prevProps, this.props)) {
            this.update();
        }
    }

    /* Checks if previous props data is the same as the new data */
    shouldUpdate(prevProps, props) {
        if (prevProps.data !== props.data) {
            return true;
        }

        return false;
    }

    /* Called if state has to be updated due to new props */
    update() {
        this.setState({
            data: this.props.data,
        })
    }

    /* Method that returns code used to render the chart */
    render() {
        /* Handles case where there is no date for the range */
        if (this.state.data === null) {
            return (<h1> Null </h1>)
        }

        /* Handles case where there is no date for the range */
        if (this.state.data === "No Data for Month") {
            return (<h1 className = "centered"> No Data for Month </h1>)
        }

        if (this.state.data === "No Data for this Range") {
            return (<h1 className = "centered"> No Data for this Range </h1>)
        }

        let activities = Colors.getActivities();

        /* Changes the date string into a date object */
        for (let i = 0; i < this.state.data.length; i++) {
            this.state.data[i]["date"] = new Date(this.state.data[i]["date"]);
        }

        /* Gets data*/
        let data = this.state.data;

        /* Stacks the data in a format for D3 use */
        let series = d3.stack().keys(Colors.getActivities())(data);

        /* Margins, height and width of the chart */
        let margin = ({top: 10, right: 40, bottom: 30, left: 40});
        let height = 300;
        let width = 900;

        /* Makes y scale */
        let y = d3.scaleLinear()
            .domain([0, d3.max(series, d => d3.max(d, d => d[1]))]).nice()
            .range([height - margin.bottom, margin.top]);

        /* Makes the x scale */
        let x = d3.scaleUtc()
            .domain(d3.extent(data, d => d.date))
            .range([margin.left, width - margin.right]);

        /* Sets title and marks of the y scale */
        let yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
            .call(g => g.select(".domain").remove());
            // .call(g => g.select(".tick:last-of-type text").clone()
            //     .attr("x", 3)
            //     .attr("text-anchor", "start")
            //     .attr("font-weight", "bold")
            //     .text("test" /*data.y*/));

        /* Sets the marks of the x scale */
        let xAxis = g => g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

        /* Makes color map using activities and colors */
        let color = d3.scaleOrdinal()
            .domain(Colors.getActivities())
            .range(Colors.getColors());

        /* Creates the chart using date for x and activity time for y */
        let area = d3.area()
            .x(d => x(d.data.date))
            .y0(d => y(d[0]))
            .y1(d => y(d[1]));

        /* Creates SVG Element with size specified */
        const svg = d3.create("svg")
            .attr("viewBox", [0, 0, width, height]);

        /* Adds other features to the chart such as filling the areas and text */
        svg.append("g")
            .selectAll("path")
            .data(series)
            .join("path")
            .attr("fill", ({key}) => color(key))
            .attr("d", area)
            .append("title")
            .text(({key}) => key);

        /* Adds x-axis to the chart */
        svg.append("g")
            .call(xAxis);

        /* Adds y-axis to the chart */
        svg.append("g")
            .call(yAxis);

        /* Extract the HTML code of the title since we cant render a SVGNode directly */
        let s = new XMLSerializer();
        let str = s.serializeToString(svg.node());

        /* Creates div element and sets the inner html to the chart */
        return <div dangerouslySetInnerHTML={{__html: str}}></div>
    }
}

export default StackedAreaChart
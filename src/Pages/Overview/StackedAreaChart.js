import React from "react"
import * as d3 from "d3"

import Colors from "../../Components/Colors";

class StackedAreaChart extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            height : this.props.height,
            width : this.props.width,
            data : null
        }
    }

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

    render() {

        // if (this.state.data == null) {
        //     return (<br></br>)
        // }

        let data = [{date: new Date(2007, 3, 24), Sleep: 10, Work: 14, Class: 15},
                    {date: new Date(2007, 3, 25), Sleep: 9, Work: 15, Class: 14},
                    {date: new Date(2007, 3, 26), Sleep: 8, Work: 16, Class: 13},
                    {date: new Date(2007, 3, 27), Sleep: 7, Work: 17, Class: 12},
                    {date: new Date(2007, 3, 30), Sleep: 6, Work: 18, Class: 11},
                    {date: new Date(2007, 4,  1), Sleep: 5, Work: 19, Class: 10}
                    ];

        let series = d3.stack().keys(Colors.getActivities())(data);

        let margin = ({top: 20, right: 30, bottom: 30, left: 40});

        let height = 300;
        let width = 900;

        let y = d3.scaleLinear()
            .domain([0, d3.max(series, d => d3.max(d, d => d[1]))]).nice()
            .range([height - margin.bottom, margin.top]);

        let x = d3.scaleUtc()
            .domain(d3.extent(data, d => d.date))
            .range([margin.left, width - margin.right]);

        let yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
            .call(g => g.select(".domain").remove());
            // .call(g => g.select(".tick:last-of-type text").clone()
            //     .attr("x", 3)
            //     .attr("text-anchor", "start")
            //     .attr("font-weight", "bold")
            //     .text("test" /*data.y*/));

        let xAxis = g => g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

        let color = d3.scaleOrdinal()
            .domain(Colors.getActivities())
            .range(Colors.getColors());

        let area = d3.area()
            .x(d => x(d.data.date))
            .y0(d => y(d[0]))
            .y1(d => y(d[1]));

        const svg = d3.create("svg")
            .attr("viewBox", [0, 0, width, height]);

        svg.append("g")
            .selectAll("path")
            .data(series)
            .join("path")
            .attr("fill", ({key}) => color(key))
            .attr("d", area)
            .append("title")
            .text(({key}) => key);

        svg.append("g")
            .call(xAxis);

        svg.append("g")
            .call(yAxis);

        let s = new XMLSerializer();
        let str = s.serializeToString(svg.node());

        return <div dangerouslySetInnerHTML={{__html: str}}></div>
    }
}

export default StackedAreaChart
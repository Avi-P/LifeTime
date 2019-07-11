import React from "react"
import DatePicker from 'react-date-picker';
import StackedAreaChart from "./StackedAreaChart"

class MonthOverview extends React.Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);

        this.state = {
            date: new Date()
        }
    }

    onChange(date) {
        this.setState({
            date: date
        })
    }

    render() {
        return (
            <div>
                <DatePicker onChange={this.onChange} value = {this.state.date}/>
                <StackedAreaChart/>
            </div>
        )
    }
}

export default MonthOverview;
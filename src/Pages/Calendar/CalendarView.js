import React from "react"

import NavBar from "../../Components/NavBar"
import Calendar from 'react-calendar';

class CalendarView extends React.Component {
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
                <NavBar />
                <Calendar onChange={this.onChange} value={this.state.date}/>
            </div>
        )
    }

}

export default CalendarView
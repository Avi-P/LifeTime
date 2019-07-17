import React from "react"
import {Button, Form, Col} from "react-bootstrap";

import 'rc-time-picker/assets/index.css';
import TimePicker from 'rc-time-picker';

import NavBar from "../../Components/NavBar"
import Colors from "../../Components/Colors"

import {SingleDatePicker} from "react-dates";
import Editor from 'react-simple-code-editor';

import "./Input.css"

class Input extends React.Component {

    constructor(props) {
        super(props);

        this.dateChange = this.dateChange.bind(this);
        this.timeChangeOne = this.timeChangeOne.bind(this);
        this.timeChangeTwo = this.timeChangeTwo.bind(this);
        this.activityChange = this.activityChange.bind(this);
        this.addToCode = this.addToCode.bind(this);
        this.submit = this.submit.bind(this);

        this.state = {
            date: null,
            activity: "Sleep",
            timeOne: null,
            timeTwo: null,
            focusedInput: null,
            code: "",
            firstAdd: false
        }
    }

    componentDidMount() {
        let month = new Date().getMonth();
        let day = new Date().getDate();
        let year = new Date().getFullYear();

        this.setState({
            code: "{\n" +
                "\t\"month\": " + month + ",\n" +
                "\t\"day\" : " + day + ",\n" +
                "\t\"year\" : " + year + ",\n" +
                "\t\"activityMap\": \n\t[\n\t]\n}"
        })
    }

    //Called when the date on the date selector changes
    dateChange(date) {
        let newDate = new Date(date);

        let month = newDate.getMonth();
        let day = newDate.getDate();
        let year = newDate.getFullYear();

        /*
        "{\n" +
                "\t\"month\": " + month + ",\n" +
                "\t\"day\" : " + day + ",\n" +
                "\t\"year\" : " + year + ",\n"
         */

        let code = "{\n" +
            "\t\"month\": " + month + ",\n" +
            "\t\"day\" : " + day + ",\n" +
            "\t\"year\" : " + year + ",\n\t" + this.state.code.substring(this.state.code.search("\"activity"), this.state.code.length);

        this.setState({
            code: code,
            date: date
        });
    }

    timeChangeOne(event) {
        this.setState({
            timeOne: new Date(event)
        })
    }

    timeChangeTwo(event) {
        this.setState({
            timeTwo: new Date(event)
        })
    }

    activityChange(event) {
        this.setState({
            activity: event.target.value
        })
    }

    checkFirst() {
        if(!this.state.firstAdd){
            this.setState({
                firstAdd: true
            });

            return "\n"
        }
        else {
            return ",\n"
        }
    }

    submit() {
        console.log(JSON.parse(this.state.code));
    }

    addToCode() {
        console.log(this.state.activity + " " + this.state.timeOne + " " + this.state.timeTwo);

        if (this.state.timeOne === null || this.state.timeTwo === null) {
            return;
        }

        let secondDate;

        if (this.state.timeTwo.getHours() == 0 && this.state.timeTwo.getMinutes()/60 === 0 &&
            this.state.timeOne.getHours() > this.state.timeTwo.getHours()) {
            secondDate = new Date(12,1,2019,0,0)
        }
        else {
            secondDate = this.state.timeTwo;
        }

        let code = this.state.code.substr(0, this.state.code.search("]") - 2) + this.checkFirst() +
                    "\t\t{\"activity\" : \"" + (this.state.activity) + "\"" +
                    ", \"time_in\" : " + (this.state.timeOne.getHours() +  (this.state.timeOne.getMinutes()/60)) +
                    ", \"time_out\" : " + (secondDate.getHours() +  (secondDate.getMinutes()/60)) + "}" +
                    "\n\t]\n}";

        this.setState({
            code: code
        })
    }

    generateList() {
        let data = [];
        let activities = Colors.getActivities();

        for (let i = 0; i < activities.length; i++) {
            data.push(<option>{activities[i]}</option>);
        }

        return data;
    }

    render() {
        const format = 'h:mm a';

        return <div>

            <NavBar/>

            <div className="header">
                <h1>Input for</h1>
                <SingleDatePicker
                    date={this.state.date} // momentPropTypes.momentObj or null
                    isOutsideRange= {() => false}
                    onDateChange={this.dateChange} // PropTypes.func.isRequired
                    focused={this.state.focused} // PropTypes.bool
                    onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
                    id="your_unique_id" // PropTypes.string.isRequired,
                />
            </div>

            <div className = "form">
                <h3> Activity </h3>

                <Form.Group as={Col} controlId="formGridState" className = "activitySelect" column sm="2">
                    <Form.Control as="select" onChange = {this.activityChange} >
                        {this.generateList()}
                    </Form.Control>
                </Form.Group>

                <div className="timeInput">
                    <h3> Start-Time </h3>
                    <TimePicker
                        className="picker"
                        showSecond={false}
                        format={format}
                        inputReadOnly
                        minuteStep={15}
                        onChange = {this.timeChangeOne}
                    />

                    <h3 className="finish"> Finish-Time </h3>
                    <TimePicker
                        className="picker"
                        showSecond={false}
                        format={format}
                        inputReadOnly
                        minuteStep={15}
                        onChange = {this.timeChangeTwo}
                    />

                    <div className = "add">
                        <Button variant="primary" size="md"  onClick = {this.addToCode}>
                            Add More
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container_editor_area">
                <Editor
                    placeholder="Type some code…"
                    value={this.state.code}
                    onValueChange={code => this.setState({ code })}
                    highlight={code => code}
                    padding={10}
                    tabsize={10}
                    insertSpaces = {true}
                    className="editor"
                />
            </div>

            <div className = "form">
                <Button variant="primary" size="md"  onClick = {this.submit}>
                    Submit
                </Button>
            </div>
        </div>
    }
}

export default Input;
import React from "react"
import {Button, Form, Col} from "react-bootstrap";

import 'rc-time-picker/assets/index.css';
import TimePicker from 'rc-time-picker';

import NavBar from "../../Components/NavBar"
import Colors from "../../Components/Colors"

import {SingleDatePicker} from "react-dates";

import Editor from 'react-simple-code-editor';

import "./Input.css"

/* Used for default time */
const moment = require("moment");

/* Input Page */
class Input extends React.Component {

    /* Constructor */
    constructor(props) {
        super(props);

        this.dateChange = this.dateChange.bind(this);
        this.timeChangeOne = this.timeChangeOne.bind(this);
        this.timeChangeTwo = this.timeChangeTwo.bind(this);
        this.activityChange = this.activityChange.bind(this);
        this.addToCode = this.addToCode.bind(this);
        this.submit = this.submit.bind(this);

        this.state = {
            date: moment(),
            activity: "Sleep",
            timeOne: new Date(),
            timeTwo: new Date(),
            focusedInput: null,
            code: "",
            firstAdd: false,
            error: ""
        }
    }

    /* Called when component renders. Sets text in textarea */
    componentDidMount() {
        let today = new Date();

        today.setHours(0);
        today.setMinutes(0);

        this.setState({
            timeOne: today,
            timeTwo: today,
            code: "{\n" +
                    "\t\"month\": " + (today.getMonth() + 1) + ",\n" +
                    "\t\"day\" : " + today.getDate() + ",\n" +
                    "\t\"year\" : " + today.getFullYear() + ",\n" +
                    "\t\"activityMap\": \n\t[\n\t]\n}"

        })
    }

    /* Called when date on selector changes */
    dateChange(date) {
        let newDate = new Date(date);

        let code = "{\n" +
            "\t\"month\": " + (newDate.getMonth() + 1) + ",\n" +
            "\t\"day\" : " + newDate.getDate() + ",\n" +
            "\t\"year\" : " + newDate.getFullYear() + ",\n\t" +
            this.state.code.substring(this.state.code.search("\"activity"), this.state.code.length);

        /* Updates JSON String with new date */
        this.setState({
            code: code,
            date: date
        });
    }

    /* Called when time on first time picker changes */
    timeChangeOne(event) {
        this.setState({
            timeOne: new Date(event)
        })
    }

    /* Called when time on second time picker changes */
    timeChangeTwo(event) {
        this.setState({
            timeTwo: new Date(event)
        })
    }

    /* Called when activity picker changes */
    activityChange(event) {
        this.setState({
            activity: event.target.value
        })
    }

    /* Used to add in a comma before it adds an activity to activitymap in the JSON String */
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

    /* Takes text from textarea, and runs some checks on it to ensure it is proper.
     * Then calls a method to insert into database
     */
    submit() {
        let obj = JSON.parse(this.state.code);

        const {activityMap} = obj;

        let total = 0;

        /* Loops through activitymap */
        for (let i = 0; i < activityMap.length; i++) {
            /* Ensures all activities are valid */
            if (!Colors.getActivities().includes(activityMap[i]["activity"])) {
                this.setState({
                    error: "Error: Unsupported Activity"
                });

                return;
            }

            /* Ensures none of the times are null */
            if (activityMap[i]["time_out"] === null || activityMap[i]["time_in"] === null) {
                this.setState({
                    error: "Error: Null time included."
                });

                return;
            }

            total = total + (activityMap[i]["time_out"] - activityMap[i]["time_in"]);
        }

        /* Ensures that the total amount of time is 24 hours or one day */
        if (total === 24) {
            this.postDayData(obj);

            this.setState({
                error: "Recorded"
            })
        }
        else {
            this.setState({
                error: "Error: Total time is not 24 hours."
            })
        }
    }

    /* Adds */
    addToCode() {
        /* Handles null case */
        if (this.state.timeOne === null || this.state.timeTwo === null) {
            return;
        }

        let secondHour;
        let secondMinute;

        /* Used to handle edge case of 0:00 representing 24:00 */
        if (this.state.timeTwo.getHours() === 0 && this.state.timeTwo.getMinutes() === 0) {
            secondHour = 24;
            secondMinute = 0;
        }
        else {
            secondHour = this.state.timeTwo.getHours();
            secondMinute = this.state.timeTwo.getMinutes();
        }

        /* Builds new JSON String */
        let code = this.state.code.substr(0, this.state.code.search("]") - 2) + this.checkFirst() +
                    "\t\t{\"activity\" : \"" + (this.state.activity) + "\"" +
                    ", \"time_in\" : " + (this.state.timeOne.getHours() +  (this.state.timeOne.getMinutes()/60)) +
                    ", \"time_out\" : " + (secondHour +  (secondMinute/60)) + "}" +
                    "\n\t]\n}";

        this.setState({
            code: code,
            timeOne: this.state.timeTwo
        })
    }

    /* POSTs to API to enter into DB */
    postDayData(JSONObj) {
        const URL = "http://localhost:8080/api/LifeTime/postInformation";

        fetch(URL, {
            credentials: 'same-origin',
            method: 'POST',
            body: JSON.stringify(JSONObj),
            headers: {
                "content-type" : "application/json"
            }
        }).then(function(res){
            return res;
        })
    }

    /* Generates list of activities for dropdown */
    generateList() {
        let data = [];

        for (let i = 0; i < Colors.getActivities().length; i++) {
            data.push(<option>{Colors.getActivities()[i]}</option>);
        }

        return data;
    }

    //Methods that will be used to get code that will displayed on the screen
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
                        value={moment(this.state.timeOne)}
                        className="picker"
                        showSecond={false}
                        format={format}
                        inputReadOnly
                        minuteStep={15}
                        onChange = {this.timeChangeOne}
                    />

                    <h3 className="finish"> Finish-Time </h3>
                    <TimePicker
                        value={moment(this.state.timeTwo)}
                        className="picker"
                        showSecond={false}
                        format={format}
                        inputReadOnly
                        minuteStep={15}
                        onChange = {this.timeChangeTwo}
                    />

                    <div className = "add">
                        <Button variant="primary" size="md"  onClick = {this.addToCode}>
                            +
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

            <h3> {this.state.error} </h3>
        </div>
    }
}

export default Input;
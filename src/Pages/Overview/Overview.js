import React from "react"

import {Tabs, Tab} from "react-bootstrap"

import NavBar from "../../Components/NavBar"
import MonthOverview from "./MonthOverview"
import RangeOverview from "./RangeOverview"

class Overview extends React.Component {

    render() {
       return (
           <div>
               <NavBar />
               <Tabs defaultActiveKey="Month" id="uncontrolled-tab-example">
                   <Tab eventKey="Month" title="Month">
                       <MonthOverview/>
                   </Tab>
                   <Tab eventKey="Date_Range" title="Date Range">
                        <RangeOverview/>
                   </Tab>
               </Tabs>
           </div>
       )
    }

}

export default Overview;
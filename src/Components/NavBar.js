import React from 'react';

import {Navbar, Nav} from 'react-bootstrap'

//Navigation Bar
class NavBar extends React.Component {

    //Code for NavBar, relies on React Bootstrap
    render() {
        return <>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/">LifeTime</Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link href="/day-view">Day View</Nav.Link>
                    <Nav.Link href="/">Overview</Nav.Link>
                </Nav>
            </Navbar>
        </>
    }

}

export default NavBar;
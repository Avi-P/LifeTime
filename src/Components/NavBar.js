import React from 'react';

import {Navbar, Nav} from 'react-bootstrap'

class NavBar extends React.Component {
    constructor(props) {
        super(props);
    }

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


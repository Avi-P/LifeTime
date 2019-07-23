import React from 'react';

import {Jumbotron, Container, Button} from "react-bootstrap";

import NavBar from "../../Components/NavBar"

import "./Home.css"
import image from "../../assets/icon.png"

/* Home page */
class Home extends React.Component{
    render() {
        return <>
                <NavBar />

                <Jumbotron>
                    <Container>
                        <h1><img src={image} width="75" height="75" /> LifeTime</h1>
                        <p>
                            A web app to help track your activities and how they change over time.
                        </p>
                    </Container>
                </Jumbotron>


                <center>
                    <h2>How does this help you?</h2>
                    <br />
                    <p>Input your daily activities and from when to when</p>
                    <p>Be able to easily see what you did on a specific day</p>
                    <p>Visualize how the use of your time has changed over time</p>
                    <p>Make informed decisions on whether you want to change your use of time</p>
                </center>


                <div className="started">
                    <Button variant="primary" size="lg" href="/input">
                        Lets get started!
                    </Button>
                </div>
            </>
    }
}

export default Home;
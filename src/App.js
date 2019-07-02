import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';

import Home from "./Pages/Home/Home"
import CalendarView from "./Pages/Calendar/CalendarView"
function App() {
  return (
      <>
          <Router>
              <div>
                  <Route path="/" exact component={Home} />
                  <Route path="/day-view" exact component={CalendarView} />
              </div>
          </Router>
      </>
  );
}

export default App;

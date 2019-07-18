# LifeTime
## Overview
This web-app allows one to input the activities they did during the day and from when to when they did this activity. With this data in the database, one can view it in multiple formats. The first representational format is a donut chart which shows a single day's data. This chart showcases all the activities for the day in-order along with a percentage representation of how much of the day a certain activity took up. The second representational format is a stacked area chart. This is used to show data for multiple days. It does not represent data in order from 12:00 AM - 11:59 PM but groups the time for a certain activity together so that you can see how much time you spent doing a certain activity over the time frame relative to other activities. Data frames you can choose in this format are month wise and custom date ranges. This project was made to track how one spends their time daily/over time and how certain activity's time changes as events come up such as holidays or exams.  

## Technical Features
* ReactJS used for the front-end
* D3.JS used to create the charts
* NodeJS & ExpressJS are used for the back-end and to handle API requests
* MongoDB & Mongoose handle the database and schemas
* HTTP requests to interact with backend
* React-router usage to have multiple sites in the app and to route users accordingly depending on the link

## Set Up
Dependencies needed: 
```
"bootstrap": "^4.3.1",
"cors": "^2.8.5",
"d3": "^5.9.7",
"d3-dsv": "^1.1.1",
"d3-scale": "^3.0.0",
"d3-shape": "^1.3.5",
"moment": "^2.24.0",
"rc-time-picker": "^3.7.1",
"react": "^16.8.6",
"react-bootstrap": "^1.0.0-beta.9",
"react-calendar": "^2.19.0",
"react-date-picker": "^7.7.0",
"react-dates": "^20.2.5",
"react-dom": "^16.8.6",
"react-router-dom": "^5.0.1",
"react-scripts": "3.0.1",
"react-simple-code-editor": "^0.9.13"
 ```
All of these are available to be downloaded through NPM
 
### Server
To start the back-end portion, navigate into the folder `server-src` with terminal

Run the command `node server.js`

The back-end has now been started

### Website
To run the front-end/React portion, navigate into the `LifeTime` folder where the folder `src` sits, with terminal

Run the command `npm start`

Go to `localhost:3000` in your browser, preferably Chrome, and you should see the front-end

## License
[GNU General Public License v3.0](https://choosealicense.com/licenses/gpl-3.0/)

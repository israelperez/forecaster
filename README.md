## Forecaster Weather App

###Description
Technical test for 3rd Stage<br>
submitted 8th May 2015

The forecast.io key has been removed from UIEngine.js. You can edit this file to add it again. The object and property is:

    UIEngine.config.APIKey

###Candidate Exercise
Using your knowlegde of node.js, client side frameworks and using the http://forecast.io API create an application which when accessed via a url can be used to retrieve a weather forecast.

###Scenarios
The items below should be considered to be applicable to all scenarios.

- Support both basic HTML and JSON responses
- UNIT & Functional test suites

####Scenario One: Display a weather forecast by location
A weather forcast should be displayed based upon the location speciﬁed in the url.

- Expected URL: http://localhost:/weather/:location
- Example URL: http://localhost:/weather/( sydney | brisbane )

####Scenario Two: Display a weather forecast by location ﬁltered by day
A weather forcast should be displayed based upon the location and day speciﬁed in the url.

- Expected URL: http://localhost:<port>/weather/:location/:weekday
- Example URL: http://localhost:<port>/weather/:location/( monday | tuesday | etc .. )

####Scenario Three: Display a weather forecast for today
A weather forcast should be displayed based upon the location and the current day.

- Expected URL: http://localhost:<port>/weather/:location/today
- Example URL: http://localhost:<port>/weather/sydney/today
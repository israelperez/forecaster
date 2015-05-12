var UIEngine ={
	_elements:{
		results: $('.results')
	},
	_mode: '', // used the flag what time to data to render
	_location: '', //records the location
	_today: null, // records the index of today
	_weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

	init: function(options){ //start app
		var weatherLocation = options.location || null; // if location not specified, default to null
		this._mode = options.period || 'week';
		
		//get settings
		this.API._server = this.config.forecastAPI; 
		this.API._ApiKey = this.config.APIKey;
		this._location = weatherLocation;


		// Find lat lng if route contained a location
		if (weatherLocation !== null || weatherLocation === undefined) {
			MapEngine.init(weatherLocation, function(){
				UIEngine.getForecast(MapEngine.location.getLatLng()); // call function that run API and get lat lng
			}); //initialise MapEngine (sets lat lng for location specified)
		}
	},
	config: {
		//could add method that get this values from a file on the server
		APIKey: '',
		forecastAPI: 'https://api.forecast.io/forecast/',
	},
	API: {
		_server: '',
		_ApiKey: '',
		_getServer: function(callData){ //creates the URL with Key, Lat and Lng
			// could modfiy to make more universal (to get config settings from json file)
			return this._server + this._ApiKey + '/' + callData.lat + ',' + callData.lng + '?units=si';
		},
		query: function(callData, callback, type){ // customizable query handler with felxible callbacks
			var Engine = this,
				urlRequest;

			type = type || 'GET'; // default to POST type
			
			urlRequest = this._getServer(callData);

			$.ajax({ 
				'type': type, 
				'dataType': 'jsonp',
				'url': urlRequest,
			}).done(function(response){ 
				if(callback.success !== undefined) callback.success.call(response, response);
			}).fail(function(response){
				if(callback.error !== undefined) callback.error.call(response, response);
			});
		}
	},
	_addDay: function(day, indexDay){ // Private method to add data to page
		var dayTile = $('<div></div>').addClass('day-tile')
			.append('<div class="day">'+this.getDayLabel(indexDay)+'</div>')
			.append('<div class="icon">'+day.icon+'</div>')
			.append('<div class="summary">'+day.summary+'</div>')
			.append('<div class="temp"><span class="temp-min">'+day.apparentTemperatureMin+'</span> - <span class="temp-max">'+day.apparentTemperatureMax+'</span></div>');
		this._elements.results.append(dayTile);
	},
	getDayLabel: function(index, special){ // Method used to find the Day as text
		if(special === undefined) special = true;
		index = parseInt(index);

		day = index + this._today; //makes day index align with weekday array
		while(day>6){ // ensure day is never over 6
			day-=7;
		}
		if(special == true){
			if (index === 0) return 'Today (' + this._weekdays[day]+')';
			if (index === 1) return 'Tomorrow (' + this._weekdays[day] +')';
		}
		return this._weekdays[day];
	},
	getForecast: function(data){ // Method that calls the query and handles render based on mode
		// data is json that contains lat, lng
		var Engine = this;
		//console.log(data);
		this.API.query(data, {
			success: function(response){
				Engine._today = new Date().getDay();
				//console.log(response);
				if(Engine._mode==='week') Engine.renderForecastWeek(response.daily);
				if(Engine._mode==='today') Engine.renderForecastToday(response.currently, response.daily.data[0]);
				if(Engine._mode!=='today' && Engine._mode!=='week')Engine.renderForecastFilterDay(response.daily, Engine._mode);
			}, error: function(response){
				console.error(response);
			}
		});
	},
	renderForecastWeek: function(days){ //render a weeks forecast (default)
		this._elements.results.append('<h2>Weather forecast for '+this._location+' this week</h2><p class="forecast-summary">'+days.summary+'</p>');
		for(var i in days.data){
			if(days.data[i] !== undefined) this._addDay(days.data[i], i);
		}
	},
	renderForecastToday: function(current, day){ //render just todays forecast along with current weather
		this._elements.results.append('<h2>Weather forecast for '+this._location+' today</h2><p class="forecast-summary">'+current.summary+'</p>')
		
		var dayTile = $('<div class="currently"></div>')
				.append('<div class="day">Today ('+ this.convertTime(current.time)+')</div>')
				.append('<div class="icon">'+current.icon+'</div>')
				.append('<div class="summary">'+current.summary+'</div>')
				.append('<div class="temp"><span class="temp-now>'+current.temperature+'</span></div>');
		this._elements.results.append(dayTile);
		if(day !== undefined) this._addDay(day, 0);
	},
	renderForecastFilterDay: function(days, filterDay){ // match the day to render forecast data
		var Engine = this;

		this._elements.results.append('<h2>Weather forecast for '+this._location+' on '+ filterDay +'</h2><p class="forecast-summary">'+days.summary+'</p>');
		for(var i in days.data){
			if(days.data[i] !== undefined && Engine.getDayLabel(i,false).toUpperCase() == filterDay.toUpperCase()) this._addDay(days.data[i], i);
		}
	},
	convertTime: function(unixTime){ // Convert unix timestamp to 12hr clock 
		var date = new Date(unixTime*1000),
			hours = date.getHours(),
			minutes = date.getMinutes()
			dayHalf = 'AM';

			if(hours >=12){
				hours -= 12;
				dayHalf = 'PM';
			}
			minutes = minutes<10 ? "0"+minutes : minutes;
		return hours+":"+minutes+" "+dayHalf;
	}
};
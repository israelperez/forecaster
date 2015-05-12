var express = require('express'),
	app = express(),
	router = express.Router();

app.set('view engine', 'jade');
app.use(express.static( __dirname + '/public'));

router.route('/:location/today').get(function(req,res){
	var location = req.params.location;
	res.render('index', {locale: location, period: 'today'});
});
router.route('/:location/:weekday').get(function(req,res){
	var location = req.params.location,
		weekday = req.params.weekday;
	res.render('index', {locale: location, period: weekday});
});
router.route('/:location').get(function(req,res){
	var location = req.params.location;
	res.render('index', {locale: location, period: 'week'});
});
app.use('/weather', router);

app.listen(4000);
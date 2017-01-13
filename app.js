const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// Require routes
const index = require('./routes/index');

// Load config
const config = require('./config');

// Initialize express
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('combined'));
app.set('port', config.port);

// Declare routes
app.use('/', index);

// Start particle listener
const ParticleListener = require('./model/ParticleListener');
let particleListener = new ParticleListener();

// Start express server
const server = app.listen(process.env.PORT || app.get('port'), () => {
	let port = server.address().port;
	console.log(`Server listening on port %s`, port);
});

module.exports = app;

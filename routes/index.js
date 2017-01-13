const express = require('express');
const router = express.Router();

// serves a very simplistic UI
router.get('/', function(req, res) {
	console.log('Index route: Request for landing page');
	res.send('Welcome to our watt meter.');
});

module.exports = router;

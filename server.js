// these are the required dependencies 
const express = require('express');
const path = require('path');
const app = express();
// this is the port # that will be listening
const PORT = process.env.PORT || 3001;

// this is the middleware for the json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('publictacos'));

//this is the middleware for the static files
// app.use(express.static(path.join(__dirname, 'publictacos')));

// this is the middleware for the routes
app.use('/api/taconotes', require('./tacoroutes/apiRoutes'));
app.use('/', require('./tacoroutes/htmlRoutes'));

// this is the message you will recieve in your terminal 
app.listen(PORT, () =>
  console.log(`Taco listening at http://localhost:${PORT}`)
);
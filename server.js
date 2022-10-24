const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3001;

// this is the middleware for the json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//this is the middleware for the static files
app.use(express.static(path.join(__dirname, 'public')));

// this is the middleware for the routes
app.use('/api/taconotes', require('./routes/apiRoutes'));
app.use('/', require('./routes/htmlRoutes'));

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
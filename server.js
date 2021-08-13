// webdevsimplifed
const express = require('express');
const app = express();
// http is built in, no need to install, specifiy which app you want to use.
const server = require('http').Server(app);

// set ejs
app.set('view engine', 'ejs');

// app.get asks what url we are going to hit
app.get('/', (req, res) => {
  // render the room ejs file from views
  res.render('room');
})


server.listen(3030);

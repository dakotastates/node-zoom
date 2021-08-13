// webdevsimplifed
const express = require('express');
const app = express();
// http is built in, no need to install, specifiy which app you want to use.
const server = require('http').Server(app);
const { v4: uuidv4 } = require('uuid');

// set ejs
app.set('view engine', 'ejs');

// app.get asks what url we are going to hit
app.get('/', (req, res) => {
  res.redirect(`/${uuidv4()}`);
})

app.get('/:room', (req, res) =>{
  res.render('room', { roomId: req.params.room})
})



server.listen(3030);

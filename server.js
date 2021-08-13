// webdevsimplifed
const express = require('express');
const app = express();
// http is built in, no need to install, specifiy which app you want to use.
const server = require('http').Server(app);

// app.get asks what url we are going to hit
app.get('/', (req, res) => {
  res.status(200).send("Hello World")
})


server.listen(3030);

// webdevsimplifed
const express = require('express');
const app = express();
// http is built in, no need to install, specifiy which app you want to use.
const server = require('http').Server(app);
const { v4: uuidv4 } = require('uuid');
// specify the server
const io = require('socket.io')(server);
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
})
// set ejs
app.set('view engine', 'ejs');

// tell server where public files are
app.use(express.static('public'));

// peerServer URL
app.use('/peerjs', peerServer);
// app.get asks what url we are going to hit
app.get('/', (req, res) => {
  res.redirect(`/${uuidv4()}`);
})

app.get('/:room', (req, res) =>{
  res.render('room', { roomId: req.params.room})
})

io.on('connection', socket =>{
  // join the room
  socket.on('join-room', (roomId, userId) =>{
    // userId comes from scripts.js peer connection
    // console.log('joined room', roomId);
    // Join room from secific ID
    socket.join(roomId);
    // broadcast the connection so it can be used on other streams
    // pass in userId
    socket.to(roomId).emit('user-connected', userId);
    // receive the messages
    socket.on('message', message =>{
      // send back to room
      io.to(roomId).emit('createMessage', message)
    })

  })
})



server.listen(process.env.PORT||3030);

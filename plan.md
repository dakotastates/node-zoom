# Plan of Action

- Initialize our NodeJs project - DONE
- Initialize our first view - DONE
- Create a room id - DONE
- Add the ability to view our own Video DONE
- Add ability to allow others to stream their Video DONE
- Add styling
- Add the ability to create messages
- Add mute button
- Add Stop Video Button





# Step by Step
- Create folder for project
- In terminal type - npm init, press enter until prompts are complete.
- create a server.js file
- install express - npm install express
- In server.js
  - Initialize express
    - const express = require('express');  
  - Create an app
    - const app = express();
  - Create server
    - const server = require('http').Server(app);
  - Listen on server Port 3030
    - server.listen(3030);
  - Create first URL
    app.get('/', (req, res) => {
      res.status(200).send("Hello World")
    })
  - Install Nodemon, use -g to install globally
    - npm install -g nodemon
  - Run server in terminal
    - nodemon server.js
- Set rooms, create folder called views
- Create a file called room.ejs inside views folder
  - In room.ejs create basic html file
    <!DOCTYPE html>
    <html lang="en" dir="ltr">
      <head>
        <meta charset="utf-8">
        <title>Zoom Clone</title>
      </head>
      <body>
        Hellloooooo World!!!!!
      </body>
    </html>
- To connect room.ejs to app -
- Install ejs, which helps us get variables from backend to frontend
  - npm install ejs
- Go to server.js
  - set the view engine
    - app.set('view engine', 'ejs');
  - Change our route to render
    app.get('/', (req, res) => {
      res.render('room');
    })
  - run server and view in browser, should see message from room.ejs
- Create a room id
  - install uuid in terminal, will create random id's
    - npm install uuid
  - import the v4 version of uuid
    - const { v4: uuidv4 } = require('uuid');
  - create a new url with room params
    app.get('/:room', (req, res) =>{
      res.render('room', { roomId: req.params.room})
    })
  - update our initial route to redirect with url id to room route
    app.get('/', (req, res) => {
      res.redirect(`/${uuidv4()}`);
    })
  - Save, refresh browser, notice the change in url to include id

- Create a public folder and create a script.js file within public
  - import script.js inside room.ejs
    - <script src="script.js"></script>
  - In server.js tell server where public folder is
    - app.use(express.static('public'));
- To view own video
  - In script.js use navigator.mediaDevices
      let myVideoStream
      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      }).then(stream =>{
        myVideoStream = stream
      })
  - getUSerMedia returns a promise
  - Create an addVideoStream function which plays the stream when loaded.
    const addVideoStream = (video, stream) =>{
      video.srcObject = stream;
      // play video once data is loaded
      video.addEventListener('loadedmetadata', () =>{
        video.play();
      })  
    }
  - create a video element
    - const myVideo = document.createElement('video');
  - mute our Video
    - myVideo.muted = true;
  - Inside the promise add the add video stream function and pass in the video element

      let myVideoStream
      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      }).then(stream =>{
        // assign the response to a variable
        myVideoStream = stream;
        // pass in myVideo element and the stream
        addVideoStream(myVideo, stream);
      })
  - In room.ejs add a video grid div
    - <div id='video-grid'></div>
  - In script.js capture video element by id
    - const videoGrid = document.getElementById('video-grid');
  - In the add video stream function append the video element by passing in the video
    - videoGrid.append(video);
      const addVideoStream = (video, stream) =>{
        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () =>{
          video.play();
        })
        videoGrid.append(video);
      }
    - Make sure script tags are at bottom of room.ejs body
    - refresh, accept video, and webcam will be activated
- Add some styling to make video smaller
  - create style.css file inside public folder
  - import style.css inside room.ejs in header
    - <link rel="stylesheet" href="style.css">
  - In style.css center, display flex and adjust size of videoGrid
      #video-grid{
        display: flex;
        justify-content: center;
      }

      video {
        height: 300px;
        width: 400px;
        object-fit: cover;
      }
- WebSockets are for realtime communications
  - install socket.io
    - npm install socket.io
  - import socket.io in server.js
    - const io = require('socket.io')(server);
  - create a connection and join room

    io.on('connection', socket =>{
      // join the room
      socket.on('join-room', () =>{
        console.log('joined room');
      })
    })
  - In room.ejs import socket.js into head
    - <script src='/socket.io/socket.io.js'></script>
  - In script.js join the room
    - socket.emit('join-room');
  - In server.js import socket
    - const socket = io('/')
  - Refresh and check log, will tell us we've jointed the room
- After connection we need to join the room
  - Place roomId into a variable within room.erj head so we can have access to it.
    <script>
      const ROOM_ID = '<%= roomId %>'
    </script>
  - Update our join room emit socket in script.js to include ROOM_ID
    - socket.emit('join-room', ROOM_ID);
  - Update our socket connection in server.js to include the id by passing it through
    io.on('connection', socket =>{
      // join the room
      socket.on('join-room', (roomId) =>{
        // console.log('joined room');
        // Join room from secific ID
        socket.join(roomId);
      })
    })
  - Tell socket we have the user connected
    - socket.to(roomId).emit('user-connected');
  - In script.js listen on the connection for new users
      socket.on('user-connected', () =>{
        connectToNewUser();
      })
  - create the connectToNewUser function - consoleLog for now
      const connectToNewUser () =>{
        console.log('new user')
      }
  - Save, refresh, copy link, go to another browser, check console.log, will have another user who has joined.
  - Now we need to be able to identify the new user.
  - Use peer to peer
    - SIDE NOTE - What is Webrtc?
      - Free and open source product that provides web browsers and mobile applications with real-time communication via simple applcation programming interfaces
      - peerJS wraps the browser's WebRTC implemation to provide a complete, confingurable, and easy to use peer-to-peer connection to a remote peer.
    - install peerJS
      - npm install peer
    - Run peerJS Server, import
      - const { ExpressPeerServer } = require('peer');
    - Connect to ExpressPeerServer
        const peerServer = ExpressPeerServer(server, {
          debug: true
        })
    - Specify the URL for the Peer server
      - app.use('/peerjs', peerServer);
    - In room.ejs, import peer
      - <script src="https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js"></script>
    -  Create new peer connection in scripts.js
        var peer = new Peer(undefined, {
          path: '/peerjs',
          host: '/',
          port: '3030'
        });
    - Listen on the Peer connection, wrap join-room socket with peer, pass in id
      peer.on('open', id => {
        // specific id for the person connecting auto created by peer
        // let server know we've joined the room
        socket.emit('join-room', ROOM_ID, id);
      })
    - Update socket connection to include userId and emit the id
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
          })
        })
    - update the socket.on response from server and pass the userId through all nesseary channels. Console log the id and join new user. ID should be in console.  

        // listen on connection /  response from server
        socket.on('user-connected', (userId) =>{
          connectToNewUser(userId, stream);
        })

        const connectToNewUser = (userId, stream) => {
          // Listen on Peer Connection
          console.log(userId);
        }

  - Now use peer to connect the users - Call user
    - call the user
      - const call = peer.call(userId, stream)
    - create new video element
      - const video = document.createElement('video')
    - add video to stream using the previouly created addVideoStream function
        call.on('stream', userVideoStream =>{
          // Use the add video stream and pass in the new users stream
          addVideoStream(video, userVideoStream)
        })
    - move the user-connected on socket inside the promise so we can have access to the stream and pass it into the connectToNewUser function

      let myVideoStream
      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      }).then(stream =>{
        // assign the response to a variable
        myVideoStream = stream;
        // pass in myVideo element and the stream
        addVideoStream(myVideo, stream);

        // listen on connection /  response from server
        socket.on('user-connected', (userId) =>{
          connectToNewUser(userId, stream);
        })
      })

  - Answer the call inside the promise
    peer.on('call', call =>{
      // answer the Call
      call.answer(stream)
      const video = document.createElement('video')
      // add the video stream for the user
      call.on('stream', userVideoStream =>{
        addVideoStream(video, userVideoStream)
      })
    })
  - Refresh and add new user, will have two users streams shown

- Style
  - Import fontawesome to room.ejs
    - <script src="https://kit.fontawesome.com/c939d0e917.js"></script>
  - Add nessessary divs for controls, chat, and video
      <div class="main">
        <div class="main__left">
          <div class="main__videos">
            <div id='video-grid'></div>
          </div>
          <div class="main__controls">
            <div class="main__controls__block">
              <div class="main__controls__button">
                <i class="fas fa-microphone"></i>
                <span>Mute</span>
              </div>
              <div class="main__controls__button">
                <i class="fas fa-video"></i>
                <span>Stop Video</span>
              </div>
            </div>

            <div class="main__controls__block">
              <div class="main__controls__button">
                <i class="fas fa-shield-alt"></i>
                <span>Security</span>
              </div>
              <div class="main__controls__button">
                <i class="fas fa-user-friends"></i>
                <span>Participants</span>
              </div>
              <div class="main__controls__button">
                <i class="fas fa-comment-alt"></i>
                <span>Chat</span>
              </div>
            </div>

            <div class="main__controls__block">
              <div class="main__controls__button">
                <span class="leave_meeting">Leave Meeting</span>
              </div>

            </div>

          </div>
        </div>
        <div class="main__right">
          <div class="main__header">
            <h6>Chat</h6>
          </div>
        </div>
      </div>
  - main style and buttons in styles.css
      body {
        margin: 0;
        padding: 0;
      }

      #video-grid{
        display: flex;
        justify-content: center;
      }

      video {
        height: 300px;
        width: 400px;
        object-fit: cover;
      }

      .main {
        height: 100vh;
        display: flex;
      }

      .main__videos{
        flex-grow: 1;
        background-color: black;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .main__left {
        flex: 0.8;
        display: flex;
        flex-direction: column;
      }

      .main__right {
        flex: 0.2;
      }

      .main__controls{
        display: flex;
        background-color: #1c1E20;
        color: #D2D2D2;
        padding: 5px;
        justify-content: space-between;
      }

      .main__controls__block{
        display: flex;

      }

      .main__controls__button{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 8px 10px;
        min-width: 80px;
        cursor: pointer;
      }

      .main__controls__button i {
        font-size: 24px;
      }

      .main__controls__button:hover {
        background-color: #343434;
        border-radius: 5px;
      }

      .leave_meeting{
        color: #EB534B;
      }

  - Chat Design
    - update main__right for chat features divs

        <div class="main__right">
          <div class="main__header">
            <h6>Chat</h6>
          </div>
          <div class="main__chat_window">
            <ul class="messages">

            </ul>
          </div>
          <div class="main__message_container">
            <input id="chat_message" type='text' placeholder="Type message here...">
          </div>
        </div>

    - Link bootstrap stylesheet
      - <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" crossorigin="anonymous">

    - Link javascript from bootstrap
      - <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-U1DAWAznBHeqEIlVSCgzq+c9gqGAJn5c/t99JyeKa9xxaYpSvHU5awsuZVVFIhvj" crossorigin="anonymous"></script>

    - Chat CSS
      .main__right {
        flex: 0.2;
        display: flex;
        flex-direction: column;
        background-color: #242324;
        border-left: 1px solid #3D3D42;
      }

      .main__header{
        color: #f5f5f5;
        text-align: center;
      }

      .main__message_container{
        padding: 22px 12px;
        display: flex;
      }

      .main__message_container input{
        flex-grow: 1;
        background-color: transparent;
        border: none;
        color: #F5F5F5;
      }

      .main__chat_window{
        flex-grow: 1;
      }

- Chat System
  

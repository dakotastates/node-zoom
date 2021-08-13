# Plan of Action

- Initialize our NodeJs project - DONE
- Initialize our first view - DONE
- Create a room id - DONE
- Add the ability to view our own Video
- Add ability to allow others to stream their Video
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

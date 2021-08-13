# Plan of Action

- Initialize our NodeJs project
- Initialize our first view
- Create a room id
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

const socket = io('/')
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '3030'
});

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

// send to server
peer.on('open', id => {
  // specific id for the person connecting auto created by peer
  // let server know we've joined the room
  socket.emit('join-room', ROOM_ID, id);
})

const connectToNewUser = (userId, stream) => {
  // Listen on Peer Connection
  // Call the user
  const call = peer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream =>{
    // Use the add video stream and pass in the new users stream
    addVideoStream(video, userVideoStream)
  })
  // console.log(userId);
}

const addVideoStream = (video, stream) =>{
  video.srcObject = stream;
  // play video once data is loaded
  video.addEventListener('loadedmetadata', () =>{
    video.play();
  })
  videoGrid.append(video);
}

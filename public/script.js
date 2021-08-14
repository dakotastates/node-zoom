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
  audio: false
}).then(stream =>{
  // assign the response to a variable
  myVideoStream = stream;
  // pass in myVideo element and the stream
  addVideoStream(myVideo, stream);

  peer.on('call', call =>{
    // answer the Call
    call.answer(stream)
    const video = document.createElement('video')
    // add the video stream for the user
    call.on('stream', userVideoStream =>{
      addVideoStream(video, userVideoStream)
    })
  })

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

// use jquery previously imported with bootstrap
let text = $('input')

$('html').keydown((e) =>{
  // have a condition where key 13 (enter) and check if not empty
  if(e.which == 13 && text.val().length !== 0){
    // console.log(text.val())
    // send the value of the input to the server
    socket.emit('message', text.val());
    // after enter is pressed we clear the input
    text.val('')
  }
})

// recieve message back from server
socket.on('createMessage', message =>{
  // console.log(message)
  // Show message in the chat
  // append the ul and add a li and the message
  $('ul').append(`<li class="message"><b>user</b><br/>${message}</li>`)
  scrollToBottom()
})

const scrollToBottom = () =>{
  // caputure main chat window
  let d = $('.main__chat_window');
  // scroll to the top
  d.scrollTop(d.prop('scrollHeight'))
}

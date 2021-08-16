const socket = io('/')
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  // port: '3030'
  port: '443'
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

// mute out Video
const muteUnmute = () =>{
  // get the current stream, get audio tracks, get enabled version of track
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  // if it's enabled we will disable it
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    // if it's disabled we will enable it
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const setMuteButton = () => {
  const html = `
  <i class="fas fa-microphone"></i>
  <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () =>{
  const html = `
  <i class="unmute fas fa-microphone-slash"></i>
  <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

// Stop Video
const playStop = () =>{
  // check if video is enabled
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

const setStopVideo = () =>{
  const html = `
  <i class="fas fa-video"></i>
  <span>Stop Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () =>{
  const html = `
  <i class="stop fas fa-video-slash"></i>
  <span>Play Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

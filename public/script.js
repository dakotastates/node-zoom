
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;


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


const addVideoStream = (video, stream) =>{
  video.srcObject = stream;
  // play video once data is loaded
  video.addEventListener('loadedmetadata', () =>{
    video.play();
  })
  videoGrid.append(video);
}

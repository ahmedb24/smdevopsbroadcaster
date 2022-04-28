const socket = io('/')

const videoGrid = document.getElementById('video-grid')

const myVideo = document.createElement('video')
myVideo.muted = true

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream)

})


function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}

const myPeer = new Peer(undefined, {
    host: '/',
    port: '3008'
})
myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})
socket.on('user-connected', userId => {
    myPeer
    console.log("User Connected " + userId)
})

socket.on('user-disconnected', userId => {
    console.log("user-disconnected " , myPeer)
    // console.log("User Connected " + userId)
})

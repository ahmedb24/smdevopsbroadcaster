const socket = io('/')

const videoGrid = document.getElementById('video-grid')
const startBtn = document.getElementById('start')
const stopBtn = document.getElementById('stop')
const homeBtn = document.getElementById('home')
const peers = {};

startBtn.addEventListener('click', (e) => {
    startRecording()
})

stopBtn.addEventListener('click', (e) => {
    const child = videoGrid.lastElementChild;
    while (child) {
        videoGrid.removeChild(child)
        child = videoGrid.lastElementChild;
    }
})

homeBtn.addEventListener('click', (e) => {
    location.replace('/')
})

startRecording();

function startRecording() {
    const myVideo = document.createElement('video')
    myVideo.muted = true

    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then(stream => {
        addVideoStream(myVideo, stream)

        socket.on('user-connected', userId => {
            console.log("User Connected " + userId)
            makeConnectionToUser(userId, stream)
        })

        socket.on('user-disconnected', userId => {
            if (peers[userId]) peers[userId].close();
            console.log("user-disconnected ", myPeer);
        })
    })
}

function makeConnectionToUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove()
    })

    peers[userId] = call;
}

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

myPeer.on('call', call => {
    navigator.getUserMedia({ video: true, audio: true }, (stream) => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        }, (err) => { console.error('Failed To get local stream', err) })
    })
})
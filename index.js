require('dotenv').config()
const express = require('express')

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server)


app.set('view engine', 'ejs');
app.use(express.static('public'));

const port = process.env.PORT;

app.get('/', (req, res) => {
    res.render('home');
});

const roomRoutes = require("./routes/room")
app.use("/", roomRoutes)


io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})

server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
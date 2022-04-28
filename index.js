require('dotenv').config()
const express = require('express')
// const { ExpressPeerServer } = require('peer');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server)


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false,
    limit: "50mb"
}))

const port = process.env.PORT;
// require("./index")

// const peerServer = ExpressPeerServer(server, {
//     debug: true,
// });

// app.use('/peerjs', peerServer);

// app.use(express.urlencoded({
//     extended: false,
//     limit: "50mb"
// }))

app.get('/', (req, res) => {
    // res.redirect(`/${uuidv4()}`);
    // res.send('Express + TypeScript Server');
    // res.render('room', { roomId: req.param.room });
    res.render('home');
});


app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room });
    console.log(req.body, req.params)

    io.on('connection', socket => {
        socket.on('join-room', (roomId, userId) => {
            socket.join(roomId)
            socket.to(roomId).broadcast.emit('user-connected', userId)

            socket.on('disconnect', () => {
                socket.to(roomId).broadcast.emit('user-disconnected', userId)
            })
        })
    })
});

app.post('/', (req, res) => {
    // res.send('Express + TypeScript Server');
    // res.render('room', { roomId: req.param.room });
    if (!req.body.name || !req.body.room) {res.render('home'); return;}
    res.redirect(`/${req.body.room}`);
    // res.redirect(`/broadcast/${uuidv4()}`);
    // res.render('home');

    // res.render('room', { roomId: req.body.room });

    // io.on('connection', socket => {
    //     socket.on('join-room', (roomId, userId) => {
    //         console.log(roomId, userId);
    //         socket.join(roomId)
    //         socket.to(roomId).broadcast.emit('user-connected', userId)

    //         socket.on('disconnect', () => {
    //             socket.to(roomId).broadcast.emit('user-disconnected', userId)
    //         })
    //     })
    // })
});











// const authRoutes = require("./routes/authentication")
// app.use("/auth", authRoutes)

// const moduleRoutes = require("./routes/modules")
// app.use("/module", moduleRoutes)

// const paymentAccountRoutes = require("./routes/payment-account")
// app.use("/payment-account", paymentAccountRoutes)

// const stateRoutes = require("./routes/state")
// app.use("/state", stateRoutes)

server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
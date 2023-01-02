// Node server which will handle socket io connections
const io = require('socket.io')(process.env.PORT || 3001, {
    cors: {
        origin: "*",
        methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"]
    }
})

console.log(process.env.PORT)
const users = {};

io.on('connection', socket => {
    // If any new user joins, let other users connected to the server know!
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        console.log("Joined : ", name)
        socket.broadcast.emit('user-joined', name);
    });

    // If someone sends a message, broadcast it to other people
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] })
    });

    // If someone leaves the chat, let others know 
    socket.on('disconnect', message => {
        console.log("Left : ", users[socket.id])
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });


})

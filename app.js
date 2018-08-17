
const express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);
//keep a list of players
let players = {}
//serve html
//serve name and model selection page
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/client/index/index.html')
})
app.use('/',express.static(__dirname+'/client/index'))
//serve chat html and files
app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/client/chat/index.html');
});
app.use('/chat', express.static(__dirname + '/client/chat'));
//setup socket io (realtime communications)
io.on('connect', socket => {
    socket.on('disconnect', () => {
        io.emit('playerDisconnect', socket.id)
        console.log('disconnect id:' + socket.id)
        //remove player on disconnect
        delete players[socket.id]
    })
    io.emit('playerJoin', { model: socket.handshake.query.model, name: socket.handshake.query.name, id: socket.id })
    socket.emit('gameData', { players })
    //the reason for adding the id even though its the key is so the client has eaisier access
    let rotation = { x: 0, y: 0, z: 0 }, position = { x: 0, y: 0, z: 0 }
    players[socket.id] = { model: socket.handshake.query.model, name: socket.handshake.query.name, id: socket.id,position,rotation}
    console.log('user connected id:' + socket.id)
    socket.on('playerUpdate', update => {
        players[update.id].position = update.position
        players[update.id].rotation = update.rotation
        io.sockets.emit('playerUpdate', update)
    })
})

server.listen(80, '0.0.0.0')
console.log(`Server is running to access on this device go to http://localhost or for devices on the network go to http://${require('os').hostname()}`)
setInterval(function () {
    console.dir(players)
}, 5000)
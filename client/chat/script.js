let scene = document.querySelector('a-scene')
let modelUrl = prompt('Select a player model from google poly and paste the url here'),
    name = prompt('user name'),
    camera = document.querySelector('a-camera'),
    rotation = JSON.stringify(camera.getAttribute('rotation'))
position = JSON.stringify(camera.getAttribute('position'))
document.querySelector('#playerModel').setAttribute('gblock', modelUrl)
//connect socket io
socket = io(`/?model=${modelUrl}&name=${name}`);
socket.on('playerUpdate', update => {
    //only update if its not you 
    console.log('update')
    if (update.id != socket.id) {
        let playerToUpdate = document.querySelector(`#id${update.id}`)
        update.position.y+=1
        update.position.z+=2
        playerToUpdate.setAttribute('position', update.position)
        playerToUpdate.setAttribute('rotation', update.rotation)
    }
})
socket.on('gameData', data => {
    //render each player
    console.log('data')
    keys = Object.keys(data.players)
    keys.forEach(key => {
        if(data.players[key]!=socket.id){
        renderPlayer(data.players[key])
        }
    });
});
socket.on('playerJoin', player => {
    if(player.id!=socket.id){
    renderPlayer(player)
    }
})
//remove player on disconnect
socket.on('playerDisconnect', id => {
    document.querySelector(`#id${id}`).remove()
});
function renderPlayer(player) {
    let playerEl = document.createElement('a-entity')
    let playerModel = document.createElement('a-entity');
    let nameTag = document.createElement('a-text');
    nameTag.setAttribute('value', player.name);
    playerModel.setAttribute('gblock', player.model);
    playerEl.id = 'id'+player.id;
    playerEl.appendChild(nameTag);
    playerEl.appendChild(playerModel);
    playerEl.setAttribute('position',player.position)
    playerEl.setAttribute('rotation',player.rotation)
    scene.appendChild(playerEl);
}
setInterval(function () {
    let newPosition = JSON.stringify(camera.getAttribute('position'))
    let newRotation = JSON.stringify(camera.getAttribute('rotation'))
    toUpdate = false
    if (newPosition != position) {
        toUpdate = true
    }
    if (newRotation != rotation) {
        toUpdate = true
    }
    position = newPosition
    rotation = newRotation
    if (toUpdate==true) {
        let update = {}
        update.id = socket.id
        update.position = camera.getAttribute('position')
        let rotation = camera.getAttribute('rotation')
        rotation.y+=playerModel.getAttribute('rotation').y
        update.rotation=rotation
        socket.emit('playerUpdate', update)
    }
}, 1000 / 30)
setTimeout(function(){
scene.remove(document.querySelector('#id'+socket.id))
},1000)
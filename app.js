var app = require('express')();
    server = require('http').createServer(app);
    io = require('socket.io').listen(server);
// Chargement de la page index.html
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket, pseudo) {
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('nouveau_client', function(pseudo) {
        socket.pseudo = pseudo;
        socket.broadcast.emit('nouveau_client', pseudo);
    });

    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (message) {
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    }); 
});



var ipttp = require("ip");
console.log("==========================================");
console.log("===================CHAT===================");
console.log("==========================================");
console.log("IP SERVEUR : " + ipttp.address() + ":9090"); 
console.log("==========================================");
server.listen(9090);
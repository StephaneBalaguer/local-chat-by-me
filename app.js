var express = require('express');
var ent = require('ent'); // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.use(express.static('public'));

//rendre le dossier "public" accessible 
app.use(express.static('public'));
// Chargement de la page index.html
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket, pseudo) {
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('nouveau_client', function (pseudo) {
        socket.pseudo = pseudo;
        socket.broadcast.emit('nouveau_client', pseudo);
    });

    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (message) {
        socket.broadcast.emit('message', { pseudo: socket.pseudo, message: message });
    });

    socket.on('code', function (message) {
        message = ent.encode(message);
        message = "<div id=\"code\">" + message + "</div>"
        socket.broadcast.emit('message', { pseudo: socket.pseudo, message: message });
        socket.emit('recepcode', { pseudo: socket.pseudo, message: message });
    });
});



var ipttp = require("ip");
console.log("==========================================");
console.log("===================CHAT===================");
console.log("==========================================");
console.log("IP SERVEUR : " + ipttp.address() + ":9090");
console.log("==========================================");
server.listen(9090);
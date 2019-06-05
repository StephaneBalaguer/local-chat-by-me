/*---------------------------------------------------------------------*/
/*
Voulez vous generer les logs : 
OUI : true
NON : false
*/
var genererleslogs = true;
/*
Voulez vous generer les logs : 
OUI : true
NON : false
*/
/*---------------------------------------------------------------------*/




var express = require('express');
var ent = require('ent'); /* Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)*/
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var ipttp = require("ip");
const fs = require('fs');
var compteurpourlecode= 0;


app.use(express.static('public'));

/*rendre le dossier "public" accessible */
app.use(express.static('public'));

/* Chargement de la page index.html*/
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket, pseudo) {
    /* Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes*/
    socket.on('nouveau_client', function (pseudo) {

        save(pseudo + " a rejoint le chat !");

        socket.pseudo = pseudo;
        socket.broadcast.emit('nouveau_client', pseudo);
    });

    /* Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes*/
    socket.on('message', function (message) {
        var tab = message.split("\0");

        save(socket.pseudo + " : " + tab[0]);

        message = ent.encode(tab[0]) + "\0" + tab[1];
        socket.broadcast.emit('message', { pseudo: socket.pseudo, message: message });
        socket.emit('message', { pseudo: socket.pseudo, message: message });
    });

    socket.on('code', function (message) {

        save("(CODE)" + socket.pseudo + " : " + message);

        message = ent.encode(message);
        message=message + "\0" + compteurpourlecode;
       
        socket.broadcast.emit('code', { pseudo: socket.pseudo, message: message });
        socket.emit('code', { pseudo: socket.pseudo, message: message });
        compteurpourlecode++;
    });
});

console.log("==========================================");
console.log("Avez vous configurer les logs dans le fichier app.js");
console.log("==========================================");
console.log("===================CHAT===================");
console.log("==========================================");
console.log("IP SERVEUR : " + ipttp.address() + ":9090");
console.log("==========================================");
console.log("Generation des log : " + genererleslogs);

server.listen(9090);

function genererTimeStamp() {
    var currentDate = new Date();
    var jour = currentDate.getDate();
    var mois = currentDate.getMonth(); //Be careful! January is 0 not 1
    var annee = currentDate.getFullYear();
    var heure = currentDate.getHours();
    var minute = currentDate.getMinutes();
    var seconde = currentDate.getSeconds();
    var datecomplete = '[' + annee + ':' + (mois + 1) + ':' + jour + '-' + heure + ':' + minute + ':' + seconde + ']';
    return datecomplete;
}

if (genererleslogs) {
    var logStream = fs.createWriteStream('log/log - ' + genererTimeStamp() + '.txt', { 'flags': 'a' });
    save(genererTimeStamp() + "App started");
}

function save(message) {
    if (genererleslogs) {
        logStream.write(genererTimeStamp() + ' ' + message + "\r\n");
    }
}
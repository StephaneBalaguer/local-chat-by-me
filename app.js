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
var compteurpourlecode = 0;


app.use(express.static('public'));

/*rendre le dossier "public" accessible */
app.use(express.static('public'));

/* Chargement de la page index.html*/
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket, pseudo) {
    /* Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes*/
    socket.on('nouveau_client', function (pseudo) {
        save(pseudo + " a rejoint le chat !");
        socket.pseudo = pseudo;
        var aEnvoyer = '{"pseudo" : "' + pseudo + '","type" : "infoconnection","message" : " ","couleur" : " ","num" : " "}'
        socket.broadcast.emit('reception', aEnvoyer);
    });

    socket.on('disconnect', function () {
        var aEnvoyer = '{"pseudo" : "' + socket.pseudo + '","type" : "infodeconnection","message" : " ","couleur" : " ","num" : " "}'
        socket.broadcast.emit('reception', aEnvoyer);
        save(socket.pseudo + " est parti");
    });



    /* Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes*/
    socket.on('message', function (message) {
        var obj = JSON.parse(message);
        var aEnvoyer = '{"pseudo" : "' + obj.pseudo + '", "type" : "' + obj.type + '", "message" : "' + obj.message + '", "couleur" : "' + obj.couleur + '", "num" : "' + compteurpourlecode + '"}'
        compteurpourlecode++;
        save(obj.pseudo + " : " + ent.decode(obj.message));
        socket.broadcast.emit('reception', aEnvoyer);
        socket.emit('reception', aEnvoyer);
    });


});

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
    save("App started");
}

function save(message) {
    if (genererleslogs) {
        logStream.write(genererTimeStamp() + ' ' + message + "\r\n");
    }
}
console.log("\r\n\r\n\r\n\r\n");
console.log("\r\n\r\n\r\n\r\n");
console.log(" ______  __    __  ________  __       __         ______   __    __   ______  ________ ");
console.log("|      \\|  \\  |  \\|        \\|  \\     /  \\       /      \\ |  \\  |  \\ /      \\|        \\ ");
console.log(" \\$$$$$$| $$\\ | $$ \\$$$$$$$$| $$\\   /  $$      |  $$$$$$\\| $$  | $$|  $$$$$$\\\\$$$$$$$$");
console.log("  | $$  | $$$\\| $$   | $$   | $$$\\ /  $$$      | $$   \\$$| $$__| $$| $$__| $$  | $$   ");
console.log("  | $$  | $$$$\\ $$   | $$   | $$$$\\  $$$$      | $$      | $$    $$| $$    $$  | $$   ");
console.log("  | $$  | $$\\$$ $$   | $$   | $$\\$$ $$ $$      | $$   __ | $$$$$$$$| $$$$$$$$  | $$   ");
console.log(" _| $$_ | $$ \\$$$$   | $$   | $$ \\$$$| $$      | $$__/  \\| $$  | $$| $$  | $$  | $$   ");
console.log("|   $$ \\| $$  \\$$$   | $$   | $$  \\$ | $$       \\$$    $$| $$  | $$| $$  | $$  | $$   ");
console.log(" \\$$$$$$ \\$$   \\$$    \\$$    \\$$      \\$$        \\$$$$$$  \\$$   \\$$ \\$$   \\$$   \\$$   ");
                                                                                      
console.log("\r\n\r\n\r\n\r\n")   ;                                                                              
console.log("\r\n\r\n\r\n\r\n");
console.log("==========================================");
console.log("Avez vous configure les logs dans le fichier app.js");
console.log("==========================================");
console.log("===================CHAT===================");
console.log("==========================================");
console.log("IP SERVEUR : " + ipttp.address() + ":9090");
console.log("==========================================");
console.log("Generation des log : " + genererleslogs);


server.listen(9090);

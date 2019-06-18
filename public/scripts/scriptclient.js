var sonactif = true;
var popip = window.location.href;
window.addEventListener("onkeypress", checklatouche, false);

/*Lors de l'appuie de la touche ENTREE : Envoie du message */
function checklatouche(e) {

    if (e.keyCode == 13) {
        envoiecouleur();
        return false;
    }
}


/*Connexion à socket.io*/
var addrserv = popip.substr(0, popip.length - 1);
var socket = io.connect(addrserv);

var pseudo = null;
/* On demande le pseudo, on l'envoie au serveur et on l'affiche dans le titre*/
while (pseudo == null || pseudo == "") {
    pseudo = prompt('Quel est votre pseudo ?');
}

socket.emit('nouveau_client', pseudo);
document.title = pseudo + ' - ' + document.title;


/** EVENEMENT  message
 * ENTREE OBJET data  : data.message | data.pseudo
 * ACTION : Affichage du message :  separation des infos dans le message ( message \0 couleur ) ajout des balises html et affichage du message
 **/
socket.on('reception', function (data) {
    var obj = JSON.parse(data);
    var message;
    if (obj.type == "text") {
        message = "<span style=\"color:" + obj.couleur + "\"> " + lien(obj.message) + " </span>";
        insereMessage(obj.pseudo, message);
        if (sonactif == true) {
            document.getElementById("notif").play();
        }
    }
    if (obj.type == "code") {
        message = "<button onclick=\"copier(" + obj.num + ")\">Copier ! </button><div id=\"code\" class=\"" + obj.num + "\">" + obj.message + "</div>";
        insereMessage(obj.pseudo, message);
        if (sonactif == true) {
            document.getElementById("notif").play();
        }
    }
    if (obj.type == "infoconnection") {
        $('#zone_chat').prepend('<p><em>' + obj.pseudo + ' a rejoint le Chat !</em></p>');
        if (sonactif == true) {
            document.getElementById('online').play();
        }
    }
    if (obj.type == "infodeconnection") {
        $('#zone_chat').prepend('<p><em>' + obj.pseudo + ' est parti !</em></p>');
        if (sonactif == true) {
            document.getElementById('online').play();
        }
    }


})


/** EVENEMENT  code
 * ENTREE OBJET data  : data.message | data.pseudo
 * ACTION : Affichage du message :  se ajout des balises html et affichage du message
 **/
/*socket.on('code', function (data) {
    tab = data.message.split("\0");
    var message = "<button onclick=\"copier(" + tab[1] + ")\">Copier ! </button><div id=\"code\" class=\"" + tab[1] + "\">" + tab[0] + "</div>"
    insereMessage(data.pseudo, message);
})
*/

/** EVENEMENT  nouveau_client
 * ENTREE STRING pseudo
 * ACTION : Affichage du message :  "--STRING pseudo-- a rejoint...."
 **/
/*socket.on('nouveau_client', function (pseudo) {
    $('#zone_chat').prepend('<p><em>' + pseudo + ' a rejoint le Chat !</em></p>');
    if (sonactif == true) {
        document.getElementById('online').play();
    }
})
*/

/** FONCTION  insereMessage
 * ENTREE : STRING pseudo , STRING message 
 * SORTIE : 
 * 
 * ACTION :
 * Ajoute dans la zone de chat:
 * EN GRAS --STRING pseudo--
 *         --STRING message-- 
 **/
function insereMessage(pseudo, message) {
    $('#zone_chat').prepend('<p><strong>' + pseudo + '</strong> ' + message + '</p>');
}


/** FONCTION  ajoutbalisecode
 * ENTREE :  
 * SORTIE : false
 * 
 * ACTION :
 * envoie le message avec l'information que c'est du code au serveur
 **/
function ajoutbalisecode() {
    if ($('#message').val() != "") {
        var message = $('#message').val();
        var aEnvoyer = '{"pseudo" : "' + encode(pseudo) + '","type" : "code","message" : "' + encode(message) + '", "couleur" : " "}';
        socket.emit('message', aEnvoyer);
    }
    $('#message').val('').focus(); // Vide la zone de Chat et remet le focus dessus
    return false; // Permet de bloquer l'envoi "classique" du formulaire
}



/** FONCTION  envoiecouleur
 * ENTREE :  
 * SORTIE : false
 * 
 * ACTION :
 * envoie le message avec la couleur au serveur pour le broadcast a tous
 * separateur utilise : \0
 **/
function envoiecouleur() {

    if ($('#message').val() != "") {
        var message = $('#message').val();
        var couleur = document.getElementById("colorpicket").value;
        var aEnvoyer = '{"pseudo" : "' + encode(pseudo) + '","type" : "text","message" : "' + encode(message) + '", "couleur" : "' + encode(couleur) + '"}';
        socket.emit('message', aEnvoyer);
    }
    $('#message').val('').focus(); // Vide la zone de Chat et remet le focus dessus
    return false; // Permet de bloquer l'envoi "classique" du formulaire
}


/**
 * FONCTION lien
 * ENTREE : STRING message 
 * SORTIE : STRING out
 * 
 * ACTION :
 * decode le message 
 * recherche les liens http / https
 * rends les lien clickable 
 * encode les caracteres de nouveau
 **/
function lien(message) {
    message = decode(message);
    var out = "";
    var too = message.split(' ');
    for (i = 0; i < too.length; i++) {

        var n = too[i].search("http://");
        var m = too[i].search("https://");
        if (n == 0 || m == 0) {
            too[i] = "<a href=\"" + encode(too[i]) + "\" target=\"_blank\"\>" + encode(too[i]) + "</a>";
            out += too[i] + " ";
        } else {
            out += encode(too[i]) + " ";
        }
    }
    return out;
}


/**
 * FONCTION changerson
 * ENTREE : 
 * SORTIE :  
 * 
 * ACTION : 
 * active ou desactive le son 
 **/
function changerson() {
    sonactif = document.getElementById("checkboxetatson").checked;
    if (sonactif == true) {
        document.getElementById('imagehp').src = 'images/hp-on.png';
    }
    else {
        document.getElementById('imagehp').src = 'images/hp-off.png';
    }

}


function copier(nbr) {
    var txt = document.getElementsByClassName(nbr)[0].innerHTML;
    const el = document.createElement('textarea');
    el.value = txt;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

}

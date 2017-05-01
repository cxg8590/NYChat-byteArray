"use strict";

var socket;
var Nyc = false;
var Nysayings = ["Bada Boom, Bada Bing", "Fuggedaboudit", "I'm walkin here", "Only in New York! amiright?"];
var audio = new Audio("https://people.rit.edu/~cxg8590/music/NYC/nyc.mp3");

var connectSocket = function connectSocket(e) {
    console.log("connecting");
    var message = document.querySelector("#message");
    var chat = document.querySelector("#chat");
    socket = io.connect();

    socket.on('connect', function () {
        console.log('connecting');

        var user = document.querySelector("#username").value;

        if (!user) {
            user = 'unknown';
        }

        socket.emit('join', { name: user });
    });
    socket.on('msg', function (data) {
        console.log(data);
        recieveMessage(data);
    });
    socket.on('NYC', function () {
        NYC();
        console.log("im walkin");
    });
};

var sendMessage = function sendMessage(e) {
    if (Nyc) {
        var message = document.querySelector("#message");
        var rand = Math.floor(Math.random() * 4);
        message.value = Nysayings[rand];
        socket.emit('msgToServer', message.value);
    }
    if (Nyc == false) {
        var message = document.querySelector("#message");
        console.log("message" + message);
        console.log("message value" + message.value);
        socket.emit('msgToServer', message.value);
    }
};

/*const changeColor = (e) => {

};*/

var init = function init() {
    console.log("init");
    var connect = document.querySelector("#connect");
    var msg = document.querySelector("#send");
    connect.addEventListener('click', connectSocket);
    msg.addEventListener('click', sendMessage);
};

var NYC = function NYC() {
    console.log("Welcome to NYC");
    var bod = document.getElementById("norm");
    bod.className += "NYC";
    var img = document.getElementById("normimg");
    img.className += "NYC";
    audio.play();
    Nyc = true;
};

window.onload = init;
"use strict";

var recieveMessage = function recieveMessage(data) {
    var totalOffset = 0;

    var decoder = new TextDecoder();
    var myData = new DataView(data);
    var userLength = myData.getInt8();

    totalOffset += 1;

    var userView = new DataView(data, 1, userLength);
    var user = decoder.decode(userView);
    totalOffset += userLength;
    totalOffset += 1;
    console.log("user: " + user + ", data: " + userLength);

    var messView = new DataView(data, totalOffset);
    var mess = decoder.decode(messView);

    chat.value += user + ": " + mess + "\n";
};

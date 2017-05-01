var socket;
var Nyc = false;
var Nysayings = ["Bada Boom, Bada Bing","Fuggedaboudit", "I'm walkin here", "Only in New York! amiright?"];
var audio = new Audio("https://people.rit.edu/~cxg8590/music/NYC/nyc.mp3");

const connectSocket = (e) => {
    console.log("connecting");
	var message = document.querySelector("#message");
	var chat = document.querySelector("#chat");
	socket = io.connect();
	
	socket.on('connect', () => {
		console.log('connecting');
		
		let user = document.querySelector("#username").value;
		
		if(!user){
			user = 'unknown';
		}
		
		socket.emit('join', { name: user });
	});
	socket.on('msg', (data) => {
		console.log(data);
		recieveMessage(data);
	});
    socket.on('NYC', () => {
        NYC();
        console.log("im walkin");
    });
};

const sendMessage = (e) => {
    if(Nyc){
        var message = document.querySelector("#message");
        var rand = Math.floor(Math.random() * 4);
        message.value = Nysayings[rand];
        socket.emit('msgToServer', message.value);
    }
	if(Nyc == false){
        var message = document.querySelector("#message");
        console.log("message"+message);
        console.log("message value"+message.value);
        socket.emit('msgToServer', message.value);
    }
};

/*const changeColor = (e) => {

};*/

const init = () => {
    console.log("init");
	const connect = document.querySelector("#connect");
	const msg = document.querySelector("#send");
	connect.addEventListener('click', connectSocket);
	msg.addEventListener('click', sendMessage);
};

const NYC = () => {
    console.log("Welcome to NYC");
    var bod = document.getElementById("norm");
    bod.className += "NYC";
    var img = document.getElementById("normimg");
    img.className += "NYC";
    audio.play();
    Nyc = true;
}

window.onload = init;

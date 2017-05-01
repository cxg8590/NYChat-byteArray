
// Message class
const Message = require('./classes/Message.js');

const users = {};

let io;

const onJoined = (sock) => {
  const socket = sock;

  socket.on('join', (data) => {
    users[data.name] = data.name;
    console.log(`User: ${users}`);

    const joinMsg = new Message('server', `There are ${Object.keys(users).length} users online`);

    socket.name = data.name;
    let tempMess = Message.toMessage(joinMsg);
    socket.emit('msg', tempMess);

    socket.join('room1');

    const response = new Message('server', `${data.name} has joined the room.`);
    tempMess = Message.toMessage(response);
    socket.broadcast.to('room1').emit('msg', response);

    console.log(`${data.name} joined`);
    const joined = new Message('server', 'You joined the room');
    tempMess = Message.toMessage(joined);
    socket.emit('msg', tempMess);
  });
};

const onMsg = (sock) => {
  const socket = sock;

  socket.on('msgToServer', (data) => {
    let dt = data;
    if (data.charAt(0) === '\\') {
      if (data.substring(0, 3) === '\\me') {
        dt = socket.name + data.substring(3);
      }
      if (data.substring(0, 2) === '\\d') {
        dt = `Rolled a D${data.substring(2)} and got: ${Math.floor((Math.random()
        * data.substring(2)) + 1)}`;
      }
      if (data.substring(0, 4) === '\\num') {
        dt = `There are ${Object.keys(users).length} users here now`;
      }
      if (data.substring(0, 13) === '\\imwalkinhere') {
        io.sockets.in('room1').emit('NYC', { name: socket.name, msg: data });
        dt = 'Bada Bing';
      }
    }
    const message = new Message(socket.name, dt);
    const tempMess = Message.toMessage(message);
    io.sockets.in('room1').emit('msg', tempMess);
    console.log(`Users num: ${Object.keys(users).length}`);
  });
};

const onDisconnect = (sock) => {
  const socket = sock;
  socket.on('disconnect', () => {
    const message = new Message(socket.name, `${socket.name} has left the room`);
    const tempMess = Message.toMessage(message);
    io.sockets.in('room1').emit('msg', tempMess);
    delete users[socket.name];
    console.log(`delete event: ${users}`);
    socket.leave('room1');
  });
};

const setupSockets = (ioServer) => {
  io = ioServer;
  io.sockets.on('connection', (socket) => {
    console.log('started');

    onJoined(socket);
    onMsg(socket);
    onDisconnect(socket);
  });
};

console.log('Websocket server started');
module.exports.setupSockets = setupSockets;

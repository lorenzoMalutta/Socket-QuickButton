const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let teste = 0
let final = undefined

io.on('connection', (socket) => {
  socket.on('click', msg => {
    teste = teste + 1
    if (teste !== final) {
      console.log(teste)
      io.emit('click', teste);
      return
    }

    io.emit('click', socket.handshake.address)
  });
  socket.on('start', msg => {
    final = Math.floor(Math.random() * (350 - 50) + 50);
    io.emit('start', final);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

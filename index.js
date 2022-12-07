// Description: Arquivo principal do servidor
const app = require('express')(); 
const http = require('http').Server(app);
// Description: Importa o socket.io e cria uma nova instância passando o http como parâmetro
const io = require('socket.io')(http);
// Description: Importa o dotenv para pegar a porta do servidor
const port = process.env.PORT || 3000;

const fs = require('fs');

// Rota para o front end
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let teste = 0
let final = undefined

// Função para resetar os valores
function resetAllValues() {
  teste = 0
  final = undefined
}

// 
io.on('connection', (socket) => {
  console.log('Novo usuário conectado ' + socket.handshake.address);
  // Recebe o click do usuário e envia para o front end agregando o valor do clique em +1 checando se o valor é diferente que o valor final
  socket.on('click', msg => {
    if (teste !== final) {
      teste = teste + 1
      io.emit('click', teste);
      return 
    }
    msg = 'O jogador de IP:'+socket.handshake.address+' venceu!',
  // Faz o Handshake do IP do usuário que clicou no botão e envia para o front end  
    escreveVencecores(socket.handshake.address);
    io.emit('click',  msg)
    resetAllValues()
    socket.disconnect()
  });
  // Inicia o jogo e envia o valor final para o front end
  socket.on('start', msg => {
    teste = 0;
    final = Math.floor(Math.random() * (350 - 50) + 50);
    // final = 10;
    io.emit('start', final);
    io.emit('clearAll', 'clearAll')
  });
});

//    final = Math.floor(Math.random() * (350 - 50) + 50);
//    final = Math.floor(Math.random() * (10 - 5) + 5);

function escreveVencecores(ip) {
  fs.writeFile('vencedores.txt', ip, { flag: 'a+' }, function (err) {
    if(err) throw err;
    fs.appendFile('vencedores.txt', '\n', err => {
      if (err) {
        console.error(err)
        return
      }
    })
  });
}

// Inicia o servidor
http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

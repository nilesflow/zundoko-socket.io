var app  = require('express')();
var http = require('http').Server(app);
var io   = require('socket.io')(http);

var port = 3050;
var tick = 1500; // ms

var messages = {
  0: 'ズン',
  1: 'ドコ',
  2: 'キ・ヨ・シ！',
};

var current  = [];
var expected = [0, 0, 0, 0, 1];

function zundoko() {
  var rand = Math.floor(Math.random() * 2); // 0 or 1
  if (current.push(rand) > 5) {
     current.shift();
  }
  emit(rand); // zun or doko ..

  // kiyoshi ?
  if (current.toString() == expected.toString()) {
    emit(2);
  }
}

var sockets = [];
io.on('connection', function(socket) {
  sockets.push(socket);
  console.log('add socket. len:' + sockets.length);

  socket.on('disconnect', function () {
    for (var i in sockets) {
      if (sockets[i] == socket) {
        sockets.splice(i, 1);
      }
    }
    console.log('remove socket. len:' + sockets.length);
  });
});

function emit(index) {
  for (var i in sockets) {
    sockets[i].emit('message', messages[index]);
  }
}

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

http.listen(port, function() {
  console.log('listening on *:' + port);

  setInterval(zundoko, tick);
  console.log('start zundoko.');
});

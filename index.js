var app  = require('express')();
var http = require('http').Server(app);
var io   = require('socket.io')(http);

var messages = {
  0: 'ズン',
  1: 'ドコ',
  2: 'キ・ヨ・シ！',
  3: '　', // blank line
};

var current = [];
var expected = [0, 0, 0, 0, 1];

function zundoko(socket) {
  var rand = Math.floor(Math.random() * 2); // 0 or 1
  if (current.push(rand) > 5) {
     current.shift();
  }
  socket.emit('message', messages[rand]); // zun or doko ..

  // kiyoshi ?
  if (current.toString() == expected.toString()) {
    socket.emit('message', messages[2]);
    socket.emit('message', messages[3]);
  }
}

io.on('connection', function(socket) {
  setInterval(zundoko.bind(this, socket), 1500);
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

http.listen(3050, function() {
  console.log('listening on *:3050');
});

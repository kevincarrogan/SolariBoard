var LastFmNode = require('lastfm').LastFmNode
  , express = require('express')
  , app = express.createServer(express.logger())
  , io = require('socket.io').listen(app);

var port = process.env.PORT || 5000;

app.listen(port, function () {
});

app.use('/src', express.static(__dirname + '/src'))
   .use('/lib', express.static(__dirname + '/lib'))
   .use('/img', express.static(__dirname + '/img'))
   .use('/plugins', express.static(__dirname + '/plugins'));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.get('/lastfm', function (req, res) {
    res.sendfile(__dirname + '/webgl.html');
});

io.configure(function () {
    io.set('transports', ['xhr-polling']);
    io.set('polling duration', 5);
});

function createListener(username, socket) {
    return function (track) {
        socket.emit(
            'lastfm',
            {
                username: username,
                track: track.name,
                artist: track.artist['#text'],
                image: track.image[3]['#text']
            }
        );
    };
}

function err(error) {
}

var lastfm = new LastFmNode({
    api_key: process.env.API_KEY,
    secret: process.env.SECRET
});

io.sockets.on('connection', function (socket) {
    socket.on('set username', function (username) {
        socket.set('username', username, function () {
            var stream;
            stream = lastfm.stream(username);
            stream.on(
                'nowPlaying',
                createListener(username, socket)
            );
            stream.on(
                'error',
                err
            );
            stream.start();
        });
    });
});

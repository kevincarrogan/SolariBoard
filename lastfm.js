var LastFmNode = require('lastfm').LastFmNode
  , express = require('express')
  , app = express.createServer(express.logger())
  , io = require('socket.io').listen(app);

var port = process.env.PORT || 5000;

app.listen(port, function () {
    console.log("Listening on " + port);
});

app.use('/src', express.static(__dirname + '/src'))
   .use('/lib', express.static(__dirname + '/lib'))
   .use('/img', express.static(__dirname + '/img'))
   .use('/plugins', express.static(__dirname + '/plugins'));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/webgl.html');
});

io.configure(function () {
    io.set('transports', ['xhr-polling']);
    io.set('polling duration', 5);
});

var sockets = [];

io.sockets.on('connection', function(socket){
    sockets.push(socket);
});

var lastfm = new LastFmNode({
    api_key: process.env.API_KEY,
    secret: process.env.SECRET
});

var users = ['kevbear'],
    streams = [];

function createListener(username) {
    return function(track) {
        for (a = 0; a < sockets.length; a++) {
            sockets[a].emit(
                'lastfm',
                {
                    username: username,
                    track: track.name,
                    artist: track.artist['#text'],
                    image: track.image[3]['#text']
                }
            );
        }
    };
}

function err(error) {
    //NOOP
}

for (i = 0; i < users.length; i++) {
    streams[i] = lastfm.stream(users[i]);
    streams[i].on(
        'nowPlaying',
        createListener(users[i])
    );
    streams[i].on(
        'error',
        err
    );
    streams[i].start();
}

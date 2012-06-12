LastFmPlugin = function (username){
    this.username = username;
};

_.extend(LastFmPlugin.prototype, SolariPlugin.prototype);

LastFmPlugin.prototype.init = function(scr){
    SolariPlugin.prototype.init.call(this, scr);
    this.socket = new io.connect();
    this.socket.emit('set username', this.username);
};

LastFmPlugin.prototype.start = function(){
    this.updateScreen();
    var self = this;
    this.socket.on('lastfm', function(track){
        self.scr.pushMessage(track.track.toUpperCase());
        self.scr.pushMessage(track.artist.toUpperCase());
        self.updateScreen();
    });
};

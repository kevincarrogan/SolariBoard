LastFmPlugin = function(){
};

_.extend(LastFmPlugin.prototype, SolariPlugin.prototype);

LastFmPlugin.prototype.init = function(scr){
    SolariPlugin.prototype.init.call(this, scr);
    this.socket = new io.connect();
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

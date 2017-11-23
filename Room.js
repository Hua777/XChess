var XChess = require('./XChess.js');

Array.prototype.remove = function(e) { for (var i = 0; i < this.length; i++) { if (e == this[i]) { return this.splice(i, 1); } } };
Array.prototype.have = function(e) { for (var i = 0; i < this.length; i++) { if (e == this[i]) { return true; } } return false; };

function XChessRoom(_name) {
    this.xChess = new XChess();
    this.name = _name;
    this.players = {
        red: null,
        blue: null
    };
    this.lookers = [];
    this.playing = false;
    this.winner = null;
    this.playerLen = () => {
        var result = 0;
        if (this.players.red !== null) {
            ++result;
        }
        if (this.players.blue !== null) {
            ++result;
        }
        return result;
    }
    this.lookerLen = () => {
        return this.lookers.length;
    }
    this.isIn = function(_player) {
        if (this.players.red == _player) {
            return true;
        } else if (this.players.blue == _player) {
            return true;
        }
        return this.lookers.have(_player);
    }
    this.join = function(_player) {
        if (this.isIn(_player)) {
            return false;
        }
        if (this.players.red === null) {
            this.players.red = _player;
            _player.gamemode = 'red';
        } else if (this.players.blue === null) {
            this.players.blue = _player;
            _player.gamemode = 'blue';
        } else {
            this.lookers.push(_player);
            _player.gamemode = 'looker';
        }
        _player.room = this;
        if (this.canPlay()) this.play();
        return true;
    }
    this.hasPlayer = function() {
        if (this.players.red !== null || this.players.blue !== null) {
            return true;
        }
        return false;
    }
    this.canPlay = function() {
        if (!this.playing && this.players.red !== null && this.players.blue !== null) {
            return true;
        }
        return false;
    }
    this.play = function() {
        this.xChess.restart();
        this.playing = true;
    }
    this.checkEnd = function() {
        if (this.players.red === null || this.players.blue === null) {
            return true;
        }
        return false;
    }
    this.sendSelfInfo = function() {
        var data = {};
        if (this.players.red !== null) {
            data = {
                gamemode: this.players.red.gamemode,
                name: this.players.red.nickname
            };
            this.players.red.emit('info', data);
        }
        if (this.players.blue !== null) {
            data = {
                gamemode: this.players.blue.gamemode,
                name: this.players.blue.nickname
            };
            this.players.blue.emit('info', data);
        }
        for (var i = 0; i < this.lookers.length; ++i) {
            data = {
                gamemode: this.lookers[i].gamemode,
                name: this.lookers[i].nickname
            };
            this.lookers[i].emit('info', data);
        }
    }
    this.sendTurn = function() {
        var data = {
            turn: this.xChess.turn
        };
        this.emitAll('turn', data);
    }
    this.sendPlayers = function() {
        var len = 0,
            redname = null,
            bluename = null;
        if (this.players.red !== null) {
            redname = this.players.red.nickname;
            ++len;
        }
        if (this.players.blue !== null) {
            bluename = this.players.blue.nickname;
            ++len;
        }
        var data = {
            redname: redname,
            bluename: bluename,
            length: len
        };
        this.emitAll('players', data);
    }
    this.sendLookers = function() {
        var data = {
            length: this.lookers.length
        };
        this.emitAll('lookers', data);
    }
    this.sendMap = function() {
        this.emitAll('map', this.xChess.map);
    }
    this.endOfTheGame = function(_bg) {
        if (this.playerLen() == 2) {
            var data = this.xChess.endOfTheGame(_bg);
            this.winner = this.players[data.winnerColor];
            data.name = this.winner.nickname;
            this.emitAll('eog', data);
            this.playing = false;
        }
    }
    this.finish = function() {
        var data = {
            name: this.winner.nickname,
            gamemode: this.winner.gamemode
        };
        this.emitAll('finish', data);
        this.playing = false;
    }
    this.end = function() {
        var data = {
            winner: 'no winner'
        };
        this.emitAll('end', data);
        this.playing = false;
    }
    this.emit = function(_player, _to, _data) {
        try {
            _player.emit(_to, _data);
        } catch (e) {
            console.log(e);
        }
    }
    this.emitPlayers = function(_to, _data) {
        if (this.players.red !== null) {
            this.emit(this.players.red, _to, _data);
        }
        if (this.players.blue !== null) {
            this.emit(this.players.blue, _to, _data);
        }
    }
    this.emitLookers = function(_to, _data) {
        for (var i = 0; i < this.lookers.length; ++i) {
            this.emit(this.lookers[i], _to, _data);
        }
    }
    this.emitAll = function(_to, _data) {
        this.emitPlayers(_to, _data);
        this.emitLookers(_to, _data);
    }
    this.moveTo = function(_player, _fx, _fy, _tx, _ty) {
        if (_player == this.players[this.xChess.turn]) {
            var result = this.xChess.moveTo(_fx, _fy, _tx, _ty);
            if (result.winnerColor !== null) {
                this.winner = this.players[result.winnerColor];
            }
            return result;
        }
        return null;
    }
    this.kill = function(_player) {
        _player.room = null;
        if (_player == this.players.red) {
            this.players.red = null;
        } else if (_player == this.players.blue) {
            this.players.blue = null;
        } else {
            this.lookers.remove(_player);
        }
    }
}

module.exports = XChessRoom;
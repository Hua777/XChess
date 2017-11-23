/**
 * 玩家
 * @param {string} _name 玩家名字
 * @param {socket} _socket 玩家所屬的 Socket
 */
function Player(_name, _socket) {
    this.nickname = null;
    this.name = _name;
    this.socket = _socket;
    this.gamemode = null;
    this.room = null;
    this.setGamemode = function(_gamemode) {
        this.room = _gamemode;
    }
    this.setRoom = function(_room) {
        this.room = _room;
    }
    this.emit = function(_to, _data) {
        this.socket.emit(_to, _data);
    }
}

module.exports = Player;
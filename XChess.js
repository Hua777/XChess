var DATA = require('./_DATA.js');
var F = require('./_FUNCTIONS.js');
var Chess = require('./Chess.js');

/**
 * 象棋棋譜
 */
function XChess() {
    this.eatenList = [];
    this.turn = 'blue';
    this.score = null;
    this.ready = false;
    this.map = null;
    this.restart = function () {
        this.eatenList = [];
        this.turn = 'red';
        this.score = { red: 0, blue: 0 };
        this.ready = true;
        this.map = [];
        for (var i = 0; i < 10; i++) {
            this.map[i] = [];
            for (var j = 0; j < 9; j++) {
                this.map[i][j] = null;
            }
        }
        //blue
        this.map[0][4] = new Chess('將', 'blue', 7);
        this.map[0][3] = new Chess('士', 'blue', 6);
        this.map[0][5] = new Chess('士', 'blue', 6);
        this.map[0][2] = new Chess('象', 'blue', 5);
        this.map[0][6] = new Chess('象', 'blue', 5);
        this.map[0][0] = new Chess('車', 'blue', 4);
        this.map[0][8] = new Chess('車', 'blue', 4);
        this.map[0][1] = new Chess('馬', 'blue', 3);
        this.map[0][7] = new Chess('馬', 'blue', 3);
        this.map[2][1] = new Chess('砲', 'blue', 2);
        this.map[2][7] = new Chess('砲', 'blue', 2);
        this.map[3][0] = new Chess('卒', 'blue', 1);
        this.map[3][2] = new Chess('卒', 'blue', 1);
        this.map[3][4] = new Chess('卒', 'blue', 1);
        this.map[3][6] = new Chess('卒', 'blue', 1);
        this.map[3][8] = new Chess('卒', 'blue', 1);
        //red
        this.map[9][4] = new Chess('帥', 'red', 7);
        this.map[9][3] = new Chess('仕', 'red', 6);
        this.map[9][5] = new Chess('仕', 'red', 6);
        this.map[9][2] = new Chess('相', 'red', 5);
        this.map[9][6] = new Chess('相', 'red', 5);
        this.map[9][1] = new Chess('傌', 'red', 3);
        this.map[9][7] = new Chess('傌', 'red', 3);
        this.map[9][0] = new Chess('俥', 'red', 4);
        this.map[9][8] = new Chess('俥', 'red', 4);
        this.map[7][1] = new Chess('炮', 'red', 2);
        this.map[7][7] = new Chess('炮', 'red', 2);
        this.map[6][0] = new Chess('兵', 'red', 1);
        this.map[6][2] = new Chess('兵', 'red', 1);
        this.map[6][4] = new Chess('兵', 'red', 1);
        this.map[6][6] = new Chess('兵', 'red', 1);
        this.map[6][8] = new Chess('兵', 'red', 1);
    }

    this.chessNumberBetween2Point = function (_fx, _fy, _tx, _ty) {
        var counter = 0;
        _fx = parseInt(_fx);
        _fy = parseInt(_fy);
        _tx = parseInt(_tx);
        _ty = parseInt(_ty);
        if (_fx == _tx) {
            for (var i = F.min(_fy, _ty) + 1; i <= F.max(_fy, _ty) - 1; ++i) {
                if (this.map[i][_fx] !== null) {
                    ++counter;
                }
            }
        } else if (_fy == _ty) {
            for (var i = F.min(_fx, _tx) + 1; i <= F.max(_fx, _tx) - 1; ++i) {
                if (this.map[_fy][i] !== null) {
                    ++counter;
                }
            }
        }
        return counter;
    }

    this.enemyTurn = (_bg) => {
        if (_bg == 'blue') {
            return 'red';
        } else {
            return 'blue';
        }
    }

    this.endOfTheGame = (_bg) => {
        return {
            moveSuccess: true,
            winnerColor: this.enemyTurn(_bg),
            errMsg: '對面投降了'
        };
    }

    this.moveObliqueStepNoBlocked = (_fx, _fy, _tx, _ty) => {
        var b2p = F.between2Point(_fx, _fy, _tx, _ty);
        var dx = b2p.vx < 0,
            dy = b2p.vy < 0;
        b2p.vx = Math.abs(b2p.vx);
        b2p.vy = Math.abs(b2p.vy);
        if (b2p.vx > 1 || b2p.vy > 1) {
            var m = F.max(b2p.vx, b2p.vy) - 1;
            b2p.vx = b2p.vx - m;
            b2p.vy = b2p.vy - m;
        }
        if (dx) b2p.vx *= -1;
        if (dy) b2p.vy *= -1;
        return this.map[_fy + b2p.vy][_fx + b2p.vx] === null;
    }

    this.moveTo = function (_fx, _fy, _tx, _ty) {
        var errMsg = '';
        var moveSuccess = false;
        var winnerColor = null;
        var fromChess = this.map[_fy][_fx];
        if (this.ready && !(_fx == _tx && _fy == _ty) && fromChess !== null && fromChess.color == this.turn) {
            var toChess = this.map[_ty][_tx];
            if (fromChess.id == 7) {
                //將帥
                if (toChess !== null && toChess.id == 7 && _tx == _fx) {
                    //檢查王不見王
                    var c = this.chessNumberBetween2Point(_fx, _fy, _tx, _ty);
                    if (c == 0) {
                        moveSuccess = true;
                    } else {
                        errMsg = '你不能在王不見王的路徑上有其他棋子';
                    }
                } else if (F.inOurJiuGongGeRange(_tx, _ty, fromChess.color) && F.moveStep(_fx, _fy, _tx, _ty, 1)) {
                    //己方九宮格直行橫行每次一步
                    moveSuccess = true;
                } else {
                    errMsg = '超出移動範圍或是移動方法失敗（己方九宮格直橫行每次一步）';
                }
            } else if (fromChess.id == 6) {
                //士仕
                if (F.inOurJiuGongGeRange(_tx, _ty, fromChess.color) && F.moveObliqueStep(_fx, _fy, _tx, _ty, 1)) {
                    //己方九宮格斜行每次一步
                    moveSuccess = true;
                } else {
                    errMsg = '超出移動範圍或是移動方法失敗（己方九宮格斜行每次一步）';
                }
            } else if (fromChess.id == 5) {
                //象相
                if (F.inOurRange(_tx, _ty, fromChess.color) && F.moveObliqueStep(_fx, _fy, _tx, _ty, 2) && this.moveObliqueStepNoBlocked(_fx, _fy, _tx, _ty)) {
                    //己方範圍斜行每次兩步
                    moveSuccess = true;
                } else {
                    errMsg = '超出移動範圍或是移動方法失敗（己方範圍斜行每次兩步）';
                }
            } else if (fromChess.id == 4) {
                //車俥
                if (F.inFullRange(_tx, _ty) && F.moveLineStep(_fx, _fy, _tx, _ty)) {
                    //只要無子阻隔直橫行不限距離移動
                    var c = this.chessNumberBetween2Point(_fx, _fy, _tx, _ty);
                    if (c == 0) {
                        moveSuccess = true;
                    } else {
                        errMsg = '你不能在移動路徑上有其他棋子';
                    }
                } else {
                    errMsg = '超出移動範圍或是移動方法失敗（只要無子阻隔直橫行不限距離移動）';
                }
            } else if (fromChess.id == 3) {
                //馬傌
                if (F.inFullRange(_tx, _ty) && F.moveHorseStep(_fx, _fy, _tx, _ty) && this.moveObliqueStepNoBlocked(_fx, _fy, _tx, _ty)) {
                    //任何方向前進一步然後斜走一步
                    moveSuccess = true;
                } else {
                    errMsg = '超出移動範圍或是移動方法失敗（任何方向前進一步然後斜走一步）';
                }
            } else if (fromChess.id == 2) {
                //砲炮
                if (F.inFullRange(_tx, _ty) && F.moveLineStep(_fx, _fy, _tx, _ty)) {
                    //走法與車相同吃子時需與目標間有一個任何一方的棋子相隔
                    var c = this.chessNumberBetween2Point(_fx, _fy, _tx, _ty);
                    if (toChess !== null && c == 1) {
                        moveSuccess = true;
                    } else if (c == 0 && toChess === null) {
                        moveSuccess = true;
                    } else {
                        errMsg = '路上不能有其他棋子或是吃的時候中間要有棋子';
                    }
                } else {
                    errMsg = '超出移動範圍或是移動方法失敗（走法與車相同吃子時需與目標間有一個任何一方的棋子相隔）';
                }
            } else if (fromChess.id == 1) {
                //卒兵
                //過河前每次只可向前直行一步，過河後可左右或往前走一步
                if (F.inOurRange(_fx, _fy, fromChess.color) && F.moveOneStepAhead(_fx, _fy, _tx, _ty, fromChess.color)) {
                    //過河前
                    moveSuccess = true;
                } else if (F.inOurRange(_fx, _fy, fromChess.enemyColor()) && F.moveOneStepWithoutBack(_fx, _fy, _tx, _ty, fromChess.color)) {
                    //過河後
                    moveSuccess = true;
                } else {
                    errMsg = '超出移動範圍或是移動方法失敗（過河前每次只可向前直行一步，過河後可左右或往前走一步）';
                }
            }
        } else if (!this.ready) errMsg = '尚未初始化遊戲';
        else if (_fx == _tx && _fy == _ty) errMsg = '起始與終點位置相同';
        else if (fromChess === null) errMsg = '起始點無棋子';
        else if (fromChess.color != this.turn) errMsg = '你不是' + fromChess.color;
        if (moveSuccess && (toChess === null || toChess.color != fromChess.color)) {
            if (toChess !== null) {
                if (toChess.id == 7) {
                    winnerColor = fromChess.color;
                }
                this.eatenList.push(toChess);
                this.score[fromChess.color]++;
            }
            this.map[_ty][_tx] = fromChess;
            this.map[_fy][_fx] = null;
            this.turn = fromChess.enemyColor();
        } else if (moveSuccess && toChess !== null && toChess.color == fromChess.color) {
            errMsg = '你吃到同隊的';
            moveSuccess = false;
        }
        if (winnerColor !== null) {
            this.ready = false;
        }
        return {
            moveSuccess: moveSuccess,
            winnerColor: winnerColor,
            errMsg: errMsg
        };
    }
}

module.exports = XChess;
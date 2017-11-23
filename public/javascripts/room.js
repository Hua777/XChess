(() => {

    var redName = null;
    var blueName = null;
    var mapData = null;
    var playerCount = 0;
    var lookerCount = 0;
    var IAM = null;
    var turn = null;

    var movePos = {
        red: {
            x: -1,
            y: -1
        },
        blue: {
            x: -1,
            y: -1
        }
    }
    var choosePos = {
        red: {
            x: -1,
            y: -1
        },
        blue: {
            x: -1,
            y: -1
        }
    }

    var min = (a, b) => {
        return a < b ? a : b;
    }

    var setErrMsg = (_msg) => {
        var errMsgDiv = $('#errMsg');
        errMsgDiv.css('visibility', 'visible');
        errMsgDiv.text(_msg);
        errMsgDiv.css({
            'margin-left': errMsgDiv.outerWidth() / 2 * -1,
            'margin-top': errMsgDiv.outerHeight() / 2 * -1
        });
        errMsgDiv.show();
        setTimeout(() => {
            errMsgDiv.fadeOut('slow', () => {});
        }, _msg.length * 125);
    }

    var getMousePos = (canvas, evt) => {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    var countMouseChessPos = (ctx, x, y) => {
        var W = ctx.canvas.width;
        var H = ctx.canvas.height;
        var XW = W / 10;
        var YW = H / 11;
        x /= XW;
        y /= YW;
        x--;
        y--;
        x = Math.round(x);
        y = Math.round(y);
        var chess = null;
        if (mapData !== null && x >= 0 && x <= 8 && y >= 0 && y <= 9) {
            chess = mapData[y][x];
        }
        return {
            x: x,
            y: y,
            chess: chess
        }
    }

    var rotatePos180 = (_xy) => {
        if (_xy !== null) {
            return {
                x: 8 - _xy.x,
                y: 9 - _xy.y
            }
        }
        return null;
    }

    var rotateMapData180 = (data) => {
        var tmpData = [];
        for (var i = 0, ii = 9; i < 10; i++, ii--) {
            tmpData[ii] = [];
            for (var j = 0, jj = 8; j < 9; j++, jj--) {
                tmpData[ii][jj] = data[i][j];
            }
        }
        return tmpData;
    }

    var drawSpecial = (ctx, x, y) => {
        var s = 5,
            l = 5;
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#663b07';
        ctx.moveTo(x - s - l, y - s);
        ctx.lineTo(x - s, y - s);
        ctx.lineTo(x - s, y - s - l);
        ctx.moveTo(x - s - l, y + s);
        ctx.lineTo(x - s, y + s);
        ctx.lineTo(x - s, y + s + l);
        ctx.moveTo(x + s + l, y - s);
        ctx.lineTo(x + s, y - s);
        ctx.lineTo(x + s, y - s - l);
        ctx.moveTo(x + s + l, y + s);
        ctx.lineTo(x + s, y + s);
        ctx.lineTo(x + s, y + s + l);
        ctx.stroke();
    }

    var drawMap = (ctx) => {
        ctx.canvas.width = $(document).width();
        ctx.canvas.height = $(document).height();
        var XW = ctx.canvas.width / 10,
            YW = ctx.canvas.height / 11;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        //邊框
        ctx.beginPath();
        ctx.fillStyle = '#5b3d07';
        ctx.fillRect(0, 0, ctx.canvas.width, YW);
        ctx.fillRect(0, 10 * YW, ctx.canvas.width, YW);
        ctx.fillRect(0, 0, XW, ctx.canvas.height);
        ctx.fillRect(9 * XW, 0, XW, ctx.canvas.height);
        ctx.stroke();
        //中間面積
        ctx.beginPath();
        ctx.fillStyle = '#8e6316';
        ctx.fillRect(1 * XW, 1 * YW, ctx.canvas.width - 2 * XW, 9 * YW);
        ctx.stroke();
        //線條
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#5b3d07';
        for (var i = 0; i < 21; ++i) {
            ctx.moveTo(0, i * YW);
            ctx.lineTo(ctx.canvas.width, i * YW);
        }
        for (var i = 0; i < 19; ++i) {
            ctx.moveTo(i * XW, 0);
            ctx.lineTo(i * XW, ctx.canvas.height);
        }
        ctx.moveTo(4 * XW, YW);
        ctx.lineTo(6 * XW, 3 * YW);
        ctx.moveTo(6 * XW, YW);
        ctx.lineTo(4 * XW, 3 * YW);
        ctx.moveTo(4 * XW, 8 * YW);
        ctx.lineTo(6 * XW, 10 * YW);
        ctx.moveTo(6 * XW, 8 * YW);
        ctx.lineTo(4 * XW, 10 * YW);
        ctx.stroke();
        drawSpecial(ctx, 2 * XW, 3 * YW);
        drawSpecial(ctx, 8 * XW, 3 * YW);
        drawSpecial(ctx, 2 * XW, 8 * YW);
        drawSpecial(ctx, 8 * XW, 8 * YW);
        drawSpecial(ctx, 1 * XW, 4 * YW);
        drawSpecial(ctx, 3 * XW, 4 * YW);
        drawSpecial(ctx, 5 * XW, 4 * YW);
        drawSpecial(ctx, 7 * XW, 4 * YW);
        drawSpecial(ctx, 9 * XW, 4 * YW);
        drawSpecial(ctx, 1 * XW, 7 * YW);
        drawSpecial(ctx, 3 * XW, 7 * YW);
        drawSpecial(ctx, 5 * XW, 7 * YW);
        drawSpecial(ctx, 7 * XW, 7 * YW);
        drawSpecial(ctx, 9 * XW, 7 * YW);
        //楚河漢界
        ctx.beginPath();
        ctx.fillStyle = '#1e587f';
        ctx.fillRect(XW, 5 * YW, ctx.canvas.width - 2 * XW, YW);
        ctx.fillStyle = 'black';
        ctx.font = min(XW / 2, YW / 2) + 'px 標楷體';
        ctx.fillText('楚河漢界', ctx.canvas.width / 2, ctx.canvas.height / 2);
        ctx.stroke();

        //Player & Looker
        ctx.beginPath();
        ctx.textAlign = 'left';
        ctx.fillStyle = 'white';
        ctx.textBaseline = 'top';
        ctx.font = min(XW / 6.5, YW / 6.5) + 'px 微軟正黑體';
        ctx.fillText('遊戲人數：' + playerCount + ', 觀戰人數：' + lookerCount, 0, 0);
        //TURN
        if (turn !== null) {
            ctx.font = min(XW / 3, YW / 3) + 'px 微軟正黑體';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = turn;
            ctx.fillText('換' + turn.toUpperCase() + '移動', XW, ctx.canvas.height / 2);
        }
        //IAM
        if (IAM !== null) {
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = IAM.gamemode;
            if (IAM.gamemode == 'looker') {
                ctx.fillStyle = 'white';
            }
            ctx.fillText('你是' + IAM.gamemode, ctx.canvas.width - XW, ctx.canvas.height / 2);
        }
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if (mapData !== null) {
            for (var i = 0; i < 10; i++) {
                for (var j = 0; j < 9; j++) {
                    var x = (j + 1) * XW,
                        y = (i + 1) * YW;
                    if (mapData[i][j] !== null) {
                        ctx.beginPath();
                        ctx.lineWidth = 3;
                        ctx.strokeStyle = 'black';
                        if ((choosePos.red.x == j && choosePos.red.y == i) || (choosePos.blue.x == j && choosePos.blue.y == i)) {
                            ctx.fillStyle = '#ffc768';
                            ctx.arc(x, y, min(XW / 1.5, YW / 1.5), 0, 2 * Math.PI);
                            ctx.font = min(XW / 1.5, YW / 1.5) + 'px 標楷體';
                        } else {
                            ctx.fillStyle = '#d89c31';
                            ctx.arc(x, y, min(XW / 2, YW / 2), 0, 2 * Math.PI);
                            ctx.font = min(XW / 2, YW / 2) + 'px 標楷體';
                        }
                        ctx.fill();
                        ctx.fillStyle = mapData[i][j].color;
                        ctx.fillText(mapData[i][j].name, x, y);
                        ctx.stroke();
                    }
                    if ((movePos.red.x == j && movePos.red.y == i) || (movePos.blue.x == j && movePos.blue.y == i)) {
                        ctx.beginPath();
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = 'black';
                        if ((movePos.red.x == j && movePos.red.y == i)) {
                            ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
                        } else {
                            ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
                        }
                        ctx.arc(x, y, min(XW / 2, YW / 2), 0, 2 * Math.PI);
                        ctx.fill();
                        ctx.stroke();
                    }
                }
            }
            //Names
            if (IAM !== null && redName !== null && blueName !== null) {
                var topString = blueName;
                var bottomString = redName;
                if (IAM.gamemode == 'blue') {
                    topString = redName;
                    bottomString = blueName;
                }
                ctx.fillStyle = 'white';
                ctx.textBaseline = 'middle';
                ctx.textAlign = 'center';
                ctx.font = min(XW / 3, YW / 3) + 'px 微軟正黑體';
                ctx.fillText(topString, 5 * XW, YW / 2);
                ctx.fillText(bottomString, 5 * XW, 10.5 * YW);
            }
        }
    }

    $(() => {

        var SCRBRD = $('#scoreboard');
        var MAP = $('#map')[0];
        var CTXMAP = MAP.getContext('2d');

        var socket = io.connect();

        $(window).resize(() => {
            drawMap(CTXMAP);
        });

        MAP.addEventListener('mousemove', (evt) => {
            if (IAM !== null && IAM.gamemode != 'looker') {
                var p = getMousePos(MAP, evt);
                var cp = countMouseChessPos(CTXMAP, p.x, p.y);
                if (movePos[IAM.gamemode].x != cp.x || movePos[IAM.gamemode].y != cp.y) {
                    if (IAM.gamemode == 'blue') {
                        cp = rotatePos180(cp);
                    }
                    cp.gamemode = IAM.gamemode;
                    socket.emit('mp', cp);
                }
            }
        }, false);

        MAP.addEventListener('click', (evt) => {
            if (IAM !== null && IAM.gamemode !== 'looker') {
                var p = getMousePos(MAP, evt);
                var cp = countMouseChessPos(CTXMAP, p.x, p.y);
                if (cp.chess && cp.chess.color == IAM.gamemode) {
                    choosePos[IAM.gamemode] = cp;
                } else {
                    if (choosePos[IAM.gamemode].x != -1) {
                        if (cp.x != -1) {
                            var fdata = {
                                x: choosePos[IAM.gamemode].x,
                                y: choosePos[IAM.gamemode].y
                            };
                            var tdata = {
                                x: cp.x,
                                y: cp.y
                            };
                            if (IAM.gamemode == 'blue') {
                                fdata = rotatePos180(fdata);
                                tdata = rotatePos180(tdata);
                            }
                            socket.emit('move', {
                                fx: fdata.x,
                                fy: fdata.y,
                                tx: tdata.x,
                                ty: tdata.y
                            });
                        }
                    }
                    choosePos[IAM.gamemode] = {
                        x: -1,
                        y: -1
                    }
                }
                var data = {
                    x: choosePos[IAM.gamemode].x,
                    y: choosePos[IAM.gamemode].y
                };
                if (IAM.gamemode == 'blue') {
                    data = rotatePos180(data);
                }
                data.gamemode = IAM.gamemode;
                socket.emit('cp', data);
            }
        }, false);

        socket.emit('join', {
            roomname: roomname,
            nickname: nickname
        });
        socket.on('info', (data) => {
            IAM = data;
            drawMap(CTXMAP);
        });
        socket.on('turn', (data) => {
            turn = data.turn;
            drawMap(CTXMAP);
        });
        socket.on('players', (data) => {
            redName = data.redname;
            blueName = data.bluename;
            if (playerCount < data.length) {
                setErrMsg('玩家加入');
            } else if (playerCount > data.length) {
                setErrMsg('玩家退出');
            }
            playerCount = data.length;
            drawMap(CTXMAP);
        });
        socket.on('lookers', (data) => {
            lookerCount = data.length;
            drawMap(CTXMAP);
        });
        socket.on('map', (data) => {
            if (IAM !== null && IAM.gamemode == 'blue') {
                mapData = rotateMapData180(data);
            } else {
                mapData = data;
            }
            drawMap(CTXMAP);
        });
        socket.on('mp', (data) => {
            if (IAM !== null && IAM.gamemode == 'blue') {
                movePos[data.gamemode] = rotatePos180(data);
            } else {
                movePos[data.gamemode] = data;
            }
            drawMap(CTXMAP);
        });
        socket.on('cp', (data) => {
            if (IAM !== null && IAM.gamemode == 'blue') {
                choosePos[data.gamemode] = rotatePos180(data);
            } else {
                choosePos[data.gamemode] = data;
            }
            drawMap(CTXMAP);
        });
        socket.on('finish', (data) => {
            drawMap(CTXMAP);
            alert('玩家[' + data.name + ']獲勝');
            window.location.href = '/';
        });
        socket.on('end', (data) => {
            alert('玩家中離');
            window.location.href = '/';
        });
        socket.on('msg', (data) => {
            if (data.errMsg != '') {
                setErrMsg(data.errMsg);
            }
        });
        socket.on('eog', (data) => {
            alert('玩家[' + data.name + ']獲勝');
            window.location.href = '/';
        });

        $('#byebye').on('click', () => {
            var b = confirm('投降？');
            if (b) {
                socket.emit('eog', {
                    byeGamemode: IAM.gamemode
                });
            }
        });

        $('#quit').on('click', () => {
            var b = confirm('離開？');
            if (b) {
                window.location.href = '/';
            }
        });
    });
})();
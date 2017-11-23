var express = require('express');
var router = express.Router();

/* Index */
router.get('/', function(req, res, next) {
    var r = '我是一隻小小小小小小鳥',
        n = '對面快投降';
    if (req.cookies.roomname) {
        r = req.cookies.roomname;
    }
    if (req.cookies.nickname) {
        n = req.cookies.nickname;
    }
    return res.render('index', {
        roomname: r,
        nickname: n
    });
});

/* XChessRoom */
router.get('/room/:names', function(req, res, next) {
    var names = req.params.names.split('_');
    if (names.length == 2 && names[0].length >= 5 && names[1].length >= 1) {
        res.cookie('roomname', names[0], { maxAge: 49 * 24 * 60 * 60 * 1000 });
        res.cookie('nickname', names[1], { maxAge: 49 * 24 * 60 * 60 * 1000 });
        return res.render('room', {
            roomname: names[0],
            nickname: names[1]
        });
    } else {
        return res.render('message');
    }
});

module.exports = router;
/**
 * 最小值
 * @param {number} _m 
 * @param {number} _n 
 */
var min = (_m, _n) => {
    return _m < _n ? _m : _n;
}

/**
 * 最大值
 * @param {number} _m 
 * @param {number} _n 
 */
var max = (_m, _n) => {
    return _m > _n ? _m : _n;
}

/**
 * 在整張地圖上
 * @param {number} _x 位置X
 * @param {number} _y 位置Y
 */
var inFullRange = (_x, _y) => {
    if (_x >= 0 && _x <= 8 && _y >= 0 && _y <= 9) {
        return true;
    }
    return false;
}

/**
 * 在己方的九宮格上
 * @param {number} _x 位置X
 * @param {number} _y 位置Y
 * @param {number} _color 棋子顏色
 */
var inOurJiuGongGeRange = (_x, _y, _color) => {
    if (_color == 'blue' && _x >= 3 && _x <= 5 && _y >= 0 && _y <= 2) {
        return true;
    } else if (_color == 'red' && _x >= 3 && _x <= 5 && _y >= 7 && _y <= 9) {
        return true;
    }
    return false;
}

/**
 * 在己方的範圍
 * @param {number} _x 位置X
 * @param {number} _y 位置Y
 * @param {number} _color 棋子顏色
 */
var inOurRange = (_x, _y, _color) => {
    if (_color == 'blue' && _x >= 0 && _x <= 8 && _y >= 0 && _y <= 4) {
        return true;
    } else if (_color == 'red' && _x >= 0 && _x <= 8 && _y >= 5 && _y <= 9) {
        return true;
    }
    return false;
}

/**
 * 兩點間的距離
 * @param {number} _fx 點1位置X
 * @param {number} _fy 點1位置Y
 * @param {number} _tx 點2位置X
 * @param {number} _ty 點2位置Y
 */
var between2Point = (_fx, _fy, _tx, _ty) => {
    var vx, vy;
    vx = _tx - _fx;
    vy = _ty - _fy;
    var forward = null;
    if (vx > 0 && vy > 0) forward = 'RD';
    else if (vx > 0 && vy < 0) forward = 'RT';
    else if (vx < 0 && vy > 0) forward = 'LD';
    else if (vx < 0 && vy < 0) forward = 'LT';
    else if (vx == 0 && vy > 0) forward = 'D';
    else if (vx == 0 && vy < 0) forward = 'T';
    else if (vx < 0 && vy == 0) forward = 'L';
    else if (vx > 0 && vy == 0) forward = 'R';
    else if (vx == 0 && vy == 0) forward = 'O';
    return {
        x: Math.abs(_fx - _tx),
        y: Math.abs(_fy - _ty),
        vx: _tx - _fx,
        vy: _ty - _fy,
        l: Math.sqrt((_fx - _tx) * (_fx - _tx) + (_fy - _ty) * (_fy - _ty)),
        forward: forward
    }
}

/**
 * 檢查是否直橫移動
 * @param {number} _fx 點1位置X
 * @param {number} _fy 點1位置Y
 * @param {number} _tx 點2位置X
 * @param {number} _ty 點2位置Y
 * @param {number} _number 步數
 */
var moveStep = (_fx, _fy, _tx, _ty, _number) => {
    var b2p = between2Point(_fx, _fy, _tx, _ty);
    if (b2p.l == _number) return true;
    return false;
}

/**
 * 檢查是否向前移動
 * @param {number} _fx 點1位置X
 * @param {number} _fy 點1位置Y
 * @param {number} _tx 點2位置X
 * @param {number} _ty 點2位置Y
 * @param {string} _color 顏色
 */
var moveOneStepAhead = (_fx, _fy, _tx, _ty, _color) => {
    var b2p = between2Point(_fx, _fy, _tx, _ty);
    if (_color == 'blue' && b2p.forward == 'D' && b2p.l == 1) {
        return true;
    } else if (_color == 'red' && b2p.forward == 'T' && b2p.l == 1) {
        return true;
    }
    return false;
}

/**
 * 檢查是否向前左右移動
 * @param {number} _fx 點1位置X
 * @param {number} _fy 點1位置Y
 * @param {number} _tx 點2位置X
 * @param {number} _ty 點2位置Y
 * @param {string} _color 顏色
 */
var moveOneStepWithoutBack = (_fx, _fy, _tx, _ty, _color) => {
    var b2p = between2Point(_fx, _fy, _tx, _ty);
    if (_color == 'blue' && (b2p.forward == 'D' || b2p.forward == 'L' || b2p.forward == 'R') && b2p.l == 1) {
        return true;
    } else if (_color == 'red' && (b2p.forward == 'T' || b2p.forward == 'L' || b2p.forward == 'R') && b2p.l == 1) {
        return true;
    }
    return false;
}

/**
 * 檢查是否直橫無限移動
 * @param {number} _fx 點1位置X
 * @param {number} _fy 點1位置Y
 * @param {number} _tx 點2位置X
 * @param {number} _ty 點2位置Y
 */
var moveLineStep = (_fx, _fy, _tx, _ty) => {
    var b2p = between2Point(_fx, _fy, _tx, _ty);
    if (b2p.x == 0 || b2p.y == 0) return true;
    return false;
}

/**
 * 檢查是否馬行移動
 * @param {number} _fx 點1位置X
 * @param {number} _fy 點1位置Y
 * @param {number} _tx 點2位置X
 * @param {number} _ty 點2位置Y
 */
var moveHorseStep = (_fx, _fy, _tx, _ty) => {
    var b2p = between2Point(_fx, _fy, _tx, _ty);
    if (b2p.l == Math.sqrt(5)) return true;
    return false;
}

/**
 * 檢查是否直橫移動
 * @param {number} _fx 點1位置X
 * @param {number} _fy 點1位置Y
 * @param {number} _tx 點2位置X
 * @param {number} _ty 點2位置Y
 * @param {number} _number 步數
 */
var moveObliqueStep = (_fx, _fy, _tx, _ty, _number) => {
    var b2p = between2Point(_fx, _fy, _tx, _ty);
    if (b2p.l == Math.sqrt(_number * _number * 2)) return true;
    return false;
}

/**
 * 亂數字串
 */
var randomID = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

module.exports = {
    min: min,
    max: max,
    inFullRange: inFullRange,
    inOurJiuGongGeRange: inOurJiuGongGeRange,
    inOurRange: inOurRange,
    between2Point: between2Point,
    moveStep: moveStep,
    moveOneStepAhead: moveOneStepAhead,
    moveOneStepWithoutBack: moveOneStepWithoutBack,
    moveLineStep: moveLineStep,
    moveHorseStep: moveHorseStep,
    moveObliqueStep: moveObliqueStep,
    randomID: randomID
}
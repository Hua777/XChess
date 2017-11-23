/**
 * 棋子
 * @param {string} _name 黑：將士象車馬砲卒，紅：帥仕相俥傌炮兵
 * @param {string} _color blue or red
 * @param {number} _id 將帥7 士仕6 象相5 車俥4 馬傌3 砲炮2 卒兵1
 */
function Chess(_name, _color, _id) {
    this.name = _name;
    this.color = _color;
    this.id = _id;
    this.enemyColor = function() {
        if (this.color == 'blue') return 'red';
        else return 'blue';
    }
}

module.exports = Chess;
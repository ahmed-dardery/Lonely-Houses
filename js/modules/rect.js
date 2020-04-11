export default class Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    collidePoint(x, y) {
        return x >= this.x && x <= this.width + this.x && y >= this.y && y <= this.height + this.y;
    }
}
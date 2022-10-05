export default class BoundingBox {
    constructor(position, size, offset) {
        this.position = position;
        this.size = size;
        this.offset = offset;
    }

    get bottom() {
        return this.position.y + this.size.y + this.offset.y;
    }

    set bottom(y) {
        this.position.y = y - (this.size.y + this.offset.y);
    }

    get top() {
        return this.position.y + this.offset.y;
    }

    set top(y) {
        this.position.y = y - this.offset.y;
    }

    get left() {
        return this.position.x + this.offset.x;
    }

    set left(x) {
        this.position.x = x - this.offset.x;
    }

    get right() {
        return this.position.x + this.size.x + this.offset.x;
    }

    set right(x) {
        this.position.x = x - (this.size.x + this.offset.x);
    }
}
// 二维向量
export class vec2 {
    values; // 使用float32Array
    constructor(x = 0, y = 0) {
        this.values = new Float32Array([x, y]);
    }
    toString() {
        return " [ " + this.values[0] + " , " + this.values[1] + " ] ";
    }
    get x() { return this.values[0]; }
    set x(x) { this.values[0] = x; }
    get y() { return this.values[1]; }
    set y(y) { this.values[1] = y; }
    isEmpty() {
        return (this.x == undefined) || (this.y == undefined);
    }
    // 静态create方法
    static create(x = 0, y = 0) {
        return new vec2(x, y);
    }
}
// 2D尺寸
export class Size {
    values; // 使用float32Array
    constructor(w = 1, h = 1) {
        this.values = new Float32Array([w, h]);
    }
    set width(value) { this.values[0] = value; }
    get width() { return this.values[0]; }
    set height(value) { this.values[1] = value; }
    get height() { return this.values[1]; }
    isEmpty() {
        return (this.width == undefined) || (this.height == undefined);
    }
    // 静态create方法
    static create(w = 1, h = 1) {
        return new Size(w, h);
    }
}
// 矩形包围框
export class Rectangle {
    origin;
    size;
    constructor(orign = new vec2(), size = new Size(1, 1)) {
        this.origin = orign;
        this.size = size;
    }
    isEmpty() {
        return this.size.isEmpty() || this.origin.isEmpty();
    }
    // 静态create方法
    static create(x = 0, y = 0, w = 1, h = 1) {
        let origin = new vec2(x, y);
        let size = new Size(w, h);
        return new Rectangle(origin, size);
    }
}

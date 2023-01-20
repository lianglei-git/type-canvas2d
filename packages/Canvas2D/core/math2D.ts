// 二维向量
export class vec2 {
    public values: Float32Array; // 使用float32Array
    public constructor(x: number = 0, y: number = 0) {
        this.values = new Float32Array([x, y]);
    }
    public toString(): string {
        return " [ " + this.values[0] + " , " + this.values[1] + " ] ";
    }
    public get x(): number { return this.values[0]; }
    public set x(x: number) { this.values[0] = x; }
    public get y(): number { return this.values[1]; }
    public set y(y: number) { this.values[1] = y; }
    public isEmpty() {
        return (this.x == undefined) || (this.y == undefined)
    }
    // 静态create方法
    public static create(x: number = 0, y: number = 0): vec2 {
        return new vec2(x, y);
    }
}
// 2D尺寸
export class Size {
    public values: Float32Array; // 使用float32Array
    public constructor(w: number = 1, h: number = 1) {
        this.values = new Float32Array([w, h]);
    }
    public set width(value: number) { this.values[0] = value; }
    public get width(): number { return this.values[0]; }
    public set height(value: number) { this.values[1] = value; }
    public get height(): number { return this.values[1]; }

    public isEmpty() {
        return (this.width == undefined) || (this.height == undefined)
    }
    // 静态create方法
    public static create(w: number = 1, h: number = 1): Size {
        return new Size(w, h);
    }
}
// 矩形包围框
export class Rectangle {
    public origin: vec2;
    public size: Size;
    public constructor(orign: vec2 = new vec2(), size: Size = new Size(1, 1)) {
        this.origin = orign;
        this.size = size;
    }
    public isEmpty() {
        return this.size.isEmpty() || this.origin.isEmpty();
    }
    // 静态create方法
    public static create(x: number = 0, y: number = 0, w: number = 1, h: number = 1): Rectangle {
        let origin: vec2 = new vec2(x, y);
        let size: Size = new Size(w, h);
        return new Rectangle(origin, size);
    }
}

// 使用const关键字定义常数
const PiBy180: number = 0.017453292519943295; // Math . PI / 180.0
export class Math2D {

    // 将以角度表示的参数转换为弧度表示
    public static toRadian(degree: number): number {
        return degree * PiBy180;
    }

    // 将以弧度表示的参数转换为角度表示
    public static toDegree(radian: number): number {
        return radian / PiBy180;
    }
}
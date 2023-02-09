const EPSILON = 0.00001;
// 二维向量
export class vec2 {
    // 使用float32Array强类型数组，不需要进行引用类型到值类型，以及值类型到引用类
    //型的转换，效率比较高
    values;
    // 构造函数
    constructor(x = 0, y = 0) {
        this.values = new Float32Array([x, y]);
    }
    // 静态的create方法
    static create(x = 0, y = 0) {
        return new vec2(x, y);
    }
    // 复制当前的向量到result
    static copy(src, result = null) {
        if (result === null)
            result = new vec2();
        result.values[0] = src.values[0];
        result.values[1] = src.values[1];
        return result;
    }
    // 为了debug输出，override toString方法
    // 当调用例如console . log方法时，会自动调用如下定义的toString方法
    toString() {
        return " [ " + this.values[0] + " , " + this.values[1] +
            " ] ";
    }
    // 方便地x和y读写操作
    get x() { return this.values[0]; }
    set x(x) { this.values[0] = x; }
    get y() { return this.values[1]; }
    set y(y) { this.values[1] = y; }
    // 为了重用向量，有时需要重置向量的x , y值
    reset(x = 0, y = 0) {
        this.values[0] = x;
        this.values[1] = y;
        return this;
    }
    isEmpty() {
        return this.x == undefined || this.y == undefined;
    }
    // 为了避免浮点数误差，使用EPSILON进行容差处理，默认情况下为0.00001
    equals(vector) {
        if (Math.abs(this.values[0] - vector.values[0]) > EPSILON)
            return false;
        if (Math.abs(this.values[1] - vector.values[1]) > EPSILON)
            return false;
        return true;
    }
    // 返回没有开根号的向量大小
    get squaredLength() {
        let x = this.values[0];
        let y = this.values[1];
        return (x * x + y * y);
    }
    // 返回真正的向量大小
    get length() {
        return Math.sqrt(this.squaredLength);
    }
    // 调用本方法后会在内部修改当前向量的x和y值，修改后的向量大小为1.0（单位向量或叫
    // 方向向量），并返回未修改前向量的大小
    normalize() {
        // 计算出向量的大小
        let len = this.length;
        // 对0向量的判断与处理
        if (Math2D.isEquals(len, 0)) {
            // alert( "长度为0，并非方向向量！! ! " ) ;
            console.log(" the length = 0 ");
            this.values[0] = 0;
            this.values[1] = 0;
            return 0;
        }
        // 如果已经是单位向量，直接返回1.0
        if (Math2D.isEquals(len, 1)) {
            console.log(" the length = 1 ");
            return 1.0;
        }
        // 否则计算出单位向量（也就是方向）
        this.values[0] /= len;
        this.values[1] /= len;
        // 同时返回向量的大小
        return len;
    }
    static xAxis = new vec2(1, 0);
    static yAxis = new vec2(0, 1);
    static nXAxis = new vec2(-1, 0);
    static nYAxis = new vec2(0, -1);
    // 公开静态方法
    static sum(left, right, result = null) {
        // 如果输出参数result为null，则分配内存给result变量
        if (result === null)
            result = new vec2();
        // x和y分量分别相加，结果仍旧是一个向量
        result.values[0] = left.values[0] + right.values[0];
        result.values[1] = left.values[1] + right.values[1];
        // 返回相加后的向量result
        return result;
    }
    // vec2类的公开实例方法：加
    add(right) {
        // this + right = this
        // 会修改this的x和y分量
        // 不需要重新分配内存空间，效率相对较高
        vec2.sum(this, right, this);
        return this;
    }
    // 公开静态方法：差
    static difference(end, start, result = null) {
        // 如果输出参数result为null，则分配内存给result变量
        if (result === null)
            result = new vec2();
        // x和y分量分别相减，结果仍旧是一个向量
        result.values[0] = end.values[0] - start.values[0];
        result.values[1] = end.values[1] - start.values[1];
        return result;
    }
    // vec2类的实例方法：减
    substract(another) {
        // this - right = this
        // 会修改this的x和y分量
        // 不需要重新分配内存空间，效率相对较高
        vec2.difference(this, another, this);
        return this;
    }
    // 会修改this向量的两个分量，返回的是修改后的向量：this指针
    negative() {
        this.values[0] = -this.values[0];
        this.values[1] = -this.values[1];
        return this;
    }
    // 向量与标量相乘
    // 向量与标量相乘的本质是缩放向量，因此实现的静态方法名为scale
    static scale(direction, scalar, result = null) {
        if (result === null)
            result = new vec2();
        result.values[0] = direction.values[0] * scalar;
        result.values[1] = direction.values[1] * scalar;
        return result;
    }
    // result = start + direction ×scalar，作用是将一个点（start），沿着direction给定的方向，移动scalar个单位。
    static scaleAdd(start, direction, scalar, result = null) {
        if (result === null)
            result = new vec2();
        vec2.scale(direction, scalar, result);
        // result中存储的是缩放后的向量
        return vec2.sum(start, result, result);
        // start + result = result，然后将result返回给调用者
    }
    // 公开的静态函数：点积
    static dotProduct(left, right) {
        return left.values[0] * right.values[0] + left.values[1]
            * right.values[1];
    }
    // 公开的实例函数：内积
    innerProduct(right) {
        // 调用静态方法
        return vec2.dotProduct(this, right);
    }
    // cosθ = a·b / ( || a || || b || )
    static getAngle(a, b, isRadian = false) {
        let dot = vec2.dotProduct(a, b);
        let radian = Math.acos(dot / (a.length * b.length));
        if (isRadian === false) {
            radian = Math2D.toDegree(radian);
        }
        return radian;
    }
    static getOrientation(from, to, isRadian = false) {
        let diff = vec2.difference(to, from);
        let radian = Math.atan2(diff.y, diff.x);
        if (isRadian === false) {
            radian = Math2D.toDegree(radian);
        }
        return radian;
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
// 使用const关键字定义常数
const PiBy180 = 0.017453292519943295; // Math . PI / 180.0
export class Math2D {
    // 将以角度表示的参数转换为弧度表示
    static toRadian(degree) {
        return degree * PiBy180;
    }
    // 将以弧度表示的参数转换为角度表示
    static toDegree(radian) {
        return radian / PiBy180;
    }
    static isEquals(k, v) {
        return k == v;
    }
}

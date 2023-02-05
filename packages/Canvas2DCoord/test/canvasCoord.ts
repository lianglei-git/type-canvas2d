import GeometryTes from '../../Canvas2D/test/canvas2dGeometry'
import _createTab from '../../Canvas2D/test/_createTab'
import { Math2D, CanvasMouseEvent, ELayout } from '../../Canvas2D/core/index'
export default class Coord extends GeometryTes {
    protected _mouseX: number = 0
    protected _mouseY: number = 0
    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.isSupportMouseMove = true
    }
    protected dispatchMouseMove(event: CanvasMouseEvent): void {
        this._mouseX = event.canvasPosition.x;
        this._mouseY = event.canvasPosition.y;
    }
    /** 记录当前指针信息 */
    public render(): void {
        // 由于canvas.getContext方法返回的CanvasRenderingContext2D可能会是null
        // 因此VSCode会强制要求null值检查，否则报错
        if (this.context2D !== null) {
            // 每次重绘都先清屏
            this.context2D.clearRect(0, 0, this.canvas.width, this.
                canvas.height);
            // 调用第4章实现背景网格绘制方法
            this.strokeGrid();
            // 绘制中心原点和x、y轴
            this.drawCanvasCoordCenter();
            // 本章后续绘制代码请写在下面
            // .... .... ..... .... ....... ...... ..... ....
            //.. ....... ... .... ... ... .... .. .... ... ...
            // 坐标信息总是在最后绘制
            this.drawCoordInfo(
                '[' + this._mouseX + ', ' + this._mouseY + "]",
                this._mouseX,
                this._mouseY
            );
        }
    }
    public drawCanvasCoordCenter(): void {
        // 绘制image要满足一些条件
        if (this.context2D === null) {
            return;
        }
        // 计算出Canvas的中心点坐标
        let halfWidth: number = this.canvas.width * 0.5;
        let halfHeight: number = this.canvas.height * 0.5;
        this.context2D.save();
        this.context2D.lineWidth = 2;
        this.context2D.strokeStyle = 'rgba( 255 , 0 , 0 , 0.5 ) ';
        // 使用alpha为0.5的红色来绘制x轴
        // 调用第4章中实现的strokeLine方法
        this.strokeLine(0, halfHeight, this.canvas.width, halfHeight);
        this.context2D.strokeStyle = 'rgba( 0 , 0 , 255 , 0.5 )';
        // 使用alpha为0.5的蓝色来绘制y轴
        this.strokeLine(halfWidth, 0, halfWidth, this.canvas.height);
        this.context2D.restore();
        // 使用alpha为0.5的黑色来绘制画布中心点
        // 调用第4章中实现的fillCircle方法
        this.fillCircle(halfWidth, halfHeight, 5, 'rgba(0 , 0 , 0 , 0.5 ) ');
    }
    public drawCoordInfo(info: string, x: number, y: number): void {
        // 调用第4章实现的fillText方法
        // 使用黑色字体，在（中下）绘制文字
        this.fillText(info, x, y, 'black', 'center', 'bottom');
    }
    // 两点间距离公式
    public distance(x0: number, y0: number, x1: number, y1: number): number {
        let diffX: number = x1 - x0;
        let diffY: number = y1 - y0;
        return Math.sqrt(diffX * diffX + diffY * diffY);
    }

    // 平移操作
    // public doTransform(): void {
    //     if (this.context2D !== null) {

    //     }
    // }

    public doTransform(degree: number, rotateFirst: boolean = true): void {
        if (this.context2D == null) return;
        // 要绘制的矩形的尺寸
        let width: number = 100;
        let height: number = 60;
        // 计算出画布中心点坐标
        let x: number = this.canvas.width * 0.5;
        let y: number = this.canvas.height * 0.5;
        this.context2D.save();
        // 调用translate平移到画布中心
        this.context2D.translate(x, y);
        this.fillRectWithTitle(0, 0, width, height, ' 0度旋转 ');
        this.context2D.restore();
        // 将角度转换为弧度，由此可见，本方法的参数degree是以角度而不是弧度表示
        let radians: number = Math2D.toRadian(degree);
        // 顺时针旋转
        this.context2D.save();
        // 根据rotateFirst进行平移和旋转变换
        if (rotateFirst) {
            // 先顺时针旋转20°
            this.context2D.rotate(radians);
            // 然后再平移到画布中心
            this.context2D.translate(this.canvas.width * 0.5, this.
                canvas.height * 0.5);
        } else {
            // 和上面正好相反
            // 先平移到画布中心
            this.context2D.translate(this.canvas.width * 0.5, this.
                canvas.height * 0.5);
            // 然后再顺时针旋转20°
            this.context2D.rotate(radians);
        }
        // 注意是[ 0 , 0 ]坐标
        this.fillRectWithTitle(0, 0, 100, 60, '+' + degree + '度旋转');
        this.context2D.restore();
        // 逆时针旋转，代码与上面顺时针旋转一样
        this.context2D.save();
        if (rotateFirst) {
            this.context2D.rotate(-radians);
            this.context2D.translate(this.canvas.width * 0.5, this.
                canvas.height * 0.5);
        } else {
            this.context2D.translate(this.canvas.width * 0.5, this.
                canvas.height * 0.5);
            this.context2D.rotate(-radians);
        }
        // 注意是[ 0 , 0 ]坐标
        this.fillRectWithTitle(0, 0, 100, 60, '-' + degree + '度旋转');
        this.context2D.restore();


    }

    /** 旋转并绘制轨迹 1 */
    doTransformStrokeCircle1() {
        // 调用前面实现的两点间距离公式
        // 第一个点是原点，第二个点是画布中心点
        let radius: number = this.distance(0, 0, this.canvas.width * 0.5,
            this.canvas.height * 0.5);
        // 然后绘制一个圆
        this.strokeCircle(0, 0, radius, 'black');
    }

    /** 旋转并绘制轨迹 2 */
    doTransformStrokeCircle2(degree: number = 20, rotateFirst: boolean = true) {

        if (this.context2D == null) return;
        this.drawCanvasCoordCenter()
        this.strokeGrid();
        // 要绘制的矩形的尺寸
        let width: number = 100;
        let height: number = 60;
        // 计算出画布中心点坐标
        let x: number = this.canvas.width * 0.5;
        let y: number = this.canvas.height * 0.5;
        this.context2D.save();
        // 调用translate平移到画布中心
        this.context2D.translate(x, y);
        this.fillRectWithTitle(-width * .5, -height * .5, width, height, ' 0度旋转 ');
        this.context2D.restore();
        this.strokeCoord(x, y, 100, 60)

        // 将角度转换为弧度，由此可见，本方法的参数degree是以角度而不是弧度表示
        let radians: number = Math2D.toRadian(degree);
        // 顺时针旋转
        this.context2D.save();
        // 根据rotateFirst进行平移和旋转变换
        if (rotateFirst) {
            // 先顺时针旋转20°
            this.context2D.rotate(radians);
            // 然后再平移到画布中心
            this.context2D.translate(this.canvas.width * 0.5, this.
                canvas.height * 0.5);
        } else {
            // 和上面正好相反
            // 先平移到画布中心
            this.context2D.translate(this.canvas.width * 0.5, this.
                canvas.height * 0.5);
            // 然后再顺时针旋转20°
            this.context2D.rotate(radians);
        }
        // 注意是[ 0 , 0 ]坐标
        this.fillRectWithTitle(-width * .5, -height * .5, 100, 60, '+' + degree + '度旋转');
        this.strokeCoord(-width * .5 + 50, -height * .5 + 30, 100, 60)

        this.context2D.restore();

        // 逆时针旋转，代码与上面顺时针旋转一样
        this.context2D.save();
        if (rotateFirst) {
            this.context2D.rotate(-radians);
            this.context2D.translate(this.canvas.width * 0.5, this.
                canvas.height * 0.5);
        } else {
            this.context2D.translate(this.canvas.width * 0.5, this.
                canvas.height * 0.5);
            this.context2D.rotate(-radians);
        }
        // 注意是[ 0 , 0 ]坐标
        this.fillRectWithTitle(-width * .5, -height * .5, 100, 60, '-' + degree + '度旋转');
        this.strokeCoord(-width * .5 + 50, -height * .5 + 30, 100, 60)

        this.context2D.restore();


        // 调用前面实现的两点间距离公式
        // 第一个点是原点，第二个点是画布中心点
        let radius: number = this.distance(0, 0, this.canvas.width * 0.5,
            this.canvas.height * 0.5);
        // 然后绘制一个圆
        this.strokeCircle(0, 0, radius, 'black');


    }
    // 将doTransform中先旋转后平移的代码独立出来，形成rotateTranslate方法
    public rotateTranslate(degree: number, layout: ELayout = ELayout.LEFT_TOP, width: number = 40, height: number = 20): void {
        if (this.context2D === null) {
            return;
        }
        // 将角度转换为弧度，由此可见，本方法的参数degree是以角度而不是弧度表示
        let radians: number = Math2D.toRadian(degree);
        // 顺时针旋转
        this.context2D.save();
        // 先顺时针旋转20°
        this.context2D.rotate(radians);
        // 然后再平移到画布中心
        this.context2D.translate(this.canvas.width * 0.5, this.canvas.
            height * 0.5);
        // 调用新实现的localRect方法
        this.fillLocalRectWithTitle(width, height, '', layout);
        this.context2D.restore();
    }
    // 实现testFillLocalRectWitTitle方法，该方法分别在圆的路径上绘制9种不同的坐标系
    public testFillLocalRectWithTitle(): void {
        if (this.context2D !== null) {
            // 旋转0°，坐标原点位于左上角（默认）
            this.rotateTranslate(0, ELayout.LEFT_TOP);
            // 顺时针旋转，使用4种不同的ELayout值
            this.rotateTranslate(10, ELayout.LEFT_MIDDLE);
            this.rotateTranslate(20, ELayout.LEFT_BOTTOM);
            this.rotateTranslate(30, ELayout.CENTER_TOP);
            this.rotateTranslate(40, ELayout.CENTER_MIDDLE);
            // 逆时针旋转，使用4种不同的ELayout值
            this.rotateTranslate(-10, ELayout.CENTER_BOTTOM);
            this.rotateTranslate(-20, ELayout.RIGHT_TOP);
            this.rotateTranslate(-30, ELayout.RIGHT_MIDDLE);
            this.rotateTranslate(-40, ELayout.RIGHT_BOTTOM);
            // 计算半径
            let radius: number = this.distance(0, 0, this.canvas.width
                * 0.5, this.canvas.height * 0.5);
            // 最后绘制一个圆
            this.strokeCircle(0, 0, radius, 'black');
        }
    }

    public doLocalTransform(): void {
        if (this.context2D === null) {
            return;
        }
        let width: number = 100;            // 在局部坐标系中显示的rect的width
        let height: number = 60;            // 在局部坐标系中显示的rect的height
        let coordWidth: number = width * 1.2;          // 局部坐标系x轴的长度
        let coordHeight: number = height * 1.2;       // 局部坐标系y轴的长度
        let radius: number = 5;             // 绘制原点时使用的半径
        this.context2D.save();
        /*
        所有局部坐标系变换演示的代码都现在此处
        本节下面的所有绘制代码都写在此处
        */
        // 1. 初始状态
        this.strokeCoord(0, 0, coordWidth, coordHeight);
        // 注意坐标为[ 0 , 0 ]
        this.fillCircle(0, 0, radius);
        this.fillLocalRectWithTitle(width, height, '1. 初始状态', ELayout.LEFT_TOP, ELayout.CENTER_MIDDLE, 'grey', false);

        // 2. 平移
        // 将坐标系向右移动到画布的中心，向下移动10个单位，再绘制局部坐标系
        this.context2D.translate(this.canvas.width * 0.5, 10);
        this.strokeCoord(0, 0, coordWidth, coordHeight);
        // 注意坐标为[ 0 , 0 ]，绘制坐标系x和y轴
        this.fillCircle(0, 0, radius);
        // 注意坐标为[ 0 , 0 ] , 绘制坐标系原点
        this.fillLocalRectWithTitle(width, height, '2. 平移', ELayout.LEFT_TOP, ELayout.CENTER_MIDDLE, 'grey', false);


        // 3. 平移到画布中心
        // translate、rotate和scale这些局部坐标系变换方法都具有累积性（Accumulation），每次变换操作都是相对上一次结果的叠加
        //所谓变换的累积性是指translate、rotate和scale这些操作都是相对上一次结果的叠加。例如上一次translate，已经将局部坐标的原点平移到了全局坐标系中x轴的中心，因此不再需要移动局部坐标系。而上一次y轴只是10个单位的平移，现在需要平移到y轴的中心，因此需要使用canva2 . height *0.5-10这样的算法来计算与上一次y轴平移的偏移量。
        this.context2D.translate(0, this.canvas.height * 0.5 - 10);
        this.strokeCoord(0, 0, coordWidth, coordHeight);
        // 注意坐标为[ 0 , 0 ]，绘制坐标系x和y轴
        this.fillCircle(0, 0, radius);
        // 注意坐标为[ 0 , 0 ] , 绘制坐标系原点
        this.fillLocalRectWithTitle(width, height, ' 3、平移到画布中心 ', ELayout.LEFT_TOP, ELayout.CENTER_MIDDLE, 'grey', false);


        /** 
         * 然后来看一下旋转，将当前的局部坐标系逆时针旋转-120°后，再继续旋转-130°，并且绘制出两次旋转后的局部坐标系及基于局部坐标系定义的矩形，代码如下：
         */

        // 4、旋转-120度 
        // 将坐标系继续旋转-120°
        this.context2D.rotate(Math2D.toRadian(-120));
        // 绘制旋转-120°的矩形
        this.fillLocalRectWithTitle(width, height, ' 4、旋转-120度 ', ELayout.LEFT_TOP, ELayout.CENTER_MIDDLE, 'grey', false);
        this.strokeCoord(0, 0, coordWidth, coordHeight);
        // 注意坐标为[ 0 , 0 ]，绘制坐标系x和y轴
        this.fillCircle(0, 0, radius);
        // 注意坐标为[ 0 , 0 ] , 绘制坐标系原点

        // 5、旋转-130度 
        // 将坐标系在-120°旋转的基础上再旋转-130°，合计旋转了-250°
        this.context2D.rotate(Math2D.toRadian(-130));
        this.fillLocalRectWithTitle(width, height, ' 5、旋转-130度 ', ELayout.LEFT_TOP, ELayout.CENTER_MIDDLE, 'grey', false);
        this.strokeCoord(0, 0, coordWidth, coordHeight);
        // 注意坐标为[ 0 , 0 ]，绘制坐标系x和y轴
        this.fillCircle(0, 0, radius);
        // 注意坐标为[ 0 , 0 ] , 绘制坐标系原点

        // 6、局部平移100个单位 
        // 继续沿着局部坐标系x轴（红色轴）的正方向平移100个单位，沿着局部坐标系y轴（蓝色轴）的正方向平移100个单位。具体代码如下：
        // 沿着局部坐标的x轴和y轴正方向各自平移100个单位
        this.context2D.translate(100, 100);
        this.fillLocalRectWithTitle(width, height, ' 6、局部平移100个单位 ', ELayout.LEFT_TOP, ELayout.CENTER_MIDDLE, 'grey', false);
        this.strokeCoord(0, 0, coordWidth, coordHeight);
        // 注意坐标为[ 0 , 0 ]，绘制坐标系x和y轴

        // 7、x轴局部放大1.5倍，y轴局部放大2倍 
        // 最后来看一下使用scale方法将局部坐标系x轴放大1.5倍，y轴放大2.0倍后的显示效果，代码如下：
        // this.context2D.scale(1.5, 2.0);
        // //局部坐标系的x轴放大1.5倍，y轴放大2倍
        // this.fillLocalRectWithTitle(width, height, ' 7、x轴局部放大1.5倍，y轴局部放大2倍 ', ELayout.LEFT_TOP, ELayout.CENTER_MIDDLE, 'grey', false);              // 同时物体的宽度也会放大1.5倍，高度放大2倍

        // 8、 放大物体尺寸 
        // 注释掉上面进行局部坐标系缩放的代码，输入下面的代码
        this.fillLocalRectWithTitle(width * 1.5, height * 2.0, ' 8、 放大物体尺寸 ', ELayout.LEFT_TOP, ELayout.CENTER_MIDDLE, 'grey', false);                              // 这里是放大物体本身的尺寸，而不是放大局部
        // 坐标系的尺寸，一定要注意！! ！
        this.strokeCoord(0, 0, coordWidth, coordHeight);
        // 注意坐标为[ 0 , 0 ]，绘制坐标系x和y轴
        this.fillCircle(0, 0, radius);
        // 注意坐标为[ 0 , 0 ] , 绘制坐标系原点

        this.context2D.restore();
    }


    // 这个方法名称按照变换顺序取名
    // 其形成一个圆的路径，而且绘制物体的朝向和圆路径一致
    public translateRotateTranslateDrawRect(degree: number, u: number =
        0, v: number = 0, radius = 200, width: number = 40, height: number
            = 20): void {
        if (this.context2D === null) {
            return;
        }
        // 将角度变换为弧度
        let radians: number = Math2D.toRadian(degree);
        // 记录状态
        this.context2D.save();
        // 将局部坐标系平移到画布的中心
        this.context2D.translate(this.canvas.width * 0.5, this.
            canvas.height * 0.5);
        // 然后再将局部坐标系旋转某个弧度
        this.context2D.rotate(radians);
        // 然后再将位于画布中心旋转后的局部坐标系沿着局部x轴的方向平移250个单位，
        this.context2D.translate(radius, 0);
        // 在变换后的局部坐标系中根据u、v值绘制矩形，其原点由u、v确定
        this.fillLocalRectWithTitleUV(width, height, '', u, v);
        // 丢弃修改的状态集
        this.context2D.restore();
    }


    public testFillLocalRectWithTitleUV(): void {

        if (this.context2D === null) {
            return;
        }

        let radius: number = 200;                    // 圆路径的半径为200个单位
        let steps: number = 18;
        // 将圆分成上下各18个等分，-180°～180°，每个等分10°

        // [ 0 , +180 ]度绘制u系数从0～1, v系数不变
        // 导致的结果是x轴原点一直从左到右变动，y轴原点一直在上面（top）
        for (let i = 0; i <= steps; i++) {
            let n: number = i / steps;
            this.translateRotateTranslateDrawRect(i * 10, n, 0, radius);
        }

        // [ 0 , -180 ]度绘制
        // 导致的结果是y轴原点一直从上到下变动，x轴原点一直在左面（left）
        for (let i = 0; i < steps; i++) {
            let n: number = i / steps;
            this.translateRotateTranslateDrawRect(- i * 10, 0, n, radius);
        }
        // 在画布中心的4个象限绘制不同u、v的矩形，可以看一下u、v不同系数产生的不同效果
        this.context2D.save();
        this.context2D.translate(this.canvas.width * 0.5 - radius *
            0.4, this.canvas.height * 0.5 - radius * 0.4);
        this.fillLocalRectWithTitleUV(100, 60, 'u = 0.5 / v = 0.5', 0.5,
            0.5);
        this.context2D.restore();
        this.context2D.save();
        this.context2D.translate(this.canvas.width * 0.5 + radius *
            0.2, this.canvas.height * 0.5 - radius * 0.2);
        this.fillLocalRectWithTitleUV(100, 60, 'u = 0 / v = 1', 0, 1);
        this.context2D.restore();
        this.context2D.save();
        this.context2D.translate(this.canvas.width * 0.5 + radius *
            0.3, this.canvas.height * 0.5 + radius * 0.4);
        this.fillLocalRectWithTitleUV(100, 60, 'u = 0.3 / v = 0.6', 0.3,
            0.6);
        this.context2D.restore();
        this.context2D.save();
        this.context2D.translate(this.canvas.width * 0.5 - radius *
            0.1, this.canvas.height * 0.5 + radius * 0.25);
        this.fillLocalRectWithTitleUV(100, 60, 'u = 1 / v = 0.2', 1, 0.2);
        this.context2D.restore();
        // 使用10个单位线宽，半透明的颜色绘制圆的路径
        this.strokeCircle(this.canvas.width * 0.5, this.canvas.height * 0.5, radius, 'rgba( 0 , 255 , 255 , 0.5 )');
    }
}


let canvas: HTMLCanvasElement | null = document.getElementById('canvas') as HTMLCanvasElement;
let app = new Coord(canvas);
canvas.width = 500
canvas.height = 500

_createTab(
    "局部坐标系变换",
    ['drawCanvasCoordCenter', '位置信息', '先平移再旋转', '先旋转再平移', '旋转轨迹1', '旋转轨迹2', '旋转轨迹3', '变换过程1', '变换过程2'],
    {
        onChange(k) {
            app.stop();
            app.clearRect();
            switch (k) {
                case 'drawCanvasCoordCenter':
                    app.drawCanvasCoordCenter();
                    break;
                case '位置信息':
                    (window as any).Spui.Message.info('鼠标在画布移动试试')
                    app.start();
                    break;
                case '先平移再旋转':
                    app.doTransform(20);
                    break;
                case '先旋转再平移':
                    app.doTransform(20, false);
                    break;
                case '旋转轨迹1':
                    app.doTransform(20);
                    app.doTransformStrokeCircle1();
                    break
                case '旋转轨迹2':
                    app.doTransformStrokeCircle2();
                    break
                case '旋转轨迹3':
                    app.testFillLocalRectWithTitle();
                    break
                case '变换过程1':
                    // app.start();
                    app.doLocalTransform();
                    break;
                case '变换过程2':
                    app.testFillLocalRectWithTitleUV()
                    break;
            }
        },
        onStar() {
            app.start();
        },
        onStop() {
            app.stop();
        }
    }
)
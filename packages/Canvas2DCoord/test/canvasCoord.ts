import GeometryTes from '../../Canvas2D/test/canvas2dGeometry'
import _createTab from '../../Canvas2D/test/_createTab'
import { CanvasMouseEvent } from 'packages/Canvas2D/core';
import { Math2D } from '../../Canvas2D/core/index'
class Coord extends GeometryTes {
    private _mouseX: number = 0
    private _mouseY: number = 0
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
}


let canvas: HTMLCanvasElement | null = document.getElementById('canvas') as HTMLCanvasElement;
let app = new Coord(canvas);
canvas.width = 500
canvas.height = 500

_createTab(
    "局部坐标系变换",
    ['drawCanvasCoordCenter', '位置信息',  '先平移再旋转', '先旋转再平移'],
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
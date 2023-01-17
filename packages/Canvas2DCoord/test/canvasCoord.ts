import GeometryTes from '../../Canvas2D/test/canvas2dGeometry'
import _createTab from '../../Canvas2D/test/_createTab'

class Coord extends GeometryTes {
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
}


let canvas: HTMLCanvasElement | null = document.getElementById('canvas') as HTMLCanvasElement;
let app = new Coord(canvas)

_createTab("局部坐标系变换", ['k'])
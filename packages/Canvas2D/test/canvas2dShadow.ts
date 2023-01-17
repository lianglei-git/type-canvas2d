// shadow 绘制阴影
import { Canvas2DApplication, vec2, Size, Rectangle, EImageFillType } from '../core/index'
import _createtab from './_createtab';
import ImageTest from './canvas2dPriture'


class ShadowTest extends ImageTest {
    public printShadowStates(): void {
        if (this.context2D!== null) {
            console.log(" ＊＊＊＊＊＊＊＊＊ ShadowState ＊＊＊＊＊＊＊＊＊＊ ");
            console.log(" shadowBlur : " + this.context2D.shadowBlur);
            console.log(" shadowColor : " + this.context2D.shadowColor);
            console.log(" shadowOffsetX : " + this.context2D.
                shadowOffsetX);
            console.log(" shadowOffsetY : " + this.context2D.
                shadowOffsetY);
        }
    }
}
const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;


const app = new ShadowTest(canvas)

_createtab(
    '绘制阴影',
    ["默认参数","高斯模糊"],
    {
        onChange(k) {
            app.clearRect();
            const descRect = Rectangle.create(0, 0, app.canvas.width, app.canvas.height)
            switch (k) {
                case '高斯模糊':
                    app.setShadowState();
                    app.loadAndDrawImage('./data/zhilu.jpeg')
                    break;
                case '默认参数':
                    app.printShadowStates();
                    break;
            }
        },
        onStar() { },
        onStop() { }
    }
)
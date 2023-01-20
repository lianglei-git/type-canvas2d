import { Canvas2DApplication } from '../core/index';
import _createtab from './_createtab';
/**
 *
 * 在CanvasRenderingContext2D上下文渲染对象中，和文本绘制相关的属性和方法主要有如下几个：
    font : string ;
    textAlign : string ;
    textBaseline : string ;
    strokeText ( text : string , x : number , y : number , maxWidth ? : number ) :
    void ;
    fillText ( text : string , x : number , y : number , maxWidth ? : number ) :
    void ;
    measureText ( text : string ) : TextMetrics ;
    // TextMetrics接口签名
    interface TextMetrics {
      readonly  width : number ;
    }
 */
export var ETextLayout;
(function (ETextLayout) {
    ETextLayout[ETextLayout["LEFT_TOP"] = 0] = "LEFT_TOP";
    ETextLayout[ETextLayout["RIGHT_TOP"] = 1] = "RIGHT_TOP";
    ETextLayout[ETextLayout["RIGHT_BOTTOM"] = 2] = "RIGHT_BOTTOM";
    ETextLayout[ETextLayout["LEFT_BOTTOM"] = 3] = "LEFT_BOTTOM";
    ETextLayout[ETextLayout["CENTER_MIDDLE"] = 4] = "CENTER_MIDDLE";
    ETextLayout[ETextLayout["CENTER_TOP"] = 5] = "CENTER_TOP";
    ETextLayout[ETextLayout["RIGHT_MIDDLE"] = 6] = "RIGHT_MIDDLE";
    ETextLayout[ETextLayout["CENTER_BOTTOM"] = 7] = "CENTER_BOTTOM";
    ETextLayout[ETextLayout["LEFT_MIDDLE"] = 8] = "LEFT_MIDDLE";
})(ETextLayout || (ETextLayout = {}));
/** 文本的实现 和 测试  */
class TextTest extends Canvas2DApplication {
    printTextStates() {
        if (this.context2D !== null) {
            console.log(" *********TextState********** ");
            console.log(" font : " + this.context2D.font);
            console.log(" textAlign : " + this.context2D.textAlign);
            console.log(" textBaseline : " + this.context2D.textBaseline);
        }
    }
    testCanvas2DTextLayout() {
        // 要绘制的矩形离canvas的margin（外边距）分别是[ 20 , 20 , 20 , 20 ] ;
        let x = 20;
        let y = 20;
        let width = this.canvas.width - x * 2;
        let height = this.canvas.height - y * 2;
        let drawX = x;
        let drawY = y;
        // 原点的半径为3像素
        let radius = 3;
        // 1．画背景rect，该函数在下面一节介绍
        this.fillRectWithTitle(x, y, width, height);
        // 使用20px sans-serif字体绘制（默认为10px sans-serif）
        // 每个位置，先绘制drawX和drawY的坐标原点，然后绘制文本
        // 2．左上
        this.fillText("left - top", drawX, drawY, 'white', 'left', 'top', '20px sans-serif');
        this.fillCircle(drawX, drawY, radius, 'black');
        // 3．右上
        drawX = x + width;
        drawY = y;
        this.fillText("right - top", drawX, drawY, 'white', 'right', 'top', '20px sans-serif');
        this.fillCircle(drawX, drawY, radius, 'black');
        // 4．右下
        drawX = x + width;
        drawY = y + height;
        this.fillText("right - bottom", drawX, drawY, 'white', 'right', 'bottom', '20px sans-serif');
        this.fillCircle(drawX, drawY, radius, 'black');
        // 5．左下
        drawX = x;
        drawY = y + height;
        this.fillText("left - bottom", drawX, drawY, 'white', 'left', 'bottom', '20px sans-serif');
        this.fillCircle(drawX, drawY, radius, 'black');
        // 6．中心
        drawX = x + width * 0.5;
        drawY = y + height * 0.5;
        this.fillText("center - middle", drawX, drawY, 'black', 'center', 'middle', '20px sans-serif');
        this.fillCircle(drawX, drawY, radius, 'red');
        // 7．中上
        drawX = x + width * 0.5;
        drawY = y;
        this.fillText("center - top", drawX, drawY, 'blue', 'center', 'top', '20px sans-serif');
        this.fillCircle(drawX, drawY, radius, 'black');
        // 8．右中
        drawX = x + width;
        drawY = y + height * 0.5;
        this.fillText("right - middle", drawX, drawY, 'blue', 'right', 'middle', '20px sans-serif');
        this.fillCircle(drawX, drawY, radius, 'black');
        // 9．中下
        drawX = x + width * 0.5;
        drawY = y + height;
        this.fillText("center - bottom", drawX, drawY, 'blue', 'center', 'bottom', '20px sans-serif');
        this.fillCircle(drawX, drawY, radius, 'black');
        // 10．左中
        drawX = x;
        drawY = y + height * 0.5;
        this.fillText("left - middle", drawX, drawY, 'blue', 'left', 'middle', '20px sans-serif');
        this.fillCircle(drawX, drawY, radius, 'black');
    }
    testMyTextLayout(font = this.makeFontString('18px', 'bold', 'italic', 'small-caps', 'sans-serif')) {
        let x = 20;
        let y = 20;
        let width = this.canvas.width - x * 2;
        let height = this.canvas.height - y * 2;
        let right = x + width;
        let bottom = y + height;
        let drawX = x;
        let drawY = y;
        let drawWidth = 80;
        let drawHeight = 50;
        // 1. 画背景rect
        this.fillRectWithTitle(x, y, width, height);
        // 2. 左上
        this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, 'left - top', ETextLayout.LEFT_TOP, 'rgba( 255 , 255 , 0 , 0.2 )');
        // 3. 右上
        drawX = right - drawWidth;
        drawY = y;
        this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, 'right - top', ETextLayout.RIGHT_TOP, 'rgba( 255 , 255 , 0 , 0.2 )');
        // 4. 右下
        drawX = right - drawWidth;
        drawY = bottom - drawHeight;
        this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, 'right - bottom', ETextLayout.RIGHT_BOTTOM, 'rgba( 255 , 255 ,0, 0.2)');
        // 5. 左下
        drawX = x;
        drawY = bottom - drawHeight;
        this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, 'left - bottom', ETextLayout.LEFT_BOTTOM, 'rgba( 255 , 255 , 0 ,0.2)');
        // 6. 中心
        drawX = (right - drawWidth) * 0.5;
        drawY = (bottom - drawHeight) * 0.5;
        this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, 'center - middle', ETextLayout.CENTER_MIDDLE, 'rgba( 255 , 0 ,0, 0.2)');
        // 7. 中上
        drawX = (right - drawWidth) * 0.5;
        drawY = y;
        this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, 'center - top', ETextLayout.CENTER_TOP, 'rgba( 0 , 255 , 0 , 0.2 )');
        // 8. 右中
        drawX = (right - drawWidth);
        drawY = (bottom - drawHeight) * 0.5;
        this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, 'right - middle', ETextLayout.RIGHT_MIDDLE, 'rgba( 0 , 255 , 0 ,0.2)');
        // 9. 中下
        drawX = (right - drawWidth) * 0.5;
        drawY = (bottom - drawHeight);
        this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, 'center - bottom', ETextLayout.CENTER_BOTTOM, 'rgba( 0 , 255 ,0, 0.2)');
        // 10. 左中
        drawX = x;
        drawY = (bottom - drawHeight) * 0.5;
        this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight, 'left - middle', ETextLayout.LEFT_MIDDLE, 'rgba( 0 , 255 , 0 ,0.2)');
    }
}
const canvas = document.getElementById('canvas');
const app = new TextTest(canvas);
canvas.width = 700;
canvas.height = 600;
_createtab('绘制文本', ['获取文本信息', '文本对齐测试', '位置信息'], {
    onChange(k) {
        switch (k) {
            case '获取文本信息':
                app.printTextStates();
                break;
            case '文本对齐测试':
                app.strokeGrid();
                app.testCanvas2DTextLayout();
                break;
            case '位置信息':
                app.strokeGrid();
                app.testMyTextLayout();
        }
    },
    onStar() { },
    onStop() {
        app.stop();
    }
});

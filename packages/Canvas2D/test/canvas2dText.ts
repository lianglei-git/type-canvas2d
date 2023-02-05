
import { Canvas2DApplication, vec2, Size, Rectangle, ELayout  } from '../core/index'
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


/** 文本的实现 和 测试  */
class TextTest extends Canvas2DApplication {
    public printTextStates(): void {
        if (this.context2D !== null) {
            console.log(" *********TextState********** ");
            console.log(" font : " + this.context2D.font);
            console.log(" textAlign : " + this.context2D.textAlign);
            console.log(" textBaseline : " + this.context2D.textBaseline);
        }
    }

    public testCanvas2DTextLayout(): void {

        // 要绘制的矩形离canvas的margin（外边距）分别是[ 20 , 20 , 20 , 20 ] ;
        let x: number = 20;
        let y: number = 20;
        let width: number = this.canvas.width - x * 2;
        let height: number = this.canvas.height - y * 2;
        let drawX: number = x;
        let drawY: number = y;
        // 原点的半径为3像素
        let radius: number = 3;
        // 1．画背景rect，该函数在下面一节介绍
        this.fillRectWithTitle(x, y, width, height);
        // 使用20px sans-serif字体绘制（默认为10px sans-serif）
        // 每个位置，先绘制drawX和drawY的坐标原点，然后绘制文本
        // 2．左上
        this.fillText("left - top", drawX, drawY, 'white', 'left', 'top',
            '20px sans-serif');
        this.fillCircle(drawX, drawY, radius, 'black');
        // 3．右上
        drawX = x + width;
        drawY = y;
        this.fillText("right - top", drawX, drawY, 'white', 'right',
            'top', '20px sans-serif');
        this.fillCircle(drawX, drawY, radius, 'black');
        // 4．右下
        drawX = x + width;
        drawY = y + height;
        this.fillText("right - bottom", drawX, drawY, 'white', 'right',
            'bottom', '20px sans-serif');
        this.fillCircle(drawX, drawY, radius, 'black');
        // 5．左下
        drawX = x;
        drawY = y + height;
        this.fillText("left - bottom", drawX, drawY, 'white', 'left',
            'bottom', '20px sans-serif');
        this.fillCircle(drawX, drawY, radius, 'black');
        // 6．中心
        drawX = x + width * 0.5;
        drawY = y + height * 0.5;
        this.fillText("center - middle", drawX, drawY, 'black', 'center',
            'middle', '20px sans-serif');
        this.fillCircle(drawX, drawY, radius, 'red');
        // 7．中上
        drawX = x + width * 0.5;
        drawY = y;
        this.fillText("center - top", drawX, drawY, 'blue', 'center',
            'top', '20px sans-serif');
        this.fillCircle(drawX, drawY, radius, 'black');
        // 8．右中
        drawX = x + width;
        drawY = y + height * 0.5;
        this.fillText("right - middle", drawX, drawY, 'blue', 'right',
            'middle', '20px sans-serif');
        this.fillCircle(drawX, drawY, radius, 'black');
        // 9．中下
        drawX = x + width * 0.5;
        drawY = y + height;
        this.fillText("center - bottom", drawX, drawY, 'blue', 'center',
            'bottom', '20px sans-serif');
        this.fillCircle(drawX, drawY, radius, 'black');
        // 10．左中
        drawX = x;
        drawY = y + height * 0.5;
        this.fillText("left - middle", drawX, drawY, 'blue', 'left',
            'middle', '20px sans-serif');
        this.fillCircle(drawX, drawY, radius, 'black');
    }

    public testMyTextLayout(font: string = this.makeFontString('18px', 'bold', 'italic', 'small-caps', 'sans-serif')): void {
        let x: number = 20;
        let y: number = 20;
        let width: number = this.canvas.width - x * 2;
        let height: number = this.canvas.height - y * 2;
        let right: number = x + width;
        let bottom: number = y + height;
        let drawX: number = x;
        let drawY: number = y;
        let drawWidth: number = 80;
        let drawHeight: number = 50;
        // 1. 画背景rect
        this.fillRectWithTitle(x, y, width, height);
        // 2. 左上
        this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight,
            'left - top', ELayout.LEFT_TOP, 'rgba( 255 , 255 , 0 , 0.2 )');
        // 3. 右上
        drawX = right - drawWidth;
        drawY = y;
        this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight,
            'right - top', ELayout.RIGHT_TOP, 'rgba( 255 , 255 , 0 , 0.2 )');

        // 4. 右下
        drawX = right - drawWidth;
        drawY = bottom - drawHeight;
        this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight,
            'right - bottom', ELayout.RIGHT_BOTTOM, 'rgba( 255 , 255 ,0, 0.2)');
        // 5. 左下
        drawX = x;
        drawY = bottom - drawHeight;
        this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight,
            'left - bottom', ELayout.LEFT_BOTTOM, 'rgba( 255 , 255 , 0 ,0.2)');
        // 6. 中心
        drawX = (right - drawWidth) * 0.5;
        drawY = (bottom - drawHeight) * 0.5;
        this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight,
            'center - middle', ELayout.CENTER_MIDDLE, 'rgba( 255 , 0 ,0, 0.2)');
        // 7. 中上
        drawX = (right - drawWidth) * 0.5;
        drawY = y;
        this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight,
            'center - top', ELayout.CENTER_TOP, 'rgba( 0 , 255 , 0 , 0.2 )');
        // 8. 右中
        drawX = (right - drawWidth);
        drawY = (bottom - drawHeight) * 0.5;
        this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight,
            'right - middle', ELayout.RIGHT_MIDDLE, 'rgba( 0 , 255 , 0 ,0.2)');
        // 9. 中下
        drawX = (right - drawWidth) * 0.5;
        drawY = (bottom - drawHeight);
        this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight,
            'center - bottom', ELayout.CENTER_BOTTOM, 'rgba( 0 , 255 ,0, 0.2)');
        // 10. 左中
        drawX = x;
        drawY = (bottom - drawHeight) * 0.5;
        this.fillRectWithTitle(drawX, drawY, drawWidth, drawHeight,
            'left - middle', ELayout.LEFT_MIDDLE, 'rgba( 0 , 255 , 0 ,0.2)');
    }
    // 下面三个方法以移动到 父类实现
    // public calcTextSize(text: string, char: string = 'W', scale: number = 0.5) {}
    // public calcLocalTextRectangle(layout: ETextLayout, text: string, parentWidth: number, parentHeight: number) {}

    // public fillRectWithTitle(){}

}

const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;

const app = new TextTest(canvas);
canvas.width = 700
canvas.height = 600

_createtab(
    '绘制文本',
    ['获取文本信息', '文本对齐测试', '位置信息'],
    {
        onChange(k) {
            switch (k) {
                case '获取文本信息':
                    app.printTextStates(); break;
                case '文本对齐测试':
                    app.strokeGrid();
                    app.testCanvas2DTextLayout(); break;
                case '位置信息':
                    app.strokeGrid();
                    app.testMyTextLayout();
            }
        },
        onStar() { },
        onStop() {
            app.stop();
        }

    }
)
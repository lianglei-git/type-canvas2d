import { Canvas2DApplication, vec2, Size, Rectangle } from '../core/index';
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
    // 笔者测试大小写26个英文字母后（10px sans-serif默认字体）
    // 决定使用大写W的宽度加上scale为0.5作为行高计算的要点（默认参数）
    // 其他字体或字体尺寸请自行做实验
    calcTextSize(text, char = 'W', scale = 0.5) {
        if (this.context2D !== null) {
            let size = new Size();
            size.width = this.context2D.measureText(text).width;
            let w = this.context2D.measureText(char).width;
            size.height = w + w * scale; // 宽度上加scale比例
            return size;
        }
        // 直接报错
        alert(" context2D渲染上下文为null ");
        throw new Error(" context2D渲染上下文为null ");
    }
    // parentWidth / parentHeight是父矩形的尺寸
    // 函数返回类型是Rectangle，表示9个文本子矩形之一
    // 这些子矩形是相对父矩形坐标系的表示
    // 这意味着父矩形原点为[0 , 0]，所以参数是父矩形的width和height，而没有x和y坐标
    calcLocalTextRectangle(layout, text, parentWidth, parentHeight) {
        // 首先计算出要绘制的文本的尺寸（width / hegiht）
        let s = this.calcTextSize(text);
        // 创建一个二维向量
        let o = vec2.create();
        // 计算出当前文本子矩形左上角相对父矩形空间中的3个关键点（左上、中心、右下）坐标
        // 1．当前文本子矩形左上角相对父矩形左上角坐标，由于局部表示，所以为[ 0 , 0 ]
        let left = 0;
        let top = 0;
        // 2．当前文本子矩形左上角相对父矩形右下角坐标
        let right = parentWidth - s.width;
        let bottom = parentHeight - s.height;
        // 3．当前文本子矩形左上角相对父矩形中心点坐标
        let center = right * 0.5;
        let middle = bottom * 0.5;
        // 根据ETextLayout的值来匹配这3个点的分量
        // 计算子矩形相对父矩形原点[ 0 , 0 ]偏移量
        switch (layout) {
            case ETextLayout.LEFT_TOP:
                o.x = left;
                o.y = top;
                break;
            case ETextLayout.RIGHT_TOP:
                o.x = right;
                o.y = top;
                break;
            case ETextLayout.RIGHT_BOTTOM:
                o.x = right;
                o.y = bottom;
                break;
            case ETextLayout.LEFT_BOTTOM:
                o.x = left;
                o.y = bottom;
                break;
            case ETextLayout.CENTER_MIDDLE:
                o.x = center;
                o.y = middle;
                break;
            case ETextLayout.CENTER_TOP:
                o.x = center;
                o.y = 0;
                break;
            case ETextLayout.RIGHT_MIDDLE:
                o.x = right;
                o.y = middle;
                break;
            case ETextLayout.CENTER_BOTTOM:
                o.x = center;
                o.y = bottom;
                break;
            case ETextLayout.LEFT_MIDDLE:
                o.x = left;
                o.y = middle;
                break;
        }
        // 返回子矩形
        return new Rectangle(o, s);
    }
    fillRectWithTitle(x, y, width, height, title = '', layout = ETextLayout.CENTER_MIDDLE, color = 'grey', showCoord = true) {
        if (this.context2D !== null) {
            this.context2D.save();
            // 1. 绘制矩形
            this.context2D.fillStyle = color;
            this.context2D.beginPath();
            this.context2D.rect(x, y, width, height);
            this.context2D.fill();
            // 如果有文字的话，先根据枚举值计算x、y坐标
            if (title.length !== 0) {
                // 2. 绘制文字信息
                // 在矩形的左上角绘制出相关文字信息，使用的是10px大小的文字
                // 调用calcLocalTextRectangle方法
                let rect = this.calcLocalTextRectangle(layout, title, width, height);
                // 修改样式
                // const font: string = this.makeFontString('18px', 'bold', 'italic', 'small-caps', 'sans-serif')
                // 绘制文本
                this.fillText(title, x + rect.origin.x, y + rect.origin.y, 'white', 'left', 'top', '10px sans-serif');
                // 绘制文本框
                this.strokeRect(x + rect.origin.x, y + rect.origin.y, rect.size.width, rect.size.height, 'rgba( 0 , 0 ,0, 0.5) ');
                // 绘制文本框左上角坐标（相对父矩形表示）
                this.fillCircle(x + rect.origin.x, y + rect.origin.y, 2);
            }
            // 3. 绘制变换的局部坐标系
            // 附加一个坐标，x轴和y轴比矩形的width和height多20个像素
            // 并且绘制3个像素的原点
            if (showCoord) {
                this.strokeCoord(x, y, width + 20, height + 20);
                this.fillCircle(x, y, 3);
            }
            this.context2D.restore();
        }
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

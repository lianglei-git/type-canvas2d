import { Canvas2DApplication } from '../core/index';
import _createtab from './_createtab';
// implements CanvasRenderingContext2D 
export default class GeometryTes extends Canvas2DApplication {
    fillStyle = '';
    strokeStyle = '';
    // 由于Colors独一无二，没有多个实例
    // 可以声明为公开的静态的数组类型
    static Colors = [
        'aqua',
        'black',
        'blue',
        'fuchsia',
        'gray',
        'green',
        'lime',
        'maroon',
        'navy',
        'olive',
        'orange',
        'purple',
        'red',
        'silver',
        'teal',
        'white',
        'yellow' //黄色
    ];
    // 在TestApplication中增加一个线性渐变对象
    _linearGradient;
    // 在TestApplication中增加一个放射渐变对象
    _radialGradient;
    _lineDashOffset = 0;
    _pattern;
    // 覆写（override）基类的构造方法
    // constructor(canvas: HTMLCanvasElement) {
    //     super(canvas);
    //     // 添加计时器，以每秒30帧的速度运行
    //     // 使用bind方法绑定回调函数
    //     this.addTimer(this.timeCallback.bind(this), 0.033)
    // }
    _updateLineDashOffset() {
        this._lineDashOffset++;
        if (this._lineDashOffset > 10000) {
            this._lineDashOffset = 0;
        }
    }
    render() {
        if (this.context2D !== null) {
            this.clearRect();
            this._drawRect(10, 10, this.canvas.width - 20, this.canvas.height - 20);
        }
    }
    clearRect = () => {
        if (this.context2D !== null) {
            this.context2D.clearRect(0, 0, this.context2D.canvas.width, this.context2D.canvas.height);
        }
    };
    _drawRect(x, y, w, h) {
        if (this.context2D !== null) {
            this.context2D.save();
            this.context2D.fillStyle = 'grey';
            this.context2D.strokeStyle = 'blue';
            this.context2D.lineWidth = 2;
            // 虚线
            this.context2D.setLineDash([10, 5]);
            // 偏移量
            this.context2D.lineDashOffset = this._lineDashOffset;
            this.context2D.beginPath();
            this.context2D.moveTo(x, y);
            this.context2D.lineTo(x + w, y);
            this.context2D.lineTo(x + w, y + h);
            this.context2D.lineTo(x, y + h);
            this.context2D.closePath();
            this.context2D.fill();
            this.context2D.stroke();
            this.context2D.restore();
        }
    }
    /** 渐变圆 */
    fillRadialRect(x, y, w, h) {
        if (this.context2D !== null) {
            // 每次要绘制时总是使用save / restore对
            this.context2D.save();
            // 如果当前的放射渐变对象为undefined，就生成一个
            // 使用延迟创建方式，只有在用到时才创建一次
            if (this._radialGradient === undefined) {
                // 计算矩形的中心点坐标
                let centX = x + w * 0.5;
                let centY = y + h * 0.5;
                // 矩形可能不是正方形，此时我们选择矩形的长度和宽度中最小的值作为直径
                let radius = Math.min(w, h);
                // 计算半径
                radius *= 0.5;
                // 放射渐变由内圆和外圆来定义
                // 可以调整一下内圆的半径来看一下效果
                // 提供内圆圈radius ＊ 0.1 / 0.3 / 0.8 对比图
                this._radialGradient = this.context2D.createRadialGradient(centX, centY, radius * 0.8, centX, centY, radius);
                this._radialGradient.addColorStop(0.0, 'black');
                this._radialGradient.addColorStop(0.25, 'rgba( 255 , 0 ,0, 1) ');
                this._radialGradient.addColorStop(0.5, 'green');
                this._radialGradient.addColorStop(0.75, '#0000FF');
                this._radialGradient.addColorStop(1.0, 'white');
            }
            // 如果当前的线性渐变对象为undefined，就生成一个
            // 使用延迟创建方式，只有在用到时才创建一次
            // 设置放射渐变对象
            this.context2D.fillStyle = this._radialGradient;
            // 这里使用fillRect方法直接绘制一个封闭的矩形对象
            // 前面代码使用moveTo和lineTo以及rect方法来实现矩形对象的绘制
            this.context2D.fillRect(x, y, w, h);
            //恢复渲染状态
            this.context2D.restore();
        }
    }
    fillLinearRect(x, y, w, h) {
        if (this.context2D !== null) {
            // 每次要绘制时总是使用save / restore对
            this.context2D.save();
            // 如果当前的线性渐变对象为undefined，就生成一个
            // 使用延迟创建方式，只有在用到时才创建一次
            if (this._linearGradient === undefined) {
                // 使用createLinearGradient
                // 创建从左到右水平线性渐变，也可以将参数改为( x + w , y , x , y )创建从右到左线性渐变
                this._linearGradient = this.context2D.createLinearGradient(x, y, x + w, y);
                // 下面的代码创建从上到下线性渐变，也可以将参数改为( x , y + h , x  , y )创建从下到上线性渐变
                // this._linearGradient = this.context2D.createLinearGradient(x, y, x, y + h);
                // 下面的代码创建从左上角到右下角的线性渐变
                // this._linearGradient = this.context2D.createLinearGradient(x, y, x + w, y + h);
                // 下面的代码创建从右下角到左上角的线性渐变
                // this._linearGradient = this.context2D.createLinearGradient(x + w, y + h, x, y);
                // 可以使用CanvasGradiant对象的addColorStop添加5个color stop
                // 第一个参数是[ 0 , 1 ]的浮点数，可以将其当成线性颜色线所占的百分比
                // 第二个参数是一个字符串颜色值，下面使用了上一节中讲到的CSS颜色表示法
                this._linearGradient.addColorStop(0.0, 'grey');
                this._linearGradient.addColorStop(0.25, 'rgba( 255 , 0 ,0, 1) ');
                this._linearGradient.addColorStop(0.5, 'green');
                this._linearGradient.addColorStop(0.75, '#0000FF');
                this._linearGradient.addColorStop(1.0, 'black');
            }
            // 设置线性渐变对象
            this.context2D.fillStyle = this._linearGradient;
            // 这里使用rect方法直接绘制一个封闭的矩形对象
            // 前面代码使用moveTo和lineTo来实现矩形对象的绘制
            this.context2D.beginPath();
            this.context2D.rect(x, y, w, h);
            this.context2D.fill(); // 这里只填充，不描边
            //恢复渲染状态
            this.context2D.restore();
        }
    }
    fillPatternRect = (x, y, w, h, repeat = "repeat") => {
        if (this.context2D !== null) {
            if (this._pattern === undefined) {
                // 注意，createElement中image类型使用’img’拼写，不能写错
                let img = document.createElement('img');
                // 设置要载入的图片URL相对路径
                img.src = './data/test.png';
                console.log(img);
                // 使用箭头函数后，this指向TestApplication类
                img.onload = (ev) => {
                    if (this.context2D !== null) {
                        // 调用createPattern方法
                        this._pattern = this.context2D.createPattern(img, repeat);
                        // 会看到onload是异步调用的，只有整个图片从服务器载入到浏览器后
                        // 才会调用下面的代码
                        this.context2D.save();
                        // 设置线性渐变对象
                        this.context2D.fillStyle = this._pattern;
                        // 这里使用rect方法直接绘制一个封闭的矩形对象
                        // 前面代码使用moveTo和lineTo来实现矩形对象的绘制
                        this.context2D.beginPath();
                        this.context2D.rect(x, y, w, h);
                        this.context2D.fill(); //这里只填充，不描边
                        //恢复渲染状态
                        this.context2D.restore();
                    }
                };
            }
            else {
                // 如果已经存在pattern后，会运行这段代码
                this.context2D.save();
                // 设置线性渐变对象
                this.context2D.fillStyle = this._pattern;
                // 这里使用rect方法直接绘制一个封闭的矩形对象
                // 前面代码使用moveTo和lineTo来实现矩形对象的绘制
                this.context2D.beginPath();
                this.context2D.rect(x, y, w, h);
                this.context2D.fill(); //这里只填充，不描边
                //恢复渲染状态
                this.context2D.restore();
            }
        }
    };
    printLineStates() {
        if (this.context2D !== null) {
            console.log(" ＊＊＊＊＊＊＊＊＊LineState＊＊＊＊＊＊＊＊＊＊ ");
            console.log(" lineWidth : " + this.context2D.lineWidth);
            console.log(" lineCap : " + this.context2D.lineCap);
            console.log(" lineJoin : " + this.context2D.lineJoin);
            console.log(" miterLimit : " + this.context2D.miterLimit);
        }
    }
    // TimeCallback函数原型签名为 ( id : number , data : any ) => void
    timeCallback(id, data) {
        this._updateLineDashOffset();
        if (this.context2D !== null) {
            this.clearRect();
            this._drawRect(10, 10, this.canvas.width - 20, this.canvas.height - 20);
        }
    }
}
let canvas = document.getElementById('canvas');
let app = new GeometryTes(canvas);
const checkRadio = [
    '虚线过度',
    '圆渐变',
    '线性渐变',
    '图片渲染',
    '坐标轴',
    '网格布局'
];
let timerId = null;
const onChange = (label) => {
    if (timerId !== null || label !== '虚线过度') {
        app.removeTimer(timerId);
        app.stop();
    }
    app.clearRect();
    switch (label) {
        case '虚线过度':
            timerId = app.addTimer(app.timeCallback.bind(app), 0.033);
            app.start();
            break;
        case '圆渐变':
            app.fillRadialRect(10, 10, app.canvas.width - 20, app.canvas.height - 20);
            break;
        case '线性渐变':
            app.fillLinearRect(10, 10, app.canvas.width - 20, app.canvas.height - 20);
            break;
        case '图片渲染':
            app.fillPatternRect(10, 10, app.canvas.width - 20, app.canvas.height - 20, 'repeat');
            break;
        case '坐标轴':
            app.strokeCoord(10, 10, app.canvas.width - 20, app.canvas.height - 20);
            break;
        case '网格布局':
            app.strokeGrid();
            break;
    }
};
const start = () => _createtab('基本的几何体', checkRadio, {
    onChange,
    onStar() {
        app.printLineStates();
    },
    onStop() {
        app.stop();
    }
});
export { start };

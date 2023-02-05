/** 坦克Demo */
/**
 * ● 将整个画布分为四大象限，分别标记出这些象限。
 * ● 坦克本身由四大基本图形组成：直线表示炮管，椭圆表示炮塔，矩形的底座及圆形用于标记坦克的正前方及炮口。
 * ● 当移动鼠标时，整个坦克会自动旋转后朝着鼠标指针方向并不停地移动，到达鼠标指针所在点后停止运行。
 * ● 当按R键时，坦克的炮塔顺时针旋转；当按E键时，坦克的炮塔逆时针旋转；当按T键时，坦克的炮塔重置到初始化状态。
 * ● 在上一节的drawCoordInfo方法中增加输出坦克当前的朝向角度相关信息。
 * ● 为了追踪运行路线，绘制出画布中心点到坦克中心点（translate、rotate和scale追踪原点），以及坦克中心点到鼠标指针位置的连线。这个坦克Demo，蕴含了几个比较重要的数学操作：
 * ● Canvas2D中象限及每个象限对应的角度取值范围（在5.18节已作说明）。
 * ● 坦克整体朝向，以及移动时涉及atan2、sin和cos这三个初中学过的三角函数的应用。
 * ● 炮管依赖于底座，但是能够独立控制，此时需要特殊处理，涉及坐标系变换时的层次操作。
 */

import Coord from "./canvasCoord";
import { Math2D, CanvasMouseEvent, ELayout, CanvasKeyBoardEvent } from '../../Canvas2D/core/index'
import _createTab from '../../Canvas2D/test/_createTab'


class Tank {

    // 坦克的大小尺寸
    public width: number = 80;
    public height: number = 50;
    // 坦克当前的位置
    // default情况下为[ 100 , 100 ]
    public x: number = 100;
    public y: number = 100;
    // 坦克当前的x和y方向上的缩放系数
    // default情况下为1.0
    public scaleX: number = 1.0;
    public scaleY: number = 1.0;
    // 坦克当前的旋转角度
    public tankRotation: number = 0;           //整个坦克的旋转角度，弧度表示
    public turretRotation: number = 0;         //炮塔的旋转角度，弧度表示
    // 在Tank类中增加一个成员变量，用来标示Tank初始化时是否朝着y轴正方向
    public initYAxis: boolean = true;
    public showLine: boolean = true;
    //是否显示坦克原点与画布中心点和目标点之间的连线
    public showCoord: boolean = false;         //是否显示坦克本身的局部坐标系
    public gunLength: number = Math.max(this.width, this.height);
    // 炮管长度，default情况下，等于坦克的width和height中最大的一个数值
    public gunMuzzleRadius: number = 5;

    // 需要在Tank类中增加要朝向的某个点（例如鼠标指针的位置）的成员变量
    public targetX: number = 0;
    public targetY: number = 0;
    public draw(app: Coord): void {
        if (app.context2D === null) {
            return;
        }
        // 整个坦克绘制tank
        app.context2D.save();
        // 整个坦克移动和旋转，注意局部变换的经典结合顺序（trs:translate->rotate-> scale )
        app.context2D.translate(this.x, this.y);
        app.context2D.rotate(this.initYAxis ? this.tankRotation - Math.PI * 0.5 : this.tankRotation);
        // app.context2D.rotate(this.tankRotation);
        app.context2D.scale(this.scaleX, this.scaleY);
        // 绘制坦克的底盘（矩形）
        app.context2D.save();
        app.context2D.fillStyle = 'grey';
        app.context2D.beginPath();
        if (this.initYAxis) {
            // 交换width和height，这样就不需要修改TestApplication中的示例
            //   代码了
            app.context2D.rect(- this.height * 0.5, - this.width
                * 0.5, this.height, this.width);
        } else {
            app.context2D.rect(- this.width * 0.5, - this.height
                * 0.5, this.width, this.height);
        }
        app.context2D.fill();
        app.context2D.restore();
        // 绘制炮塔turret
        app.context2D.save();
        app.context2D.rotate(this.turretRotation);
        // 椭圆炮塔ellipse方法
        app.context2D.fillStyle = 'red';
        app.context2D.beginPath();
        if (this.initYAxis) {
            // 当朝着y轴正方向时，椭圆的radiuX < radiuY
            app.context2D.ellipse(0, 0, 10, 15, 0, 0, Math.PI * 2);
        } else {
            // 当朝着x轴正方向时，椭圆的radiuX > radiuY
            app.context2D.ellipse(0, 0, 15, 10, 0, 0, Math.PI * 2);
        }
        app.context2D.fill();
        // 炮管gun barrel（炮管）
        app.context2D.strokeStyle = 'blue';
        app.context2D.lineWidth = 5; // 炮管需要粗一点，因此5个单位
        app.context2D.lineCap = 'round'; // 使用round方式
        app.context2D.beginPath();
        app.context2D.moveTo(0, 0);
        if (this.initYAxis) {
            // 当朝着y轴正方向时，炮管是沿着y轴正方向绘制的
            app.context2D.lineTo(0, this.gunLength);
        } else {
            // 当朝着x轴正方向时，炮管是沿着x轴正方向绘制的
            app.context2D.lineTo(this.gunLength, 0);
        }
        app.context2D.stroke();
        // 炮口，先将局部坐标系从当前的方向，向x轴的正方向平移gunLength（数值
        //   类型的变量，以像素为单位，表示炮管的长度）个像素，此时局部坐标系在炮管最右侧
        if (this.initYAxis) {
            // 当朝着y轴正方向时，炮口是沿着y轴正方向绘制的
            app.context2D.translate(0, this.gunLength);
            app.context2D.translate(0, this.gunMuzzleRadius);
        } else {
            // 当朝着x轴正方向时，炮口是沿着x轴正方向绘制的
            app.context2D.translate(this.gunLength, 0);
            app.context2D.translate(this.gunMuzzleRadius, 0);
        }
        // 调用自己实现的fillCircle方法，内部使用Canvas2D arc绘制圆弧方法
        app.fillCircle(0, 0, 5, 'black');
        app.context2D.restore();
        // 绘制一个圆球，标记坦克正方向，一旦炮管旋转后，可以知道正前方在哪里
        app.context2D.save();
        if (this.initYAxis) {
            // 当朝着y轴正方向时，标记坦克前方的圆球是沿着y轴正方向绘制的
            app.context2D.translate(0, this.height * 0.5);
        } else {
            // 当朝着x轴正方向时，标记坦克前方的圆球是沿着x轴正方向绘制的
            app.context2D.translate(this.width * 0.5, 0);
        }
        app.fillCircle(0, 0, 10, 'green');
        app.context2D.restore();
        // 坐标系是跟随整个坦克的
        if (this.showCoord) {
            app.context2D.save();
            app.context2D.lineWidth = 1;
            app.context2D.lineCap = '' as any;
            app.strokeCoord(0, 0, this.width * 1.2, this.height
                * 1.2);
            app.context2D.restore();
        }
        app.context2D.restore();
        if (this.showLine === false) {
            return;
        }
        app.context2D.save();
        app.strokeLine(this.x, this.y, app.canvas.width * 0.5,
            app.canvas.height * 0.5);
        app.strokeLine(this.x, this.y, this.targetX, this.targetY);
        app.context2D.restore();
    }

    private _lookAt(): void {
        // 将鼠标点的x和y变换为相对坦克坐标系原点的表示值
        let diffX: number = this.targetX - this.x;
        let diffY: number = this.targetY - this.y;
        // 通过atan2方法，计算出方位角，以弧度表示
        let radian = Math.atan2(diffY, diffX);
        // 设置坦克将要朝向的方向
        this.tankRotation = radian;
    }


    public onMouseMove(evt: CanvasMouseEvent): void {
        // 每次鼠标指针移动时，记录当前鼠标指针在Canvas2D画布中的位置
        this.targetX = evt.canvasPosition.x;
        this.targetY = evt.canvasPosition.y;
        // 并且根据鼠标指针的位置与坦克本身的位置，使用atan2方法计算出方位夹角
        this._lookAt();
    }


    // Tank类中增加如下成员变量，用于表示线性移动时的速率
    public linearSpeed: number = 100.0;
    private _moveTowardTo(intervalSec: number): void {
        // 将鼠标点的x和y变换到相对坦克坐标系原点的表示
        let diffX: number = this.targetX - this.x;
        let diffY: number = this.targetY - this.y;
        // linearSpeed的单位是：像素 / 秒
        let currSpeed: number = this.linearSpeed * intervalSec;
        // 根据时间差计算出当前的运行速度
        // 关键点1：判断坦克是否要停止运动
        // 如果整个要运行的距离大于当前的速度，说明还没到达目的地，可以继续刷新坦克的位置
        if ((diffX * diffX + diffY * diffY) > currSpeed * currSpeed) {
            // 关键点2：使用sin和cos函数计算斜向运行时x、y分量
            this.x = this.x + Math.cos(this.tankRotation) * currSpeed;
            this.y = this.y + Math.sin(this.tankRotation) * currSpeed;
        }
    }
    // 在Tank类中实现update公开方法，TestApplication类的update覆写方法调用本方法
    // 就可以不停地更新坦克的位置
    public update(intervalSec: number): void {
        this._moveTowardTo(intervalSec);
    }

    //Tank增加一个成员变量
    //turretRotateSpeed用于控制炮塔的旋转速度，初始化时旋转速度设置为每秒旋转2°角度表示
    //由于三角函数中要使用弧度为单位，因此需要调用Math2D.toRadian( 2 )方法，将角度转
    // 换为弧度表示
    public turretRotateSpeed: number = Math2D.toRadian(2);
    public onKeyPress(evt: CanvasKeyBoardEvent): void {
        if (evt.key === 'r') {
            this.turretRotation += this.turretRotateSpeed;
        } else if (evt.key === 't') {
            this.turretRotation = 0;
        } else if (evt.key === 'e') {
            this.turretRotation -= this.turretRotateSpeed;
        }
    }

}


class Application5_2 extends Coord {

    // 在TestApplication类中增加如下成员变量
    public _tank: Tank;
    constructor(canvas: HTMLCanvasElement) {
        super(canvas)
        // 在TestApplication类的构造函数中初始化_tank成员变量，并且让坦克位于画布中心
        this._tank = new Tank();
        this._tank.x = canvas.width * 0.5 + 50;
        this._tank.y = canvas.height * 0.5 + 50;
        this._tank.scaleX = 2
        this._tank.scaleY = 2

        // 分别旋转坦克和炮管，将角度转换为弧度表示
        // this._tank.tankRotation = Math2D.toRadian(30);
        // this._tank.turretRotation = Math2D.toRadian(-30);

        this.isSupportMouseMove = true;
    }



    // 在TestApplication类中增加drawTank方法
    public drawTank(): void {
        this._tank.draw(this);
    }
    // 在TestApplication类中覆写（override）render方法，当调用TestApplication
    // 类的start方法后就会进入动画的update和render循环
    public render(): void {
        // 由于canvas.getContext方法返回的CanvasRenderingContext2D可能会是null
        // 因此VS Code会强制要求null值检查，否则报错
        if (this.context2D !== null) {
            let centX: number
            // 每次重绘都先清屏
            this.clearRect();
            // 调用第4章实现的背景网格绘制方法
            this.strokeGrid();
            // 绘制中心原点和x与y轴
            this.drawCanvasCoordCenter();
            this.draw4Quadrant();
            this.drawTank();
            // 坐标信息总是在最后绘制
            // 1. 显示鼠标当前位置（相对坦克坐标系的表示，而不是全局表示！!）
            // 2. 显示当前坦克方位角度，使用Number . toFix ( 2 )方法，将浮点数保留两位小数
            this.drawCoordInfo(
                '坐标 : [' + (this._mouseX - this._tank.x).toFixed
                    (2) + ', ' + (this._mouseY - this._tank.y).toFixed
                    (2) + "] 角度 : " + Math2D.toDegree(this._tank.tankRotation).toFixed(2),
                this._mouseX,
                this._mouseY
            );
        }
    }

    public update(elapsedMsec: number, intervalSec: number): void {
        this._tank.update(intervalSec)
    }

    // new 

    // 象限（Quadrant）文字绘制
    public draw4Quadrant(): void {
        if (this.context2D === null) {
            return;
        }
        this.context2D.save();
        this.fillText("第一象限", this.canvas.width, this.canvas.height, 'rgba( 0 , 0 , 255 , 0.5 )', 'right', 'bottom', "20px sans-serif");
        this.fillText("第二象限", 0, this.canvas.height, 'rgba( 0 ,0 , 255 , 0.5 )', 'left', 'bottom', "20px sans-serif");
        this.fillText("第三象限", 0, 0, 'rgba( 0 , 0 , 255 , 0.5 )', 'left', 'top', "20px sans-serif");
        this.fillText("第四象限", this.canvas.width, 0, 'rgba( 0 ,0 , 255 , 0.5 )', 'right', 'top', "20px sans-serif");
        this.context2D.restore();
    }

    // 覆写（override）基类的dispatchMouseMove方法
    protected dispatchMouseMove(evt: CanvasMouseEvent): void {
        // 必须要设置this . isSupportMouseMove = true才能处理moveMove事件
        this._mouseX = evt.canvasPosition.x;
        this._mouseY = evt.canvasPosition.y;
        this._tank.onMouseMove(evt);
    }

    // TestApplication类中覆盖（override）基类的dispatchKeyPress
    protected dispatchKeyPress(evt: CanvasKeyBoardEvent): void {
        this._tank.onKeyPress(evt);
    }


    // 在TestApplication类中增加三角形绘制代码
    public drawTriangle(x0: number, y0: number, x1: number, y1: number,
        x2: number, y2: number, stroke: boolean = true): void {
        if (this.context2D === null) {
            return;
        }
        this.context2D.save();
        this.context2D.lineWidth = 3;
        this.context2D.strokeStyle = 'rgba( 0 , 0 , 0 , 0.5 )';
        this.context2D.beginPath();
        this.context2D.moveTo(x0, y0);
        this.context2D.lineTo(x1, y1);
        this.context2D.lineTo(x2, y2);
        this.context2D.closePath();

        if (stroke) {
            this.context2D.stroke();
        } else {
            this.context2D.fill();
        }

        this.fillCircle(x2, y2, 5);
        this.context2D.restore();
    }

}

// 调用TestApplication类来绘制图5.25所示的效果
//获取canvas元素
let canvas: HTMLCanvasElement | null = document.getElementById('canvas') as HTMLCanvasElement;
let app = new Application5_2(canvas);
let ptX: number = 600;
let ptY: number = 500;
canvas.width = 600
canvas.height = 600
app.strokeGrid(); // 绘制背景网格
app.drawCanvasCoordCenter(); //绘制中心坐标系和原点
app.draw4Quadrant(); // 绘制四个象限文字
// 在画布中心绘制坦克
app.drawTank(); // 绘制坦克
// 绘制旋转后并且位于画布中心的坦克
app._tank.tankRotation = Math.atan2(ptX - app.canvas.width *
    0.5, ptY - app.canvas.height * 0.5);
app.drawTank();

//计算出点[ ptX , ptY ] 与 坦克原点之间的距离（也就是三角形斜边的长度）
let len: number = app.distance(ptX, ptY, app.canvas.width * 0.5,
    app.canvas.height * 0.5);
// 计算出斜边一半时的坐标，然后在该坐标处绘制坦克
app._tank.x = app._tank.x + Math.cos(app._tank.tankRotation)
    * len * 0.5;
app._tank.y = app._tank.y + Math.sin(app._tank.tankRotation)
    * len * 0.5;
app.drawTank();
// 接下来要继续将坦克绘制到斜边的末尾，上面的代码已经将坦克的坐标更新到了斜边一半的位置
app._tank.x = app._tank.x + Math.cos(app._tank.tankRotation)
    * len * 0.5;
app._tank.y = app._tank.y + Math.sin(app._tank.tankRotation)
    * len * 0.5;
app.drawTank();
// 绘制平面直角三角形
app.drawTriangle(app.canvas.width * 0.5, app.canvas.height *
    0.5, ptX, app.canvas.height * 0.5, ptX, ptY);


_createTab(
    "5.2 坦克Demo",
    [],
    {
        onChange(k) { },
        onStar() {
            app.start();
        },
        onStop() {
            app.stop();
        }
    }
)
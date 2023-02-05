/** 自转 与 公转 */

import GeometryTes from "../../Canvas2D/test/canvas2dGeometry";
import { Math2D, CanvasMouseEvent, ELayout } from '../../Canvas2D/core/index'
import _createTab from '../../Canvas2D/test/_createTab'


class Application5_1_9 extends GeometryTes {
    private _rotationSunSpeed: number = 50;        //太阳自转的角速度，以角度为单位
    private _rotationMoonSpeed: number = 100;      //月球自转的角速度，以角度为单位
    private _revolutionSpeed: number = 60;         //月球公转的角速度

    private _rotationSun: number = 0;              //太阳自转的角位移
    private _rotationMoon: number = 0;             //月亮自转的角位移
    private _revolution: number = 0;               //月亮围绕太阳公转的角位移


    // override update函数
    public update(elapsedMsec: number, intervalSec: number): void {
        // 角位移公式：v = s * t ;
        this._rotationMoon += this._rotationMoonSpeed * intervalSec;
        this._rotationSun += this._rotationSunSpeed * intervalSec;
        this._revolution += this._revolutionSpeed * intervalSec;
    }

    // 公转自转模拟
    public rotationAndRevolutionSimulation(radius: number = 230): void {
        if (this.context2D === null) {
            return;
        }
        this.clearRect()
        // 将自转rotation转换为弧度表示
        let rotationMoon: number = Math2D.toRadian(this._rotationMoon);
        // 将公转revolution转换为弧度表示
        let rotationSun: number = Math2D.toRadian(this._rotationSun);
        let revolution: number = Math2D.toRadian(this._revolution);
        // 记录当前渲染状态
        this.context2D.save();
        // 将局部坐标系平移到画布中心
        this.context2D.translate(this.canvas.width * 0.5, this.
            canvas.height * 0.5);
        this.context2D.save();
        // 绘制矩形在画布中心自转
        this.context2D.rotate(rotationSun);

        /** 1. 默认原点 */
        // 绕局部坐标系原点自转
        this.fillLocalRectWithTitleUV(100, 100, '自转', 0.5, 0.5);

        /** 2. 原点变换 */
        // 因为要绘制的矩形宽度和高度都为100个单位，而原点在矩形左上角
        // 为了将自转的原点位于矩形的中心，同时要让矩形的中心与画布原点重合
        // 因此再次沿着局部坐标系的负x轴（左）和负y轴（上）各自平移50个单位
        // 这样旋转的参考点位于矩形的中心，并且在全局坐标中也和画布原点重合
        // this.context2D.translate(-50, -50);
        // this.fillLocalRectWithTitleUV(100, 100, '自转', 0.0, 0.0);


        this.context2D.restore();
        // 公转 + 自转，注意顺序：
        this.context2D.save();
        this.context2D.rotate(revolution);            // 先公转
        this.context2D.translate(radius, 0);
        //然后沿着当前的x轴平移radius个单位，radius半径形成圆路径
        this.context2D.rotate(rotationMoon);
        // 一旦平移到圆的路径上，开始绕局部坐标系原点进行自转
        this.fillLocalRectWithTitleUV(80, 80, '自转 + 公转', 0.5,
            0.5);
        this.context2D.restore();
        // 恢复上一次记录的渲染状态
        this.context2D.restore();
    }
    public render(): void {
        this.rotationAndRevolutionSimulation()
    }
}


let canvas: HTMLCanvasElement | null = document.getElementById('canvas') as HTMLCanvasElement;
let app = new Application5_1_9(canvas);
canvas.width = 600
canvas.height = 600

_createTab(
    "5.1.9自转 公转",
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
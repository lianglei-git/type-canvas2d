import { Application } from '../core/Application.js'
import { Canvas2D } from '../../../utils/index.js'
import { CanvasKeyBoardEvent, CanvasMouseEvent } from "../core/CanvasMouseEvent.js";
// ApplicationTest继承并扩展了Application基类


export default class ApplicatinTest extends Application {
    // 覆写（override）基类的受保护方法dispatchKeyDown
    protected dispatchKeyDown(evt: CanvasKeyBoardEvent): void {
        // 当发生keydown事件时，将哪个键按下信息输出到console控制台
        console.log(" key : " + evt.key + " is down ");
    }
    // 覆写（override）基类的受保护方法dispatchMouseDown
    protected dispatchMouseDown(evt: CanvasMouseEvent): void {
        //当发生mousedown事件时，将canvasPosition坐标信息输出到console控制台
        console.log(" canvasPosition : " + evt.canvasPosition);
    }
    // 覆写（override）基类公开方法update
    public update(elapsedMsec: number, intervalSec: number): void {
        console.log(" elapsedMsec : " + elapsedMsec + " intervalSec :" + intervalSec);
    }
    // 覆写（override）基类公开方法render
    public render(): void {
        console.log(" 调用render方法 ");
    }
}


let canvas: HTMLCanvasElement | null = document.getElementById('canvas') as HTMLCanvasElement;
if (canvas === null) {
    alert("无法获取HTMLCanvasElement ! ! ! ");
    throw new Error("无法获取HTMLCanvasElement ! ! ! ");
}


let canvas2d: Canvas2D = new Canvas2D(canvas);
console.log('Hello Typescript')
canvas2d.drawText("Hello World");

const app = new ApplicatinTest(canvas);
app.update(0, 0);
app.render();

let star = document.getElementById('star')
star?.addEventListener('click', () => {
    app.start();
})

let stop = document.getElementById('stop')
stop?.addEventListener('click', () => {
    app.stop();
})
import { Application } from '../core/Application.js';
import { Canvas2D } from '../../../utils/index.js';
// ApplicationTest继承并扩展了Application基类
export default class ApplicatinTest extends Application {
    // 覆写（override）基类的受保护方法dispatchKeyDown
    dispatchKeyDown(evt) {
        // 当发生keydown事件时，将哪个键按下信息输出到console控制台
        console.log(" key : " + evt.key + " is down ");
    }
    // 覆写（override）基类的受保护方法dispatchMouseDown
    dispatchMouseDown(evt) {
        //当发生mousedown事件时，将canvasPosition坐标信息输出到console控制台
        console.log(" canvasPosition : " + evt.canvasPosition);
    }
    // 覆写（override）基类公开方法update
    update(elapsedMsec, intervalSec) {
        console.log(" elapsedMsec : " + elapsedMsec + " intervalSec :" + intervalSec);
    }
    // 覆写（override）基类公开方法render
    render() {
        console.log(" 调用render方法 ");
    }
}
let canvas = document.getElementById('canvas');
if (canvas === null) {
    alert("无法获取HTMLCanvasElement ! ! ! ");
    throw new Error("无法获取HTMLCanvasElement ! ! ! ");
}
let canvas2d = new Canvas2D(canvas);
console.log('Hello Typescript');
canvas2d.drawText("Hello World");
const app = new ApplicatinTest(canvas);
app.update(0, 0);
app.render();
let star = document.getElementById('star');
star?.addEventListener('click', () => {
    app.start();
});
let stop = document.getElementById('stop');
stop?.addEventListener('click', () => {
    app.stop();
});

import { Application } from '../core/Application.js';
//获取canvas元素，并创建Application对象
let canvas = document.getElementById('canvas');
let app = new Application(canvas);
// 实现一个TimerCallback签名的回调函数，打印当前Timer的id号，以及传给回调函数的参数data
function timerCallback(id, data) {
    console.log("当前调用的Timer的id : " + id + " data : " + data);
}
// 3秒钟后触发回调函数，仅回调一次
// addTimer后返回的id = 0
let timer0 = app.addTimer(timerCallback, 3, true, " data是timeCallback的数据 ");
// 每5秒钟触发回调函数，回调n次
// addTimer后返回的id = 1
let timer1 = app.addTimer(timerCallback, 5, false, " data是timeCallback的数据 ");
// 获取stop Button元素
let button = document.getElementById('stop');
// 当单击stop button后
button.onclick = (evt) => {
    // remove掉timer1计时器，并不实际删除id=1的计时器
    // 删除掉1号计时器，就不会有重复信息输出了
    app.removeTimer(timer1);
    // 这时打印出来的应该是两个计时器
    console.log(app.timers.length);
    // 重用0号计时器，并且10秒后回调一次，然后删除
    let id = app.addTimer(timerCallback, 10, true, " data是timeCallback的数据 ");
    // 返回的应该是0号计时器，因为重用了现有的计时器
    console.log(id === 0);
    // 10 秒后打印出0号计时器的相关信息，仅打印1次
    // app.stop()
};
// 一开始就启动动画循环
app.start();

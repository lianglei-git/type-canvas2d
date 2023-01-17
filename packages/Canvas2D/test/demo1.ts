let posX: number = 0;
let speedX: number = 10;           //单位为秒，以每秒10个像素的速度进行位移
function update(timestamp: number, elapsedMsec: number, intervalMsec:
    number): void {
    // 参数都是使用毫秒为单位，而现在的速度都是以秒为单位
    // 因此需要将毫秒转换为秒来表示
    let t: number = intervalMsec / 1000.0;
    // 线性速度公式 : posX = posX + speedX ＊ t ;
    posX += speedX * t;
    console.log(" current posX : " + posX);
}

// 使用CanvasRenderingContext2D绘图上下文渲染对象进行物体的绘制
function render(ctx: CanvasRenderingContext2D | null): void {
    // 简单起见，仅仅输出render字符串
    console.log(" render ");
}


// start记录的是第一次调用step函数的时间点，用于计算与第一次调用step函数的时间差，以毫秒为单位
let start: number = 0;
//lastTime记录的是上一次调用step函数的时间点，用于计算两帧之间的时间差，以毫秒为单位
let lastTime: number = 0;
// count用于记录step函数运行的次数
let count: number = 0;
// step函数用于计算
// 1．获取当前时间点与HTML程序启动时的时间差 : timestamp
// 2．获取当前时间点与第一次调用step时的时间差 : elapsedMsec
// 3．获取当前时间点与上一次调用step时的时间差 : intervalMsec
function step(timestamp: number) {
    //第一次调用本函数时，设置start和lastTime为timestamp
    if (!start) start = timestamp;
    if (!lastTime) lastTime = timestamp;
    //计算当前时间点与第一次调用step时间点的差
    let elapsedMsec = timestamp - start;
    //计算当前时间点与上一次调用step时间点的差（可以理解为两帧之间的时间差）
    let intervalMsec = timestamp - lastTime;
    //记录上一次的时间戳
    lastTime = timestamp;
    // 进行基于时间的更新
    update(timestamp, elapsedMsec, intervalMsec);

    // 调用渲染函数，目前并没有使用CanvasRenderingContext2D类，因此设置为null
    render(null);
    // 使用requestAnimationFrame调用step函数
    window.requestAnimationFrame(step);
}
// 使用requestAnimationFrame启动step
// 而step函数中通过调用requestAnimationFrame来回调step函数
// 从而形成不间断地递归调用，驱动动画不停地运行
window.requestAnimationFrame(step);
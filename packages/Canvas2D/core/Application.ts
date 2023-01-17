import { CanvasMouseEvent, CanvasKeyBoardEvent, vec2 } from './index'

// 回调函数类型别名
// 回调函数需要第三方实现和设置，所以导出该回调函数
export type TimerCallback = (id: number, data: any) => void;
// 纯数据类
// 不需要导出Timer类，因为只是作为内部类使用
class Timer {
    public id: number = -1;                  //计时器的id号
    // 标记当前计时器是否有效，很重要的一个变量，具体看后续代码
    public enabled: boolean = false;
    public callback: TimerCallback;          //回调函数，到时间会自动调用
    public callbackData: any = undefined;     //用作回调函数的参数
    public countdown: number = 0;           //倒计时器，每次update时会倒计时
    public timeout: number = 0;  //
    public onlyOnce: boolean = false;
    constructor(callback: TimerCallback) {
        this.callback = callback;
    }


}


interface EventListenerObject {
    handleEvent(evt: Event): void;
}


export class Application implements EventListenerObject {
    public timers: Timer[] = [];
    private _timeId: number = -1;
    // Application中声明私有成员变量
    private _fps: number = 0;
    // 提供一个只读函数，用于获得当前帧率
    public get fps() {
        return this._fps;
    }

    // _start成员变量用于标记当前Application是否进入不间断地循环状态
    protected _start: boolean = false;
    // 由Window对象的requestAnimationFrame返回的大于0的id号
    // 可以使用cancelAnimationFrame ( this ._requestId )来取消动画循环
    protected _requestId: number = -1;
    // 用于基于时间的物理更新，这些成员变量类型前面使用了！，可以进行延迟赋值操作
    protected _lastTime !: number;
    protected _startTime !: number;

    // 对于mousemove事件提供一个开关变量
    // 如果下面变量设置为true，则每次鼠标移动都会触发mousemove事件
    // 否则就不会触发
    public isSupportMouseMove: boolean;
    // 使用下面变量来标记当前鼠标是否为按下状态
    // 目的是提供mousedrag事件
    protected _isMouseDown: boolean;
    public constructor(public canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        // canvas元素能够监听鼠标事件
        this.canvas.addEventListener("mousedown", this, false);
        this.canvas.addEventListener("mouseup", this, false);
        this.canvas.addEventListener("mousemove", this, false);

        // 很重要的一点，键盘事件不能在canvas中触发，但是能在全局的window对象中触发
        // 因此能在window对象中监听键盘事件
        window.addEventListener("keydown", this, false);
        window.addEventListener("keyup", this, false);
        window.addEventListener("keypress", this, false);

        // 初始化时，mouseDown为false
        this._isMouseDown = false;
        // 默认状态下，不支持mousemove事件
        this.isSupportMouseMove = false;
    }

    // 根据id在timers列表中查找
    // 如果找到，则设置timer的enabled为false，并返回true
    // 如没找到，返回false
    public removeTimer(id: number): boolean {
        let found: boolean = false;
        for (let i = 0; i < this.timers.length; i++) {
            if (this.timers[i].id === id) {
                let timer: Timer = this.timers[i];
                timer.enabled = false;
                // 只是enabled设置为false，并没有从数组中删除掉
                found = true;
                break;
            }
        }
        return found;
    }

    // 初始化时，timers是空列表
    // 为了减少内存析构，在removeTimer时，并不从timers中删除timer，而是设置enabled为false
    // 这样让内存使用量和析构达到相对平衡状态
    // 每次添加一个计时器时，先查看timers列表中是否存在可用的timer，有的话，返回该timer的id号
    // 如果没有可用的timer，就重新new一个timer，并设置其id号及其他属性
    public addTimer(callback: TimerCallback, timeout: number = 1.0, onlyOnce: boolean = false, data: any = undefined): number {
        let timer: Timer
        let found: boolean = false;
        for (let i = 0; i < this.timers.length; i++) {
            let timer: Timer = this.timers[i];
            if (timer.enabled === false) {
                timer.callback = callback;
                timer.callbackData = data;
                timer.timeout = timeout;
                timer.countdown = timeout;
                timer.enabled = true;
                timer.onlyOnce = onlyOnce;
                return timer.id;
            }
        }
        // 不存在，就new一个新的Timer，并设置所有相关属性
        timer = new Timer(callback);
        timer.callbackData = data;
        timer.timeout = timeout;
        timer.countdown = timeout;
        timer.enabled = true;
        timer.id = ++this._timeId;     // 由于初始化时id为-1，所以前++
        timer.onlyOnce = onlyOnce;        //设置是一次回调，还是重复回调
        // 添加到timers列表中
        this.timers.push(timer);
        // 返回新添加的timer的id号
        return timer.id;
    }

    // _handleTimers私有方法被Application的update函数调用
    // update函数第二个参数是以秒表示的前后帧时间差
    // 正符合_handleTimers参数要求
    // 计时器依赖于requestAnimationFrame回调
    // 如果当前Application没有调用start的话
    // 则计时器不会生效
    private _handleTimers(intervalSec: number): void {
        // 遍历整个timers列表
        for (let i = 0; i < this.timers.length; i++) {
            let timer: Timer = this.timers[i];
            // 如果当前timer enabled为false，那么继续循环
            // 这句也是重用Timer对象的一个关键实现
            if (timer.enabled === false) {
                continue;
            }
            // countdown初始化时 = timeout
            // 每次调用本函数，会减少上下帧的时间间隔，也就是update第二个参数传来的值
            // 从而形成倒计时的效果
            timer.countdown -= intervalSec;
            // 如果countdown小于 0.0，那么说明时间到了
            // 要触发回调了
            // 从这里看到，实际上timer并不是很精确的
            // 举个例子，假设update每次0.16秒
            // timer设置0.3秒回调一次
            // 那么实际上是 ( 0.3-0.32 ) < 0，触发回调
            if (timer.countdown < 0.0) {
                // 调用回调函数
                timer.callback(timer.id, timer.callbackData);
                // 下面的代码两个分支分别处理触发一次和重复触发的操作
                // 如果该计时器需要重复触发
                if (timer.onlyOnce === false) {
                    // 重新将countdown设置为timeout
                    // 由此可见，timeout不会更改，它规定了触发的时间间隔
                    // 每次更新的是countdown倒计时器
                    timer.countdown = timer.timeout;     //很精妙的一个技巧
                } else {  // 如果该计时器只需要触发一次，那么就删除该计时器
                    this.removeTimer(timer.id);
                }
            }
        }
    }

    // 调用dispatchXXXX虚方法进行事件分发
    // handleEvent是接口EventListenerObject定义的接口方法，必须要实现
    public handleEvent(evt: Event): void {
        // 根据事件的类型，调用对应的dispatchXXX虚方法
        switch (evt.type) {
            case "mousedown":
                this._isMouseDown = true;
                this.dispatchMouseDown(this._toCanvasMouseEvent(evt));
                break;
            case "mouseup":
                this._isMouseDown = false;
                this.dispatchMouseUp(this._toCanvasMouseEvent(evt));
                break;
            case "mousemove":
                //如果isSupportMouseMove为true，则每次鼠标移动会触发mouseMove事件
                if (this.isSupportMouseMove) {
                    this.dispatchMouseMove(this._toCanvasMouseEvent(evt));
                }
                // 同时，如果当前鼠标任意一个键处于按下状态并拖动时，触发drag事件
                if (this._isMouseDown) {
                    this.dispatchMouseDrag(this._toCanvasMouseEvent(evt));
                }
                break;
            case "keypress":
                this.dispatchKeyPress(this._toCanvasKeyBoardEvent(evt));
                break;
            case "keydown":
                this.dispatchKeyDown(this._toCanvasKeyBoardEvent(evt));
                break;
            case "keyup":
                this.dispatchKeyUp(this._toCanvasKeyBoardEvent(evt));
                break;
        }
    }
    protected dispatchMouseUp(arg0: CanvasMouseEvent) {
        throw new Error('Method not implemented.');
    }
    protected dispatchMouseMove(arg0: CanvasMouseEvent) {
        throw new Error('Method not implemented.');
    }
    protected dispatchMouseDrag(arg0: CanvasMouseEvent) {
        throw new Error('Method not implemented.');
    }
    protected dispatchKeyPress(arg0: CanvasKeyBoardEvent) {
        throw new Error('Method not implemented.');
    }
    protected dispatchKeyDown(arg0: CanvasKeyBoardEvent) {
        throw new Error('Method not implemented.');
    }
    protected dispatchKeyUp(arg0: CanvasKeyBoardEvent) {
        throw new Error('Method not implemented.');
    }
    protected dispatchMouseDown(arg0: CanvasMouseEvent) {
        throw new Error('Method not implemented.');
    }

    public start = (): void => {
        if (!this._start) {
            this._start = true;
            this._requestId = -1;     // 将_requestId设置为-1
            // 在start和stop函数中，_lastTime和_startTime都设置为-1
            this._lastTime = -1;
            this._startTime = -1;
            // 启动更新渲染循环
            // this._requestId = requestAnimationFrame((elapsedMsec: number):
            //     void => {
            //     // 启动step方法
            //     this.step(elapsedMsec);
            // });

            this._requestId = requestAnimationFrame(this.step);
        }
    }
    public stop = (): void => {
        if (this._start) {
            // cancelAnimationFrame函数用于：
            //取消一个先前通过调用window.requestAnimationFrame()方法添加到计划中的
            //动画帧请求
            cancelAnimationFrame(this._requestId);
            this._requestId = -1;     // 将_requestId设置为-1
            // 在start和stop函数中，_lastTime和_startTime都设置为-1
            this._lastTime = -1;
            this._startTime = -1;
            this._start = false;
        }
    }
    // 用于查询当前是否处于动画循环状态
    public isRunning(): boolean {
        return this._start;
    }


    // 周而复始地运动
    protected step = (timeStamp: number): void => {
        // 第一次调用本函数时，设置start和lastTime为timestamp
        if (this._startTime === -1) this._startTime = timeStamp;
        if (this._lastTime === -1) this._lastTime = timeStamp;
        //计算当前时间点与第一次调用step时间点的差
        let elapsedMsec = timeStamp - this._startTime;
        // 下面的代码和前几节的代码有更改：
        // 1．增加FPS计算
        // 2．增加调用_updateTimer私方法
        //计算当前时间点与上一次调用step时间点的差（可以理解为两帧之间的时间差）
        // 此时intervalSec实际是毫秒表示
        let intervalSec = (timeStamp - this._lastTime);
        // 第一帧的时候，intervalSec为0，防止0作为分母
        if (intervalSec !== 0) {
            // 计算fps
            this._fps = 1000.0 / intervalSec;
        }
        // update使用的是以秒为单位，因此转换为秒表示
        intervalSec /= 1000.0;
        //记录上一次的时间戳
        this._lastTime = timeStamp;
        this._handleTimers(intervalSec);

        // console . log (" elapsedTime = " + elapsedMsec + " diffTime = " + intervalSec);
        // 先更新
        this.update(elapsedMsec, intervalSec);
        // 后渲染
        this.render();
        // 递归调用，形成周而复始地前进
        this._requestId = requestAnimationFrame((elapsedMsec: number): void => {
            // console.log(elapsedMsec,'elapsedMsec')
            this.step(elapsedMsec);
        });

        // requestAnimationFrame ( this . step . bind ( this ) ) ;
    }

    // 将鼠标事件发生时鼠标指针的位置变换为相对当前canvas元素的偏移表示
    // 这是一个私有方法，意味着只能在本类中使用，子类和其他类都无法调用本方法
    // 只要是鼠标事件（down / up / move / drag .....）都需要调用本方法
    // 将相对于浏览器viewport表示的点变换到相对于canvas表示的点
    private _viewportToCanvasCoordinate(evt: MouseEvent): vec2 {
        if (this.canvas) {
            // 切记，很重要一点：getBoundingClientRect ( )方法返回的ClientRect
            let rect: ClientRect = this.canvas.getBoundingClientRect();
            // 作为测试，每次mousedown时，打印出当前canvas的boundClientRect的位置和尺寸
            if (evt.type === "mousedown") {
                console.log("  boundingClientRect  :  " + JSON.stringify
                    (rect));
                // 测试使用输出相关信息，打印出MouseEvent的clientX / clientY属性
                console.log(" clientX : " + evt.clientX + " clientY : " +
                    evt.clientY);
            }

            // 获取触发鼠标事件的target元素，这里总是HTMLCanvasElement
            if (evt.target) {
                let borderLeftWidth: number = 0;
                //返回border左侧离margin的宽度
                let borderTopWidth: number = 0;
                //返回border上侧离margin的宽度
                let paddingLeft: number = 0;
                //返回padding相对border（border存在的话）左偏移
                let paddingTop: number = 0;
                //返回padding相对border（border存在的话）上偏移
                // 调用getComputedStyle方法，这个方法比较有用
                let decl: CSSStyleDeclaration = window.getComputedStyle(evt.target as HTMLElement);
                // 需要注意，CSSStyleDeclaration中的数值都是字符串表示，而且有可能返回null
                // 所以需要进行null值判断
                // 并且返回的坐标都是以像素表示的，所以是整数类型
                // 使用parseInt转换为十进制整数表示
                let strNumber: string | null = decl.borderLeftWidth;
                if (strNumber !== null) {
                    borderLeftWidth = parseInt(strNumber, 10);
                }
                strNumber = decl.borderTopWidth;
                if (strNumber !== null) {
                    borderTopWidth = parseInt(strNumber, 10);
                }
                strNumber = decl.paddingLeft;
                if (strNumber !== null) {
                    paddingLeft = parseInt(strNumber, 10);
                }
                strNumber = decl.paddingTop;
                if (strNumber !== null) {
                    paddingTop = parseInt(strNumber, 10);
                }

                // a = evt . clientX - rect . left，将鼠标点从viewport坐标系变换到border坐标系
                // b = a - borderLeftWidth，将border坐标系变换到padding坐标系
                // x = b - paddingLeft，将padding坐标系变换到context坐标系，也就是canvas元素坐标系
                let x: number = evt.clientX - rect.left - borderLeftWidth
                    - paddingLeft;
                let y: number = evt.clientY - rect.top - borderTopWidth -
                    paddingTop;
                // 变成向量表示
                let pos: vec2 = vec2.create(x, y);
                // 测试使用输出相关信息
                if (evt.type === "mousedown") {
                    console.log(" borderLeftWidth : " + borderLeftWidth + "borderTopWidth : " + borderTopWidth);
                    console.log(" paddingLeft : " + paddingLeft + " paddingTop :" + paddingTop);
                    console.log(" 变换后的canvasPosition : ", pos);
                }
                return pos;
            }
            // 对于错误，直接报错
            alert(" canvas为null ");
            throw new Error(" canvas为null ");
        }
        // 对于错误，直接报错
        alert(" evt . target为null ");
        throw new Error(" evt . target为null ");
    }


    // 将DOM Event对象信息转换为自己定义的CanvasMouseEvent事件
    private _toCanvasMouseEvent(evt: Event): CanvasMouseEvent {
        // 向下转型，将Event转换为MouseEvent
        let event: MouseEvent = evt as MouseEvent;
        // 将客户区的鼠标pos变换到Canvas坐标系中表示
        let mousePosition: vec2 = this._viewportToCanvasCoordinate(event);
        // 将Event一些要用到的信息传递给CanvasMouseEvent并返回
        let canvasMouseEvent: CanvasMouseEvent = new CanvasMouseEvent
            (mousePosition, event.button, event.altKey, event.ctrlKey,
                event.shiftKey);
        return canvasMouseEvent;
    }
    // 将DOM Event对象信息转换为自己定义的Keyboard事件
    private _toCanvasKeyBoardEvent(evt: Event): CanvasKeyBoardEvent {
        let event: KeyboardEvent = evt as KeyboardEvent;
        // 将Event一些要用到的信息传递给CanvasKeyBoardEvent并返回
        let canvasKeyboardEvent: CanvasKeyBoardEvent = new CanvasKeyBoardEvent
            (event.key, event.keyCode, event.repeat, event.altKey, event.
                ctrlKey, event.shiftKey);
        return canvasKeyboardEvent;
    }


    //虚方法，子类能覆写（override）
    //注意：intervalSec是以秒为单位的，而elapsedMsec是以毫秒为单位
    public update(elapsedMsec: number, intervalSec: number): void { }

    //虚方法，子类能覆写（override）
    public render(): void { }
}


// new Application().start();



export class WebGLApplication extends Application {
    public context3D: WebGLRenderingContext | null;
    public constructor(canvas: HTMLCanvasElement, contextAttributes?:
        WebGLContextAttributes) {
        super(canvas);
        this.context3D = this.canvas.getContext("webgl", contextAttributes);
        if (this.context3D === null) {
            this.context3D = (this.canvas.getContext("experimental-webgl", contextAttributes) as any);
            if (this.context3D === null) {
                alert(" 无法创建WebGLRenderingContext上下文对象 ");
                throw new Error("无法创建WebGLRenderingContext上下文对象");
            }
        }
    }
}



// CanvasKeyboardEvent和CanvasMouseEvent都继承自本类
// 基类定义了共同的属性，keyboard或mouse事件都能使用组合键
// 例如可以按住Ctrl键的同时单击鼠标左键做某些事情
// 当然也可以按住Alt + A键做另外一些事情
export class CanvasInputEvent {
    // 3个boolean变量，用来指示Alt、Ctrl、Shift键是否被按下
    altKey;
    ctrlKey;
    shiftKey;
    // type是一个枚举对象，用来表示当前的事件类型，枚举类型定义在下面的代码中
    type;
    // 构造函数，使用了default参数，初始化时3个组合键都是false状态
    constructor(altKey = false, ctrlKey = false, shiftKey = false, type = EInputEventType.MOUSEEVENT) {
        this.altKey = altKey;
        this.ctrlKey = ctrlKey;
        this.shiftKey = shiftKey;
        this.type = type;
    }
}
export var EInputEventType;
(function (EInputEventType) {
    EInputEventType[EInputEventType["MOUSEEVENT"] = 0] = "MOUSEEVENT";
    EInputEventType[EInputEventType["MOUSEDOWN"] = 1] = "MOUSEDOWN";
    EInputEventType[EInputEventType["MOUSEUP"] = 2] = "MOUSEUP";
    EInputEventType[EInputEventType["MOUSEMOVE"] = 3] = "MOUSEMOVE";
    EInputEventType[EInputEventType["MOUSEDRAG"] = 4] = "MOUSEDRAG";
    EInputEventType[EInputEventType["KEYBOARDEVENT"] = 5] = "KEYBOARDEVENT";
    EInputEventType[EInputEventType["KEYUP"] = 6] = "KEYUP";
    EInputEventType[EInputEventType["KEYDOWN"] = 7] = "KEYDOWN";
    EInputEventType[EInputEventType["KEYPRESS"] = 8] = "KEYPRESS"; //按键事件
})(EInputEventType || (EInputEventType = {}));
;
// export type vec2 = {
//     x: number
//     y: number
// }
// export const vec2 = {
//     create(x:number = 0,y: number = 0) {
//         return {x,y}
//     }
// }

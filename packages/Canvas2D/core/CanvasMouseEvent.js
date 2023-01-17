import { CanvasInputEvent, EInputEventType, vec2 } from './index';
// import 
// import type { vec2} from './CanvasInputEvent'
export class CanvasMouseEvent extends CanvasInputEvent {
    // button表示当前按下鼠标哪个键
    // [ 0 : 鼠标左键 ,1 : 鼠标中键，2 : 鼠标右键 ]
    button;
    // 基于canvas坐标系的表示
    canvasPosition;
    localPosition;
    constructor(canvasPos, button, altKey = false, ctrlKey = false, shiftKey = false) {
        super(altKey, ctrlKey, shiftKey);
        this.canvasPosition = canvasPos;
        this.button = button;
        // 暂时创建一个vec2对象
        this.localPosition = vec2.create();
    }
}
export class CanvasKeyBoardEvent extends CanvasInputEvent {
    // 当前按下的键的ASCII字符
    key;
    // 当前按下的键的ASCII码（数字）
    keyCode;
    // 当前按下的键是否不停地触发事件
    repeat;
    constructor(key, keyCode, repeat, altKey = false, ctrlKey = false, shiftKey = false) {
        super(altKey, ctrlKey, shiftKey, EInputEventType.KEYBOARDEVENT);
        this.key = key;
        this.keyCode = keyCode;
        this.repeat = repeat;
    }
}

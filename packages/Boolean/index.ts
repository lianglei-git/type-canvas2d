/** 多边形的布尔运算（intersection交集, union并集, difference差异, xor 异或） */
/** 主要在canvas中实验 */

import {Application5_2} from "../Canvas2DCoord/test/canvasCoord5_2";
import { Math2D, CanvasMouseEvent, ELayout, CanvasKeyBoardEvent } from '../../Canvas2D/core/index'
import _createTab from '../../Canvas2D/test/_createTab'
const demoPath1 = [
    [20, 20],
    [100, 100],
    [20, 100],
    [100, 20]
]


class Union extends Application5_2 {

}
let canvas: HTMLCanvasElement | null = document.getElementById('canvas') as HTMLCanvasElement;
let app = new Union(canvas);




/**
 * 参考
 * 1. https://zhuanlan.zhihu.com/p/544058724
 */

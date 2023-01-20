import { Application, Rectangle, Size, vec2 } from './index';
export var ETextLayout;
(function (ETextLayout) {
    ETextLayout[ETextLayout["LEFT_TOP"] = 0] = "LEFT_TOP";
    ETextLayout[ETextLayout["RIGHT_TOP"] = 1] = "RIGHT_TOP";
    ETextLayout[ETextLayout["RIGHT_BOTTOM"] = 2] = "RIGHT_BOTTOM";
    ETextLayout[ETextLayout["LEFT_BOTTOM"] = 3] = "LEFT_BOTTOM";
    ETextLayout[ETextLayout["CENTER_MIDDLE"] = 4] = "CENTER_MIDDLE";
    ETextLayout[ETextLayout["CENTER_TOP"] = 5] = "CENTER_TOP";
    ETextLayout[ETextLayout["RIGHT_MIDDLE"] = 6] = "RIGHT_MIDDLE";
    ETextLayout[ETextLayout["CENTER_BOTTOM"] = 7] = "CENTER_BOTTOM";
    ETextLayout[ETextLayout["LEFT_MIDDLE"] = 8] = "LEFT_MIDDLE";
})(ETextLayout || (ETextLayout = {}));
export var EImageFillType;
(function (EImageFillType) {
    EImageFillType[EImageFillType["STRETCH"] = 0] = "STRETCH";
    EImageFillType[EImageFillType["REPEAT"] = 1] = "REPEAT";
    EImageFillType[EImageFillType["REPEAT_X"] = 2] = "REPEAT_X";
    EImageFillType[EImageFillType["REPEAT_Y"] = 3] = "REPEAT_Y"; // y方向重复填充模式
})(EImageFillType || (EImageFillType = {}));
export class Canvas2DApplication extends Application {
    context2D;
    constructor(canvas, contextAttributes) {
        super(canvas);
        this.context2D = this.canvas.getContext("2d", contextAttributes);
    }
    clearRect() {
        this.context2D?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    render() {
        if (this.context2D !== null) {
            this.context2D.clearRect(0, 0, this.context2D.canvas.width, this.context2D.canvas.height);
        }
    }
    // 和以前的绘制方法相比，strokeLine比较特别
    // 没有进行状态的save / restore操作
    // 也没有任何的修改渲染属性
    // 纯粹stroke操作
    // 这是因为这个方法被其他方法多次调用，由调用方进行状态管理和状态设置
    //（参考strokeCoord和strokeGrid方法）
    // 要记住本方法并没有进行状态管理和状态修改
    strokeLine(x0, y0, x1, y1) {
        if (this.context2D !== null) {
            // 一定要调用beginPath方法
            this.context2D.beginPath();
            this.context2D.moveTo(x0, y0);
            this.context2D.lineTo(x1, y1);
            this.context2D.stroke();
        }
    }
    /** 坐标轴 */
    strokeCoord(orginX, orginY, width, height) {
        if (this.context2D !== null) {
            this.context2D.save();
            // 红色为x轴
            this.context2D.strokeStyle = 'red';
            this.strokeLine(orginX, orginY, orginX + width, orginY);
            // 蓝色为y轴
            this.context2D.strokeStyle = 'blue';
            this.strokeLine(orginX, orginY, orginX, orginY + height);
            this.context2D.restore();
        }
    }
    /** 矩形边框 */
    strokeRect(x, y, w, h, style = 'red') {
        if (this.context2D !== null) {
            this.context2D.save();
            this.context2D.strokeStyle = style;
            this.context2D.strokeRect(x, y, w, h);
            this.context2D.restore();
        }
    }
    /** 铺满矩形 */
    fillRect(x, y, w, h, style = 'red') {
        if (this.context2D !== null) {
            this.context2D.save();
            this.context2D.fillStyle = style;
            this.context2D.fillRect(x, y, w, h);
            this.context2D.restore();
        }
    }
    // grid绘制的区域为整个canvas的大小
    // 其中参数interval控制每个网格横向和纵向的间隔大小
    strokeGrid(color = 'grey', interval = 10) {
        if (this.context2D !== null) {
            this.context2D.save();
            this.context2D.strokeStyle = color;
            this.context2D.lineWidth = 0.5;
            // 从左到右每隔interval个像素画一条垂直线
            for (let i = interval + 0.5; i < this.canvas.width; i += interval) {
                this.strokeLine(i, 0, i, this.canvas.height);
            }
            // 从上到下每隔interval个像素画一条水平线
            for (let i = interval + 0.5; i < this.canvas.height; i += interval) {
                this.strokeLine(0, i, this.canvas.width, i);
            }
            this.context2D.restore();
            // 绘制网格背景全局坐标系的原点
            this.fillCircle(5, 5, 5, 'green');
            // 为网格背景绘制全局坐标系
            // Canvas中全局坐标系的原点在左上角，并且x轴总是指向右侧，y轴指向下方
            // 全局坐标系永远不会变换，总是固定的
            this.strokeCoord(5, 5, this.canvas.width, this.canvas.height);
        }
    }
    //在坐标[ x , y ]处绘制半径为radius的圆，可以使用指定的style来填充（颜色、渐变色或图案）
    fillCircle(x, y, radius, fillStyle = 'red') {
        if (this.context2D !== null) {
            //流程
            this.context2D.save();
            this.context2D.fillStyle = fillStyle;
            this.context2D.beginPath();
            // 圆是圆弧的特殊表现形式[startAngle = 0 , endAngle = 2 ＊ Math . PI ]
            this.context2D.arc(x, y, radius, 0, Math.PI * 2);
            //只是使用fill，如要用stroke，请设置strokeStyle属性和调用stroke方法
            this.context2D.fill();
            //流程
            this.context2D.restore();
        }
    }
    // 填充文字
    fillText(text, x, y, color = 'white', align = 'left', baseline = 'top', font = '10px sans-serif') {
        if (this.context2D !== null) {
            this.context2D.save(); //管理渲染属性经典模式
            this.context2D.textAlign = align;
            //文字左右对齐方式，类型为TextAlign
            this.context2D.textBaseline = baseline;
            //文字上下对齐方式，类型为TextBaseline
            this.context2D.font = font; //使用哪种字体，多少大小绘制
            this.context2D.fillStyle = color; //文字填充的颜色
            this.context2D.fillText(text, x, y);
            //调用fillText()函数，指定文字要绘制的坐标
            this.context2D.restore(); //状态恢复
        }
    }
    // 1．本方法并没有使用本类中的任何成员变量或成员方法，因此可以声明为static方法，当然也可以定义为实例方法
    // 2.css font属性字符串中每个属性都是有先后顺序之分的，因此编写此方法，内部会使用正确的属性字符串合成顺序，减少错误
    // 3．按照笔者认为最常用的频度来声明参数的顺序，但是内部生成字符串时会按照正确的属性顺序来合成
    makeFontString(size = '10px', weight = 'normal', style = 'normal', variant = 'normal', family = 'sans-serif') {
        let strs = [];
        // 第一个是fontStyle
        strs.push(style);
        // 第二个是fontVariant
        strs.push(variant);
        // 第三个是fontWeight
        strs.push(weight);
        // 第四个是fontSize
        strs.push(size);
        // 第五个是fontFamily
        strs.push(family);
        // 最后需要将数组中的每个属性字符串以空格键合成
        // 使用Array对象的join方法，其参数是空格字符串：" "
        let ret = strs.join(" ");
        console.log(ret);
        return ret;
    }
    drawImage(img, destRect, srcRect = Rectangle.create(0, 0, img.width, img.height), fillType = EImageFillType.STRETCH) {
        // 绘制image要满足一些条件
        if (this.context2D === null) {
            return false;
        }
        // 默认绘制
        if (!destRect) {
            this.context2D.drawImage(img, 0, 0);
            return true;
        }
        if (srcRect.isEmpty()) {
            return false;
        }
        if (destRect.isEmpty()) {
            return false;
        }
        // 分为stretch和repeat两种方式
        if (fillType === EImageFillType.STRETCH) {
            this.context2D.drawImage(img, srcRect.origin.x, srcRect.origin.y, srcRect.size.width, srcRect.size.height, destRect.origin.x, destRect.origin.y, destRect.size.width, destRect.size.height);
        }
        else { // 使用repeat模式
            // 测试使用，绘制出目标区域的大小
            // this.fillRectangleWithColor(destRect, 'grey');
            // 调用Math . ceil方法，ceil是天花板的意思，向上升级，例如1.3会变成整数
            // 然而Math . floor方法，floor是地板的意思，向下降级，例如1.3会变成整数
            // 2, 2.1会变成整数3
            // 1, 2.1会变成整数2
            // 还有Math . round方法，该方法则是四舍五入，例如1.3变成1，而1.8会变成2
            // 计算x轴方向（左右）需要填充的图像的数量，使用ceil向上升级
            let rows = Math.ceil(destRect.size.width / srcRect.
                size.width);
            // 计算y轴方向（上下）需要填充的图像的数量，使用ceil向上升级
            let colums = Math.ceil(destRect.size.height / srcRect.
                size.height);
            // 下面6个变量在行列双重循环中每次都会更新
            // 表示的是当前要绘制的区域的位置与尺寸
            let left = 0;
            let top = 0;
            let right = 0;
            let bottom = 0;
            let width = 0;
            let height = 0;
            // 计算出目标Rectangle的right和bottom坐标
            let destRight = destRect.origin.x + destRect.size.
                width;
            let destBottom = destRect.origin.y + destRect.size.
                height;
            // REPEAT_X和REPEAT_Y是REPEAT的一种特殊形式
            if (fillType === EImageFillType.REPEAT_X) {
                colums = 1; // 如果是重复填充x轴，则让y轴列数设置为1
            }
            else if (fillType === EImageFillType.REPEAT_Y) {
                rows = 1; // 如果是重复填充y轴，则让x轴行数设置为1
            }
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < colums; j++) {
                    // 如何计算第i行第j列的坐标
                    left = destRect.origin.x + i * srcRect.size.width;
                    top = destRect.origin.y + j * srcRect.size.height;
                    width = srcRect.size.width;
                    height = srcRect.size.height;
                    // 计算出当前要绘制的区域的右下坐标
                    right = left + width;
                    bottom = top + height;
                    // 参见图4.19
                    // 计算x轴方向（左右）剩余灰色部分的尺寸的算法
                    if (right > destRight) {
                        width = srcRect.size.width - (right - destRight);
                    }
                    // 参见图4.19
                    // 计算y轴方向（上下）剩余灰色部分的尺寸的算法
                    if (bottom > destBottom) {
                        height = srcRect.size.height - (bottom - destBottom);
                    }
                    // 调用Canvas2D的drawImage方法
                    this.context2D.drawImage(img, srcRect.origin.x, srcRect.origin.y, width, height, left, top, width, height);
                }
            }
        }
        return true;
    }
    setShadowState(shadowBlur = 5, shadowColor = "rgba( 127 , 127 , 127 , 0.5 )", shadowOffsetX = 10, shadowOffsetY = 10) {
        if (this.context2D !== null) {
            this.context2D.shadowBlur = shadowBlur;
            this.context2D.shadowColor = shadowColor;
            this.context2D.shadowOffsetX = shadowOffsetX;
            this.context2D.shadowOffsetY = shadowOffsetY;
        }
    }
    fillRectWithTitle(x, y, width, height, title = '', layout = ETextLayout.CENTER_MIDDLE, color = 'grey', showCoord = true) {
        if (this.context2D !== null) {
            this.context2D.save();
            // 1. 绘制矩形
            this.context2D.fillStyle = color;
            this.context2D.beginPath();
            this.context2D.rect(x, y, width, height);
            this.context2D.fill();
            // 如果有文字的话，先根据枚举值计算x、y坐标
            if (title.length !== 0) {
                // 2. 绘制文字信息
                // 在矩形的左上角绘制出相关文字信息，使用的是10px大小的文字
                // 调用calcLocalTextRectangle方法
                let rect = this.calcLocalTextRectangle(layout, title, width, height);
                // 修改样式
                // const font: string = this.makeFontString('18px', 'bold', 'italic', 'small-caps', 'sans-serif')
                // 绘制文本
                this.fillText(title, x + rect.origin.x, y + rect.origin.y, 'white', 'left', 'top', '10px sans-serif');
                // 绘制文本框
                this.strokeRect(x + rect.origin.x, y + rect.origin.y, rect.size.width, rect.size.height, 'rgba( 0 , 0 ,0, 0.5) ');
                // 绘制文本框左上角坐标（相对父矩形表示）
                this.fillCircle(x + rect.origin.x, y + rect.origin.y, 2);
            }
            // 3. 绘制变换的局部坐标系
            // 附加一个坐标，x轴和y轴比矩形的width和height多20个像素
            // 并且绘制3个像素的原点
            if (showCoord) {
                this.strokeCoord(x, y, width + 20, height + 20);
                this.fillCircle(x, y, 3);
            }
            this.context2D.restore();
        }
    }
    // parentWidth / parentHeight是父矩形的尺寸
    // 函数返回类型是Rectangle，表示9个文本子矩形之一
    // 这些子矩形是相对父矩形坐标系的表示
    // 这意味着父矩形原点为[0 , 0]，所以参数是父矩形的width和height，而没有x和y坐标
    calcLocalTextRectangle(layout, text, parentWidth, parentHeight) {
        // 首先计算出要绘制的文本的尺寸（width / hegiht）
        let s = this.calcTextSize(text);
        // 创建一个二维向量
        let o = vec2.create();
        // 计算出当前文本子矩形左上角相对父矩形空间中的3个关键点（左上、中心、右下）坐标
        // 1．当前文本子矩形左上角相对父矩形左上角坐标，由于局部表示，所以为[ 0 , 0 ]
        let left = 0;
        let top = 0;
        // 2．当前文本子矩形左上角相对父矩形右下角坐标
        let right = parentWidth - s.width;
        let bottom = parentHeight - s.height;
        // 3．当前文本子矩形左上角相对父矩形中心点坐标
        let center = right * 0.5;
        let middle = bottom * 0.5;
        // 根据ETextLayout的值来匹配这3个点的分量
        // 计算子矩形相对父矩形原点[ 0 , 0 ]偏移量
        switch (layout) {
            case ETextLayout.LEFT_TOP:
                o.x = left;
                o.y = top;
                break;
            case ETextLayout.RIGHT_TOP:
                o.x = right;
                o.y = top;
                break;
            case ETextLayout.RIGHT_BOTTOM:
                o.x = right;
                o.y = bottom;
                break;
            case ETextLayout.LEFT_BOTTOM:
                o.x = left;
                o.y = bottom;
                break;
            case ETextLayout.CENTER_MIDDLE:
                o.x = center;
                o.y = middle;
                break;
            case ETextLayout.CENTER_TOP:
                o.x = center;
                o.y = 0;
                break;
            case ETextLayout.RIGHT_MIDDLE:
                o.x = right;
                o.y = middle;
                break;
            case ETextLayout.CENTER_BOTTOM:
                o.x = center;
                o.y = bottom;
                break;
            case ETextLayout.LEFT_MIDDLE:
                o.x = left;
                o.y = middle;
                break;
        }
        // 返回子矩形
        return new Rectangle(o, s);
    }
    // 笔者测试大小写26个英文字母后（10px sans-serif默认字体）
    // 决定使用大写W的宽度加上scale为0.5作为行高计算的要点（默认参数）
    // 其他字体或字体尺寸请自行做实验
    calcTextSize(text, char = 'W', scale = 0.5) {
        if (this.context2D !== null) {
            let size = new Size();
            size.width = this.context2D.measureText(text).width;
            let w = this.context2D.measureText(char).width;
            size.height = w + w * scale; // 宽度上加scale比例
            return size;
        }
        // 直接报错
        alert(" context2D渲染上下文为null ");
        throw new Error(" context2D渲染上下文为null ");
    }
}

// 绘制图像
import { Canvas2DApplication, Rectangle, EImageFillType } from '../core/index';
import _createtab from './_createtab';
import TestApplication from './canvas2dGeometry';
export default class ImageTest extends Canvas2DApplication {
    // 参数是要载入的image的URL路径
    loadAndDrawImage(url, descRect, fillStyle = EImageFillType.STRETCH) {
        // 调用document对象的createElement方法
        // 并且提供tagName为"img"的字符串生成一个HTMLElement对象
        // 要注意3点：
        // 1. 必须使用img的tagName，千万别拼错
        // 2. ts是强类型的语言，createEelemet返回的是HTMLElement类型，所以必须要用as关键字向下转型成HTMLImageElement类型
        // 3. HTMLImageElement的src设置后会以异步方式载入数据，所以如果要绘制相关图像，必须要放在onload事件中，否则图像不能正确显示
        let img = document.createElement('img');
        // 设置要载入的图片URL路径
        img.src = url;
        // 使用箭头函数后，this指向TestApplication类
        img.onload = (ev) => {
            // onload事件表示图像载入完成
            if (this.context2D !== null) {
                // 在console控制台输出载入图像的尺寸
                console.log(url + " 尺寸为 [ " + img.width + " , " + img.height + " ] ");
                // 将srcImage以保持原样的方式绘制到Canvas画布上[ 10 , 10 ]的位置处
                // this.context2D.drawImage(img, 10, 10);
                const imgRect = Rectangle.create(0, 0, img.width, img.height);
                if (descRect) {
                    this.drawImage(img, descRect, imgRect, fillStyle);
                }
                else {
                    // 普通绘制
                    this.drawImage(img);
                }
            }
        };
    }
    // 获取4 * 4 = 16种基本颜色的离屏画布
    getColorCanvas(amount = 32) {
        let step = 4;
        // 第1步，使用createElement方法，提供tagName为"canvas"关键字创建一个离屏画布对象
        let canvas = document.createElement('canvas');
        // 第2步，设置该画布的尺寸
        canvas.width = amount * step;
        canvas.height = amount * step;
        // 第3步，从离屏画布中获取渲染上下文对象
        let context = canvas.getContext("2d");
        if (context === null) {
            alert("离屏Canvas获取渲染上下文失败！");
            throw new Error("离屏Canvas获取渲染上下文失败！");
        }
        for (let i = 0; i < step; i++) {
            for (let j = 0; j < step; j++) {
                // 将二维索引转换成一维索引，用来在静态的Colors数组中寻址
                let idx = step * i + j;
                // 第4步，使用渲染上下文对象绘图
                context.save();
                // 在4.1.6节中定义了一个静态颜色数组，表示17种标准色名
                // 使用其中16种颜色（由于背景是白色，17种颜色包含白色，所以去除白色）
                context.fillStyle = TestApplication.Colors[idx];
                context.fillRect(i * amount, j * amount, amount, amount);
                context.restore();
            }
        }
        return canvas;
    }
    drawColorCanvas() {
        let colorCanvas = this.getColorCanvas();
        this.fillRect(0, 0, this.canvas.width, this.canvas.height, 'rgba(0,0,0,0.3)');
        this.drawImage(colorCanvas, Rectangle.create(100, 100, colorCanvas.width, colorCanvas.height));
    }
    // 参数rRow / rColum表示要替换（replace）的颜色的行列索引，默认情况下，将第3行，
    // 第1列的蓝色子矩形替换为红色
    // 参数cRow / cColum表示要改变（change）的颜色的行列索引，默认情况下，将第2行，
    // 第1列的黑色子矩形反转为白色
    testChangePartCanvasImageData(rRow = 2, rColum = 0, cRow = 1, cColum = 0, size = 32) {
        // 调用getColorCanvas方法生成16种标准色块离屏画布
        let colorCanvas = this.getColorCanvas(size);
        // 获取离屏画布的上下文渲染对象
        let context = colorCanvas.getContext("2d");
        if (context === null) {
            alert("Canvas获取渲染上下文失败！");
            throw new Error("Canvas获取渲染上下文失败！");
        }
        // 接上面的代码继续往下来替换颜色
        //使用creatImageData方法，大小为size * size个像素
        // 每个像素又有4个分量[ r , g , b , a ]
        let imgData = context.createImageData(size, size);
        // imgData有3个属性，其中data属性存储的是一个Uint8ClampedArray类型数组对象
        // 该数组中存储方式为： [ r , g , b , a , r , g , b , a , ........ ]
        // 所以imgData . data . length = size * size * 4 ;
        let data = imgData.data;
        // 上面也提到过，imgData . data . length表示的是所有分量的个数
        // 而为了方便寻址，希望使用像素个数进行遍历，因此要除以4（一个像素由r、g、b、a
        // 这4个分量组成）
        let rbgaCount = data.length / 4;
        for (let i = 0; i < rbgaCount; i++) {
            // 注意下面索引的计算方式
            data[i * 4 + 0] = 255; //红色的rbga = [ 255 , 0 , 0 , 255 ]
            data[i * 4 + 1] = 0;
            data[i * 4 + 2] = 0;
            data[i * 4 + 3] = 255; // alpha这里设置为255，全不透明
        }
        // 一定要调用putImageData方法来替换context中的像素数据
        // 参数imgData表示要替换的像素数据
        // 参数[ size * rColum  , size * rRow ]表示要绘制到context中的哪个位置
        // 参数[ 0 , 0 , size , size ]表示从imgData哪个位置获取多少像素
        context.putImageData(imgData, size * rColum, size * rRow, 0, 0, size, size);
        // 显示未修改时的离屏画布的效果
        this.drawImage(colorCanvas, Rectangle.create(100, 100, colorCanvas.width, colorCanvas.height));
        // 获取离屏画布中位于[ size * cColum , size * cRow ] 处，尺寸为[ size , size ]大小的像素数据
        imgData = context.getImageData(size * cColum, size * cRow, size, size);
        data = imgData.data;
        let component = 0;
        // 下面使用imgDate的width和height属性，二维方式表示像素
        for (let i = 0; i < imgData.width; i++) {
            for (let j = 0; j < imgData.height; j++) {
                // 由于每个像素有包含4个分量，[ r g b a ] 因此三重循环
                for (let k = 0; k < 4; k++) {
                    // 因为data是一维数组表示，而使用三重循环，因此需要下面算法
                    // 将三维数组表示的索引转换为一维数组表示的索引，该算法很重要
                    let idx = (i * imgData.height + j) * 4 + k;
                    component = data[idx];
                    // 在data数组中，idx % 4 为3时，说明是alpha值
                    // 需求是alpha总是保持不变，因此需要下面判断代码，切记
                    if (idx % 4 == 3) {
                        data[idx] = 255 - component; //反转rgb，但是alpha不变，仍旧是255
                    }
                }
            }
        }
        // 使用putImageData更新像素数据
        context.putImageData(imgData, size * cColum, size * cRow, 0, 0, size, size);
        // 将修改后的结果绘制显示出来
        this.drawImage(colorCanvas, Rectangle.create(300, 100, colorCanvas.width, colorCanvas.
            height));
    }
}
const canvas = document.getElementById('canvas');
const app = new ImageTest(canvas);
canvas.width = 500;
canvas.height = 500;
_createtab('绘制图片 - 实现repeat', ["原图绘制", "拉伸绘制", "repeatX绘制", "repeatY绘制", "repeat绘制", "离屏渲染", "理解ImageData"], {
    onChange(k) {
        app.clearRect();
        const descRect = Rectangle.create(0, 0, app.canvas.width, app.canvas.height);
        switch (k) {
            case '原图绘制':
                app.loadAndDrawImage('./data/zhilu.jpeg');
                break;
            case '拉伸绘制':
                app.loadAndDrawImage('./data/zhilu.jpeg', descRect, EImageFillType.STRETCH);
                break;
            case 'repeatX绘制':
                app.loadAndDrawImage('./data/zhilu.jpeg', descRect, EImageFillType.REPEAT_X);
                break;
            case 'repeatY绘制':
                app.loadAndDrawImage('./data/zhilu.jpeg', descRect, EImageFillType.REPEAT_Y);
                break;
            case 'repeat绘制':
                app.loadAndDrawImage('./data/zhilu.jpeg', descRect, EImageFillType.REPEAT);
                break;
            case "离屏渲染":
                app.drawColorCanvas();
                break;
            case "理解ImageData":
                app.testChangePartCanvasImageData();
        }
    },
    onStar() { },
    onStop() { }
});

### 核心函数的思考

作为一个核心函数应该有什么

canvas
Application:
    1. 事件 （坐标）
        - 键盘
        - 鼠标
        - padding border 兼容
    2. 刷新     
        - 周而复始地运动
        - 开始
        - 停止
        - 更新和渲染外部实现
    3. 定义内部规范、模块到处规范
    4. 抽离、继承组件的实现。什么方法要被覆盖


本章主要介绍了Canvas2D中绘制部分的相关内容，章节的安排是根据可渲染的对象来分类的。首先通过继承前面实现的Canvas2DApplication类，实现了一个本章及后续章节都要使用的基于Canvas2D的演示和测试环境。然后通过一个绘制矩形的Demo介绍了Canvas2D中的绘制方式，并且重点讲述了Canvas2D中渲染状态管理的关键原理，即渲染状态堆栈，使用TypeScript代码模拟了渲染堆栈的实现和应用。接着介绍了线段和形体绘制的相关内容。先是介绍了与线段绘制相关的lineWidth和lineCap等属性，并通过一个例子演示了虚线动画效果（如Photoshop中选中某个几何形体时虚线滚动效果），然后详细讲解了描边（stroke）和填充（fill）的相关知识，重点讲述了使用颜色、渐变色及图案填充的相关内容。在此强调一点，使用图案对象可以填充任何几何体或线段，但是无法像WebGL中那样自行控制纹理（图案）坐标，并且使用图案填充矩形时只能用repeat等模式，无法使用拉伸方式。

然后介绍了文本绘制的相关内容。首先通过一个Demo来演示Canvas2D内置的文本对齐的相关知识点。然后提升了一下难度，在限定条件下，自己实现类似于Canvas2D中文本对齐的算法，做到不仅知其然，而且知其所以然。最后实现了一个名为makeFontString的辅助方法，通过该方法可以确保font对象各个属性设置的正确性。接下来继续讲解图像绘制相关的知识，通过一些演示代码，讲解了drawImage的3个重载方法各自的用途及限制。发现drawImage支持拉伸模式的绘制，但是却不支持repeat、repeatX和repeatY这些模式的绘制，而前面的矩形几何体图案填充正好相反，它支持repeat、repeatX和repeatY，却不支持拉伸模式的绘制，于是决定实现加强版的drawImage方法，让其支持repeat、repeatX和repeatY模式，以及拉伸模式并进行相关测试。接着实现了在离屏画布上绘制16种不同颜色的正方形，然后通过修改其中两种矩形在不同色块区域中的像素rgba值来引申出两个重要的图像数据操作方法，即getImageDat和putImageData的用法。

最后演示了如何绘制阴影，但是对于阴影绘制，建议除非需要，否则不要使用。由上述内容可知，Canvas2D中可绘制的对象可以分为4种类型：
● 矢量图形对象（基于路径对象）；
● 文本对象；
● 像素图像对象；
● 阴影。
其中，阴影属于全局绘制对象，它影响到矢量图形、图像及文本的绘制效果。在上面4个主题中，文本、图像及阴影绘制演示的内容在本章中有比较全面的介绍，但是在矢量图形绘制这一主题中，还有很多绘制方法，例如曲线、弧线、椭圆和多边形等内容本章中并没有涉及。像这些基础重要的图形，在后面章节的精灵和形体系统中会更加深入地介绍。

在上面4个主题中，文本、图像及阴影绘制演示的内容在本章中有比较全面的介绍，但是在矢量图形绘制这一主题中，还有很多绘制方法，例如曲线、弧线、椭圆和多边形等内容本章中并没有涉及。像这些基础重要的图形，在后面章节的精灵和形体系统中会更加深入地介绍。由于渲染状态非常重要，而且必须要清晰地知道各个可选值和默认值，在此提供一段CanvasRenderingContext2D对象中所有渲染状态默认值的输出代码，具体如下：

```ts
    public static printAllStates ( ctx: CanvasRenderingContext2D ): void {
        console.log( "＊＊＊＊＊＊＊＊＊LineState＊＊＊＊＊＊＊＊＊＊" );
        console.log( " lineWidth : " + ctx.lineWidth );
        console.log( " lineCap : " + ctx.lineCap );
        console.log( " lineJoin : " + ctx.lineJoin );
        console.log( " miterLimit : " + ctx.miterLimit );
        console.log( "＊＊＊＊＊＊＊＊＊LineDashState＊＊＊＊＊＊＊＊＊＊" );
        console.log( " lineDashOffset : " + ctx.lineDashOffset );
        console.log( "＊＊＊＊＊＊＊＊＊ShadowState＊＊＊＊＊＊＊＊＊＊" );
        console.log( " shadowBlur : " + ctx.shadowBlur );
        console.log( " shadowColor : " + ctx.shadowColor );
        console.log( " shadowOffsetX : " + ctx.shadowOffsetX );
        console.log( " shadowOffsetY : " + ctx.shadowOffsetY );
        console.log( "＊＊＊＊＊＊＊＊＊TextState＊＊＊＊＊＊＊＊＊＊" );
        console.log( " font : " + ctx.font );
        console.log( " textAlign : " + ctx.textAlign );
        console.log( " textBaseline : " + ctx.textBaseline );
        console.log( "＊＊＊＊＊＊＊＊＊RenderState＊＊＊＊＊＊＊＊＊＊" );
        console.log( " strokeStyle : " + ctx.strokeStyle );
        console.log( " fillStyle : " + ctx.fillStyle );
        console.log( " globalAlpha : " + ctx.globalAlpha );
        console.log( " globalCompositeOperation : " + ctx.globalComposite
        Operation );
    }
```

通过上述代码，可以得到如下几个结论：
● globalAlpha和globalCompositeOperation这两个全局渲染属性本章没有涉及，如有需要，请自行查阅官方文档。
● 上述渲染状态都是受到渲染状态堆栈管理的（渲染状态堆栈管理参考4.1.3节）。
● 图像绘制和渲染状态及渲染堆栈无任何关系。
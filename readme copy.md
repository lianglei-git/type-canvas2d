## typescript 第二次学习
> 学习周期： 2023/1/5~2023/1/18 (11天)
#### 学习分为两个方向
1. [深入理解typescript这本书](https://jkchao.github.io/typescript-book-chinese/project/modules.html#%E5%85%A8%E5%B1%80%E6%A8%A1%E5%9D%97)
2. [typescript图形作战](https://weread.qq.com/web/reader/d6b32000717cc126d6bdb9bkd3d322001ad3d9446802347)
2022-1-5学习
目的：使用typescript进行canvas的UI开发


##### 大纲介绍
- 第一章 - 起步
    > tsc监听编译、ESmodule模式、vscode的热监听或http-server手动刷新
    1. tsc热监听：配置tsconfig.json中`compilerOptions`中`watch`为true，使用方法：在根目录`tsc --watch`已经写入到package.json中了
    2. vscode的热监听： 两种方式：1. http-server依赖包；2. 请去应用商店搜索 `Live Server`，详情查看说明；
    3. ESmodule模式： 有几种选择的模式，第一个就是使用importScripts动态加载，第二就是现在用这种，使用module直接映入，但是要在tsconfig.json 修改target和module为`ESNext`
    4. 项目启动：  
        - yarn install
        - yarn watch 
- [第二章 - Doom3 解释器](packages/Doom3/index.ts)
- [第三章 - Canvas 2D](packages/Canvas2D/index.ts)
- [第四章 - Canvas 2D绘图](packages/Canvas2D/index.ts)
- [第五章 - Canvas 2D坐标转换](packages/Canvas2DCoord/index.ts)
    

##### systemjs 
importScripts
其他参考链接`https://zhuanlan.zhihu.com/p/402155045`



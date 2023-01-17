
/**
 * @brief 
 * 一种是类似于while ( true ) { }之类的死循环，除非满足退出死循环的条件，
 * 否则就一直不停地重复相同的行为。在Windows下的D3D / OpenGL开发中，
 * 经常使用这种模式来驱动动画不断运行。作为知识的延伸点，
 * 下面来看一段经典的Windows下基于C / C++语言的动画循环演示代码。
 * 若不感兴趣可直接跳过。具体代码如下：
 */
MSG msg;
ZeroMemory(&msg, sizeof(msg));
// 只有明确地收到WM_QUIT消息，才跳出while循环，退出应用程序
// 否则一直循环重复相同的行为
// Windows下经典的runLoop操作
while (msg.message ! = WM_QUIT)
{
    // 如果当前线程消息队列中有消息，则取出该消息
    if (PeekMessage(&msg, NULL, 0U, 0U, PM_REMOVE))
    {
        // 将键盘的虚拟键消息转换为WM_CHAR消息，并将WM_CHAR消息再次放入当前线程
        // 消息队列中，下次还是可以被PeekMessage读取并处理
        TranslateMessage(&msg);
        // 将当前的WM_开头的消息分发到Window窗口过程处理回调函数中进行处理
        DispatchMessage(&msg);
        // 上面的代码实际就是处理鼠标、键盘、WM_PAINT，或者计时器等队列消息
    }
    else
    {
        // 如果当前线程消息队列中（上面的代码处理消息队列）没有消息可处理，就一直更新并重绘
        Update(); // 更新
        Render(); // 重绘
    }
}
/** 第三章 */
// 3.1 ~ 3.3 功能实现 =>  application
// import './test/applicatin' 

// 3.4 功能实现 =>  application 的timer
// import "./test/Timer";

/** 第四章 */
// 4.1.3 功能实现 =>  renderstate
// import './test/testRenderState'

// 4.1.1, 4.1.3 ~ 4.2功能实现 =>  test application 2d 基本几何图形
// import {start} from './test/canvas2dGeometry'
// start()

// 4.2 功能实现 =>  基本文本绘制
// import('./test/canvas2dText')

// 4.3 功能实现 =>  基本图像实现
// import('./test/canvas2dPriture')

// 4.4章 功能实现 =>  阴影实现
// import('./test/canvas2dShadow')

const map = {
    '3.1 ~ 3.3 application': './test/applicatinTest',
    '3.4 Timer': './test/Timer',
    '4.1 renderstate': './test/testRenderState',
    '4.1 基本几何图形': './test/canvas2dGeometry',
    '4.2 基本文本绘制': './test/canvas2dText',
    '4.3 基本图像实现': './test/canvas2dPriture',
    '4.4 阴影实现': './test/canvas2dShadow',
}

function run() {
    let container = document.createElement('div');
    for(let k in map) {
        let item = document.createElement('div');
        item.textContent = k;
        item.addEventListener('click', e=> {
            if(document.querySelector('#tmp__script')) {
                document.querySelector('#tmp__script')?.remove();
            }
           setTimeout(() => {
            const _script = document.createElement('script');
            _script.id = 'tmp__script'
            _script.role = 'reload'
            _script.type = 'module'
            _script.src = map[k]
        //    import(map[k]).then(r => console.log(r))
        // fetch( map[k]).then(r => r.text()).then(content => {
        //     _script.innerHTML = content;
        // })

            document.body.append(_script)
           },1000)
        })
        container.append(item);
    }
    document.querySelector('#app')?.append(container)
}

run();

// window.changeTab = (k) => {
//     switch(k) {
//         case k == ''
//     }
// }



/** 第五章在 packages/canvas2DCoord里面 */

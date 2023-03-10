
window.addEventListener('load', () => {
    let map:any = {
        'canvas2d': './packages/Canvas2D/index.html',
        'doom3': './packages/Doom3/index.html',
        'canvas2dCoord': './packages/Canvas2DCoord/index.html',
        'boolean': './modules/polybooljs-master/dist/demo.html',
    }
    
    const iframe:any = document.getElementById('iframe');
    const div = document.createElement('div');
    for(let k in map) {
        const el = document.createElement('sp-button');
        // el.setAttribute('type', 'link')
        el.textContent = k;
        el.addEventListener('click', () => {
            iframe.src = map[k];
        })
        div.appendChild(el);
    }
    
    document.getElementById('series')?.appendChild(div);
    
})

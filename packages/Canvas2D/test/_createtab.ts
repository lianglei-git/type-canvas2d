

/**
 * 
 * @param title 
 * @param checkRadio 
 * @param events 
 
    <div id="app">
        <p id="title"></p>
        <canvas id="canvas"></canvas>
        <div>
            <sp-button id="star" type="primary">star</sp-button>
            <sp-button id="stop" type="danger">stop</sp-button>
        </div>
    </div>

 */
const createTab = (title = '', checkRadio:string[], events: {
    onChange: (k: any) => any,
    onStar: () => any,
    onStop: () => any
}) => {
    const group: any = document.createElement('sp-radio-group');
    group.setAttribute('type', 'button');
    group.setAttribute('optiontype', 'button')
    checkRadio.map(name => {
        const radio = document.createElement('sp-radio');
        radio.innerText = name;
        group.append(radio);
    })
    const titleEl:any = document.querySelector('#title');
    titleEl.innerHTML = '<div>'+title+'</div>' //'基本的几何体'
    titleEl.append(group);
    // document.body.insertBefore(group, document.getElementById('canvas'))
    let starButton: HTMLButtonElement = document.getElementById('star') as HTMLButtonElement;
    let stopButton: HTMLButtonElement = document.getElementById('stop') as HTMLButtonElement;

    group.onChange = (label: string) => {
        events.onChange(label);
    }
    starButton.addEventListener('click', () => {
        events.onStar();
    })

    stopButton.addEventListener('click', () => {
        events.onStop();
        // app.stop();
    })
    
}

export default createTab;
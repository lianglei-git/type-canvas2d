class RenderState {
    lineWidth = 1; //默认情况下，lineWidth为1
    strokeStyle = 'red'; //默认情况下，描边状态为红色
    fillStyle = 'green'; //默认情况下，填充状态为绿色
    // 克隆当前的RenderState并返回
    clone() {
        let state = new RenderState();
        state.lineWidth = this.lineWidth;
        state.strokeStyle = this.strokeStyle;
        state.fillStyle = this.fillStyle;
        return state;
    }
    // 调用JOSN的静态方法stringify，将this对象序列化成JSON字符串
    // 实现toString方法，用来debug打印相关信息
    toString() {
        return JSON.stringify(this, null, ' ');
    }
}
class RenderStateStack {
    // 初始化情况下，堆栈中有一个渲染状态对象，并且所有状态值都是默认值
    _stack = [new RenderState()];
    // 关键的私有get辅助属性，获取堆栈栈顶的渲染状态
    get _currentState() {
        // 栈顶就是数组的最后一个元素
        return this._stack[this._stack.length - 1];
    }
    // save其实就是克隆栈顶的元素，然后将克隆返回的元素进栈操作
    save() {
        this._stack.push(this._currentState.clone());
    }
    // restore就是将栈顶元素丢弃，此时状态会恢复到上一个状态
    restore() {
        this._stack.pop();
    }
    // 下面几个读写属性，都是操作的栈顶元素
    get lineWidth() {
        return this._currentState.lineWidth;
    }
    set lineWidth(value) {
        this._currentState.lineWidth = value;
    }
    get strokeStyle() {
        return this._currentState.strokeStyle;
    }
    set strokeStyle(value) {
        this._currentState.strokeStyle = value;
    }
    get fillStyle() {
        return this._currentState.strokeStyle;
    }
    set fillStyle(value) {
        this._currentState.strokeStyle = value;
    }
    // 辅助方法，用来打印栈顶元素的状态值
    printCurrentStateInfo() {
        console.log(this._currentState.toString());
    }
}
export { RenderStateStack, RenderState };

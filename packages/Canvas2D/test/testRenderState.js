import { RenderStateStack } from "../core/index";
// 测试代码，首先创建一个渲染状态堆栈，此时会有一个栈顶并有个默认的渲染状态
let stack = new RenderStateStack();
// 1．打印出默认的全局状态
stack.printCurrentStateInfo();
// 2．克隆栈顶元素，并且将克隆的状态压栈变成当前状态
stack.save();
// 3．修改当前状态（栈顶元素）的值
stack.lineWidth = 10;
stack.fillStyle = 'black';
// 4．此时打印出当前的状态值
stack.printCurrentStateInfo();
stack.restore(); // 丢弃当前状态
stack.printCurrentStateInfo(); // 5．再次打印，应该是和第1步一致

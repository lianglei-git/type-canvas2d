// COM（Component Object Modal，组件对象模型)
import { Doom3Tokenizer } from './doomTokenizer.js';
// 该工厂需要被调用方使用，因此export导出
export class Doom3Factory {
    // 注意返回的是IDoom3Tokenizer接口，而不是Doom3Tokenizer实现类
    static createDoom3Tokenizer() {
        let ret = new Doom3Tokenizer();
        return ret;
    }
}

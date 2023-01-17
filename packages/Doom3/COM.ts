// COM（Component Object Modal，组件对象模型)

import {Doom3Tokenizer} from './doomTokenizer.js'
import type {IDoom3Tokenizer} from './doomTokenizer'


// 该工厂需要被调用方使用，因此export导出
export class Doom3Factory {
    // 注意返回的是IDoom3Tokenizer接口，而不是Doom3Tokenizer实现类
    public static createDoom3Tokenizer(): IDoom3Tokenizer {
        let ret: IDoom3Tokenizer = new Doom3Tokenizer();
        return ret;
    }
}

// Doom3 词法解释器
// 工厂模式
// 迭代器模式  Enumerator
// 有限状态机



//可以详情的查看一下 迭代器的表现 入 Enumerator
export interface IEnumerator<T> extends Partial<Enumerator<T>> {
    // 将迭代器重置为初始位置
    reset(): void;
    // 如果没越界，moveNext将current设置为下一个元素，并返回true
    // 如果已越界，moveNext返回false
    moveNext(): boolean;
    // 只读属性，用于获取当前的元素，返回泛型T
    readonly current: T;
}

export enum ETokenType {
    NONE = 0,
    STRING,
    NUMBER
}
export interface IDoom3Token {
    reset(): void;
    isString(str: string): boolean;
    readonly type: ETokenType;
    getString(): string;
    getFloat(): number;
    getInt(): number;
}

export interface IDoom3Tokenizer extends IEnumerator<IDoom3Token> {
    createIDoom3Token(): IDoom3Token
    setSource(source: string): void
    // reset(): void
    // getNextToken(token: Doom3Token): boolean
}

class Doom3Token implements IDoom3Token {
    private _type!: ETokenType;
    private _chartArr: string[] = []
    private _val!: number;

    constructor() {
        this.reset();
    }

    get type(): ETokenType {
        return this._type
    }

    isString(str: string) {
        let count: number = this._chartArr.length;
        if (str.length !== count) {
            return false;
        }
        for (let i = 0; i < count; i++) {
            if (this._chartArr[i] !== str[i]) {
                return false;
            }
        }
        return true
    }

    getFloat() {
        // return typeof a === 'number' && String(a).indexOf('.') > -1
        return this._val;
    }

    getInt(): number {
        return parseInt(this._val.toString(), 10);
    }

    getString() {
        return this._chartArr.join('');

    }

    reset = () => {
        this._chartArr.length = 0;
        this._type = ETokenType.NONE
        this._val = 0.0
    }

    addChar(c: string) {
        this._chartArr.push(c);
    }

    setVal(num: number): void {
        this._val = num;
        this._type = ETokenType.NUMBER
    }

    setType(type: ETokenType) {
        this._type = type
    }
}



// IDoom3Tokenizer 词法解析器仅支持ASCII编码字符串的解析，不支持UNICODE编码字符串的解析
export class Doom3Tokenizer implements IDoom3Tokenizer {
    // 增加一个私有变量_current，并使用new进行初始化接口
    private _current: IDoom3Token = new Doom3Token();
    // 实现moveNext方法，实际调用的是getNextToken方法
    public moveNext(): boolean {
        return this._getNextToken(this._current);
    }
    // 通过get方式实现只读属性current
    public get current(): IDoom3Token {
        return this._current;
    }
    createIDoom3Token(): IDoom3Token {
        // throw new Error("Method not implemented.");
        return new Doom3Token();
    }
    private _source: string = ' Doom3Tokenizer '
    private _currIdx: number = 0;

    // 使用了初始化表达式方式初始化字符串数组
    private _digits: string[] = ["0", "1", "2", "3", "4", "5", "6",
        "7", "8", "9"];
    private _whiteSpaces: string[] = [" ", "\t", "\v", "\n"];

    //判断某个字符是不是数字
    private _isDigit(c: string): boolean {
        for (let i: number = 0; i < this._digits.length; i++) {
            if (c === this._digits[i]) {
                return true;
            }
        }
        return false;
    }

    reset(): void {
        this._currIdx = 0;
        // throw new Error("Method not implemented.");
    }
    createDoom3Token = (): Doom3Token => {
        return new Doom3Token();
    }

    setSource = (source: string) => {
        this._source = source;
        this._currIdx = 0;
    }
    //判断某个字符是不是空白符
    //一般将空格符（" "）、水平制表符（"\t"）、垂直制表符（"\v"）及换行符（"\n"）统 称为空白符
    private _isWhitespace(c: string): boolean {
        for (let i: number = 0; i < this._whiteSpaces.length; i++) {
            if (c === this._whiteSpaces[i]) {
                return true;
            }
        }
        return false;
    }

    private _getNextToken(tok: IDoom3Token): boolean {
        //使用as关键字将IDoom3Token向下转型为Doom3Token类型
        let token: Doom3Token = tok as Doom3Token;
        //初始化为空字符串
        let c: string = "";
        //重用Token，每次调用reset()函数时，将Token的索引重置为0
        //避免发生内存重新分配
        token.reset();
        do {
            // 第一步：跳过所有的空白字符，返回第一个可显示的字符
            //开始条件：当前字符是空白符
            c = this._skipWhitespace();
            // 第二步：判断非空白字符的第一个字符是什么
            if (c === '/' && this._peekChar() === '/') {
                // 开始条件：如果是//开头，则跳过单行注释中的所有字符
                c = this._skipComments0();
            } else if (c === '/' && this._peekChar() === '*') {
                //开始条件：如果是/＊开头的字符，则跳过多行注释中的所有字符
                c = this._skipComments1();
            } else if (this._isDigit(c) || c === '-' || (c === '.' && this.
                _isDigit(this._peekChar()))) {
                //开始条件：如果当前字符是数字、符号或者以点号且数字开头
                //则返回到上一个字符索引处，因为第一个字符被读取并处理过了，而_getNumber
                // 会重新处理数字情况，这样需要恢复到数字解析的原始状态
                this._ungetChar();
                this._getNumber(token);
                return true;
            } else if (c === '\" ' || c === '\' ') {
                //开始条件：如果以\"或\’开头的字符，例如’origin’或’Body'
                this._getSubstring(token, c);
                return true;
            } else if (c.length > 0) {
                //开始条件：排除上述所有的条件并且在确保数据源没有解析完成的情况下
                //返回到上一个字符索引处，因为_getString会重新处理相关情况
                this._ungetChar();
                this._getString(token);
                return true;
            }
        } while (c.length > 0);
        return false;
    }

    // 进入该函数，说明肯定不是数字，不是单行注释，不是多行注释，也不是子字符串
    // 进入该函数只有两种类型的字符串，即不带双引号或单引号的字符串及specialChar
    private _getString(token: Doom3Token): void {
        // 获取当前字符，因为前面已经判断为字符串了
        let c: string = this._getChar();
        token.setType(ETokenType.STRING);
        // 进入循环
        do {
            //将当前的char添加到Token中
            token.addChar(c);
            if (!this._isSpecialChar(c)) {
                c = this._getChar(); // 只有不是特殊操作符号的字符，才调用_getChar移动当前索引
            }
            //如果this . _isSpecialChar ( c )为true，不会调用_getChar()函数，并且满足了跳出while循环的条件
            //结束条件：数据源解析全部完成，或下一个是空白符或者当前字符是特殊符号
        } while (c.length > 0 && !this._isWhitespace(c) && !
        this._isSpecialChar(c));
    }
    // 将左边和右边的大、中、小括号及点号逗号都当作单独的Token进行处理
    // 如果想要增加更多的标点符号作为Token，可以在本函数中进行添加
    private _isSpecialChar(c: string): boolean {
        switch (c) {
            case '(':
                return true;
            case ')':
                return true;
            case '[':
                return true;
            case ']':
                return true;
            case '{':
                return true;
            case '}':
                return true;
            case ', ':
                return true;
            case '.':
                return true;
        }
        return false;
    }

    private _getSubstring(token: Doom3Token, endChar: string): void {
        let end: boolean = false;
        let c: string = "";
        token.setType(ETokenType.STRING);
        do {
            // 获取字符
            c = this._getChar();
            //如果当前字符是结束符(要么是\"，要么是\')
            if (c === endChar) {
                end = true;  // 结束符
            }
            else {
                token.addChar(c);
            }

            //结束条件： 数据源解析全部完成或遇到换行符（子串不能多行表示）或是结束符号(要么是
            // \"，要么是\')
        } while (c.length > 0 && c !== '\n' && !end);
    }

    private _getNumber(token: Doom3Token): void {
        let val: number = 0.0;
        let isFloat: boolean = false;                         // 是不是浮点数
        let scaleValue: number = 0.1;                         // 缩放的倍数
        //获取当前的字符（当前可能的值是[数字，小数点，负号]）
        //目前不支持+3.14类似的表示
        //如果 -3.14这种情况，由于负号和数字之间有空格，所以目前会解析成[ '-' , 3.14 ] 这两个Token
        //目前支持例如：[ 3.14 , -3.14 ,  .14  , -.14 , 3.  , -3.  ]的表示
        let c: string = this._getChar();
        //预先判断是不是负数
        let isNegate: boolean = (c === '-');             // 是不是负数
        let consumed: boolean = false;
        //获得0的ASCII编码，使用了字符串的charCodeAt实列方法
        let ascii0 = "0".charCodeAt(0);
        // 3.14-3.14 .13-.13 3. -3.
        // 只能进来3种类型的字符 :  [ -, ., 数字]
        do {
            // 将当前的字符添加到Token中
            token.addChar(c);
            // 如果当前的字符是．的话，设置为浮点数类型
            if (c === '.') {
                isFloat = true;
            } else if (c !== '-') {
                // 十进制从字符到浮点数的转换算法
                // 否则如果不是-符号的话，说明是数字（代码运行到这里已经将点和负号操作符都排斥掉了，仅可能是数字）

                //这里肯定是数字了，获取当前的数字字符的ASCII编码
                let ascii: number = c.charCodeAt(0);
                //将当前数字的ASCII编码减去0的ASCII编码的算法，其实就是进行字符串-数字的类型转换算法
                let vc: number = (ascii - ascii0);
                if (!isFloat)      // 整数部分算法，10倍递增，因为十进制
                    val = 10 * val + vc;
                else {
                    // 小数部分算法
                    val = val + scaleValue * vc;
                    //10倍递减
                    scaleValue *= 0.1;
                }
            } /* else {                // 运行到这段代码时，当前的变量c肯定为负号
                  console.log ( " 运行到此处的只能是 : " + c ) ;
          } */
            //上面循环中的代码没有读取并处理过字符，之所以使用consumed变量，是为了探测下一个字符
            if (consumed === true)
                this._getChar();
            //获得下一个字符后，才设置consumed为true
            c = this._peekChar();
            consumed = true;
            //结束条件：数据源解析全部完成，或下一个字符既不是数字也不是小数点（如果是浮点数表示的话）
        } while (c.length > 0 && (this._isDigit(c) || (!isFloat && c === '.')));
        //如果是负数，要取反
        if (isNegate) {
            val = -val;
        }

        //设置数字值和NUMBER类型
        token.setVal(val);
    }

    // 获取当前字符，然后++
    private _getChar(): string {
        if (this._currIdx >= 0 && this._currIdx < this._source.length) {
            return this._source.charAt(this._currIdx++);
        }
        return '';
    }

    // 很微妙的获取下一个预测字符
    private _peekChar(): string {
        if (this._currIdx >= 0 && this._currIdx < this._source.length) {
            return this._source.charAt(this._currIdx);
        }
        return '';
    }

    //跳过所有的空白字符，将当前索引指向非空白字符
    private _skipWhitespace(): string {
        let c: string = "";
        do {
            c = this._getChar();             //移动当前索引
            //结束条件：解析全部完成或当前字符不是空白符
        } while (c.length > 0 && this._isWhitespace(c));
        // 返回的是正常的非空白字符
        return c;
    }
    //跳过单行注释中的所有字符
    private _skipComments0(): string {
        let c: string = "";
        do {
            c = this._getChar();
            //结束条件：数据源解析全部完成或者遇到换行符
        } while (c.length > 0 && c !== '\n');
        //此时返回的是\n字符
        return c;
    }
    //跳过多行注释中的所有字符
    private _skipComments1(): string {
        //进入本函数时，当前索引是/字符
        let c: string = "";
        // 1. 读取＊号
        c = this._getChar();
        // 2. 读取所有非＊ /这两个符号结尾的所有字符
        do {
            c = this._getChar();

            //结束条件：数据源解析全部完成或者当前字符为＊且下一个字符是/，也就是以＊/结尾
        } while (c.length > 0 && (c !== '*' || this._peekChar() !== '/'));
        // 3. 由于上面读取到＊字符就停止了，因此要将/也读取并处理掉
        c = this._getChar();
        //此时返回的应该是/字符
        return c;
    }

    private _ungetChar(): void {
        //将索引前移1位，前减操作符
        if (this._currIdx > 0) {
            --this._currIdx;
        }
    }


}



class Doom3Factory {
    static createDoom3Tokenizer = (): Doom3Tokenizer => {
        return new Doom3Tokenizer();
    }
}


// 从Doom3Factory工厂创建IDoom3Tokenizer接口
let tokenizer: Doom3Tokenizer = Doom3Factory.createDoom3Tokenizer();
// IDoom3Tokenizer接口创建IDoomToken接口
let token: Doom3Token = tokenizer.createDoom3Token();

//设置IDoom3Tokenizer要解析的数据源
// tokenizer.setSource(str);

// // getNextToken函数返回ture，说明没有到达字符串的结尾，仍有Token需要解析
// // 解析的结果以传引用的方式从参数token中传出来
// // 如果getNextToken返回false，说明已经到达字符串结尾，则停止循环
// while (tokenizer.getNextToken(token)) {
//     //如果当前的Token的type是Number类型
//     if (token.type === ETokenType.NUMBER) {
//         console.log(" NUMBER :  " + token.getFloat());
//         //输出该数字的浮点值
//     } else if (token.isString("joints")) {
//         //如果当前Token是字符串类型，并且其值为joints，则输出
//         console.log(" 开始解析joints数据 ");
//     }
//     else { //否则获取当前Token的字符串值
//         console.log(" STRING :  " + token.getString());
//     }
// }




// 测试解析下列数字
// let input: string = " [ 3.14 , -3.14 ,  .14  , -.14 , 3.  , -3. , +3.14 ] ";
// //使用setSource重新设置数据源
// tokenizer.setSource(input);
// while (tokenizer.getNextToken(token)) {
//     if (token.type === ETokenType.NUMBER) {
//         console.log("NUMBER : " + token.getFloat());
//     }
//     else {
//         console.log("STRING : " + token.getString());
//     }
// }


let input: string = " [ 3.14 , -3.14 ,  .14  , -.14 , 3.  , -3. ] ";

tokenizer.setSource(input);

while (tokenizer.moveNext()) {
    if (tokenizer.current.type === ETokenType.NUMBER) {
        console.log(" NUMBER : " + tokenizer.current.getFloat());
    }
    else {
        console.log(" STRING : " + tokenizer.current.getString());
    }
}



/**
 迭代器的设计应用，工厂模式的设计应用
 内部私有变量的规范、继承、封装、多态的进一步理解

 迭代器，返回ture才能继续执行，这就是迭代器模式

 工厂：工厂里还会有A程序加工、A程序又分为其他程序加工 这就是工厂模式；
 
 到此时，来了解面向接口编程的特点是比较适合的时机。面向对象有3个要素：
 继承（Inheritance）、封装（Encapsulation）和多态（Polymorphism）。
 继承分为接口继承和实现继承（类继承）, Doom3Tokenizer就是接口继承了IDoom3Tokenzier并实现了该接口的所有方法。
 对于TypeScript来说，可以通过关键字来区分实现继承（extends）还是接口继承（implements）。关于封装，笔者的理解有以下3个方面：
 ● 在接口中声明readonly属性，在实现类中使用get访问器来提供只读属性，这是对只读属性的封装。
 ● 将类内部使用的成员变量或成员方法，全部声明为private或者protected访问级别，决定是使用私有还是受保护级别的访问，依赖于你是否允许自己定义的类被继承，这是第二个封装的体现。
 ● 使用export导出接口，然而并没有导出实现类，让接口与实现相分离。这种情况是最高级别的隐藏，只能看到接口的方法签名，却无法了解具体的成员变量及实现细节。

 关于多态，可以用一个最简单的例子来理解。
 例如，在调用IDoom3Tokenzier接口的moveNext方法时，
 实际调用的是实现类Doom3Tokenizer的moveNext方法。
 换句话说，就是同一个操作，作用于不同的实列对象，有不同的解释，产生不同的执行结果。
 其实多态是整个面向对象编程的核心，在后面章节中将会有非常多的例子来演示和了解多态。
 */
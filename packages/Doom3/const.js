export const baseConstDoom3 = [
    {
        "type": "Keyword",
        "value": "if"
    },
    {
        "type": "Punctuator",
        "value": "("
    },
    {
        "type": "Identifier",
        "value": "b"
    },
    {
        "type": "Punctuator",
        "value": "==="
    },
    {
        "type": "Boolean",
        "value": "true"
    },
    {
        "type": "Punctuator",
        "value": ")"
    },
    {
        "type": "Punctuator",
        "value": "{"
    },
    {
        "type": "Identifier",
        "value": "alert"
    },
    {
        "type": "Punctuator",
        "value": "("
    },
    {
        "type": "String",
        "value": "\"true\""
    },
    {
        "type": "Punctuator",
        "value": ")"
    },
    {
        "type": "Punctuator",
        "value": "}"
    }
];
export let str = `
numMeshes  5
/*
 *  joints关键字定义了骨骼动画的bindPose
 */

joints  {
  "origin" -1  ( 0 0 0 )  ( -0.5  -0.5  -0.5 )
  "Body"    0  ( -12.1038131714  0  79.004776001 )  ( -0.5-0.5-0.5 )
  //origin
}
`;
export let str3 = [
    'numMeshes  5',
    '/*',
    '* joints关键字定义了骨骼动画的bindPose',
    '*/',
    'joints  {',
    '"origin" -1  ( 0 0 0 )  ( -0.5  -0.5  -0.5 )',
    '"Body"    0  ( -12.1038131714  0  79.004776001 )  ( -0.5-0.5-0.5 ) //origin',
    " } "
].join("\n");
/**

Esprima是一个ECMAScript解析器，包含词法解析和语法解析，最终会将JS源码解析成抽象语法树（Abstract Syntax Tree, AST），而在这里由于演示的原因，仅仅使用了Esprima的词法解析功能，并没有使用到语法解析功能。
https://esprima.org/demo/parse.html#
https://esprima.org/demo/parse.html?code=if(%20b%20%3D%3D%3D%20true%20)%20%7B%0A%20%20%20%20alert(%20%22true%22%20)%0A%7D
 */

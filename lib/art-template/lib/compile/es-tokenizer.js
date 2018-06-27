'use strict';

const jsTokens = /((['"])(?:(?!\2|\\).|\\(?:\r\n|[\s\S]))*(\2)?|`(?:[^`\\$]|\\[\s\S]|\$(?!\{)|\$\{(?:[^{}]|\{[^}]*\}?)*\}?)*(`)?)|(\/\/.*)|(\/\*(?:[^*]|\*(?!\/))*(\*\/)?)|(\/(?!\*)(?:\[(?:(?![\]\\]).|\\.)*\]|(?![\/\]\\]).|\\.)+\/(?:(?!\s*(?:\b|[\u0080-\uFFFF$\\'"~({]|[+\-!](?!=)|\.?\d))|[gmiyu]{1,5}\b(?![\u0080-\uFFFF$\\]|\s*(?:[+\-*%&|^<>!=?({]|\/(?![\/*])))))|(0[xX][\da-fA-F]+|0[oO][0-7]+|0[bB][01]+|(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?)|((?!\d)(?:(?!\s)[$\w\u0080-\uFFFF]|\\u[\da-fA-F]{4}|\\u\{[\da-fA-F]+\})+)|(--|\+\+|&&|\|\||=>|\.{3}|(?:[+\-\/%&|^]|\*{1,2}|<{1,2}|>{1,3}|!=?|={1,2})=?|[?~.,:;[\](){}])|(\s+)|(^$|[\s\S])/g;
const matchToToken = (match) => {
    const token = {type: "invalid", value: match[0]}
    if (match[ 1]) token.type = "string" , token.closed = !!(match[3] || match[4])
    else if (match[ 5]) token.type = "comment"
    else if (match[ 6]) token.type = "comment", token.closed = !!match[7]
    else if (match[ 8]) token.type = "regex"
    else if (match[ 9]) token.type = "number"
    else if (match[10]) token.type = "name"
    else if (match[11]) token.type = "punctuator"
    else if (match[12]) token.type = "whitespace"
    return token
}
const reservedKeywords = {
    'abstract': true,
    'await': true,
    'boolean': true,
    'break': true,
    'byte': true,
    'case': true,
    'catch': true,
    'char': true,
    'class': true,
    'const': true,
    'continue': true,
    'debugger': true,
    'default': true,
    'delete': true,
    'do': true,
    'double': true,
    'else': true,
    'enum': true,
    'export': true,
    'extends': true,
    'false': true,
    'final': true,
    'finally': true,
    'float': true,
    'for': true,
    'function': true,
    'goto': true,
    'if': true,
    'implements': true,
    'import': true,
    'in': true,
    'instanceof': true,
    'int': true,
    'interface': true,
    'let': true,
    'long': true,
    'native': true,
    'new': true,
    'null': true,
    'package': true,
    'private': true,
    'protected': true,
    'public': true,
    'return': true,
    'short': true,
    'static': true,
    'super': true,
    'switch': true,
    'synchronized': true,
    'this': true,
    'throw': true,
    'transient': true,
    'true': true,
    'try': true,
    'typeof': true,
    'var': true,
    'void': true,
    'volatile': true,
    'while': true,
    'with': true,
    'yield': true
};

function isKeyword (str) {
    return reservedKeywords.hasOwnProperty(str);
};


/**
 * 将逻辑表达式解释为 Tokens
 * @param {string} code
 * @return {Object[]}
 */
var esTokenizer = function esTokenizer(code) {
    var tokens = code.match(jsTokens).map(function (value) {
        jsTokens.lastIndex = 0;
        return matchToToken(jsTokens.exec(value));
    }).map(function (token) {
        if (token.type === 'name' && isKeyword(token.value)) {
            token.type = 'keyword';
        }
        return token;
    });

    return tokens;
};

module.exports = esTokenizer;
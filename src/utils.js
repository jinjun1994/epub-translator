export function textNodesUnder(el, dom) {
  var n,
    a = [],
    walk = el.createTreeWalker(
      el,
      dom.window.NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          // Logic to determine whether to accept, reject or skip node
          // In this case, only accept nodes that have content
          // other than whitespace
          if (node.parentNode.tagName!=='style') {
            return dom.window.NodeFilter.FILTER_ACCEPT
          }
        }
      },
      false
    );
  while ((n = walk.nextNode())) {
    a.push(n);
  }
  return a;
}

/**
 * 所占字节数
 *
 * UTF-8 一种可变长度的Unicode编码格式，使用一至四个字节为每个字符编码（Unicode在范围 D800-DFFF 中不存在任何字符）
 * 000000 - 00007F(128个代码)      0zzzzzzz(00-7F)                             一个字节
 * 000080 - 0007FF(1920个代码)     110yyyyy(C0-DF) 10zzzzzz(80-BF)             两个字节
 * 000800 - 00D7FF
 * 00E000 - 00FFFF(61440个代码)    1110xxxx(E0-EF) 10yyyyyy 10zzzzzz           三个字节
 * 010000 - 10FFFF(1048576个代码)  11110www(F0-F7) 10xxxxxx 10yyyyyy 10zzzzzz  四个字节
 * {@link https://zh.wikipedia.org/wiki/UTF-8}
 *
 * UTF-16 编码65535以内使用两个字节编码，超出65535的使用四个字节（JS内部，字符储存格式是：UCS-2——UTF-16的子级）
 * 000000 - 00FFFF  两个字节
 * 010000 - 10FFFF  四个字节
 * {@link https://zh.wikipedia.org/wiki/UTF-16}
 *
 * GBK(ASCII的中文扩展) 除了0~126编号是1个字节之外，其他都2个字节（超过65535会由2个字显示）
 * {@link https://zh.wikipedia.org/wiki/汉字内码扩展规范}
 *
 * @param  {String} str
 * @param  {String} [charset= 'gbk'] utf-8, utf-16
 * @return {Number}
 */
export function sizeofByte (str, charset = 'gbk') {
  let total = 0
  let charCode

  charset = charset.toLowerCase()

  if (charset === 'utf-8' || charset === 'utf8') {
    for (let i = 0, len = str.length; i < len; i++) {
      charCode = str.codePointAt(i)

      if (charCode <= 0x007f) {
        total += 1
      } else if (charCode <= 0x07ff) {
        total += 2
      } else if (charCode <= 0xffff) {
        total += 3
      } else {
        total += 4
        i++
      }
    }
  } else if (charset === 'utf-16' || charset === 'utf16') {
    for (let i = 0, len = str.length; i < len; i++) {
      charCode = str.codePointAt(i)

      if (charCode <= 0xffff) {
        total += 2
      } else {
        total += 4
        i++
      }
    }
  } else {
    total = str.replace(/[^\x00-\xff]/g, 'aa').length
  }

  return total
}

/* 使用测试 */
console.log(sizeofByte('💩'), sizeofByte('哈'), sizeofByte('©')) // => 4 2 1
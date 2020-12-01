规范不一样，章节内容位置不同
用 epub 读取 拿到章节内容 flow，

```js
{
    href:'OPS/text/ch0_split_0.html'
    id:'id0'
    level:0
    media-type:'application/xhtml+xml'
    order:1
    title:'Engines That Move Markets 2nd Edition'
}
```
href 就是文件位置

遍历flow 改原始章节xml文件


格式验证：

http://validator.idpf.org/application/validate

Mimetype file should only contain the string "application/epub+zip" and should not be compressed.

element "link" not allowed here; expected the element end-tag:
https://github.com/jsdom/jsdom/issues/1839


Fixed!
https://github.com/jsdom/jsdom/issues/798#issuecomment-434066640
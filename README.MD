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



翻译流程：
- 读取目录文件
- toc文件翻译
- 内容页翻译

正文可能是 xhtml/html
正文索引是 content.opf
目录 .ncx toc.xhtml


#### META-INF文件夹：

META-INF用于存放容器信息，默认情况下该目录包含一个文件，即container.xml。container.xml文件的主要功能用于告诉阅读器，电子书的根文件（rootfile）的路径和打开格式，一般来说，该container.xml文件也不需要任何修改，除非改变了根文件的路径和文件名称。除了container.xml文件之外，OCF还规定了以下几个文件：

manifest.xml 文件列表

metadata.xml 元数据

signatures.xml 数字签名

encryption.xml 加密

rights.xml 权限管理

这些文件是可选的。
翻译策略：META-INF目录全部忽略即可

文件夹：OEBPS 有可能是 OPS
这里面全部翻译即可，可能是 html ,xhtml

书籍目录 包含 .ncx toc.xhtml

最终翻译策略： 
翻译除了META-INF文件夹内的 所有html、xhtml文件 + .ncx文件





https://www.jianshu.com/p/d2edab6750df EPUB 文件说明
import { createEpub, readEpub } from "./epub-io.js";
import path from "path";
import fs from "fs";
import jszip from "jszip";
import utf8 from "utf8";

import mkdirp from "mkdirp";

import EPub from "epub";
import xpath from "xpath";
import xmldom from "xmldom";
import _ from "lodash";
import jsdom from "jsdom";

const { JSDOM } = jsdom;
const { DOMParser, XMLSerializer } = xmldom;
const { dirname } = path;
import { converter } from "./tencent.js";
import { fstat } from "fs";
import { textNodesUnder } from "./src/utils.js";

const EPUB_TO_BE_CREATED_URL = normalizeRelativePath(
  "./src/test/test_epub_js.epub"
);

function normalizeRelativePath(relativePath) {
  return path.normalize(`${path.resolve()}/${relativePath}`);
}
EPub.prototype.getChapterRawSync = async function (id) {
  return new Promise((resolve, reject) => {
    if (this.manifest[id]) {
      if (
        !(
          this.manifest[id]["media-type"] == "application/xhtml+xml" ||
          this.manifest[id]["media-type"] == "image/svg+xml"
        )
      ) {
        return reject(new Error("Invalid mime type for chapter"));
      }

      this.zip.readFile(
        this.manifest[id].href,
        function (err, data) {
          if (err) {
            reject(new Error("Reading archive failed"));
            return;
          }

          var str = "";
          if (data) {
            str = data.toString("utf-8");
          }

          resolve(str);
        }.bind(this)
      );
    } else {
      reject(new Error("File not found"));
    }
  });
};
async function readEpubSync(path) {
  const epub = new EPub(path);

  return new Promise((resolve) => {
    epub.on("end", async () => {
      resolve(epub);
    });
    epub.parse();
  });
}
function resolveAfter(number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, number);
  });
}
(async () => {
  try {
    

  const file = "中文版.epub";
  const book = await readEpubSync(file);
  const epub = fs.readFileSync(file);
  const zip = await jszip.loadAsync(epub, { base64: false });
  zip.file("mimetype", "application/epub+zip", {
    base64: false,
    compression: "STORE", // no compression
  });
  // Mimetype file should only contain the string "application/epub+zip" and should not be compressed.

  const { metadata, chapters, flow } = book;
  //-----------------------------------------------------------------------------
  //读取目录文件
  
  try {
  const  ncxFile = zip.filter(function (relativePath, file) {
      return relativePath.includes(".ncx");
    })[0];
    console.log('object');
  const ncx = await zip.file(ncxFile.name).async("string");
  // 生成目录文件dom翻译
  const dom = new JSDOM(ncx, { contentType: "text/xml" });
  const texts = dom.window.document.querySelectorAll("text");
  console.log('object104');
  for (const text of texts) {
    // break
    let translated;
    try {
      await resolveAfter(Math.random() * 100 + 100);
      translated = await converter(text.textContent);
      console.log(translated);
    } catch (error) {
      console.log(error);
    }

    text.textContent = translated;
  }

  const string = dom.serialize();
  // mkdirp.sync(dirname(f.href))
  // fs.writeFileSync(f.href,string )
  zip.file(ncxFile.name, string);
  } catch (error) {
    throw new error('no ncx file')
  }

  try {
  const  ncxFile = zip.filter(function (relativePath, file) {
      return relativePath==="OPS/toc.xhtml";
    })[0];
    console.log('object');
  const ncx = await zip.file(ncxFile.name).async("string");
  // 生成目录文件dom翻译
  const dom = new JSDOM(ncx, { contentType: "text/xml" });
  const texts  = textNodesUnder(dom.window.document,dom.window) 
  for (const text of texts) {
    
    if(!text.textContent.trim()) continue //trim去除所有空白，行终止符字符，为‘’ 不翻译
    let translated;
    try {
      await resolveAfter(Math.random() * 100 + 100);
      translated = await converter(text.textContent);
      console.log(translated);
    } catch (error) {
      console.log(error);
    }

    text.textContent = translated;
  }

  const string = dom.serialize();
  zip.file(ncxFile.name, string);
  } catch (error) {
    console.log(error);
  }
// /*%/

  //-----------------------------------------------------------------------------
  for (const f of flow) {
    break;
    try {
      // const xml = (await book.getChapterRawSync(f.id)).replace('\n','');
      const xml = await book.getChapterRawSync(f.id);
      // console.log(xml);

      const dom = new JSDOM(xml, { contentType: "text/xml" });
      //https://github.com/jsdom/jsdom/issues/798#issuecomment-434066640
1;
      const nodes = textNodesUnder(dom.window.document,dom.window) 
      // 有些书文字全部在span ,有些不是，所以直接拿所有text节点。后续优化code pre等标签内容
            // console.log(nodes);
 
      for (const node of nodes) {
        const textContent = node.textContent
        if(!textContent.trim()) continue //trim去除所有空白，行终止符字符，为‘’ 不翻译
        let translated;

        try {
          await resolveAfter(Math.random() * 100 + 100);
          translated = await converter(node.textContent);
          console.log("", translated);
        } catch (error) {
          console.log(error);
          return;
        }

        node.textContent = translated;
      }

      // const spans = dom.window.document.querySelectorAll("span");

      // for (const span of spans) {
      //   // console.log(span.textContent);
      //   let translated;
      //   try {
      //     await resolveAfter(Math.random() * 100 + 100);
      //     translated = await converter(span.textContent);
      //     console.log("", translated);
      //   } catch (error) {
      //     console.log(error);
      //     return;
      //   }

      //   span.textContent = translated;
      // }

      const string = dom.serialize();
      // mkdirp.sync(dirname(f.href))
      // fs.writeFileSync(f.href,string )
      zip.file(f.href, string);
      // console.log(string);
    } catch (error) {
      console.log(error);
    }
  }

  const data = await zip.generateAsync({
    base64: false,
    compression: "DEFLATE",
    type: "nodebuffer",
  });
  fs.writeFileSync("中文版1.epub", data, "binary");

} catch (error) {
    console.log(error);
}
})();




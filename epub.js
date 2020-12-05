import { createEpub, readEpub } from "./epub-io.js";
import path from "path";
import fs from "fs";
import jszip from "jszip";
import {  performance } from 'perf_hooks';

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

import {Lines} from "./src/line.js";

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
  const t0 = performance.now();
  try {
    const file = "./Tiny Habits The Small Changes That Change Everything by BJ Fogg.epub";
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
      const ncxFile = zip.filter(function (relativePath, file) {
        return relativePath.includes(".ncx");
      })[0];
      console.log("翻译目录");
      const ncx = await zip.file(ncxFile.name).async("string");
      // 生成目录文件dom翻译
      const dom = new JSDOM(ncx, { contentType: "text/xml" });
      // const texts = dom.window.document.querySelectorAll("text");
      const texts = textNodesUnder(dom.window.document, dom.window);
      const lines = new Lines(texts);
      await lines.translate()
  

      const string = dom.serialize();

      zip.file(ncxFile.name, string);
    } catch (error) {
      console.log(error);
    }

    try {
      const ncxFile = zip.filter(function (relativePath, file) {
        return relativePath === "OPS/toc.xhtml";
      })[0];
      console.log("翻译封面");
      const ncx = await zip.file(ncxFile.name).async("string");
      // 生成目录文件dom翻译
      const dom = new JSDOM(ncx, { contentType: "text/xml" });
      const texts = textNodesUnder(dom.window.document, dom.window);
      const lines = new Lines(texts);
      await lines.translate()

      const string = dom.serialize();
      zip.file(ncxFile.name, string);
    } catch (error) {
      console.log(error);
    }
    // /*%/

    //-----------------------------------------------------------------------------
    for (const f of flow) {
      try {
        // const xml = (await book.getChapterRawSync(f.id)).replace('\n','');
        const xml = await book.getChapterRawSync(f.id);
        // console.log(xml);
        console.log("翻译章节",f.id);
        const dom = new JSDOM(xml, { contentType: "text/xml" });
        //https://github.com/jsdom/jsdom/issues/798#issuecomment-434066640
        1;
        const nodes = textNodesUnder(dom.window.document, dom.window);
        // 有些书文字全部在span ,有些不是，所以直接拿所有text节点。后续优化code pre等标签内容
        // console.log(nodes);
        const lines = new Lines(nodes);
        await lines.translate()
        const string = dom.serialize();

        zip.file(f.href, string);
      } catch (error) {
        console.log(error);
      }
    }

    const data = await zip.generateAsync({
      base64: false,
      compression: "DEFLATE",
      type: "nodebuffer",
    });
    fs.writeFileSync(Math.random()*1000+"中文版1.epub", data, "binary");
  } catch (error) {
    console.log(error);
  }
  const t1 = performance.now();
  console.log('总计耗时：',t1-t0);
})();

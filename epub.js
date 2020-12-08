import fs from "fs";
import jszip from "jszip";
import { performance } from "perf_hooks";
import jsdom from "jsdom";
const { JSDOM } = jsdom;
import { textNodesUnder } from "./src/utils.js";
import { Lines } from "./src/line.js";

export const translator = async (file) => {
  const t0 = performance.now();
  let zip
  try {
    const epub = fs.readFileSync(file);
     zip = await jszip.loadAsync(epub, { base64: false });
    zip.file("mimetype", "application/epub+zip", {
      base64: false,
      compression: "STORE", // no compression
    });
  } catch (error) {
    console.log('epub file error');
    console.log(error);
  }
  // Mimetype file should only contain the string "application/epub+zip" and should not be compressed.

  //-----------------------------------------------------------------------------
  //读取目录文件

  try {
    const xmlFiles = zip.filter(function (relativePath, file) {
      return (
        !relativePath.includes("META-INF") &&
        (relativePath.includes(".ncx") ||
          relativePath.includes(".html") ||
          relativePath.includes(".xhtml"))
      );
    });
    for (const xmlFile of xmlFiles) {
      console.log("翻译", xmlFile.name);
      try {
        const xml = await zip.file(xmlFile.name).async("string");
        const dom = new JSDOM(xml, { contentType: "text/xml" });
        const texts = textNodesUnder(dom.window.document, dom.window);
        const lines = new Lines(texts);
        await lines.translate();
        const string = dom.serialize();
        zip.file(xmlFile.name, string);
      } catch (error) {
        console.log(erroe);
      }
    }
    const data = await zip.generateAsync({
      base64: false,
      compression: "DEFLATE",
      type: "nodebuffer",
    });
    fs.writeFileSync(file.replace(".epub", "中文版.epub"), data, "binary");
  } catch (error) {
    console.log(error);
  }

  const t1 = performance.now();
  console.log("总计耗时：", t1 - t0);
};

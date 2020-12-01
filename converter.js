import immer from "immer";
import xpath from "xpath";
import dom from "xmldom";
import _ from "lodash";
import { converter } from "./baidu.js";

const mapValuesAsync = (obj, asyncFn) => {
  const keys = Object.keys(obj);
  const promises = keys.map((k) => {
    return asyncFn(obj[k]).then((newValue) => {
      return { key: k, value: newValue };
    });
  });
  return Promise.all(promises).then((values) => {
    const newObj = {};
    values.forEach((v) => {
      newObj[v.key] = v.value;
    });
    return newObj;
  });
};

export class EnglishToChineseConverter {
  async convert(text) {
    try {
      return await converter(text);
    } catch (error) {
      console.log("convert error");
    }
  }
  async convertMetaData(metadata) {
    return await mapValuesAsync(metadata, async (text) => {
      // await converter(text);
      return text;
    });
  }
  async convertChapters(chapters) {
    return await mapValuesAsync(chapters, async (chapter) => {
      const draft = _.cloneDeep(chapter);
      try {
        const xml = draft.text;
        const doc = new dom.DOMParser().parseFromString(xml);
        const nodes = xpath.select("//span", doc);
        // console.log(nodes);
        let translated;

        // translated = await converter("hellow");
        // console.log(translated,'翻译');
        for (const node of nodes) {
          // console.log(node.textContent);
          let translated;
          try {
            // translated = await converter(node.textContent);
            translated = "TEST";
          } catch (error) {
            console.log(error);
          }

          node.textContent = translated;
          // console.log(node.textContent);
        }
        const string = new dom.XMLSerializer().serializeToString(doc);
        // console.log(string);

        draft.text = string;
        return draft;
      } catch (error) {
        console.log(error);
      }
    });
  }
  async convertBook(book) {
    try {
      const metadata = await this.convertMetaData(book.metadata);
      const chapters = await this.convertChapters(book.chapters);
      return { metadata, chapters };
    } catch (error) {
      console.log("convertBook error");
      console.log(error);
    }
  }
  converter;
}

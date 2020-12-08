// 行
// 职责: 保存翻译状态, 保存翻译后的结果

import { sizeofByte } from "./utils.js";


export class Lines {
  constructor({ texts, translateByBaiDu } = {}) {
    this.translateByBaiDu = translateByBaiDu
    this.nodeList = Array.from(texts).filter((text) => text.textContent.trim());
    this.texts = this.nodeList.map((text) => {
      text, text.textContent;
    });

    // 原文数组 (比如是英文)

    this.results = null; // 翻译后的文字 (比如是中文)
    this.group = [];
    this.setGroup();
  }
  // 功能: 把text 节点分成一个二层数组
  // 输入: 字符数限制, 最大元素数量限制
  // 输出: Array
  // 输出: Array
  /* [ 
  [ [0, text], [1, text], [2, text] ] , 
  [ [3, text], [4, text], [5, text] ], 
  [], 
  ...]
*/
  setGroup(size_limit = 5000) {
    let list = [];
    let listSizeofByte = 0;
    for (const node of this.nodeList) {
      const textContent = node.textContent;
      const size = sizeofByte(textContent);
      if (listSizeofByte + size < size_limit) {
        list.push(node);
        listSizeofByte += size;
      } else {
        listSizeofByte = size;
        this.group.push(list);
        list = [node];
      }
    }
    if (list.length) this.group.push(list);
  }
  async translate() {
    for (const group of this.group) {
      let allText = group.map((node) => node.textContent).join("\n");
      const translated = await this.translateByBaiDu.converter(allText);
      this.results = translated;
      // .trans_result;
      for (const [k, node] of Object.entries(group)) {
        node.textContent = translated.trans_result[k].dst;
      }
    }
  }

  set_result(text) {
    this.result = text;
    this.set_success();
  }
}

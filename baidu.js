import dotenv from "dotenv";
import BaiduTranslate from "node-baidu-translate";
import { performance } from "perf_hooks";

dotenv.config();

const bdt = new BaiduTranslate(
  process.env.BAIDU_TRANSLATE_APPID,
  process.env.BAIDU_TRANSLATE_SECRET
);

// bdt.translate("apple", "zh").then((res) => {});
function sleep(number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, number);
  });
}

export class TranslateByBaiDu {
  constructor(qps = 1) {
    this.qps = qps;
    this.millisecond_gap = 1001 / qps;
    this.t0 = performance.now();
  }
  async converter(text, { from = "en", to = "zh" } = {}) {
    try {
      const t1 = performance.now();
      const { t0, millisecond_gap } = this;
      // 控制 QPS
      // console.log("Call took " + (t1 - t0) + " milliseconds.");
      if (t1 - t0 < millisecond_gap) {
        await sleep(millisecond_gap - (t1 - t0));
      }
      this.t0 = performance.now();
      const result = await bdt.translate(text, to, from);
      this.t0 = performance.now();
      return result;
    } catch (error) {
      // console.log("error converter");
      console.log(error);
      // if (error.error_code === "54003") {
      return await this.converter(text, { to, from });
      // }
    }
  }
}

// (async () => {
//   const text = await converter(
//     `By adding flexibility and ease of access including through cross-platform mobile support these services have enticed users who can't afford to be tied to the desktop.
//     Hello\nhellow`
//   );
//   console.log(text);
// })();

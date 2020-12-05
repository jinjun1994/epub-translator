import dotenv from "dotenv";
import BaiduTranslate from "node-baidu-translate";
import {  performance } from 'perf_hooks';

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
//   await resolveAfter2Seconds()
const qps = 10;
const millisecond_gap = 1050 / qps;
let t0 = performance.now();

export async function converter(text, { from, to = "zh" } = {}) {
  try {
    const t1 = performance.now();

    // 控制 QPS
    // console.log("Call took " + (t1 - t0) + " milliseconds.");
    if (t1 - t0 < millisecond_gap) {
      await sleep(millisecond_gap - (t1 - t0))
      t0 = t1
    }
    const result = await bdt.translate(text, to);
    console.log(result);
    return result.trans_result[0].dst;
  } catch (error) {
    console.log("error converter");
    console.log(error);
    if (error.error_code === "54003") {
      return await converter(text, { to, from });
    }
  }
}

(async () => {
  const text = await converter(
    `By adding flexibility and ease of access including through cross-platform mobile support these services have enticed users who can't afford to be tied to the desktop.
    Hello\nhellow`
  );
  console.log(text);
})();

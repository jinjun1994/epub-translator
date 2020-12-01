import dotenv from "dotenv";
import BaiduTranslate from "node-baidu-translate";

dotenv.config();

const bdt = new BaiduTranslate(process.env.APPID, process.env.SECRET);

bdt.translate("apple", "zh").then((res) => {});
function resolveAfter(number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, number);
  });
}
//   await resolveAfter2Seconds()
export async function converter(text, { from, to = "zh" } = {}) {
  try {
    return (await bdt.translate(text, to)).trans_result[0].dst;
  } catch (error) {
    console.log("error converter");
    console.log(error);
    if (error.error_code === "54003") {
      await resolveAfter(Math.random() * 100 + 100);
      return await converter(text, { to, from });
    }
  }
}

(async () => {
  const text = await converter("Hello world");
  console.log(text);
})();

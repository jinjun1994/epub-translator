import { translator } from "./epub.js";
import dotenv from "dotenv";
dotenv.config();
(async () => {
  await translator({
    file: "./books/7《逆流而上：在问题发生之前就解决掉》Upstream The Quest to Solve Problems Before They Happen by Dan Heath .epub",
    appid: process.env.BAIDU_TRANSLATE_APPID,
    secret: process.env.BAIDU_TRANSLATE_SECRET,
  });
})();

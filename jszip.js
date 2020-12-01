import jszip from "jszip";
import fs from "fs";
(async () => {
  const epub = fs.readFileSync("test.epub");
  const zip = await jszip.loadAsync(epub,{base64: false});
  const files = Object.keys(zip.files);
  console.log(files);
  zip.file("OPS/cover.xhtml", "content");

  const data = await zip.generateAsync({ base64: false, compression:'DEFLATE',type:"nodebuffer"})
  fs.writeFileSync('test_jszip.epub', data, 'binary')

})();

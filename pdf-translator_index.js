const fs = require("fs");
const pdf = require("./pdf-translator");
 
let dataBuffer = fs.readFileSync("4.pdf");
 // default render callback
function render_page(pageData,doc) {
    //check documents https://mozilla.github.io/pdf.js/
    let render_options = {
        //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
        normalizeWhitespace: false,
        //do not attempt to combine same line TextItem's. The default value is `false`.
        disableCombineTextItems: false,
    };
 
    return pageData.getTextContent(render_options).then(function (textContent) {
//
        const mapByTransform = new Map();
        textContent.items.forEach((element) => {
          const { str, transform } = element;
          if (!mapByTransform.has(transform[0])) {
            mapByTransform.set(transform[0], [str]);
          } else {
            mapByTransform.get(transform[0]).push(str);
          }
        });
        console.log(mapByTransform);
        console.log(pageData);
        const o = doc.getOutline()
        console.log(doc);
        
        

//
        let lastY,
            text = "";
        for (let item of textContent.items) {
            console.log(lastY);
            console.log(item.transform[5]);
            if (lastY == item.transform[5] || !lastY) {
                text += item.str;
            } else {
                text += "\n" + item.str;
            }
            lastY = item.transform[5];
        }
        return {
            text,
            textContent
        };

    });
}
 
let options = {
    pagerender: render_page,
    version: "v2.0.550",
};
pdf(dataBuffer,options).then(function (data) {
    // number of pages
    console.log(data.numpages);
    // number of rendered pages
    console.log(data.numrender);
    // PDF info
    console.log(data.info);
    // PDF metadata
    console.log(data.metadata);
    // PDF.js version
    // check https://mozilla.github.io/pdf.js/getting_started/
    console.log(data.version);
    // PDF text

    console.log(data.pageTexts);
    console.log(data.textContents);
    console.log(data.text);
});
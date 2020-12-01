const {parsePdf} = require('easy-pdf-parser')
const fs = require('fs')
parsePdf('./845.pdf').then(data => {
  // console.log(JSON.stringify(data, '', 2));
  fs.writeFileSync('easy-pdf-parser_845.json',JSON.stringify(data, '', 2))
});
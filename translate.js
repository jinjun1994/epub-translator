import dotenv from 'dotenv'
import translate from 'translate';      // New wave
// Old school
dotenv.config()

translate.engine = process.env.ENGINE;
translate.key = process.env.TRANSLATE_KEY;

console.log(process.env.TRANSLATE_KEY);

(async()=>{
    const text = await translate('Hello world', 'zh');
    console.log(text);
})()
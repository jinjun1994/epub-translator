import tencentcloud from "tencentcloud-sdk-nodejs";

const TmtClient = tencentcloud.tmt.v20180321.Client;

const clientConfig = {
  credential: {
    secretId: "AKIDOcbXDeHmZNDr9eD7y64pMn1RvhMqn7k8",
    secretKey: "JOIyOccPxFJQkqhIL9h2B5k9LL6brvmw",
  },
  region: "ap-shanghai-fsi",
  profile: {
    httpProfile: {
      endpoint: "tmt.tencentcloudapi.com",
    },
  },
};
function resolveAfter(number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, number);
    });
  }
const client = new TmtClient(clientConfig);
const params = {
    "SourceText": "hellow",
    "ProjectId": 0,
    "Source": "auto",
    "Target": "zh"
};
// client.TextTranslate(params).then(
//   (data) => {
//     console.log(data);
//   },
//   (err) => {
//     console.error("error", err);
//   }
// );
export async function converter(SourceText, { Source = "auto", Target = "zh",  ProjectId = 0 } = {}) {
    try {
      return (await client.TextTranslate({SourceText,Source,Target,ProjectId})).TargetText;
    } catch (error) {
      // console.log("error converter");
      console.log(error);
      if (error) {
        await resolveAfter(Math.random() * 100 + 100);
        return await converter(SourceText,  Source , Target ,  ProjectId );
      }
    }
  }
  // (async () => {
  //   const text = await converter("Hello world");
  //   console.log(text);
  // })();
import { Converter } from "../../dist/esm/full.js";

const convert = Converter({ from: "cn", to: "tw2" });

for (const text of [
  "汉语是一种美丽的语言。",
  "默认用户界面支持数据库和网络请求。",
  "这只鼠标连接到计算机后，可以打开软件设置。",
]) {
  console.log(`原文：${text}`);
  console.log(`轉換：${convert(text)}`);
  console.log();
}

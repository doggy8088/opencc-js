import { Converter } from "../../dist/esm/full.js";

const text = "鼠标、软件、打印机和服务器都连接到计算机网络。";

console.log(`原文：${text}`);
console.log();

for (const target of ["t", "tw", "tw2", "twp", "hk", "jp"]) {
  const convert = Converter({ from: "cn", to: target });
  console.log(`cn -> ${target.padEnd(3)} ${convert(text)}`);
}

console.log();
console.log("選擇建議：只轉字形用 t；臺灣產品介面多半用 tw2；面向香港使用者可用 hk。");

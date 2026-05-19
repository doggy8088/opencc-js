import { Converter } from "../../dist/esm/full.js";

const text = "鼠标和软件可以连接到计算机网络。";
const shapeOnly = Converter({ from: "cn", to: "t" });
const taiwanWords = Converter({ from: "cn", to: "tw2" });

console.log(`原文：${text}`);
console.log(`只轉字形 cn -> t：${shapeOnly(text)}`);
console.log(`臺灣詞彙 cn -> tw2：${taiwanWords(text)}`);
console.log();
console.log("差異：cn -> t 保留原本詞彙；cn -> tw2 會轉成臺灣慣用詞。");

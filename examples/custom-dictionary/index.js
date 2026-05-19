import { ConverterFactory, CustomConverter, Locale } from "../../dist/esm/full.js";

const customOnly = CustomConverter([
  ["香蕉", "banana"],
  ["蘋果", "apple"],
  ["用户", "使用者"],
  ["用户界面", "使用者介面"],
]);

console.log(customOnly("香蕉、蘋果和用户界面"));

const productTerms = [
  ["預設使用者介面", "預設 UI"],
  ["資料庫", "DB"],
];

const cnToTwWithProductTerms = ConverterFactory(
  Locale.from.cn,
  Locale.to.tw2,
  [productTerms],
);

console.log(cnToTwWithProductTerms("默认用户界面支持数据库和网络请求。"));

# 基本簡繁轉換

這個範例示範在 Node.js 中建立 `cn` 到 `tw2` 的轉換器。

## 重點

- `Converter({ from: "cn", to: "tw2" })` 適合中國大陸簡體轉臺灣繁體。
- 轉換器是一般函式，可重複處理多段文字。

## 執行

```bash
npm run build
node examples/basic-conversion/index.js
```

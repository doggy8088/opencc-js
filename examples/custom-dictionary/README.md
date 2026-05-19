# 自訂詞典

這個範例示範兩種自訂詞典用法。

## 重點

- `CustomConverter()` 適合只套用自己的詞典。
- `ConverterFactory()` 可把內建 locale 詞庫與自訂詞典串接。
- Trie 會採用最長匹配，較長詞條會優先。

## 執行

```bash
npm run build
node examples/custom-dictionary/index.js
```

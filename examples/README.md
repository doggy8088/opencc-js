# opencc-js 範例

這個資料夾收錄可直接執行或開啟的 `@willh/opencc-js` 使用者範例。Node.js 範例引用本 repo 建置後的 `dist/esm/full.js`，瀏覽器範例則使用 CDN，方便使用者複製到自己的專案。

## 範例列表

| 範例 | 用途 |
| --- | --- |
| [basic-conversion](basic-conversion/) | Node.js 基本簡體轉臺灣繁體。 |
| [no-phrase-conversion](no-phrase-conversion/) | 只做字形轉換，不套用地區詞彙。 |
| [locale-differences](locale-differences/) | 比較 `t`、`tw`、`tw2`、`twp`、`hk`、`jp` 的輸出。 |
| [custom-dictionary](custom-dictionary/) | 使用 `CustomConverter` 與 `ConverterFactory` 串接自訂詞典。 |
| [browser-html-conversion](browser-html-conversion/) | 在瀏覽器中轉換 DOM 文字與 `lang` 屬性。 |

## 執行方式

在 `opencc-js/` 目錄下執行：

```bash
npm run build
node examples/basic-conversion/index.js
node examples/no-phrase-conversion/index.js
node examples/locale-differences/index.js
node examples/custom-dictionary/index.js
```

瀏覽器範例請直接開啟 `examples/browser-html-conversion/index.html`。

# 瀏覽器 HTML 轉換

這個範例示範如何在瀏覽器中轉換 DOM 文字、`lang` 屬性與圖片 `alt`。

## 重點

- 使用 CDN 載入 ESM 版本，不需要建置流程。
- `HTMLConverter()` 會遞迴轉換指定根節點。
- `ignore-opencc` class 可讓某個區塊跳過轉換。
- `restore()` 可還原轉換前內容。

## 使用方式

直接用瀏覽器開啟 `index.html`，再點選頁面上的「轉換」與「還原」按鈕。

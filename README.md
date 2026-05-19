# @willh/opencc-js

[![npm version](https://badge.fury.io/js/%40willh%2Fopencc-js.svg)](https://www.npmjs.com/package/@willh/opencc-js)
[![Test](https://github.com/doggy8088/opencc-js/workflows/Test/badge.svg)](https://github.com/doggy8088/opencc-js/actions?query=workflow%3ATest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

開放中文轉換 (Open Chinese Convert) 的 JavaScript 實作版本

## 專案簡介

`@willh/opencc-js` 是一個純 JavaScript 實作的中文簡繁轉換工具，基於 [OpenCC](https://github.com/BYVoid/OpenCC) 專案。本套件提供完整的中文字詞轉換功能，支援多種地區性變體（中國大陸、臺灣、香港、日本新字體等），可在瀏覽器和 Node.js 環境中使用。

## 範例

請參考 [`examples/`](examples/)，內含 Node.js 基本轉換、不套用詞彙轉換、不同簡繁詞庫差異、自訂詞典與瀏覽器 HTML 轉換範例。

### 主要特色

- ✅ **零依賴**：純 JavaScript 實作，不需要額外的系統依賴
- ✅ **多平台支援**：可在瀏覽器、Node.js、Deno、Bun 等環境中運行
- ✅ **模組化設計**：支援 CommonJS、ES Modules、UMD 等多種模組格式
- ✅ **輕量化選項**：提供完整版和精簡版，可按需載入
- ✅ **Tree Shaking**：支援 Tree Shaking，進一步減少打包體積
- ✅ **自訂詞典**：可自訂轉換詞典，靈活擴充轉換規則
- ✅ **DOM 操作**：提供 DOM 操作 API，輕鬆轉換網頁內容
- ✅ **TypeScript 友善**：完整的型別定義支援（計畫中）
- ✅ **獨立 CLI 工具**：提供跨平台命令列工具（通過 GitHub Releases 分發）

## 安裝方式

### 作為 JavaScript Library

#### 使用 npm

```bash
npm install @willh/opencc-js
```

#### 使用 yarn

```bash
yarn add @willh/opencc-js
```

#### 使用 pnpm

```bash
pnpm add @willh/opencc-js
```

#### 使用 bun

```bash
bun add @willh/opencc-js
```

### 作為命令列工具 (CLI)

有兩種安裝方式，請根據需求選擇：

#### 方式 1：透過 npm 安裝（需要 Node.js 環境）

```bash
npm install -g @willh/opencc-js
```

安裝後可直接使用 `opencc` 命令，但需要 Node.js 環境。

#### 方式 2：下載獨立執行檔（推薦，無需 Node.js）

從 [GitHub Releases](https://github.com/doggy8088/opencc-js/releases) 下載對應平台的執行檔：

- **Linux**: `opencc-linux-x64`
- **macOS**: `opencc-macos-x64`
- **Windows**: `opencc-windows-x64.exe`

下載後可直接執行，**完全不需要** Node.js 或任何依賴。

**兩種方式的比較：**

| 特點 | npm 安裝 | 獨立執行檔 |
|------|---------|-----------|
| 安裝方式 | `npm i -g` | 下載檔案 |
| 需要 Node.js | ✅ 是 | ❌ 否 |
| 檔案大小 | ~6 MB | ~116 MB |
| 執行速度 | 普通 | 快速 |
| 適用場景 | 已有 Node.js 環境 | 獨立工具使用 |

#### CLI 使用方式

```bash
# 顯示幫助訊息
opencc

# 轉換並顯示到 console（預設行為）
opencc input.txt cn tw2

# 轉換並儲存到新檔案（短參數）
opencc input.txt cn tw2 -o output.txt

# 轉換並儲存到新檔案（長參數）
opencc input.txt cn tw2 --output output.txt

# 原地覆寫檔案（短參數，類似 sed -i）
opencc input.txt cn tw2 -i

# 原地覆寫檔案（長參數）
opencc input.txt cn tw2 --in-place

# 配合管道使用
opencc input.txt cn tw2 | grep "關鍵字"

# 重定向輸出
opencc input.txt cn tw2 > output.txt
```

**參數說明：**

| 參數 | 長參數 | 功能 |
|------|--------|------|
| (無) | - | 輸出到 console |
| `-o FILE` | `--output FILE` | 儲存到指定檔案 |
| `-i` | `--in-place` | 原地覆寫輸入檔案 |

**使用模式：**

| 模式 | 命令 | 行為 |
|------|------|------|
| 顯示輸出 | `opencc file.txt cn tw2` | 轉換結果輸出到 console，原檔案不變 ✅ |
| 另存新檔 | `opencc file.txt cn tw2 -o out.txt` | 輸出到指定檔案，原檔案不變 |
| 原地覆寫 | `opencc file.txt cn tw2 -i` | 直接覆寫原始檔案（in-place） ⚠️ |

**注意事項：**
- `-i` 和 `-o` 不能同時使用
- `-i` (in-place) 會直接修改原檔案，請謹慎使用

#### CLI 支援的語系

- `cn` - 簡體中文（中國）
- `tw` - 繁體中文（台灣）
- `tw2` - 繁體中文（台灣，含自訂詞組）
- `twp` - 繁體中文（台灣，含更多詞組）
- `hk` - 繁體中文（香港）
- `jp` - 日文新字體
- `t` - 繁體中文

## 載入方式

### 在瀏覽器中使用

#### 方法 1：使用 CDN（UMD 格式）

```html
<!-- 完整版：包含所有轉換功能 -->
<script src="https://cdn.jsdelivr.net/npm/@willh/opencc-js@1.0.5/dist/umd/full.js"></script>

<!-- 精簡版：僅簡體轉繁體 -->
<script src="https://cdn.jsdelivr.net/npm/@willh/opencc-js@1.0.5/dist/umd/cn2t.js"></script>

<!-- 精簡版：僅繁體轉簡體 -->
<script src="https://cdn.jsdelivr.net/npm/@willh/opencc-js@1.0.5/dist/umd/t2cn.js"></script>

<script>
  // 使用全域變數 OpenCC
  const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });
  console.log(converter('汉语')); // 輸出：漢語
</script>
```

#### 方法 2：使用 ES Modules

```html
<script type="module">
  // 完整版
  import * as OpenCC from 'https://cdn.jsdelivr.net/npm/@willh/opencc-js@1.0.5/dist/esm/full.js';

  // 或使用精簡版
  // import * as OpenCC from 'https://cdn.jsdelivr.net/npm/@willh/opencc-js@1.0.5/dist/esm/cn2t.js';
  // import * as OpenCC from 'https://cdn.jsdelivr.net/npm/@willh/opencc-js@1.0.5/dist/esm/t2cn.js';

  const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });
  console.log(converter('汉语')); // 輸出：漢語
</script>
```

#### 方法 3：自行託管

如果您想自行託管檔案，可以從 `node_modules/@willh/opencc-js/dist/` 目錄複製所需的檔案到您的專案中。

### 在 Node.js 中使用

#### CommonJS

```javascript
const OpenCC = require('@willh/opencc-js');

const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });
console.log(converter('汉语')); // 輸出：漢語
```

#### ES Modules

```javascript
import * as OpenCC from '@willh/opencc-js';

const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });
console.log(converter('汉语')); // 輸出：漢語
```

### 在 Deno 中使用

```javascript
import * as OpenCC from 'npm:@willh/opencc-js';

const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });
console.log(converter('汉语')); // 輸出：漢語
```

### 在 Bun 中使用

```javascript
import * as OpenCC from '@willh/opencc-js';

const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });
console.log(converter('汉语')); // 輸出：漢語
```

## 使用方式

### 基本用法

#### 簡體轉繁體

```javascript
import * as OpenCC from '@willh/opencc-js';

const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });
console.log(converter('汉语')); // 輸出：漢語
console.log(converter('计算机')); // 輸出：電腦
```

#### 繁體轉簡體

```javascript
const converter = OpenCC.Converter({ from: 'tw', to: 'cn' });
console.log(converter('漢語')); // 輸出：汉语
console.log(converter('電腦')); // 輸出：计算机
```

#### 香港繁體轉簡體

```javascript
const converter = OpenCC.Converter({ from: 'hk', to: 'cn' });
console.log(converter('漢語')); // 輸出：汉语
```

### 支援的地區碼

`@willh/opencc-js` 支援以下地區碼（locale codes）：

| 地區碼 | 說明                                                       | 範例                            |
| ------ | ---------------------------------------------------------- | ------------------------------- |
| `cn`   | 簡體中文（中國大陸）                                       | 汉语、计算机                    |
| `tw`   | 繁體中文（臺灣）                                           | 漢語、電腦                      |
| `tw2`  | 繁體中文（臺灣）+ 常見詞彙（TWVariants + TWPhrasesCustom） | 漢語、影片（视频 → 影片）       |
| `twp`  | 繁體中文（臺灣）+ 慣用詞轉換                               | 漢語、腳踏車（自行車 → 腳踏車） |
| `hk`   | 繁體中文（香港）                                           | 漢語、電腦                      |
| `jp`   | 日本新字體                                                 | 漢語、国語                      |
| `t`    | 繁體中文（OpenCC 標準）                                    | 漢語、電腦                      |

**注意事項**：
- `from` 和 `to` 參數可以使用上述任何地區碼
- `t` 是 OpenCC 的內部標準格式，除非您清楚了解其用途，否則不建議使用
- `tw2` 僅包含 TWVariants 與內建的常見詞彙字典 `TWPhrasesCustom`，適合技術文件、開發相關用語
- `twp` 包含臺灣慣用詞彙的轉換，例如「自行車」會轉換為「腳踏車」

### 常用轉換範例

```javascript
import * as OpenCC from '@willh/opencc-js';

// 簡體（大陸）→ 繁體（臺灣）
const cn2tw = OpenCC.Converter({ from: 'cn', to: 'tw' });
console.log(cn2tw('软件开发')); // 輸出：軟體開發

// 簡體（大陸）→ 繁體（臺灣，含慣用詞）
const cn2twp = OpenCC.Converter({ from: 'cn', to: 'twp' });
console.log(cn2twp('信息技术')); // 輸出：資訊技術

// 簡體（大陸）→ 繁體（臺灣，自訂常見詞彙）
const cn2tw2 = OpenCC.Converter({ from: 'cn', to: 'tw2' });
console.log(cn2tw2('视频接口')); // 輸出：影片介面

// 繁體（臺灣）→ 簡體（大陸）
const tw2cn = OpenCC.Converter({ from: 'tw', to: 'cn' });
console.log(tw2cn('資訊科技')); // 輸出：信息科技

// 繁體（香港）→ 繁體（臺灣）
const hk2tw = OpenCC.Converter({ from: 'hk', to: 'tw' });
console.log(hk2tw('香港繁體')); // 輸出：香港繁體

// 繁體（臺灣）→ 繁體（香港）
const tw2hk = OpenCC.Converter({ from: 'tw', to: 'hk' });
console.log(tw2hk('臺灣繁體')); // 輸出：臺灣繁體
```

### 自訂轉換器

如果您需要建立自己的轉換規則，可以使用 `CustomConverter`。

#### 使用陣列定義轉換規則

```javascript
import * as OpenCC from '@willh/opencc-js';

const converter = OpenCC.CustomConverter([
  ['香蕉', 'banana'],
  ['蘋果', 'apple'],
  ['梨', 'pear'],
  ['橘子', 'orange'],
]);

console.log(converter('我喜歡吃香蕉和蘋果'));
// 輸出：我喜歡吃banana和apple
```

#### 使用字串定義轉換規則

您也可以使用空白和豎線（`|`）作為分隔符號來定義轉換規則：

```javascript
const converter = OpenCC.CustomConverter('香蕉 banana|蘋果 apple|梨 pear|橘子 orange');

console.log(converter('香蕉 蘋果 梨 橘子'));
// 輸出：banana apple pear orange
```

**格式說明**：
- 每組轉換規則使用豎線（`|`）分隔
- 每組規則內，原始詞與目標詞使用空白分隔
- 格式：`原始詞1 目標詞1|原始詞2 目標詞2|...`

**添加字詞**

* `ConverterFactory` 是比較底層的函數，`Converter` 及 `CustomConverter` 都是這個函數的再包裝。
* 透過 `Locale` 屬性可以得到原本的字典，進而添加字詞。

```javascript
const customDict = [
  ['“', '「'],
  ['”', '」'],
  ['‘', '『'],
  ['’', '』'],
];
const converter = OpenCC.ConverterFactory(
  OpenCC.Locale.from.cn,                   // 中國大陸 => OpenCC 標準
  OpenCC.Locale.to.tw.concat([customDict]) // OpenCC 標準 => 臺灣+自訂
);
console.log(converter('悟空道：“师父又来了。怎么叫做‘水中捞月’？”'));
// output: 悟空道：「師父又來了。怎麼叫做『水中撈月』？」
```

下面的寫法也會得到相同的結果，只是內部會多做一次轉換

```javascript
const customDict = [
  ['“', '「'],
  ['”', '」'],
  ['‘', '『'],
  ['’', '』'],
];
const converter = OpenCC.ConverterFactory(
  OpenCC.Locale.from.cn, // 中國大陸 => OpenCC 標準
  OpenCC.Locale.to.tw,   // OpenCC 標準 => 臺灣
  [customDict]           // 臺灣 => 自訂
);
console.log(converter('悟空道：“师父又来了。怎么叫做‘水中捞月’？”'));
// output: 悟空道：「師父又來了。怎麼叫做『水中撈月』？」
```

### DOM 操作與網頁轉換

`@willh/opencc-js` 提供 `HTMLConverter` 函數，可以輕鬆轉換網頁中的文字內容。

#### 基本使用

```html
<!DOCTYPE html>
<html lang="zh-HK">
<head>
  <meta charset="UTF-8">
  <title>中文轉換範例</title>
</head>
<body>
  <h1 lang="zh-HK">漢語</h1>
  <p lang="zh-HK">這是一段繁體中文（香港）的文字。</p>

  <button onclick="convertPage()">轉換為簡體</button>
  <button onclick="restorePage()">還原為繁體</button>

  <script src="https://cdn.jsdelivr.net/npm/@willh/opencc-js@1.0.5/dist/umd/full.js"></script>
  <script>
    // 建立轉換器：繁體（香港）→ 簡體（大陸）
    const converter = OpenCC.Converter({ from: 'hk', to: 'cn' });

    // 設定轉換起點為根節點（整個頁面）
    const rootNode = document.documentElement;

    // 建立 HTML 轉換處理器
    const htmlConverter = OpenCC.HTMLConverter(
      converter,
      rootNode,
      'zh-HK',  // 原始語言屬性
      'zh-CN'   // 轉換後的語言屬性
    );

    function convertPage() {
      htmlConverter.convert(); // 開始轉換
      // 結果：<h1 lang="zh-CN">汉语</h1>
    }

    function restorePage() {
      htmlConverter.restore(); // 還原為原始內容
      // 結果：<h1 lang="zh-HK">漢語</h1>
    }
  </script>
</body>
</html>
```

#### API 說明

```javascript
OpenCC.HTMLConverter(converter, rootNode, langAttrInitial, langAttrNew)
```

**參數**：
- `converter`：由 `OpenCC.Converter()` 建立的轉換器函數
- `rootNode`：轉換的起始節點（通常使用 `document.documentElement` 或 `document.body`）
- `langAttrInitial`：要轉換的元素的原始 `lang` 屬性值（例如：`'zh-HK'`、`'zh-TW'`）
- `langAttrNew`：轉換後的 `lang` 屬性值（例如：`'zh-CN'`、`'zh-TW'`）

**回傳值**：
- 包含 `convert()` 和 `restore()` 方法的物件

#### 進階範例：局部轉換

```html
<div id="content">
  <p lang="zh-TW">這是臺灣正體中文。</p>
  <p lang="zh-CN">这是简体中文。</p>
  <p class="ignore-opencc" lang="zh-TW">這段不會被轉換。</p>
</div>

<script>
  const converter = OpenCC.Converter({ from: 'tw', to: 'cn' });
  const contentNode = document.getElementById('content');

  // 只轉換 content 區域中的繁體中文
  const htmlConverter = OpenCC.HTMLConverter(converter, contentNode, 'zh-TW', 'zh-CN');
  htmlConverter.convert();
</script>
```

#### 忽略特定元素

如果您不希望某些元素被轉換，可以在該元素上加上 `ignore-opencc` class：

```html
<div>
  <p lang="zh-TW">這段會被轉換</p>
  <p class="ignore-opencc" lang="zh-TW">這段不會被轉換</p>
  <div class="ignore-opencc">
    <p lang="zh-TW">這段也不會被轉換（父元素有 ignore-opencc）</p>
  </div>
</div>
```

**注意事項**：
- 帶有 `ignore-opencc` class 的元素及其所有子元素都不會被轉換
- `lang` 屬性遵循 [IETF BCP 47](https://www.w3.org/International/articles/bcp47/) 標準（例如：`zh-TW`、`zh-HK`、`zh-CN`、`zh-SG`）

## 打包優化

### Tree Shaking（ES Modules）

如果使用 Rollup、Webpack、Vite 等支援 Tree Shaking 的打包工具，可以使用以下方式讓打包工具自動移除用不到的部分，大幅減少最終打包檔案的大小。

```javascript
import * as OpenCC from '@willh/opencc-js/core';   // 核心程式碼
import * as Locale from '@willh/opencc-js/preset'; // 字典資料

const converter = OpenCC.ConverterFactory(Locale.from.hk, Locale.to.cn);
console.log(converter('漢語')); // 輸出：汉语
```

**重要提示**：
- 由於 Tree Shaking 需要靜態分析，因此必須使用 ES Modules
- 在這個模式下，沒有 `Converter` 函式，必須直接使用 `ConverterFactory`
- 只有實際使用的地區轉換字典會被打包進最終檔案

### 選擇合適的版本

根據您的使用情境，選擇最適合的版本可以有效減少載入時間：

| 使用情境         | 建議版本     | 檔案路徑                                            |
| ---------------- | ------------ | --------------------------------------------------- |
| 只需要簡體轉繁體 | cn2t.js      | `dist/esm/cn2t.js` 或 `dist/umd/cn2t.js`            |
| 只需要繁體轉簡體 | t2cn.js      | `dist/esm/t2cn.js` 或 `dist/umd/t2cn.js`            |
| 需要多種轉換     | full.js      | `dist/esm/full.js` 或 `dist/umd/full.js`            |
| 使用打包工具     | Tree Shaking | `@willh/opencc-js/core` + `@willh/opencc-js/preset` |

## API 參考

### Converter(options)

建立一個基本的轉換器函數。

**參數**：
- `options` (Object): 轉換選項
  - `from` (String): 來源地區碼（預設：`'tw'`）
  - `to` (String): 目標地區碼（預設：`'cn'`）

**回傳值**：
- (Function): 轉換器函數，接受一個字串參數並回傳轉換後的字串

**範例**：
```javascript
const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });
const result = converter('汉语'); // '漢語'
```

### CustomConverter(dict)

建立一個自訂轉換器函數。

**參數**：
- `dict` (Array|String): 轉換字典
  - Array: 二維陣列，每個元素為 `[原始詞, 目標詞]`
  - String: 使用 `|` 和空白分隔的字串

**回傳值**：
- (Function): 轉換器函數

**範例**：
```javascript
const converter = OpenCC.CustomConverter([['apple', '蘋果']]);
const result = converter('I like apple'); // 'I like 蘋果'
```

### ConverterFactory(from, to, custom?)

建立一個進階轉換器函數，可以組合多個轉換步驟。

**參數**：
- `from` (Array): 來源地區的字典陣列
- `to` (Array): 目標地區的字典陣列
- `custom` (Array, 可選): 額外的自訂字典陣列

**回傳值**：
- (Function): 轉換器函數

**範例**：
```javascript
const converter = OpenCC.ConverterFactory(
  OpenCC.Locale.from.cn,
  OpenCC.Locale.to.tw
);
const result = converter('汉语'); // '漢語'
```

### HTMLConverter(converter, rootNode, langFrom, langTo)

建立一個 HTML DOM 轉換處理器。

**參數**：
- `converter` (Function): 由 `Converter()` 建立的轉換器函數
- `rootNode` (HTMLElement): 轉換的根節點
- `langFrom` (String): 原始語言標籤（例如：`'zh-TW'`）
- `langTo` (String): 目標語言標籤（例如：`'zh-CN'`）

**回傳值**：
- (Object): 包含以下方法的物件
  - `convert()`: 執行轉換
  - `restore()`: 還原為原始內容

**範例**：
```javascript
const converter = OpenCC.Converter({ from: 'tw', to: 'cn' });
const handler = OpenCC.HTMLConverter(
  converter,
  document.documentElement,
  'zh-TW',
  'zh-CN'
);
handler.convert(); // 轉換整個頁面
handler.restore(); // 還原
```

### Locale

包含所有預定義的地區字典。

**結構**：
- `Locale.from`: 來源地區字典
  - `Locale.from.cn`: 簡體中文（大陸）
  - `Locale.from.tw`: 繁體中文（臺灣）
  - `Locale.from.twp`: 繁體中文（臺灣，含慣用詞）
  - `Locale.from.hk`: 繁體中文（香港）
  - `Locale.from.jp`: 日本新字體
- `Locale.to`: 目標地區字典
  - `Locale.to.cn`: 簡體中文（大陸）
  - `Locale.to.tw`: 繁體中文（臺灣）
  - `Locale.to.twp`: 繁體中文（臺灣，含慣用詞）
  - `Locale.to.hk`: 繁體中文（香港）
  - `Locale.to.jp`: 日本新字體

## 專案開發

### 建置專案

```bash
# 安裝依賴
npm install

# 建置
npm run build

# 執行測試
npm test
```

### 專案結構

```
opencc-js/
├── src/              # 原始碼
│   ├── main.js       # 核心轉換邏輯
│   ├── full.js       # 完整版入口
│   ├── cn2t.js       # 簡轉繁入口
│   ├── t2cn.js       # 繁轉簡入口
│   └── data-config.js # 字典配置
├── dist/             # 建置輸出
│   ├── esm/          # ES Modules 格式
│   ├── umd/          # UMD 格式（瀏覽器 + Node.js）
│   └── esm-lib/      # 模組化字典
├── test/             # 測試檔案
└── build.js          # 建置腳本
```

## 常見問題

### Q: 為什麼轉換結果不符合預期？

A: 請確認：
1. 使用的地區碼是否正確（`cn`、`tw`、`hk` 等）
2. 是否需要使用 `twp`（包含慣用詞轉換）
3. 輸入文字的編碼是否為 UTF-8

### Q: 如何在 TypeScript 專案中使用？

A: 目前套件尚未包含官方的型別定義檔（`.d.ts`），但您可以建立自己的型別定義：

```typescript
// opencc-js.d.ts
declare module '@willh/opencc-js' {
  export interface ConverterOptions {
    from?: string;
    to?: string;
  }

  export function Converter(options?: ConverterOptions): (text: string) => string;
  export function CustomConverter(dict: [string, string][] | string): (text: string) => string;
  export function ConverterFactory(from: any, to: any, custom?: any): (text: string) => string;
  export function HTMLConverter(converter: Function, rootNode: HTMLElement, langFrom: string, langTo: string): {
    convert(): void;
    restore(): void;
  };

  export const Locale: {
    from: Record<string, any>;
    to: Record<string, any>;
  };
}
```

### Q: 可以在離線環境使用嗎？

A: 可以。只要事先安裝套件或下載 UMD 檔案，就可以在完全離線的環境中使用。

### Q: 支援哪些瀏覽器？

A: 支援所有現代瀏覽器（Chrome、Firefox、Safari、Edge 等）。如果需要支援舊版瀏覽器（如 IE11），請使用 UMD 版本並搭配適當的 polyfills。

## 授權條款

本專案採用 MIT 授權條款。詳見 [LICENSE](LICENSE) 檔案。

## 貢獻

歡迎提交 Issue 或 Pull Request！

## 發布說明

### 發布 JavaScript Library 到 npm

```bash
# 1. 更新版本號
npm version patch  # 或 minor / major

# 2. 發布到 npm
npm publish
```

### 發布 CLI 執行檔到 GitHub Releases

CLI 執行檔透過 GitHub Actions 自動建置和發布：

```bash
# 1. 確保所有變更都已提交
git add .
git commit -m "Release v1.2.0"

# 2. 創建並推送 tag
git tag v1.2.0
git push origin main
git push origin v1.2.0
```

推送 tag 後，GitHub Actions 會自動：
- ✅ 在 Linux、macOS、Windows 三個平台上建置 CLI
- ✅ 創建 GitHub Release
- ✅ 上傳三個平台的獨立執行檔：
  - `opencc-linux-x64`
  - `opencc-macos-x64`
  - `opencc-windows-x64.exe`

### CI/CD Workflow

本專案使用 GitHub Actions 進行自動化測試和發布：

- **測試** - 每次 push 或 PR 都會執行測試
- **建置 CLI** - 當推送帶 `v*` 的 tag 時觸發
- **發布** - 自動創建 Release 並上傳執行檔

## 相關資源

- [OpenCC](https://github.com/BYVoid/OpenCC) - 原始 C++ 實作
- [opencc-data](https://github.com/nk2028/opencc-data) - OpenCC 字典資料
- [線上示範](https://opencc.byvoid.com/) - OpenCC 線上轉換工具

## 更新日誌

### 1.1.1
- ✨ 新增命令列工具 (CLI)
- 🚀 支援跨平台獨立執行檔（無需 Node.js）
- 📦 優化 npm package 大小（不包含大型執行檔）
- 🤖 自動化 CI/CD 流程，一鍵發布多平台執行檔

### 1.0.5
- 更新套件名稱為 `@willh/opencc-js`
- 改用 Bun 進行專案建置
- 完整的正體中文文件
- 更新 CI/CD workflow

---

**注意**：本專案基於 [nk2028/opencc-js](https://github.com/nk2028/opencc-js) 進行維護與更新。

// 產生 tw2 的「台／臺」字典 TW2Tai（standard→tw2）與 TW2TaiRev（tw2→standard）。
//
// TW2Tai    = 「臺」→「台」單字規則 + 白名單每個詞的所有寫法 → 正式名稱
// TW2TaiRev = 白名單每個詞的台灣寫法 → OpenCC standard 寫法；不含「台」→「臺」單字規則（仙台、台州本來就寫「台」）
//
// 「所有寫法」= 每個「臺」可寫成「台」或「臺」，每個字也可寫成 OpenCC standard 字形（依 TWVariantsRev，例如「眾」→「衆」）。
// 需要 standard 字形是因為 cn→tw2 的第 1 輪輸出 standard 字形，TWVariants 和 TW2Tai 在同一棵 Trie，比對時還沒轉成台灣字形。
//
// 用法：
//   node tools/gen-tw2-tai.mjs                 輸出兩個字典的內容（每行 key<TAB>value）
//   node tools/gen-tw2-tai.mjs --check <file>  檢查某個 port 的原始碼是否含有一致的 TW2Tai／TW2TaiRev
//   node tools/gen-tw2-tai.mjs --write <file>  把 TW2Tai／TW2TaiRev 寫入（或更新）C#、Rust、Swift 的字典原始碼
//                                              Python 的 dict_data.py 改用 opencc-py/tools/generate_dict_data.py 從 C# 產生
import fs from 'fs';
import { fileURLToPath } from 'url';
import TW2TaiProperNouns from '../src/custom/TW2TaiProperNouns.js';

// 台灣字形 → OpenCC standard 字形（只取第一個候選字）
function loadTwVariantsRev() {
  const file = fileURLToPath(new URL('../node_modules/opencc-data/data/TWVariantsRev.txt', import.meta.url));
  const map = new Map();
  for (const line of fs.readFileSync(file, 'utf-8').trimEnd().split('\n')) {
    const [k, vs] = line.split('\t');
    const v = vs.split(' ')[0];
    if (k !== v) map.set(k, v);
  }
  return map;
}

// 列出每個字所有可能寫法的組合
function expand(word, optionsOf) {
  let variants = [''];
  for (const c of word) {
    const options = optionsOf(c);
    variants = variants.flatMap(prefix => options.map(o => prefix + o));
  }
  return variants;
}

export function buildTw2Tai(properNouns = TW2TaiProperNouns, twVariantsRev = loadTwVariantsRev()) {
  const toStandard = word => [...word].map(c => twVariantsRev.get(c) ?? c).join('');
  const forward = [['臺', '台']];
  const reverse = [];
  const seen = new Set();
  for (const noun of properNouns) {
    if (!noun.includes('臺')) {
      throw new Error(`TW2TaiProperNouns 的「${noun}」沒有「臺」字`);
    }
    const variants = expand(noun, c => {
      const options = new Set([c]);
      if (c === '臺') options.add('台');
      if (twVariantsRev.has(c)) options.add(twVariantsRev.get(c));
      return [...options];
    });
    for (const variant of variants) {
      if (seen.has(variant)) {
        throw new Error(`TW2TaiProperNouns 有重複的寫法「${variant}」`);
      }
      seen.add(variant);
      forward.push([variant, noun]);
    }
    // tw2 的輸入是台灣字形，只需要「台／臺」的組合
    const standard = toStandard(noun);
    for (const variant of expand(noun, c => (c === '臺' ? ['臺', '台'] : [c]))) {
      reverse.push([variant, standard]);
    }
  }
  return { forward, reverse };
}

export function toLines(pairs) {
  return pairs.map(([k, v]) => `${k}\t${v}`).join('\n');
}

// 從原始碼中取出字串常數的內容（C#／Swift 用 TW2Tai，Rust 用 TW2_TAI，Python 用 TW_2_TAI）
function extractBlob(source, names) {
  const re = new RegExp(`\\b(?:${names.join('|')})\\b[^\\n]*\\n([\\s\\S]*?)\\n\\s*(?:"""|";)`);
  const m = source.match(re);
  if (!m) return null;
  return m[1].split('\n').map(l => l.trim()).filter(Boolean).map(l => l.replace(/\s+/, '\t')).join('\n');
}

// 各 port 字典原始碼的常數格式；close 是常數之後的關閉符號（null 表示檔尾）
const SOURCE_FORMATS = {
  '.cs': { names: ['TW2Tai', 'TW2TaiRev'], close: '}', blob: (n, l) => `        public const string ${n} = """\n${l}\n""";\n` },
  '.rs': { names: ['TW2_TAI', 'TW2_TAI_REV'], close: null, blob: (n, l) => `pub const ${n}: &str = "\\\n${l}\n";\n` },
  '.swift': { names: ['TW2Tai', 'TW2TaiRev'], close: '}', blob: (n, l) => `    static let ${n} = """\n${l}\n"""\n` },
};

// TW2Tai／TW2TaiRev 一律放在檔案最後，所以更新時刪掉 TW2Tai 宣告到檔尾關閉符號之間的內容再重寫
function writeBlobs(file, forward, reverse) {
  const ext = file.slice(file.lastIndexOf('.'));
  const format = SOURCE_FORMATS[ext];
  if (!format) throw new Error(`不支援的副檔名：${file}`);
  let s = fs.readFileSync(file, 'utf-8');
  const start = s.search(new RegExp(`\\n[^\\n]*\\b${format.names[0]}\\b`));
  if (start !== -1) {
    s = s.slice(0, start) + '\n' + s.slice(format.close ? s.lastIndexOf(format.close) : s.length);
  }
  const blobs = '\n' + format.blob(format.names[0], toLines(forward)) + '\n' + format.blob(format.names[1], toLines(reverse));
  const i = format.close ? s.lastIndexOf(format.close) : s.length;
  s = s.slice(0, i).replace(/\n*$/, '\n') + blobs + s.slice(i);
  fs.writeFileSync(file, s);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { forward, reverse } = buildTw2Tai();
  const checkIndex = process.argv.indexOf('--check');
  const writeIndex = process.argv.indexOf('--write');
  if (writeIndex !== -1) {
    for (const file of process.argv.slice(writeIndex + 1)) {
      writeBlobs(file, forward, reverse);
      console.log(`updated ${file}`);
    }
  } else if (checkIndex === -1) {
    console.log(`# TW2Tai\n${toLines(forward)}\n\n# TW2TaiRev\n${toLines(reverse)}`);
  } else {
    let failed = false;
    for (const file of process.argv.slice(checkIndex + 1)) {
      const source = fs.readFileSync(file, 'utf-8');
      for (const [name, pairs] of [['TW2Tai', forward], ['TW2TaiRev', reverse]]) {
        const actual = extractBlob(source, [name, ...(name === 'TW2Tai' ? ['TW2_TAI', 'TW_2_TAI'] : ['TW2_TAI_REV', 'TW_2_TAI_REV'])]);
        const ok = actual === toLines(pairs);
        failed ||= !ok;
        console.log(`${ok ? 'OK  ' : 'FAIL'} ${file} ${name}${actual === null ? '（找不到）' : ''}`);
      }
    }
    process.exit(failed ? 1 : 0);
  }
}

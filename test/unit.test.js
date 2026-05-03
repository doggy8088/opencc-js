import { describe, it, expect } from 'vitest';
import * as OpenCC from '../dist/esm-lib/core.js';
import * as loc from '../dist/esm-lib/preset/full.js';

const Converter = OpenCC.ConverterBuilder(loc);

describe('Trie', () => {
  it('should convert basic ASCII words', () => {
    const trie = new OpenCC.Trie();
    trie.addWord('abc', '123');
    trie.addWord('abcd', '4');
    expect(trie.convert('ab')).toBe('ab');
    expect(trie.convert('abc')).toBe('123');
    expect(trie.convert('abcd')).toBe('4');
    expect(trie.convert('abcde')).toBe('4e');
    expect(trie.convert('dabc')).toBe('d123');
    expect(trie.convert('dabcd')).toBe('d4');
  });

  it('should convert CJK characters with variant selectors', () => {
    const trie = new OpenCC.Trie();
    trie.addWord('𦫖𩇩', 'aaa');
    trie.addWord('的𫟃', 'bbb');
    expect(trie.convert('𦫖𩇩𭞂的𫟃')).toBe('aaa𭞂bbb');
    expect(trie.convert('𦫖𭞂𩇩的𫟃')).toBe('𦫖𭞂𩇩bbb');
  });

  it('should handle empty trie', () => {
    const trie = new OpenCC.Trie();
    expect(trie.convert('test')).toBe('test');
  });

  it('should handle overlapping words', () => {
    const trie = new OpenCC.Trie();
    trie.addWord('a', '1');
    trie.addWord('ab', '12');
    trie.addWord('abc', '123');
    expect(trie.convert('abc')).toBe('123');
    expect(trie.convert('ab')).toBe('12');
    expect(trie.convert('a')).toBe('1');
  });

  it('should preserve unmapped characters', () => {
    const trie = new OpenCC.Trie();
    trie.addWord('hello', 'world');
    expect(trie.convert('hello123')).toBe('world123');
    expect(trie.convert('123hello')).toBe('123world');
  });

  it('should load raw dictionaries with tab before space fallback', () => {
    const trie = new OpenCC.Trie();
    trie.loadDict('Web 平台庫\tWeb 平台函式庫|保存更改 儲存變更');
    expect(trie.convert('Web 平台庫')).toBe('Web 平台函式庫');
    expect(trie.convert('保存更改')).toBe('儲存變更');
  });
});

describe('Converter - Preset Conversions', () => {
  it('should convert Hong Kong to Simplified Chinese', () => {
    const converter = Converter({ from: 'hk', to: 'cn' });
    expect(converter('政府初步傾向試驗為綠色專線小巴設充電裝置')).toBe(
      '政府初步倾向试验为绿色专线小巴设充电装置'
    );
  });

  it('should convert Traditional to Simplified Chinese', () => {
    const converter = Converter({ from: 't', to: 'cn' });
    expect(converter('漢語')).toBe('汉语');
  });

  it('should convert Simplified to Traditional with Taiwan Phrase', () => {
    const converter = Converter({ from: 'cn', to: 'twp' });
    expect(converter('方便面')).toBe('泡麵');
  });

  it('should handle single character conversion', () => {
    const converter = Converter({ from: 't', to: 'cn' });
    expect(converter('語')).toBe('语');
    expect(converter('漢')).toBe('汉');
  });

  it('should preserve already converted text', () => {
    const converter = Converter({ from: 't', to: 'cn' });
    expect(converter('汉语')).toBe('汉语');
  });

  it('should handle mixed content with numbers', () => {
    const converter = Converter({ from: 't', to: 'cn' });
    expect(converter('第123章 漢語')).toBe('第123章 汉语');
  });

  it('should handle punctuation', () => {
    const converter = Converter({ from: 't', to: 'cn' });
    expect(converter('漢語、中文，繁體？')).toBe('汉语、中文，繁体？');
  });

  it('should handle empty string', () => {
    const converter = Converter({ from: 't', to: 'cn' });
    expect(converter('')).toBe('');
  });

  it('should handle whitespace', () => {
    const converter = Converter({ from: 't', to: 'cn' });
    expect(converter('漢 語')).toBe('汉 语');
    expect(converter('  漢語  ')).toBe('  汉语  ');
  });

  it('should handle newlines', () => {
    const converter = Converter({ from: 't', to: 'cn' });
    expect(converter('漢語\n繁體')).toBe('汉语\n繁体');
  });
});

describe('CustomConverter', () => {
  it('should convert custom mappings', () => {
    const converter = OpenCC.CustomConverter([
      ['香蕉', '🍌️'],
      ['蘋果', '🍎️'],
      ['梨', '🍐️'],
    ]);
    expect(converter('香蕉蘋果梨')).toBe('🍌️🍎️🍐️');
  });

  it('should handle overlapping custom mappings', () => {
    const converter = OpenCC.CustomConverter([
      ['AB', 'X'],
      ['ABC', 'Y'],
    ]);
    expect(converter('ABC')).toBe('Y');
    expect(converter('AB')).toBe('X');
  });

  it('should handle multiple occurrences', () => {
    const converter = OpenCC.CustomConverter([
      ['老', '老'],
      ['虎', '🐯'],
    ]);
    expect(converter('老虎老虎')).toBe('老🐯老🐯');
  });

  it('should handle empty custom mapping', () => {
    const converter = OpenCC.CustomConverter([]);
    expect(converter('test')).toBe('test');
  });

  it('should preserve unmapped text in custom converter', () => {
    const converter = OpenCC.CustomConverter([
      ['A', 'X'],
    ]);
    expect(converter('ABCD')).toBe('XBCD');
    expect(converter('A')).toBe('X');
  });
});

describe('Edge Cases', () => {
  it('should handle consecutive same characters', () => {
    const converter = Converter({ from: 't', to: 'cn' });
    expect(converter('漢漢漢')).toBe('汉汉汉');
  });

  it('should handle very long text', () => {
    const converter = Converter({ from: 't', to: 'cn' });
    const longText = '漢語'.repeat(1000);
    expect(converter(longText)).toBe('汉语'.repeat(1000));
  });

  it('should handle special Unicode characters', () => {
    const converter = Converter({ from: 't', to: 'cn' });
    expect(converter('組織')).toBe('组织');
  });

  it('should handle Emoji with text', () => {
    const converter = Converter({ from: 't', to: 'cn' });
    expect(converter('漢語👍')).toBe('汉语👍');
  });
});

describe('常見簡繁轉換錯誤', () => {
  it('should handle "发" (fa) character correctly', () => {
    const converter = Converter({ from: 'cn', to: 'tw' });
    const cases = {
      '发现': '發現',
      '发芽': '發芽',
      '发生': '發生',
      '发现': '發現',
      '发烧': '發燒',
      '发怒': '發怒',
      '发表': '發表',
      '开发': '開發',
      '发送': '發送',
      '发射': '發射',
      '发行': '發行',
      '发出': '發出',
      '发言': '發言',
      '发展': '發展',
      '发达': '發達',
      '发财': '發財',
      '发扬': '發揚',
    };
    for (const [cn, tw] of Object.entries(cases)) {
      expect(converter(cn)).toBe(tw);
    }
  });

  it('should handle "常見台灣詞彙" character correctly', () => {
    // 使用內建 tw2 詞庫（TWVariants + TWPhrasesCustom）
    const converter = Converter({ from: 'cn', to: 'tw2' });

    expect(loc.to.tw2).toHaveLength(2);
    expect(loc.to.tw2[0]).toBe(loc.to.tw[0]);
    expect(Array.isArray(loc.to.tw2[1])).toBe(true);

    const cases = {

      'Web 平台库': 'Web 平台函式庫',
      '「类」': '「類別」',
      '一个类': '一個類別',
      '任意类': '任意類別',
      '全平台库列表': '全平台函式庫列表',
      '具体类扩充': '具體類別擴充',
      '原生平台库': '原生平台函式庫',
      '子类': '子類別',
      '就是类': '就是類別',
      '抽象类': '抽象類別',
      '接口和抽象类': '介面和抽象類別',
      '控制台': '主控台',
      '控制台打印': '輸出到 Console',
      '扩展类（继承）': '類別繼承',
      '文档注释': '文件註解',
      '栅格类': '網格類別',
      '的类都拥有': '的類別都擁有',
      '类加载器': '類別載入器',
      '控制檯': '主控台',
      '脚本': '指令碼',
      '调用实现类': '呼叫實現類別',
      '这些类拥有': '這些類別擁有',
      '预定义类': '預先定義類別',
      '类。': '類別。',
      '类加载': '類別載入',
      '类库': '類別庫',
      '类的': '類別的',
      '类（ Class ）': '類別（ Class ）',

      // 法/髮/發
      '一触即发': '一觸即發',
      '千钧一发': '千鈞一髮',
      '蓄势待发': '蓄勢待發',
      '百发百中': '百發百中',
      '振聋发聩': '振聾發聵',
      '奋发图强': '奮發圖強',
      '厚积薄发': '厚積薄發',

      // 其他常見詞彙轉換
      '哥特风格': '哥德風格',
      '剪裁合体': '剪裁合身',
      '卫衣': '連帽衫',
      '红晕': '臉紅',
      '监控摄像头': '監視攝影機',
      '毛绒': '絨毛',
      '背包': '背包',
      '安全套': '保險套',
      '高质量': '高品質',
      '赛博朋克': '賽博龐克',
      '黑客帝国': '駭客任務',
      '霍格沃茨': '霍格華茲',
      '星球大战': '星際大戰',
      '塔图因集市': '塔圖因市集',
      '指环王': '魔戒',
      '权力的游戏': '冰與火之歌',
      '盗梦空间': '全面啟動',
      '折叠': '折疊',
      '粘土': '黏土',
      '泰坦尼克号': '鐵達尼號',
      '星际穿越': '星際效應',
      '钢铁侠': '鋼鐵人',
      '竖构图': '直式構圖',
      '横构图': '橫式構圖',
      '灰色开衫': '灰色開襟',
      '埃菲尔铁塔': '艾菲爾鐵塔',
      '舞台聚光灯': '舞台聚光燈',
      '桂林漓江': '桂林漓江',
      '台湾': '台灣',
      '斯塔克': '史塔克',
      '扎哈·哈迪德': '薩哈·哈蒂',
      '台球桌': '撞球桌',
      '单反相机': '單眼相機',
      '剃须刀': '刮鬍刀',
      '屏幕': '螢幕',

      // 常見詞彙轉換
      '竞品': '競品',
      '惰性加载': '延遲載入',
      '引用变数': '參考變數',
      '变量': '變數',
      'for 循环': 'for 迴圈',
      'while 循环': 'while 迴圈',
      '视频': '影片',
      '音频': '音訊',
      '激光': '雷射',
      '一些库': '一些函式庫',
      '一个库': '一個函式庫',
      '并发': '平行處理',
      '事务': '交易',
      '事务性': '交易式',
      '代码': '程式碼',
      '代码快': '程式碼區塊',
      '代码段': '程式碼片段',
      '代码生成': '程式碼產生器',
      '代码审查': '程式碼審查',
      '代码库': '程式碼庫',
      '代码重构': '程式碼重構',
      '伸缩性': '延展性',
      '依赖包': '相依套件',
      '依赖注入': '相依性注入',
      '依赖项': '相依性',
      '保留关键字': '保留字',
      '信息': '資訊',
      '元数据': 'Metadata',
      '克隆': '複製',
      '内存': '記憶體',
      '内存洩漏': '記憶體洩漏',
      '内置': '內建',
      '全局': '全域',
      '全局变量': '全域變數',
      '兼容性': '相容性',
      '冇有': '沒有',
      '函数': '函式',
      '函数式编程': '函數式程式設計',
      '到账': '到帳',
      '刷新': '重新整理',
      '创建': '建立',
      '创建一个整型': '建立一個整數型別',
      '加载': '載入',
      '动图': '動畫',
      '包定义': '套件定義',
      '包的依赖': '套件相依性',
      '包管理器': '套件管理器',
      '博客': '部落格',
      '原语': '原語(primitives)',
      '只读': '唯讀',
      '可扩展性': '可擴充性',
      '可视化': '視覺化',
      '可视化思想': '視覺化的點子',
      '可访问性': '可及性',
      '命令行': '命令列',
      '命令行工具': '命令列工具',
      '回调': 'callback',
      '回调函式': '回呼函式',
      '在线': '線上',
      '在线文档': '線上文件',
      '均衡': '平衡',
      '块级作用域': '區塊作用域',
      '多线程': '多執行緒',
      '线程': '執行緒',
      '字段': '欄位',
      '字符': '字元',
      '字符串': '字串',
      '字符编码': '字元編碼',
      '编码': '寫程式',
      '字节': '位元組',
      '字节码': '位元組碼',
      '字面量': '字面量（Literal）',
      '存储': '儲存',
      '存储过程': '預存程序',
      '定制': '客製化',
      '定製': '客製化',
      '实例化': '實體化',
      '实现': '實作',
      '对象': '物件',
      '对象导向': '物件導向',
      '导入': '匯入',
      '导出': '匯出',
      '导航': '導覽',
      '导航条': '導覽列',
      '局部变量': '區域變數',
      '屏幕': '螢幕',
      '屏蔽': '遮罩',
      '嵌套': '巢狀 (Nesting)',
      '工具链': '工具鏈',
      '巨石': '單體',
      '布尔值': '布林值',
      '布尔型': '布林型別',
      '带宽': '頻寬',
      '干货': '乾貨',
      '库概览': '函式庫概覽',
      '应用程序': '應用程式',
      '开发': '開發',
      '开发者': '開發者',
      '开发环境': '開發環境',
      '快捷键': '快速鍵',
      '快速起步': '快速入門',
      '性能': '效能',
      '性能优化': '效能最佳化',
      '性能测试': '效能測試',
      '惰性载入': '延遲載入',
      '应用程序': '應用程式',
      '应用程序接口': '應用程式介面',
      '懒加载': '延遲載入',
      '我们的程序': '我們的應用程式',
      '打包': '封裝',
      '打包工具': '封裝工具',
      '批处理': '批次處理',
      '技术栈': '技術堆疊',
      '指针': '指標',
      '接口': '介面',
      '控件': '控制項',
      '打印机': '印表機',
      '插件': '外掛',
      '插件开发': '外掛開發',
      '搜索': '搜尋',
      '搜索引擎': '搜尋引擎',
      '操作系统': '作業系統',
      '操作符': '運算子',
      '扩展': '擴充',
      '支持': '支援',
      '教程': '課程',
      '数字': '數位',
      '数字营销': '數位行銷',
      '数据': '資料',
      '数据库': '資料庫',
      '数据结构': '資料結構',
      '数据绑定': '資料繫結',
      '数据类型': '資料型別',
      '数组': '陣列',
      '文档': '文件',
      '文件夹': '資料夾',
      '断点': '中斷點',
      '断言': '判斷提示',
      '日誌': '記錄',
      '时间戳': '時間戳記',
      '映射': '對應',
      '智能': '智慧',
      '最佳实践': '最佳做法',
      '服务器': '伺服器',
      '服务器端': '伺服器端',
      '服务端': '伺服器端',
      '框架': '框架',
      '栅格': '網格',
      '核心库': '核心函式庫',
      '根组件': '根元件',
      '栈追踪': '堆疊追蹤（Stack Trace）',
      '极端要求': '嚴格要求',
      '构建': '建構',
      '构建工具': '建構工具',
      '构造函式': '建構函式',
      '构造块': '構成要素',
      '标识符': '識別符號',
      '标籤': '標記',
      '模块': '模組',
      '模块化': '模組化',
      '模板': '樣板',
      '模板引擎': '樣板引擎',
      '模组库': '模組函式庫',
      '模组的库': '模組的函式庫',
      '样例': '範例',
      '权限': '權限',
      '法学硕士': 'LLM',
      '派生物件': '衍生物件',
      '流程': '流程',
      '流程图': '流程圖',
      '测试': '測試',
      '测试用例': '測試案例',
      '测试复盖率': '測試覆蓋率',
      '消息': '訊息',
      '消息队列': '訊息佇列',
      '添加': '新增',
      '源代码': '原始碼',
      '源码': '原始碼',
      '演示': '示範',
      '演示程序': '展示程式',
      '激活': '啟動',
      '营销': '行銷',
      '爆发': '爆發',
      '版本控制': '版本控制',
      '发布': '發表',
      '生产率': '生產力',
      '生产环境': '正式環境',
      '用例': '使用案例',
      '用户': '使用者',
      '用户界面': '使用者介面',
      '界面': '介面',
      '异常': '例外',
      '异常处理': '例外處理',
      '异步': '非同步',
      '异步编程': '非同步程式設計',
      '的库': '的函式庫',
      '监听': '監聽',
      '监听器': '監聽器',
      '相依性插入': '相依性注入',
      '矢量': '向量',
      '矢量图': '向量圖',
      '硬件': '硬體',
      '硬伤': '罩門',
      '知识库': '知識庫',
      '码农': '程式設計師',
      '示例': '範例',
      '社区': '社群',
      '秘籍': '秘笈',
      '移动': '行動',
      '移动端': '行動裝置端',
      '移动应用': '行動應用程式',
      '程序': '程式',
      '程序员': '程式設計師',
      '算法': '演算法',
      '算法複杂度': '演算法複雜度',
      '索引': '索引',
      '组件': '元件',
      '组件化': '元件化',
      '绑定': '繫結',
      '网络': '網路',
      '网络请求': '網路請求',
      '编译': '編譯',
      '编译器': '編譯器',
      '编程': '程式設計',
      '编程语言': '程式語言',
      '缓存': '快取',
      '缓存策略': '快取策略',
      '声明': '宣告',
      '声明式': '宣告式',
      '自定义': '自訂',
      '菜单': '選單',
      '虚拟化': '虛擬化',
      '虚拟机': '虛擬機器',
      '视口': '畫面',
      '视图': '檢視',
      '视图层': '檢視層',
      '规范': '規範',
      '触发': '觸發',
      '解析': '解析',
      '解析器': '解析器',
      '计算机': '電腦',
      '计算属性': '計算屬性',
      '访问': '存取',
      '访问修饰符': '存取修飾符',
      '访问权限': '存取權限',
      '设置': '設定',
      '设计模式': '設計模式',
      '语句': '陳述式',
      '语法': '語法',
      '语法糖': '語法糖',
      '调用': '呼叫',
      '调用堆栈': '呼叫堆疊',
      '调度': '排程',
      '调试': '偵錯',
      '调试器': '偵錯工具',
      '调试工具': '偵錯工具',
      '负载均衡': '負載平衡',
      '账户': '帳戶',
      '账号': '帳號',
      '超链接': '超連結',
      '跟踪': '追蹤',
      '跨域': '跨網域',
      '路由': '路由',
      '路由器': '路由器',
      '软件': '軟體',
      '软件包': '軟體套件',
      '软件开发': '軟體開發',
      '软件工程': '軟體工程',
      '输入': '輸入',
      '输出': '輸出',
      '运行': '執行',
      '运行时': '執行時期',
      '运行时环境': '執行環境',
      '运行时检查': '執行時期檢查',
      '进程': '行程',
      '进程间通信': '行程間通訊',
      '连接': '連線',
      '连接池': '連線集區',
      '遍历': '遍歷',
      '适配器': '配接器',
      '配置': '組態',
      '配置文件': '組態檔',
      '重载': '多載',
      '链接': '連結',
      '链式调用': '鏈式呼叫',
      '队列': '佇列',
      '隐式': '隱含',
      '隐式转换': '隱含轉換',
      '集合': '集合',
      '集成': '整合',
      '集成开发环境': '整合開發環境',
      '集群': '叢集',
      '云计算': '雲端運算',
      '云端': '雲端',
      '静态': '靜態',
      '静态方法': '靜態方法',
      '面向对象': '物件導向',
      '面向对象编程': '物件導向程式設計',
      '响应': '回應',
      '响应式': '回應式',
      '响应式编程': '回應式程式設計',
      '响应头': '回應標頭',
      '响应体': '回應內文',
      '页标籤': '頁籤',
      '页头': '頁首',
      '项目': '專案',
      '项目文件夹': '專案資料夾',
      '项目的': '專案的',
      '项目目录': '專案目錄',
      '项目管理': '專案管理',
      '项目设置': '專案設定',
      '类型': '型別',
      '类型推断': '型別推斷',
      '类型检查': '型別檢查',
      '类型系统': '型別系統',
      '类型转换': '型別轉換',
      '显式': '明確',
      '显式地': '明確地',
      '显式声明': '明確宣告',
      '高级': '進階',
      '高级用法': '進階用法',
      '高级的': '進階的',
      '高级特性': '進階特性',
      '质量': '品質',
      '剑指': '針對',
      '痛点': '要害',
      '默认': '預設',
      '默认值': '預設值',
      '默认参数': '預設參數',
      '鼠标': '滑鼠',
      '鼠标事件': '滑鼠事件'
    };
    for (const [cn, tw] of Object.entries(cases)) {
      // console.log(`Testing conversion: ${cn} -> ${tw}`);
      expect(converter(cn)).toBe(tw);
    }
  });

  it('should handle preferred Taiwan terminology recommendations', () => {
    const converter = Converter({ from: 'cn', to: 'tw2' });
    const cases = {
      '视频': '影片',
      '音频': '音訊',
      '软件': '軟體',
      '硬件': '硬體',
      '程序': '程式',
      '进程': '行程',
      '进程间通信': '行程間通訊',
      '线程': '執行緒',
      '数据': '資料',
      '数据库': '資料庫',
      '网络': '網路',
      '电子邮件': '電子郵件',
      '网络服务': '網路服務',
      '应用程序网关': '應用程式閘道',
      '镜像文件': '映像檔',
      '保存更改': '儲存變更',
      '信息': '資訊',
      '质量': '品質',
      '用户': '使用者',
      '默认': '預設',
      '创建': '建立',
      '实现': '實作',
      '运行': '執行',
      '发布': '發表',
      '屏幕': '螢幕',
      '界面': '介面',
      '文档': '文件',
      '操作系统': '作業系統',
      '剑指': '針對',
      '痛点': '要害',
      '硬伤': '罩門',
    };

    for (const [cn, tw] of Object.entries(cases)) {
      expect(converter(cn)).toBe(tw);
    }
  });

  it('should cover cn to tw2 terminology edge cases from the quality plan', () => {
    const converter = Converter({ from: 'cn', to: 'tw2' });
    const cases = {
      '数据结构数据库': '資料結構資料庫',
      '应用程序网关和网络服务': '應用程式閘道和網路服務',
      'Docker 镜像文件': 'Docker 映像檔',
      '电子邮件设置保存更改。': '電子郵件設定儲存變更。',
      '“数据库”, “网络请求”': '“資料庫”, “網路請求”',
      '应用程序网关 API': '應用程式閘道 API',
      '爆发发布': '爆發發表',
      '发布公告': '發表公告',
      '发布新版本': '發表新版本',
    };

    for (const [cn, tw] of Object.entries(cases)) {
      expect(converter(cn)).toBe(tw);
    }
  });
});

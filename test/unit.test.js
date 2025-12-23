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

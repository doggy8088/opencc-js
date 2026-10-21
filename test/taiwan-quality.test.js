import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import { ConverterBuilder } from '../dist/esm-lib/core.js';
import * as locale from '../dist/esm-lib/preset/full.js';

const cases = readFileSync(new URL('./taiwan-quality.tsv', import.meta.url), 'utf8')
  .trimEnd().split('\n').map(line => line.split('\t'));
for (const to of ['tw2', 'twp']) {
  describe(`Taiwan quality ${to}`, () => {
    const convert = ConverterBuilder(locale)({ from: 'cn', to });
    for (const [scope, source, expected] of cases) {
      if (scope !== 'both' && scope !== to) continue;
      it(source, () => {
        expect(convert(source)).toBe(expected);
        expect(convert(expected)).toBe(expected);
        expect(expected).not.toMatch(/[賬羣]/u);
      });
    }
  });
}

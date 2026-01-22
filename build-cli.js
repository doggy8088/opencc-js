import { $ } from 'bun';
import { join } from 'path';

console.log('Building standalone CLI...');

// Build the CLI as a standalone executable
const result = await $`bun build ./bin/opencc.js --compile --outfile ./bin/opencc`;

if (result.exitCode === 0) {
  console.log('✅ CLI built successfully: bin/opencc');
} else {
  console.error('❌ Failed to build CLI');
  process.exit(1);
}

#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { Converter } from '../dist/esm/full.js';

// Parse command line arguments
const args = process.argv.slice(2);
let file, from, to, outputFile;
let inPlace = false;

for (let i = 0; i < args.length; i++) {
  if ((args[i] === '-o' || args[i] === '--output') && args[i + 1]) {
    outputFile = args[i + 1];
    i++; // Skip next argument
  } else if (args[i] === '-i' || args[i] === '--in-place') {
    inPlace = true;
  } else if (!file) {
    file = args[i];
  } else if (!from) {
    from = args[i];
  } else if (!to) {
    to = args[i];
  }
}

if (!file || !from || !to) {
  console.error('Usage: opencc [file] [from] [to] [-o output | -i]');
  console.error('');
  console.error('Arguments:');
  console.error('  file              Input file path');
  console.error('  from              Source locale');
  console.error('  to                Target locale');
  console.error('  -o, --output      Output file path (optional)');
  console.error('  -i, --in-place    Overwrite input file in-place');
  console.error('');
  console.error('Examples:');
  console.error('  opencc input.txt cn tw2              # Print to console');
  console.error('  opencc input.txt cn tw2 -o out.txt   # Save to out.txt');
  console.error('  opencc input.txt cn tw2 -i           # Overwrite input.txt');
  console.error('');
  console.error('Supported locales:');
  console.error('  cn   - Simplified Chinese (China)');
  console.error('  tw   - Traditional Chinese (Taiwan)');
  console.error('  tw2  - Traditional Chinese (Taiwan) with custom phrases');
  console.error('  twp  - Traditional Chinese (Taiwan) with more phrases');
  console.error('  hk   - Traditional Chinese (Hong Kong)');
  console.error('  jp   - Japanese Shinjitai');
  console.error('  t    - Traditional Chinese');
  process.exit(1);
}

// Check for conflicting flags
if (outputFile && inPlace) {
  console.error('❌ Error: Cannot use -o and -i together');
  console.error('  -o: Save to a different file');
  console.error('  -i: Overwrite input file in-place');
  process.exit(1);
}

try {
  const filePath = resolve(process.cwd(), file);
  const content = readFileSync(filePath, 'utf-8');
  
  const converter = Converter({ from, to });
  const result = converter(content);
  
  if (outputFile) {
    // Save to output file
    const output = resolve(process.cwd(), outputFile);
    writeFileSync(output, result, 'utf-8');
    console.error(`✅ Converted ${file} from ${from} to ${to} → ${outputFile}`);
  } else if (inPlace) {
    // Overwrite input file in-place
    writeFileSync(filePath, result, 'utf-8');
    console.error(`✅ Converted ${file} from ${from} to ${to} (in-place)`);
  } else {
    // Print to console (stdout)
    console.log(result);
  }
} catch (error) {
  console.error(`❌ Error: ${error.message}`);
  process.exit(1);
}

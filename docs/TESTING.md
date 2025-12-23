# Testing Guide

## Overview

This project uses **Vitest** for unit testing with automatic coverage reporting and CI/CD integration via GitHub Actions.

## Running Tests Locally

### Quick Test
```bash
bun run test
```
Runs all tests once and displays:
- Detailed test results with pass/fail status
- Coverage report (HTML and JSON formats)
- Test execution summary

### Watch Mode (Development)
```bash
bun run test:watch
```
Automatically re-runs tests when files change. Perfect for TDD workflow.

## Test Structure

The test suite is organized in `test/unit.test.js` with the following categories:

### 1. **Trie Tests** (5 tests)
Tests the core `Trie` data structure for character conversion:
- Basic ASCII word conversion
- CJK characters with variant selectors
- Empty trie handling
- Overlapping words
- Unmapped character preservation

### 2. **Converter - Preset Conversions** (10 tests)
Tests preset conversion configurations (hk→cn, t→cn, cn→twp, etc.):
- Hong Kong to Simplified Chinese
- Traditional to Simplified Chinese
- Simplified to Traditional with Taiwan Phrase
- Single character conversion
- Already converted text preservation
- Mixed content with numbers and punctuation
- Empty strings and whitespace
- Newline handling

### 3. **CustomConverter Tests** (5 tests)
Tests custom user-defined conversion mappings:
- Basic custom mappings
- Overlapping mappings
- Multiple occurrences
- Empty custom mapping
- Unmapped text preservation

### 4. **Edge Cases** (4 tests)
Tests edge cases and performance scenarios:
- Consecutive same characters
- Very long text (1000+ characters)
- Special Unicode characters
- Emoji with text

## Test Count

- **Total: 24 tests**
- All tests passing ✓
- Coverage report auto-generated in `./coverage/`

## Test Results

Each test run generates:

1. **Console Output** - Verbose test results with status indicators
2. **HTML Report** - Open `./coverage/index.html` in browser for visual coverage report
3. **Coverage JSON** - Machine-readable coverage data in `./coverage/coverage-final.json`
4. **LCOV Report** - Standard LCOV format for CI integration

Example output:
```
✓ test/unit.test.js > Trie > should convert basic ASCII words
✓ test/unit.test.js > Converter - Preset Conversions > should convert Hong Kong to Simplified Chinese
✓ test/unit.test.js > CustomConverter > should convert custom mappings
...
Test Files  1 passed (1)
Tests       24 passed (24)
```

## CI/CD Integration

### GitHub Actions Workflow

The project includes automated testing via `.github/workflows/ci.yml` that:

1. **Triggers on:**
   - Push to `main` or `develop` branches
   - Pull requests to `main` or `develop` branches

2. **Test Matrix:**
   - Runs on Ubuntu latest
   - Tests against Node.js 18.x and 20.x

3. **CI Steps:**
   - Checkout code
   - Setup Bun runtime
   - Install dependencies
   - Build the project
   - Run tests with coverage
   - Upload coverage to Codecov
   - Comment PR with coverage stats (if PR)

### Example PR Comment

When a PR is submitted, the workflow automatically comments with:

```markdown
## Test Results

| Metric     | Coverage |
|------------|----------|
| Lines      | 85.5%    |
| Statements | 84.2%    |
| Functions  | 88.0%    |
| Branches   | 79.3%    |
```

## Adding New Tests

To add more test cases:

1. Open `test/unit.test.js`
2. Add a new `it()` block within an existing `describe()` or create a new suite:

```javascript
describe('New Feature', () => {
  it('should handle scenario X', () => {
    const converter = Converter({ from: 't', to: 'cn' });
    expect(converter('input')).toBe('expected');
  });
});
```

3. Run `bun run test:watch` to verify immediately
4. Tests will auto-run in CI when you push

## Vitest Configuration

Configuration is in `vitest.config.js`:

- **Environment:** Node.js
- **Globals:** Enabled (no need to import describe/it/expect)
- **Coverage Provider:** V8 (native Node.js coverage)
- **Reporters:** Verbose output for clarity
- **Coverage Include:** `src/**/*.js`

## Troubleshooting

### Tests not running?
```bash
bun install
bun run build
bun run test
```

### Clear cache and reinstall:
```bash
rm -rf node_modules bun.lock
bun install
```

### View coverage in browser:
```bash
# After running tests
open coverage/index.html  # macOS
start coverage/index.html # Windows
xdg-open coverage/index.html # Linux
```

## Best Practices

1. **Run tests before committing:** `bun run test`
2. **Use watch mode during development:** `bun run test:watch`
3. **Add tests for new features** before pushing to avoid CI failures
4. **Check coverage report** to identify untested code paths
5. **Keep tests focused** - one scenario per test case

## Coverage Goals

Target minimum coverage thresholds:
- Lines: 80%+
- Statements: 80%+
- Functions: 85%+
- Branches: 75%+

These can be configured in `vitest.config.js` using the `coverage` option.

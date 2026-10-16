# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.1] - 2026-10-16

### Changed

- `tw2` now writes 台 instead of 臺 in everyday words (台北, 舞台, 電視台) and keeps 臺 in official names such as 國立臺灣大學, 臺北市政府 and 新臺幣 (`TW2Tai` dictionary, list in `src/custom/TW2TaiProperNouns.js`). 颱 and 檯 are unchanged.

### Fixed

- `cn → tw2` no longer turns 国立台湾大学 into 國立台灣大學.

## [1.1.1] - 2025-12-28

### Changed

- Add more terms to `tw2` to enhance Taiwanese language conversion accuracy.

## [1.1.0] - 2025-12-23

- Initial release of @willh/opencc-js based on [opencc-js](https://github.com/nk2028/opencc-js) v1.0.5

### Added

- Add `tw2` conversion option for improved Taiwanese localization.

### Changed

### Deprecated

### Removed

### Fixed

### Security

[Unreleased]: https://github.com/doggy8088/opencc-js/compare/v1.2.1...HEAD
[1.2.1]: https://github.com/doggy8088/opencc-js/compare/v1.2.0...v1.2.1
[1.1.1]: https://github.com/doggy8088/opencc-js/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/doggy8088/opencc-js/releases/tag/v1.1.0

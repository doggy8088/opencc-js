# 貢獻與驗證

## 本機與 CI 驗證分工

- 啟用本機 pre-commit hook（每個 clone 設定一次）：`git config core.hooksPath .githooks`
- 分工原則：本機負責 format 與快速回歸；CI 負責完整測試矩陣與「乾淨環境」驗證。hook 只放快檢查，慢測試一律交給 CI，避免被 `--no-verify` 繞過。
- 本機 hook：`bun run build`（字典產生是最常見的翻車點）；完整 vitest 較久，不放 hook。
- CI：`ci.yml` 以 Bun 跑 build＋完整測試，以 CI 為準。（ci.yml 雖宣告 Node 22／24 matrix，但未實際以該版本切換執行環境，勿解讀為 Node 版本相容性驗證。）

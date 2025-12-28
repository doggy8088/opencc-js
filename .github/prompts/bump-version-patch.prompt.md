---
agent: agent
---

Bump the patch version of the package.

1.  Read `package.json` to determine the current version.
2.  Increment the patch version (e.g., 1.0.0 -> 1.0.1).
3.  Update `package.json` with the new version.
4.  Update `CHANGELOG.md`:
    -   If it doesn't exist, create it.
    -   Prepend the new version entry with the current date (YYYY-MM-DD).
    -   Example format:
        ```markdown
        ## [1.0.1] - 2023-10-27

        - Bump version to 1.0.1
        ```

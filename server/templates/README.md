# Server runtime templates

Files here are read at runtime via `process.cwd()/templates/...` (the SWC build does not
copy non-`.ts` assets into `dist/`, and Render's root directory is `server/`, so `cwd` is
`server/` in both dev and prod).

## googleWalletMacro.template.json  ← REQUIRED, not yet added

The Google Wallet auto-capture feature (`GET /api/shortcut/macro`) reads this file,
substitutes the per-user token, and serves it as `Lyra.macrodroid`.

To install it:

1. Export the macro from MacroDroid (the real, working macro).
2. Save the exported JSON **verbatim** to `server/templates/googleWalletMacro.template.json`.
3. Make exactly ONE edit: set
   `m_actionList[0].requestConfig.headerParams[0].paramValue` to the literal string
   `Shortcut __LYRA_SHORTCUT_TOKEN__`.
   The server replaces `__LYRA_SHORTCUT_TOKEN__` with a freshly-minted revocable token
   on each download. Do not change anything else (URL, trigger, body).

Until this file exists with the `__LYRA_SHORTCUT_TOKEN__` placeholder, the download
endpoint returns HTTP 500 with a clear message.

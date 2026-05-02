# Lyra Server

## `xlsx` override is duplicated on purpose

The `overrides.xlsx` block in [`server/package.json`](./package.json) is a
**duplicate** of the one in the workspace root [`Lyra/package.json`](../package.json).
Both must stay identical.

Why both:

- **Local dev** runs from the workspace root (`Lyra/`). `npm install` there is
  workspace-aware and the override at the root is what gets honored. The copy
  inside `server/package.json` is silently ignored in this context.
- **Render** is configured with **Root Directory = `server/`**, so its build
  only sees `server/package.json`. From npm's view inside Render's checkout,
  this file *is* the project root, and its override is what redirects `xlsx`
  to the SheetJS CDN.

Removing either copy will silently regress one of the two environments.

## When upgrading `xlsx`

SheetJS no longer publishes patched versions to npm — fixes ship only via
their CDN. Bump the version in **both** `overrides` blocks (the version
string appears twice in each URL, four total) and run a clean reinstall at
the workspace root:

```bash
rm -rf node_modules server/node_modules client/node_modules shared/node_modules package-lock.json
npm install
npm why xlsx   # must show "xlsx@<new-version> overridden"
npm audit      # must show no xlsx advisories
```

`npm install xlsx@latest` from npm will not work and will silently revert to
the vulnerable 0.18.5 published on the registry. Always go through the CDN
override.

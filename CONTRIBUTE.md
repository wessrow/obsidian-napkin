# Contributing

## Development setup

Requirements:

- Node.js 18+
- npm

Install dependencies:

- `npm install`

Run in watch mode:

- `npm run dev`

Build production bundle:

- `npm run build`

Run lint checks:

- `npm run lint`

## Project structure

- Source code: `src/`
- Build output entry: `main.js`
- Manifest: `manifest.json`
- Styles: `styles.css`

## Manual plugin testing

1. Build the plugin.
2. Copy these files to your vault plugin folder `Vault/.obsidian/plugins/napkin/`:
   - `main.js`
   - `manifest.json`
   - `styles.css`
3. Reload Obsidian and enable **Napkin** under **Settings → Community plugins**.

## Release workflow

This repository includes a GitHub Actions workflow:

- `.github/workflows/release.yml`

On tag push, it will:

1. Install dependencies.
2. Build the plugin.
3. Create a draft GitHub release.
4. Upload release assets: `main.js`, `manifest.json`, `styles.css`.

Before first use, set repository Actions workflow permissions to **Read and write permissions**.

Create and push a tag that matches `manifest.json` version:

- `git tag -a 0.1.0 -m "0.1.0"`
- `git push origin 0.1.0`

## Submission checklist

For initial submission to Obsidian community plugins:

- Ensure root files exist: `README.md`, `LICENSE`, `manifest.json`.
- Keep `manifest.json`, `versions.json`, and release tag version aligned.
- Open a PR to `obsidianmd/obsidian-releases` and add your plugin entry to `community-plugins.json`.
- Ensure entry `id`, `name`, `author`, and `description` match `manifest.json`.
- Follow Obsidian Developer policies, Submission requirements, and Plugin guidelines.

# Napkin

Napkin is an Obsidian community plugin that sends selected note content to Napkin's API and inserts the generated diagram back into your vault as an attachment.

## Legal notice

This plugin is an independent, unofficial community plugin. It is not endorsed by, sponsored by, or otherwise affiliated with napkin.ai.

## What it does

- Adds two editor commands: `Napkin: generate diagram` and `Napkin: quick generate diagram`.
- Uses the selected text in the active note as the diagram prompt.
- Lets you choose style, visual type, color mode, orientation, and output format from the modal.
- Saves the generated PNG or SVG into your vault's attachment location and inserts an embed below the selected text.

## Settings

The plugin currently supports these settings:

- `Napkin API token`: stored locally in the plugin's `data.json`. This is plain-text local storage, so only use it on a trusted device.
- `Default style`: preselected in the generation modal.
- `Default color mode`: `Auto` matches the current Obsidian theme, otherwise `Light` or `Dark` is sent explicitly.
- `Default orientation`: `Auto`, `Horizontal`, `Vertical`, or `Square`.
- `Default output format`: `PNG` or `SVG`.
- `Attachment filename prefix`: base name for saved diagram files.

## Usage

1. Open **Settings → Community plugins → Napkin**.
2. Paste your Napkin API token.
3. Select text in a markdown note.
4. Run `Napkin: generate diagram` for full options, or `Napkin: quick generate diagram` for defaults.
5. Review the modal options and select `Generate`.

The plugin will upload the selected text to Napkin.ai, wait for the generated result, save the returned file into your vault, and insert an embed into the current note.

## Development

Requirements:

- Node.js 18+
- npm

Commands:

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`

The source code lives under `src/`. The build uses `esbuild` and outputs the plugin entry bundle to `main.js`.

## Manual install

Copy these files into your vault's plugin folder:

- `main.js`
- `manifest.json`
- `styles.css`

Then reload Obsidian and enable the plugin in **Settings → Community plugins**.

## Release notes

When publishing a release:

- Keep `manifest.json` and `versions.json` in sync.
- Use the exact plugin version as the Git tag.
- Attach `main.js`, `manifest.json`, and `styles.css` to the GitHub release.

## Submission checklist

For an initial community submission (from Obsidian's release docs):

- Ensure `README.md`, `LICENSE`, and `manifest.json` are present in repo root.
- Create a GitHub release whose tag exactly matches `manifest.json` version.
- Attach release assets: `main.js`, `manifest.json`, and optional `styles.css`.
- Open a PR to `obsidianmd/obsidian-releases` and add an entry to `community-plugins.json`.
- Keep plugin `id`, `name`, `author`, and `description` in that PR aligned with your `manifest.json`.
- Follow Developer policies, Submission requirements, and Plugin guidelines before review.

Important: Obsidian's submission docs state the plugin `id` must not contain `obsidian`.

## Notes

- The plugin is intended to work locally inside the vault aside from the explicit request sent to Napkin.ai when generating a diagram.
- No console logging is used during normal operation.

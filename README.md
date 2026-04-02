# Obsidian Napkin

Obsidian Napkin is an Obsidian plugin that sends selected note content to Napkin.ai and inserts the generated diagram back into your vault as an attachment.

## What it does

- Adds a `Generate diagram` editor command.
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

1. Open **Settings → Community plugins → Obsidian Napkin**.
2. Paste your Napkin API token.
3. Select text in a markdown note.
4. Run the `Generate diagram` command.
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

## Notes

- The plugin is intended to work locally inside the vault aside from the explicit request sent to Napkin.ai when generating a diagram.
- No console logging is used during normal operation.

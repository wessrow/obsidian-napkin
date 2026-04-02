# Napkin

Napkin is an Obsidian community plugin that sends selected note content to Napkin's API and inserts the generated diagram back into your vault as an attachment.

## Legal notice

This plugin is an independent, unofficial community plugin. It is not endorsed by, sponsored by, or otherwise affiliated with napkin.ai.

## Purpose

Generate diagrams from selected note text and insert the result back into your note.

## Commands

- `Napkin: generate diagram` opens the options modal.
- `Napkin: quick generate diagram` uses your default settings.

## Settings

- Napkin API token (required)
- Styling defaults: style, color mode, orientation
- Output defaults: format, output folder, filename prefix

## Usage

1. Open **Settings → Community plugins → Napkin**.
2. Paste your Napkin API token.
3. Select text in a markdown note.
4. Run `Napkin: generate diagram` for full options, or `Napkin: quick generate diagram` for defaults.
5. Review the modal options and select `Generate`.

Napkin uploads only the selected text you submit for generation. The returned image is saved to your configured vault folder and embedded in the note.

## Contributing

See [CONTRIBUTE.md](CONTRIBUTE.md) for local development, testing, and release workflow details.


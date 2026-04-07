import { App, PluginSettingTab, Setting } from "obsidian";
import ObsidianNapkinPlugin from "./main";
import { NapkinOutputFormat, NapkinColorModeSetting, NapkinOrientation } from "./types";
import { NAPKIN_STYLES, DEFAULT_STYLE_ID } from "./utils/constants";
import { FolderSuggest } from "./ui/folder-suggest";

export type { NapkinOutputFormat, NapkinColorModeSetting, NapkinOrientation };

export interface ObsidianNapkinSettings {
	napkinApiToken: string;
	defaultStyle: string;
	defaultOutputFormat: NapkinOutputFormat;
	defaultColorMode: NapkinColorModeSetting;
	defaultOrientation: NapkinOrientation;
	defaultLanguage: string;
	outputDirectory: string;
	filenamePrefix: string;
}

export const DEFAULT_SETTINGS: ObsidianNapkinSettings = {
	napkinApiToken: "",
	defaultStyle: DEFAULT_STYLE_ID,
	defaultOutputFormat: "png",
	defaultColorMode: "auto",
	defaultOrientation: "auto",
	defaultLanguage: "auto",
	outputDirectory: "",
	filenamePrefix: "napkin-sketch",
};

export class ObsidianNapkinSettingTab extends PluginSettingTab {
	private readonly plugin: ObsidianNapkinPlugin;

	constructor(app: App, plugin: ObsidianNapkinPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Token (required)")
			.setHeading();

		new Setting(containerEl)
			.setName("Napkin API token")
			.setDesc("Stored locally in this plugin's data.json file. Treat your vault device as trusted.")
			.addText((text) => {
				text
					.setPlaceholder("Paste token")
					.setValue(this.plugin.settings.napkinApiToken)
					.onChange(async (value) => {
						this.plugin.settings.napkinApiToken = value.trim();
						await this.plugin.saveSettings();
					});

				text.inputEl.type = "password";
				text.inputEl.autocomplete = "off";
			});

		new Setting(containerEl)
			.setName("Styling")
			.setHeading();

		new Setting(containerEl)
			.setName("Default style")
			.setDesc("Pre-selected style in the generate diagram modal.")
			.addDropdown((dropdown) => {
				for (const style of NAPKIN_STYLES) {
					dropdown.addOption(style.id, `${style.name} — ${style.category}`);
				}
				dropdown
					.setValue(this.plugin.settings.defaultStyle)
					.onChange(async (value) => {
						this.plugin.settings.defaultStyle = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("Default color mode")
			.setDesc("Diagram palette. Auto matches the current Obsidian theme.")
			.addDropdown((dropdown) =>
				dropdown
					.addOption("auto", "Auto (match Obsidian)")
					.addOption("light", "Light")
					.addOption("dark", "Dark")
					.setValue(this.plugin.settings.defaultColorMode)
					.onChange(async (value) => {
						this.plugin.settings.defaultColorMode = value as NapkinColorModeSetting;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Default orientation")
			.setDesc("Slide layout for generated diagrams.")
			.addDropdown((dropdown) =>
				dropdown
					.addOption("auto", "Auto")
					.addOption("horizontal", "Horizontal")
					.addOption("vertical", "Vertical")
					.addOption("square", "Square")
					.setValue(this.plugin.settings.defaultOrientation)
					.onChange(async (value) => {
						this.plugin.settings.defaultOrientation = value as NapkinOrientation;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Default language")
			.setDesc("BCP 47 language tag used for generation. Use 'auto' to detect from selected text.")
			.addText((text) =>
				text
					.setPlaceholder("auto or en-US")
					.setValue(this.plugin.settings.defaultLanguage)
					.onChange(async (value) => {
						this.plugin.settings.defaultLanguage = normalizeLanguageTagOrAutoInput(value);
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Output")
			.setHeading();

		new Setting(containerEl)
			.setName("Default output format")
			.setDesc("Used when creating diagram attachments.")
			.addDropdown((dropdown) =>
				dropdown
					.addOption("png", "PNG")
					.addOption("svg", "SVG")
					.setValue(this.plugin.settings.defaultOutputFormat)
					.onChange(async (value) => {
						if (value !== "png" && value !== "svg") {
							return;
						}

						this.plugin.settings.defaultOutputFormat = value as NapkinOutputFormat;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Output directory")
			.setDesc("Vault-relative folder for generated diagrams. Existing folders autocomplete while typing. Leave empty to use Obsidian's default attachment location.")
			.addText((text) => {
				text
					.setPlaceholder("Napkin")
					.setValue(this.plugin.settings.outputDirectory)
					.onChange(async (value) => {
						this.plugin.settings.outputDirectory = value.trim().replace(/^\/+|\/+$/g, "");
						await this.plugin.saveSettings();
					});

				new FolderSuggest(this.app, text.inputEl).onSelect((folder) => {
					text.setValue(folder.path);
					this.plugin.settings.outputDirectory = folder.path;
					void this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName("Attachment filename prefix")
			.setDesc("Base name used for generated diagram files.")
			.addText((text) =>
				text
					.setPlaceholder("Napkin sketch")
					.setValue(this.plugin.settings.filenamePrefix)
					.onChange(async (value) => {
						this.plugin.settings.filenamePrefix = value.trim() || DEFAULT_SETTINGS.filenamePrefix;
						await this.plugin.saveSettings();
					})
			);
	}
}

function normalizeLanguageTagOrAutoInput(value: string | undefined | null): string {
	const trimmed = (value ?? "").trim();
	if (!trimmed || trimmed.toLowerCase() === "auto") {
		return "auto";
	}

	try {
		const [canonical] = Intl.getCanonicalLocales(trimmed);
		return canonical ?? trimmed;
	} catch {
		return trimmed;
	}
}

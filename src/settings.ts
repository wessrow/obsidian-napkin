import { App, PluginSettingTab, Setting } from "obsidian";
import ObsidianNapkinPlugin from "./main";

export type NapkinOutputFormat = "png" | "svg";

export interface ObsidianNapkinSettings {
	napkinApiToken: string;
	defaultStyle: string;
	defaultOutputFormat: NapkinOutputFormat;
	filenamePrefix: string;
}

export const DEFAULT_SETTINGS: ObsidianNapkinSettings = {
	napkinApiToken: "",
	defaultStyle: "napkin",
	defaultOutputFormat: "png",
	filenamePrefix: "napkin-sketch"
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
			.setName("Default style")
			.setDesc("Pre-selected style in the generate diagram modal.")
			.addDropdown((dropdown) =>
				dropdown
					.addOption("napkin", "Napkin")
					.addOption("sketch", "Sketch")
					.addOption("flowchart", "Flowchart")
					.addOption("mindmap", "Mind map")
					.setValue(this.plugin.settings.defaultStyle)
					.onChange(async (value) => {
						this.plugin.settings.defaultStyle = value;
						await this.plugin.saveSettings();
					})
			);

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
			.setName("Attachment filename prefix")
			.setDesc("Base name used for generated diagram files.")
			.addText((text) =>
				text
					.setPlaceholder("napkin-sketch")
					.setValue(this.plugin.settings.filenamePrefix)
					.onChange(async (value) => {
						this.plugin.settings.filenamePrefix = value.trim() || DEFAULT_SETTINGS.filenamePrefix;
						await this.plugin.saveSettings();
					})
			);
	}
}

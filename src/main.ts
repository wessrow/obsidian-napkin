import { Plugin } from "obsidian";
import { DEFAULT_SETTINGS, ObsidianNapkinSettingTab, ObsidianNapkinSettings } from "./settings";

export default class ObsidianNapkinPlugin extends Plugin {
	settings!: ObsidianNapkinSettings;

	async onload(): Promise<void> {
		await this.loadSettings();
		this.addSettingTab(new ObsidianNapkinSettingTab(this.app, this));
	}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<ObsidianNapkinSettings>);
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}
}

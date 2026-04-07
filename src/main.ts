import { Plugin } from "obsidian";
import { DEFAULT_SETTINGS, ObsidianNapkinSettingTab, ObsidianNapkinSettings } from "./settings";
import { registerGenerateDiagramCommand } from "./commands/generate-diagram";
import { normalizeLanguageTagOrAuto } from "./utils/language";

export default class ObsidianNapkinPlugin extends Plugin {
	settings!: ObsidianNapkinSettings;

	async onload(): Promise<void> {
		await this.loadSettings();
		this.addSettingTab(new ObsidianNapkinSettingTab(this.app, this));
		registerGenerateDiagramCommand(this);
	}

	async loadSettings(): Promise<void> {
		const saved = await this.loadData() as Partial<ObsidianNapkinSettings>;
		const merged = Object.assign({}, DEFAULT_SETTINGS, saved);

		// Guard against stale enum values from older plugin versions
		const validOrientations = ["auto", "horizontal", "vertical", "square"];
		if (!validOrientations.includes(merged.defaultOrientation)) {
			merged.defaultOrientation = DEFAULT_SETTINGS.defaultOrientation;
		}
		const validColorModes = ["auto", "light", "dark"];
		if (!validColorModes.includes(merged.defaultColorMode)) {
			merged.defaultColorMode = DEFAULT_SETTINGS.defaultColorMode;
		}
		merged.defaultLanguage = normalizeLanguageTagOrAuto(merged.defaultLanguage);

		this.settings = merged;
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}
}

import { App, Modal, Setting } from "obsidian";
import { NAPKIN_STYLES, NAPKIN_VISUAL_QUERIES } from "../utils/constants";
import { NapkinOutputFormat, NapkinVisualQuery } from "../types";
import { ObsidianNapkinSettings } from "../settings";

export interface GenerateModalResult {
	styleId: string;
	format: NapkinOutputFormat;
	visualQuery?: NapkinVisualQuery;
}

type OnConfirm = (result: GenerateModalResult) => void;

export class GenerateDiagramModal extends Modal {
	private readonly settings: ObsidianNapkinSettings;
	private readonly onConfirm: OnConfirm;
	private selectedStyleId: string;
	private selectedFormat: NapkinOutputFormat;
	private selectedVisualQuery: NapkinVisualQuery | "";

	constructor(app: App, settings: ObsidianNapkinSettings, onConfirm: OnConfirm) {
		super(app);
		this.settings = settings;
		this.onConfirm = onConfirm;
		this.selectedStyleId = settings.defaultStyle;
		this.selectedFormat = settings.defaultOutputFormat;
		this.selectedVisualQuery = "";
	}

	onOpen(): void {
		const { contentEl } = this;

		new Setting(contentEl)
			.setName("Generate diagram")
			.setHeading();

		new Setting(contentEl)
			.setName("Style")
			.setDesc("Visual theme for the generated diagram.")
			.addDropdown((dropdown) => {
				for (const style of NAPKIN_STYLES) {
					dropdown.addOption(style.id, `${style.name} — ${style.category}`);
				}
				dropdown
					.setValue(this.selectedStyleId)
					.onChange((value) => {
						this.selectedStyleId = value;
					});
			});

		new Setting(contentEl)
			.setName("Visual type")
			.setDesc("Optional layout hint for generated visuals.")
			.addDropdown((dropdown) => {
				dropdown.addOption("", "Auto (let Napkin choose)");
				for (const visualQuery of NAPKIN_VISUAL_QUERIES) {
					dropdown.addOption(visualQuery.value, visualQuery.label);
				}
				dropdown
					.setValue(this.selectedVisualQuery)
					.onChange((value) => {
						if (!value || value === "timeline" || value === "mindmap" || value === "iceberg") {
							this.selectedVisualQuery = value as NapkinVisualQuery | "";
						}
					});
			});

		new Setting(contentEl)
			.setName("Output format")
			.addDropdown((dropdown) =>
				dropdown
					.addOption("png", "PNG")
					.addOption("svg", "SVG")
					.setValue(this.selectedFormat)
					.onChange((value) => {
						if (value === "png" || value === "svg") {
							this.selectedFormat = value;
						}
					})
			);

		new Setting(contentEl)
			.addButton((btn) =>
				btn
					.setButtonText("Generate")
					.setCta()
					.onClick(() => {
						this.close();
						this.onConfirm({
							styleId: this.selectedStyleId,
							format: this.selectedFormat,
							visualQuery: this.selectedVisualQuery || undefined,
						});
					})
			)
			.addButton((btn) =>
				btn
					.setButtonText("Cancel")
					.onClick(() => this.close())
			);
	}

	onClose(): void {
		this.contentEl.empty();
	}
}

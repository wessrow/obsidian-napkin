import { App, Modal, Setting, setIcon } from "obsidian";
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
		contentEl.addClass("napkin-generate-modal");

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
			.setDesc("Optional layout hint for generated visuals.");

		this.renderVisualQuerySelector(contentEl);

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

	private renderVisualQuerySelector(containerEl: HTMLElement): void {
		const cards = containerEl.createDiv({ cls: "napkin-visual-query-grid" });

		const options = [
			{
				value: "" as const,
				label: "Auto",
				description: "Let Napkin choose the best layout.",
				icon: "sparkles",
			},
			...NAPKIN_VISUAL_QUERIES,
		];

		const buttons: HTMLButtonElement[] = [];

		const updateActiveState = (): void => {
			for (const button of buttons) {
				const value = button.dataset.value ?? "";
				const isActive = value === this.selectedVisualQuery;
				button.toggleClass("is-active", isActive);
				button.setAttribute("aria-pressed", isActive ? "true" : "false");
			}
		};

		for (const option of options) {
			const button = cards.createEl("button", {
				cls: "napkin-visual-query-card",
				attr: { type: "button" },
			});
			button.dataset.value = option.value;

			const iconEl = button.createDiv({ cls: "napkin-visual-query-icon" });
			setIcon(iconEl, option.icon);

			button.createEl("div", {
				cls: "napkin-visual-query-label",
				text: option.label,
			});

			button.createEl("div", {
				cls: "napkin-visual-query-description",
				text: option.description,
			});

			button.addEventListener("click", () => {
				this.selectedVisualQuery = option.value;
				updateActiveState();
			});

			buttons.push(button);
		}

		updateActiveState();
	}
}

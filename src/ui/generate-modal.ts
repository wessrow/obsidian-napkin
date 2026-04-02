import { App, Modal, Setting, setIcon } from "obsidian";
import { NAPKIN_STYLES, NAPKIN_VISUAL_QUERY_GROUPS } from "../utils/constants";
import { NapkinOutputFormat, NapkinVisualQuery, NapkinColorModeSetting, NapkinOrientation } from "../types";
import { ObsidianNapkinSettings } from "../settings";

export interface GenerateModalResult {
	styleId: string;
	format: NapkinOutputFormat;
	visualQuery?: NapkinVisualQuery;
	colorMode: NapkinColorModeSetting;
	orientation: NapkinOrientation;
	context?: string;
}

type OnConfirm = (result: GenerateModalResult) => void;

export class GenerateDiagramModal extends Modal {
	private readonly settings: ObsidianNapkinSettings;
	private readonly onConfirm: OnConfirm;
	private selectedStyleId: string;
	private selectedFormat: NapkinOutputFormat;
	private selectedVisualQuery: NapkinVisualQuery | "";
	private selectedColorMode: NapkinColorModeSetting;
	private selectedOrientation: NapkinOrientation;
	private contextText: string;

	constructor(app: App, settings: ObsidianNapkinSettings, onConfirm: OnConfirm) {
		super(app);
		this.settings = settings;
		this.onConfirm = onConfirm;
		this.selectedStyleId = settings.defaultStyle;
		this.selectedFormat = settings.defaultOutputFormat;
		this.selectedVisualQuery = "";
		this.selectedColorMode = settings.defaultColorMode;
		this.selectedOrientation = settings.defaultOrientation;
		this.contextText = "";
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
			.setName("Color mode")
			.setDesc("Diagram palette. Auto matches the current Obsidian theme.")
			.addDropdown((dropdown) =>
				dropdown
					.addOption("auto", "Auto (match Obsidian)")
					.addOption("light", "Light")
					.addOption("dark", "Dark")
					.setValue(this.selectedColorMode)
					.onChange((value) => {
						this.selectedColorMode = value as NapkinColorModeSetting;
					})
			);

		new Setting(contentEl)
			.setName("Orientation")
			.setDesc("Slide layout for the generated diagram.")
			.addDropdown((dropdown) =>
				dropdown
					.addOption("auto", "Auto")
					.addOption("horizontal", "Horizontal")
					.addOption("vertical", "Vertical")
					.addOption("square", "Square")
					.setValue(this.selectedOrientation)
					.onChange((value) => {
						this.selectedOrientation = value as NapkinOrientation;
					})
			);

		new Setting(contentEl)
			.setName("Context")
			.setDesc("Optional context for the generated diagram.");

		this.renderContextInput(contentEl);

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
							colorMode: this.selectedColorMode,
							orientation: this.selectedOrientation,
							context: this.contextText.trim() || undefined,
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
		const wrapper = containerEl.createDiv({ cls: "napkin-visual-query-wrapper" });
		const headerButton = wrapper.createEl("button", {
			cls: "napkin-visual-query-header",
			attr: { type: "button" },
		});

		const headerText = headerButton.createDiv({ cls: "napkin-visual-query-header-text" });
		const headerLabel = headerText.createDiv({ cls: "napkin-visual-query-header-label" });
		const headerDescription = headerText.createDiv({ cls: "napkin-visual-query-header-description" });
		const chevron = headerButton.createDiv({ cls: "napkin-visual-query-header-chevron" });
		setIcon(chevron, "chevron-down");

		const panel = wrapper.createDiv({ cls: "napkin-visual-query-panel is-collapsed" });
		const autoRow = panel.createDiv({ cls: "napkin-visual-query-auto-row" });
		const autoButton = autoRow.createEl("button", {
			cls: "napkin-visual-query-chip",
			text: "Auto",
			attr: { type: "button" },
		});
		autoButton.dataset.value = "";

		const groups = panel.createDiv({ cls: "napkin-visual-query-groups" });

		const buttons: HTMLButtonElement[] = [];
		let isExpanded = false;

		const getVisualQueryLabel = (value: string): string => {
			if (!value) {
				return "Auto";
			}

			return value
				.split("-")
				.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
				.join(" ");
		};

		const updateHeader = (): void => {
			headerLabel.setText(`Visual type: ${getVisualQueryLabel(this.selectedVisualQuery)}`);
			headerDescription.setText("Grouped by use case.");
		};

		const updateExpandedState = (): void => {
			panel.toggleClass("is-collapsed", !isExpanded);
			headerButton.toggleClass("is-expanded", isExpanded);
			headerButton.setAttribute("aria-expanded", isExpanded ? "true" : "false");
		};

		const updateActiveState = (): void => {
			for (const button of buttons) {
				const value = button.dataset.value ?? "";
				const isActive = value === this.selectedVisualQuery;
				button.toggleClass("is-active", isActive);
				button.setAttribute("aria-pressed", isActive ? "true" : "false");
			}
		};

		const registerButton = (button: HTMLButtonElement, value: string): void => {
			button.dataset.value = value;
			button.addEventListener("click", () => {
				this.selectedVisualQuery = value;
				isExpanded = false;
				updateExpandedState();
				updateHeader();
				updateActiveState();
			});

			buttons.push(button);
		};

		registerButton(autoButton, "");

		for (const group of NAPKIN_VISUAL_QUERY_GROUPS) {
			const groupEl = groups.createDiv({ cls: "napkin-visual-query-group" });
			groupEl.createDiv({
				cls: "napkin-visual-query-group-title",
				text: group.category,
			});

			const chipsEl = groupEl.createDiv({ cls: "napkin-visual-query-chip-grid" });

			for (const query of group.queries) {
				const button = chipsEl.createEl("button", {
					cls: "napkin-visual-query-chip",
					text: getVisualQueryLabel(query),
					attr: { type: "button" },
				});

				registerButton(button, query);
			}
		}

		headerButton.addEventListener("click", () => {
			isExpanded = !isExpanded;
			updateExpandedState();
		});

		updateHeader();
		updateExpandedState();
		updateActiveState();
	}

	private renderContextInput(containerEl: HTMLElement): void {
		const wrapper = containerEl.createDiv({ cls: "napkin-context-input-wrapper" });
		const textArea = wrapper.createEl("textarea", {
			cls: "napkin-context-input",
			attr: {
				rows: "3",
				placeholder: "Add background context, constraints, or intended audience",
			},
		});

		textArea.value = this.contextText;
		textArea.addEventListener("input", () => {
			this.contextText = textArea.value;
		});
	}
}

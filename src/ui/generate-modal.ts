import { App, Modal, Setting, setIcon } from "obsidian";
import { NAPKIN_STYLES, NAPKIN_VISUAL_QUERY_GROUPS } from "../utils/constants";
import { NapkinOutputFormat, NapkinVisualQuery, NapkinColorModeSetting, NapkinOrientation } from "../types";
import { ObsidianNapkinSettings } from "../settings";

const NAPKIN_LANGUAGE_OPTIONS: Array<{ value: string; label: string }> = [
	{ value: "auto", label: "Auto (detect from selection)" },
	{ value: "en-US", label: "English (US) — en-US" },
	{ value: "fr-FR", label: "French (France) — fr-FR" },
	{ value: "sv-SE", label: "Swedish (Sweden) — sv-SE" },
	{ value: "de-DE", label: "German (Germany) — de-DE" },
	{ value: "es-ES", label: "Spanish (Spain) — es-ES" },
	{ value: "it-IT", label: "Italian (Italy) — it-IT" },
	{ value: "pt-PT", label: "Portuguese (Portugal) — pt-PT" },
	{ value: "ja-JP", label: "Japanese (Japan) — ja-JP" },
	{ value: "ko-KR", label: "Korean (Korea) — ko-KR" },
	{ value: "zh-CN", label: "Chinese (Simplified) — zh-CN" },
];

const SUPPORTED_LANGUAGE_TAGS = new Set(NAPKIN_LANGUAGE_OPTIONS.map((option) => option.value));

function normalizeLanguageSelection(value: string | undefined | null): string {
	const trimmed = (value ?? "").trim();
	if (!trimmed || trimmed.toLowerCase() === "auto") {
		return "auto";
	}

	try {
		const [canonical] = Intl.getCanonicalLocales(trimmed);
		return canonical && SUPPORTED_LANGUAGE_TAGS.has(canonical) ? canonical : "auto";
	} catch {
		return "auto";
	}
}

export interface GenerateModalResult {
	styleId: string;
	format: NapkinOutputFormat;
	visualQuery?: NapkinVisualQuery;
	colorMode: NapkinColorModeSetting;
	orientation: NapkinOrientation;
	language: string;
	context?: string;
}

type OnConfirm = (result: GenerateModalResult) => void;

export class GenerateDiagramModal extends Modal {
	private readonly settings: ObsidianNapkinSettings;
	private readonly onConfirm: OnConfirm;
	private selectedStyleId: string;
	private selectedFormat: NapkinOutputFormat;
	private selectedVisualQuery: NapkinVisualQuery;
	private selectedColorMode: NapkinColorModeSetting;
	private selectedOrientation: NapkinOrientation;
	private selectedLanguage: string;
	private contextText: string;
	private visualQuerySearch: string;

	constructor(app: App, settings: ObsidianNapkinSettings, onConfirm: OnConfirm) {
		super(app);
		this.settings = settings;
		this.onConfirm = onConfirm;
		this.selectedStyleId = settings.defaultStyle;
		this.selectedFormat = settings.defaultOutputFormat;
		this.selectedVisualQuery = "";
		this.selectedColorMode = settings.defaultColorMode;
		this.selectedOrientation = settings.defaultOrientation;
		this.selectedLanguage = normalizeLanguageSelection(settings.defaultLanguage);
		this.contextText = "";
		this.visualQuerySearch = "";
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
			.setName("Language")
			.setDesc("BCP 47 language tag for generation.")
			.addDropdown((dropdown) => {
				for (const option of NAPKIN_LANGUAGE_OPTIONS) {
					dropdown.addOption(option.value, option.label);
				}

				dropdown
					.setValue(this.selectedLanguage)
					.onChange((value) => {
						this.selectedLanguage = normalizeLanguageSelection(value);
					});
			});

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
							language: this.selectedLanguage,
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
		const searchWrapper = panel.createDiv({ cls: "napkin-visual-query-search-wrapper" });
		const searchInput = searchWrapper.createEl("input", {
			cls: "napkin-visual-query-search",
			attr: {
				type: "text",
				placeholder: "Search by diagram, category, or intent",
			},
		});
		const suggestionList = searchWrapper.createDiv({ cls: "napkin-visual-query-suggestions is-hidden" });
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
			if (isExpanded) {
				window.setTimeout(() => searchInput.focus(), 0);
			}
		};

		const matchesSearch = (groupCategory: string, keywords: string[], query: string): boolean => {
			const normalizedSearch = this.visualQuerySearch.trim().toLowerCase();
			if (!normalizedSearch) {
				return true;
			}

			const label = getVisualQueryLabel(query).toLowerCase();
			const category = groupCategory.toLowerCase();
			const raw = query.toLowerCase();
			return label.includes(normalizedSearch)
				|| raw.includes(normalizedSearch)
				|| category.includes(normalizedSearch)
				|| keywords.some((keyword) => keyword.includes(normalizedSearch));
		};

		const renderSuggestions = (): void => {
			suggestionList.empty();

			const normalizedSearch = this.visualQuerySearch.trim().toLowerCase();
			if (!normalizedSearch) {
				suggestionList.addClass("is-hidden");
				return;
			}

			const matches: Array<{ query: string; category: string }> = [];
			const seen = new Set<string>();

			for (const group of NAPKIN_VISUAL_QUERY_GROUPS) {
				const keywords = (group.keywords ?? []).map((keyword) => keyword.toLowerCase());
				for (const query of group.queries) {
					if (!matchesSearch(group.category, keywords, query)) {
						continue;
					}

					if (seen.has(query)) {
						continue;
					}

					seen.add(query);
					matches.push({ query, category: group.category });
				}
			}

			const limitedMatches = matches.slice(0, 8);
			if (limitedMatches.length === 0) {
				suggestionList.addClass("is-hidden");
				return;
			}

			for (const match of limitedMatches) {
				const button = suggestionList.createEl("button", {
					cls: "napkin-visual-query-suggestion",
					attr: { type: "button" },
				});
				button.createSpan({
					cls: "napkin-visual-query-suggestion-label",
					text: getVisualQueryLabel(match.query),
				});
				button.createSpan({
					cls: "napkin-visual-query-suggestion-category",
					text: match.category,
				});

				button.addEventListener("click", () => {
					this.selectedVisualQuery = match.query;
					this.visualQuerySearch = match.query;
					searchInput.value = match.query;
					renderGroups();
					updateHeader();
					updateActiveState();
					suggestionList.addClass("is-hidden");
				});
			}

			suggestionList.removeClass("is-hidden");
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

		const renderGroups = (): void => {
			groups.empty();
			buttons.length = 0;
			buttons.push(autoButton);

			for (const group of NAPKIN_VISUAL_QUERY_GROUPS) {
				const keywords = (group.keywords ?? []).map((keyword) => keyword.toLowerCase());
				const visibleQueries = group.queries.filter((query) => matchesSearch(group.category, keywords, query));
				if (visibleQueries.length === 0) {
					continue;
				}

				const groupEl = groups.createDiv({ cls: "napkin-visual-query-group" });
				const titleRow = groupEl.createDiv({ cls: "napkin-visual-query-group-title-row" });
				const iconEl = titleRow.createDiv({ cls: "napkin-visual-query-group-icon" });
				setIcon(iconEl, group.icon);
				titleRow.createDiv({
					cls: "napkin-visual-query-group-title",
					text: group.category,
				});

				const chipsEl = groupEl.createDiv({ cls: "napkin-visual-query-chip-grid" });

				for (const query of visibleQueries) {
					const button = chipsEl.createEl("button", {
						cls: "napkin-visual-query-chip",
						text: getVisualQueryLabel(query),
						attr: { type: "button" },
					});

					registerButton(button, query);
				}
			}

			updateActiveState();
		};

		searchInput.addEventListener("input", () => {
			this.visualQuerySearch = searchInput.value;
			renderGroups();
			renderSuggestions();
		});

		searchInput.addEventListener("keydown", (evt) => {
			if (evt.key === "Escape") {
				suggestionList.addClass("is-hidden");
			}
		});

		searchInput.addEventListener("blur", () => {
			window.setTimeout(() => suggestionList.addClass("is-hidden"), 120);
		});

		headerButton.addEventListener("click", () => {
			isExpanded = !isExpanded;
			updateExpandedState();
		});

		renderGroups();
		renderSuggestions();
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

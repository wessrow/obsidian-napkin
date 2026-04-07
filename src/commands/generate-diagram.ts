import { Editor, EditorPosition, MarkdownFileInfo, MarkdownView, Notice, TFile } from "obsidian";
import ObsidianNapkinPlugin from "../main";
import { GenerateDiagramModal, GenerateModalResult } from "../ui/generate-modal";
import { createVisualRequest, pollForCompletion, downloadVisualFile } from "../napkin-api";
import { saveAttachment } from "../utils/vault-helpers";
import { resolveLanguageForRequest } from "../utils/language";

export function registerGenerateDiagramCommand(plugin: ObsidianNapkinPlugin): void {
	plugin.addCommand({
		id: "generate-diagram",
		name: "Generate diagram",
		editorCallback(editor: Editor, ctx: MarkdownView | MarkdownFileInfo) {
			const generationInput = getGenerationInput(plugin, editor, ctx);
			if (!generationInput) {
				return;
			}

			const { selectedText, insertAt, activeFile } = generationInput;

			new GenerateDiagramModal(
				plugin.app,
				plugin.settings,
				(result) => {
					void runGeneration(plugin, editor, activeFile, selectedText, insertAt, result);
				}
			).open();
		},
	});

	plugin.addCommand({
		id: "quick-generate-diagram",
		name: "Quick generate diagram",
		editorCallback(editor: Editor, ctx: MarkdownView | MarkdownFileInfo) {
			const generationInput = getGenerationInput(plugin, editor, ctx);
			if (!generationInput) {
				return;
			}

			const { selectedText, insertAt, activeFile } = generationInput;
			void runGeneration(plugin, editor, activeFile, selectedText, insertAt, {
				styleId: plugin.settings.defaultStyle,
				format: plugin.settings.defaultOutputFormat,
				visualQuery: undefined,
				colorMode: plugin.settings.defaultColorMode,
				orientation: plugin.settings.defaultOrientation,
				language: plugin.settings.defaultLanguage,
				context: undefined,
			});
		},
	});
}

function getGenerationInput(
	plugin: ObsidianNapkinPlugin,
	editor: Editor,
	ctx: MarkdownView | MarkdownFileInfo
): {
	selectedText: string;
	insertAt: EditorPosition;
	activeFile: TFile;
} | null {
	if (!plugin.settings.napkinApiToken) {
		new Notice("Napkin: add your API token in plugin settings.");
		return null;
	}

	if (!editor.somethingSelected()) {
		new Notice("Napkin: select some text first.");
		return null;
	}

	const activeFile = ctx.file;
	if (!activeFile) {
		new Notice("Napkin: could not determine the active file.");
		return null;
	}

	return {
		selectedText: editor.getSelection(),
		insertAt: editor.getCursor("to"),
		activeFile,
	};
}

async function runGeneration(
	plugin: ObsidianNapkinPlugin,
	editor: Editor,
	activeFile: TFile,
	selectedText: string,
	insertAt: EditorPosition,
	result: GenerateModalResult
): Promise<void> {
	const notice = new Notice("Generating diagram…", 0);

	try {
		// 1. Submit request — resolve "auto" colour mode against the live Obsidian theme
		const resolvedColorMode = result.colorMode === "auto"
			? (document.body.classList.contains("theme-dark") ? "dark" : "light")
			: result.colorMode;
		const resolvedLanguage = resolveLanguageForRequest(selectedText, result.language);

		const { id: requestId } = await createVisualRequest(
			plugin.settings.napkinApiToken,
			selectedText,
			result.styleId,
			result.format,
			result.visualQuery,
			resolvedColorMode,
			result.orientation === "auto" ? undefined : result.orientation,
			result.context,
			resolvedLanguage
		);

		// 2. Poll until complete, updating the notice with elapsed time
		const statusResp = await pollForCompletion(
			plugin.settings.napkinApiToken,
			requestId,
			(elapsedSeconds) => {
				notice.messageEl.setText(`Generating diagram… (${elapsedSeconds}s)`);
			}
		);

		const files = statusResp.generated_files ?? [];
		const firstFile = files[0];
		if (!firstFile) {
			throw new Error("No files were generated.");
		}

		// 3. Download the first generated file
		const binary = await downloadVisualFile(
			plugin.settings.napkinApiToken,
			requestId,
			firstFile,
			result.format
		);

		// 4. Save to vault attachment folder
		const savedFile = await saveAttachment(
			plugin.app,
			activeFile.path,
			plugin.settings.outputDirectory,
			plugin.settings.filenamePrefix,
			result.format,
			binary
		);

		// 5. Insert embed on the line below the selection
		editor.replaceRange(`\n![[${savedFile.path}]]`, insertAt);

		notice.hide();
		new Notice(`Diagram saved: ${savedFile.name}`);
	} catch (err) {
		notice.hide();
		const message = err instanceof Error ? err.message : String(err);
		new Notice(`Napkin error: ${message}`, 0);
	}
}

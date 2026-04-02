import { AbstractInputSuggest, App, TFolder } from "obsidian";

export class FolderSuggest extends AbstractInputSuggest<TFolder> {
	constructor(app: App, inputEl: HTMLInputElement) {
		super(app, inputEl);
	}

	getSuggestions(query: string): TFolder[] {
		const normalizedQuery = query.trim().toLowerCase();
		const folders = this.app.vault
			.getAllFolders(false)
			.slice()
			.sort((left, right) => left.path.localeCompare(right.path));

		if (!normalizedQuery) {
			return folders;
		}

		return folders.filter((folder) => {
			const path = folder.path.toLowerCase();
			return path.includes(normalizedQuery);
		});
	}

	renderSuggestion(folder: TFolder, el: HTMLElement): void {
		el.setText(folder.path);
	}
}
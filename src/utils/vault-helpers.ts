import { App, TFile, normalizePath } from "obsidian";
import { NapkinOutputFormat } from "../types";

function resolveAttachmentFolder(app: App, activeFilePath: string): string {
	// Respect Obsidian's configured attachment folder path
	const configured = ((app.vault as unknown as Record<string, unknown>)
		.getConfig as ((key: string) => unknown) | undefined)?.("attachmentFolderPath");
	const setting = typeof configured === "string" ? configured : "";

	if (!setting || setting === "/") {
		// Vault root
		return "";
	}

	if (setting === ".") {
		// Same folder as active file
		const slash = activeFilePath.lastIndexOf("/");
		return slash >= 0 ? normalizePath(activeFilePath.substring(0, slash)) : "";
	}

	if (setting.startsWith("./")) {
		// Subfolder relative to active file's folder
		const slash = activeFilePath.lastIndexOf("/");
		const dir = slash >= 0 ? activeFilePath.substring(0, slash) : "";
		const rel = setting.slice(2);
		return normalizePath(dir ? `${dir}/${rel}` : rel);
	}

	// Fixed absolute path within vault
	return normalizePath(setting);
}

export async function saveAttachment(
	app: App,
	activeFilePath: string,
	filenamePrefix: string,
	format: NapkinOutputFormat,
	data: ArrayBuffer
): Promise<TFile> {
	const folder = resolveAttachmentFolder(app, activeFilePath);

	if (folder && !app.vault.getFolderByPath(folder)) {
		await app.vault.createFolder(folder);
	}

	const filePath = findFreePath(app, folder, filenamePrefix, format);
	return app.vault.createBinary(filePath, data);
}

function findFreePath(
	app: App,
	folder: string,
	prefix: string,
	format: NapkinOutputFormat
): string {
	for (let i = 1; i <= 9999; i++) {
		const name = `${prefix}-${i}.${format}`;
		const path = normalizePath(folder ? `${folder}/${name}` : name);
		if (!app.vault.getFileByPath(path)) {
			return path;
		}
	}
	throw new Error("Could not find a free filename for the attachment.");
}

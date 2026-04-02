import { requestUrl } from "obsidian";
import {
	NapkinOutputFormat,
	NapkinVisualQuery,
	NapkinCreateResponse,
	NapkinStatusResponse,
	NapkinGeneratedFile,
} from "./types";

const API_BASE = "https://api.napkin.ai/v1";
const POLL_INTERVAL_MS = 2500;
const MAX_POLL_ATTEMPTS = 60; // ~2.5 minutes

export async function createVisualRequest(
	token: string,
	content: string,
	styleId: string,
	format: NapkinOutputFormat,
	visualQuery?: NapkinVisualQuery
): Promise<NapkinCreateResponse> {
	const response = await requestUrl({
		url: `${API_BASE}/visual`,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json",
			"Authorization": `Bearer ${token}`,
		},
		body: JSON.stringify({
			content,
			format,
			style_id: styleId || undefined,
			visual_query: visualQuery || undefined,
			language: "en",
		}),
		throw: false,
	});

	if (response.status !== 201) {
		const msg = (response.json as { error?: { message?: string } })?.error?.message
			?? `HTTP ${response.status}`;
		throw new Error(`Napkin API: ${msg}`);
	}

	return response.json as NapkinCreateResponse;
}

export async function pollForCompletion(
	token: string,
	requestId: string,
	onProgress?: (elapsedSeconds: number) => void
): Promise<NapkinStatusResponse> {
	for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
		if (attempt > 0) {
			await sleep(POLL_INTERVAL_MS);
		}

		onProgress?.(Math.round((attempt * POLL_INTERVAL_MS) / 1000));

		const response = await requestUrl({
			url: `${API_BASE}/visual/${requestId}/status`,
			method: "GET",
			headers: {
				"Accept": "application/json",
				"Authorization": `Bearer ${token}`,
			},
			throw: false,
		});

		if (response.status !== 200) {
			throw new Error(`Napkin status check failed: HTTP ${response.status}`);
		}

		const status = response.json as NapkinStatusResponse;

		if (status.status === "completed") {
			return status;
		}

		if (status.status === "failed") {
			const msg = status.error?.message ?? "Unknown error";
			throw new Error(`Napkin: generation failed — ${msg}`);
		}
	}

	throw new Error("Napkin: generation timed out after 2.5 minutes.");
}

export async function downloadVisualFile(
	token: string,
	requestId: string,
	file: NapkinGeneratedFile,
	format: NapkinOutputFormat
): Promise<ArrayBuffer> {
	const fileId = file.id ?? file.file_id ?? "";
	const url = file.url ?? `${API_BASE}/visual/${requestId}/file/${fileId}`;
	const mimeType = format === "svg" ? "image/svg+xml" : "image/png";

	const response = await requestUrl({
		url,
		method: "GET",
		headers: {
			"Accept": mimeType,
			"Authorization": `Bearer ${token}`,
		},
		throw: false,
	});

	if (response.status !== 200) {
		throw new Error(`Napkin: file download failed — HTTP ${response.status}`);
	}

	return response.arrayBuffer;
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => window.setTimeout(resolve, ms));
}

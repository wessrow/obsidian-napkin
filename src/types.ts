export type NapkinOutputFormat = "png" | "svg";
export type NapkinVisualQuery = "timeline" | "mindmap" | "iceberg";

export type NapkinRequestStatus = "pending" | "completed" | "failed";

export interface NapkinStyle {
	id: string;
	name: string;
	category: string;
}

export interface NapkinVisualQueryOption {
	value: NapkinVisualQuery;
	label: string;
	description: string;
	icon: string;
}

export interface NapkinGeneratedFile {
	id?: string;
	file_id?: string;
	url?: string;
	format?: string;
}

export interface NapkinCreateResponse {
	id: string;
	status: NapkinRequestStatus;
}

export interface NapkinStatusResponse {
	id: string;
	status: NapkinRequestStatus;
	generated_files?: NapkinGeneratedFile[];
	error?: { message?: string };
}

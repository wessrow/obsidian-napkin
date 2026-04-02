export type NapkinOutputFormat = "png" | "svg";
export type NapkinVisualQuery = string;
export type NapkinColorMode = "light" | "dark";
export type NapkinColorModeSetting = "auto" | NapkinColorMode;
export type NapkinOrientation = "auto" | "horizontal" | "vertical" | "square";

export type NapkinRequestStatus = "pending" | "completed" | "failed";

export interface NapkinStyle {
	id: string;
	name: string;
	category: string;
}

export interface NapkinVisualQueryGroup {
	category: string;
	queries: NapkinVisualQuery[];
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

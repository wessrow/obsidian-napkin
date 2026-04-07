import { franc } from "franc-min";

const DEFAULT_LANGUAGE_TAG = "en-US";

export const NAPKIN_LANGUAGE_OPTIONS: Array<{ value: string; label: string }> = [
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

// Maps ISO 639-3 output from franc to stable BCP 47 tags accepted by Napkin.
const ISO3_TO_BCP47: Record<string, string> = {
	arb: "ar-SA",
	ben: "bn-BD",
	bul: "bg-BG",
	cat: "ca-ES",
	ces: "cs-CZ",
	dan: "da-DK",
	deu: "de-DE",
	ell: "el-GR",
	eng: "en-US",
	esp: "es-ES",
	spa: "es-ES",
	est: "et-EE",
	fin: "fi-FI",
	fra: "fr-FR",
	nld: "nl-NL",
	heb: "he-IL",
	hin: "hi-IN",
	hrv: "hr-HR",
	hun: "hu-HU",
	ind: "id-ID",
	ita: "it-IT",
	jpn: "ja-JP",
	kor: "ko-KR",
	lit: "lt-LT",
	lav: "lv-LV",
	msa: "ms-MY",
	nor: "nb-NO",
	pol: "pl-PL",
	por: "pt-PT",
	ron: "ro-RO",
	rus: "ru-RU",
	slk: "sk-SK",
	slv: "sl-SI",
	swe: "sv-SE",
	tam: "ta-IN",
	tel: "te-IN",
	tha: "th-TH",
	tur: "tr-TR",
	ukr: "uk-UA",
	urd: "ur-PK",
	vie: "vi-VN",
	yue: "zh-HK",
	zho: "zh-CN",
};

export function normalizeLanguageTagOrAuto(value: string | undefined | null): string {
	const trimmed = (value ?? "").trim();
	if (!trimmed || trimmed.toLowerCase() === "auto") {
		return "auto";
	}

	try {
		const [canonical] = Intl.getCanonicalLocales(trimmed);
		return canonical ?? trimmed;
	} catch {
		return trimmed;
	}
}

export function normalizeLanguageSelection(value: string | undefined | null): string {
	const normalized = normalizeLanguageTagOrAuto(value);
	return SUPPORTED_LANGUAGE_TAGS.has(normalized) ? normalized : "auto";
}

export function resolveLanguageForRequest(selection: string, configuredLanguage: string): string {
	const normalized = normalizeLanguageTagOrAuto(configuredLanguage);
	if (normalized !== "auto") {
		return normalized;
	}

	return detectLanguageTag(selection);
}

function detectLanguageTag(text: string): string {
	const sample = text.trim();
	if (sample.length < 24) {
		return DEFAULT_LANGUAGE_TAG;
	}

	const detected = franc(sample, { minLength: 24 });
	if (!detected || detected === "und") {
		return DEFAULT_LANGUAGE_TAG;
	}

	return ISO3_TO_BCP47[detected] ?? DEFAULT_LANGUAGE_TAG;
}

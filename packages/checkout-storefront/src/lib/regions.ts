export const locales = ["en-US"] as const;

export const DEFAULT_LOCALE = "en-US";

export const DEFAULT_CHANNEL = "dealer-channel";

export type Locale = typeof locales[number];

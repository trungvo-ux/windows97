export const appIds = [
  "finder",
  "internet-explorer",
  "textedit",
  "paint",
  "photo-booth",
  "ipod",
  "synth",
  "pc",
  "terminal",
  "aol",
  "control-panels",
] as const;

export type AppId = (typeof appIds)[number];

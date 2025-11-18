export const appIds = [
  "finder",
  "soundboard",
  "internet-explorer",
  "chats",
  "textedit",
  "paint",
  "photo-booth",
  "minesweeper",
  "blackjack",
  "videos",
  "ipod",
  "synth",
  "pc",
  "terminal",
  "applet-viewer",
  "control-panels",
] as const;

export type AppId = (typeof appIds)[number];

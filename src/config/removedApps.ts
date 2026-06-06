import { appRegistry } from "@/config/appRegistry";

/** App IDs removed from the OS — shortcuts/aliases should be purged. */
export const REMOVED_APP_IDS = new Set([
  "chats",
  "soundboard",
  "videos",
  "minesweeper",
  "blackjack",
  "baccarat",
  "texas-holdem",
  "3-card-poker",
  "craps",
  "slots",
  "casino",
  "applet-viewer",
]);

export function isRemovedAppAlias(item: {
  aliasType?: string;
  aliasTarget?: string;
}): boolean {
  if (item.aliasType !== "app" || !item.aliasTarget) return false;
  return (
    REMOVED_APP_IDS.has(item.aliasTarget) ||
    !(item.aliasTarget in appRegistry)
  );
}

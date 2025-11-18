import { BaseApp } from "../base/types";
import { BlackjackAppComponent } from "./components/BlackjackAppComponent";

export const appMetadata: BaseApp["metadata"] = {
  name: "Blackjack",
  version: "1.0.0",
  creator: {
    name: "Ryo Lu",
    url: "https://ryo.lu",
  },
  github: "https://github.com/ryokun6/ryos",
  icon: "/icons/default/minesweeper.png", // Using minesweeper icon as placeholder
};

export const helpItems: BaseApp["helpItems"] = [
  {
    icon: "🃏",
    title: "Game Rules",
    description:
      "Get as close to 21 as possible without going over. Face cards are worth 10, Aces are worth 1 or 11.",
  },
  {
    icon: "👆",
    title: "Hit",
    description: "Take another card to get closer to 21.",
  },
  {
    icon: "✋",
    title: "Stand",
    description: "Keep your current hand and let the dealer play.",
  },
  {
    icon: "💰",
    title: "Betting",
    description: "Place your bet before each hand. Win to double your bet!",
  },
  {
    icon: "🎯",
    title: "Winning",
    description:
      "Beat the dealer by having a higher hand without going over 21, or if the dealer busts.",
  },
];

export const BlackjackApp: BaseApp = {
  id: "blackjack",
  name: "Blackjack",
  icon: { type: "image", src: "/icons/default/minesweeper.png" },
  description: "Classic casino blackjack game",
  component: BlackjackAppComponent,
  helpItems,
  metadata: appMetadata,
};


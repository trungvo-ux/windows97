import { BaseApp } from "../base/types";
import { AolAppComponent } from "./components/AolAppComponent";

export const helpItems = [
  {
    icon: "📬",
    title: "You've Got Mail",
    description:
      "Open Mail to read design updates, career milestones, and project announcements.",
  },
  {
    icon: "👥",
    title: "Buddy List",
    description:
      "Use People to view online contacts, away messages, and nostalgic presence states.",
  },
  {
    icon: "🔎",
    title: "Keyword Search",
    description:
      "Search AOL Keywords like PORTFOLIO, PROJECTS, ABOUTME, or CONTACT.",
  },
  {
    icon: "🗂️",
    title: "AOL Channels",
    description:
      "Browse the crowded AOL Home directory for news, shopping, games, computing, and member services.",
  },
];

export const appMetadata = {
  version: "1.0",
  name: "AOL Online",
  creator: {
    name: "Trung Vo",
    url: "https://trungvo.xyz",
  },
  github: "https://github.com/trungvo",
  icon: "/icons/default/aol-online.png",
};

export const AolApp: BaseApp = {
  id: "aol",
  name: "AOL Online",
  icon: { type: "image", src: appMetadata.icon },
  description: "Dial up to an AOL 4.0/5.0-inspired desktop client",
  component: AolAppComponent,
  helpItems,
  metadata: appMetadata,
};

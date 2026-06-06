import { BaseApp } from "../base/types";
import { TerminalAppComponent } from "./components/TerminalAppComponent";

export const TerminalApp: BaseApp = {
  id: "terminal",
  name: "Terminal",
  icon: {
    type: "image",
    src: "/icons/default/terminal.png",
  },
  description: "Command Prompt for TrungvOS — navigate files and run commands",
  component: TerminalAppComponent,
  helpItems: [
    {
      icon: "💻",
      title: "Basic Commands",
      description:
        "Use commands like ls, cd, cat, pwd, clear, and touch to navigate and manage files.",
    },
    {
      icon: "🧭",
      title: "Navigation",
      description:
        "Browse the same virtual file system as Finder with familiar Unix commands.",
    },
    {
      icon: "⌨️",
      title: "Command History",
      description:
        "Press ↑ / ↓ arrows to cycle through previous commands and re-run them quickly.",
    },
    {
      icon: "🤖",
      title: "AI Assistant",
      description:
        'Type "ryo &lt;prompt&gt;" to chat with Ryo AI directly inside the terminal.',
    },
    {
      icon: "📝",
      title: "File Editing",
      description:
        "Open documents in TextEdit (edit) or Vim-style editor (vim) right from the prompt.",
    },
    {
      icon: "🔊",
      title: "Terminal Sounds",
      description:
        "Distinct sounds for output, errors & AI replies. Toggle in View ▸ Sounds.",
    },
  ],
  metadata: {
    name: "Command Prompt",
    version: "1.0",
    creator: {
      name: "Trung Vo",
      url: "https://trungvo.xyz",
    },
    github: "https://github.com/trungvo",
    icon: "/icons/default/terminal.png",
  },
};

export const appMetadata = TerminalApp.metadata;
export const helpItems = TerminalApp.helpItems;

import { CSSProperties, FormEvent, useEffect, useMemo, useState } from "react";
import { AppProps } from "@/apps/base/types";
import { WindowFrame } from "@/components/layout/WindowFrame";
import { Sounds, useSound } from "@/hooks/useSound";

type PanelType =
  | "mail"
  | "people"
  | "portfolio"
  | "case-studies"
  | "contact"
  | "about"
  | "work"
  | "channel"
  | "search";

interface AolPanel {
  id: number;
  type: PanelType;
  title: string;
  query?: string;
}

const dialSteps = [
  "Opening modem...",
  "Dialing...",
  "Verifying username...",
  "Establishing connection...",
  "Connected",
] as const;

const channelItems = [
  "Welcome",
  "Computing",
  "Entertainment",
  "Families",
  "Games",
  "Health",
  "Influence",
  "Interests",
  "International",
  "Kids Only",
  "Lifestyles",
  "Local",
  "News",
  "Personal Finance",
  "Research & Learn",
  "Shopping",
  "Sports",
  "Travel",
  "WorkPlace",
] as const;

const toolbarItems: Array<{
  label: string;
  bg: string;
  icon: string;
  action?: PanelType;
}> = [
  { label: "Read", bg: "#0066cc", icon: "📬", action: "mail" },
  { label: "Write", bg: "#0066cc", icon: "✉️" },
  { label: "Mail Center", bg: "#0066cc", icon: "📭", action: "mail" },
  { label: "Print", bg: "#0066cc", icon: "🖨️" },
  { label: "My Files", bg: "#009999", icon: "📁" },
  { label: "My AOL", bg: "#009999", icon: "👤", action: "about" },
  { label: "Favorites", bg: "#009999", icon: "⭐" },
  { label: "Internet", bg: "#6633cc", icon: "🌐" },
  { label: "Channels", bg: "#6633cc", icon: "📺", action: "channel" },
  { label: "People", bg: "#6633cc", icon: "👥", action: "people" },
];

const todayStories = [
  {
    title: "New Music: Listen to clips from the latest chart-toppers",
    body: "Hear 30-second previews from this week's Top 40 before you buy.",
  },
  {
    title: "Design Systems: Building UI for the enterprise web",
    body: "Member spotlight on scalable patterns for complex product workflows.",
  },
  {
    title: "Attention Sports Fans!",
    body: "Live scores, fantasy leagues, and chat with fans in the Sports channel.",
  },
  {
    title: "8 Easy Steps to Car-Buying",
    body: "Research, compare, and negotiate your next ride with AOL Auto Center.",
  },
];

const topNewsItems = [
  "Tech stocks rally on strong earnings reports",
  "Summer travel deals now live on AOL Travel",
  "New parental controls available in Member Services",
  "Chat tonight: Retro Computing at 9 PM Eastern",
];

const buddyGroups = [
  {
    name: "design-friends",
    label: "design-friends",
    count: "2/8",
    members: [
      { name: "PixelCourier", status: "away" as const },
      { name: "DesignDesk", status: "online" as const },
    ],
  },
  {
    name: "portfolio-pals",
    label: "portfolio-pals",
    count: "2/5",
    members: [
      { name: "DataBuddy", status: "idle" as const },
      { name: "HomeBase", status: "online" as const },
    ],
  },
];

const channelCards: Array<{
  title: string;
  type: PanelType;
  color: string;
  description: string;
  meta: string;
}> = [
  {
    title: "Welcome to AOL",
    type: "channel",
    color: "bg-[#ffea00]",
    description:
      "Start here for mail, chat rooms, member services, downloads, weather, and today's headlines.",
    meta: "AOL Home",
  },
  {
    title: "Featured Channels",
    type: "channel",
    color: "bg-[#00d7ff]",
    description:
      "Explore News, Sports, Finance, Shopping, Travel, Games, Computing, and Kids Only.",
    meta: "Editor picks",
  },
  {
    title: "AOL News",
    type: "channel",
    color: "bg-[#ff66cc]",
    description:
      "Breaking stories, local updates, technology reports, market notes, and entertainment gossip.",
    meta: "Top stories",
  },
  {
    title: "What's New",
    type: "channel",
    color: "bg-[#5cff63]",
    description:
      "New downloads, chat events, message boards, screen names, and featured communities.",
    meta: "Daily update",
  },
  {
    title: "Member Services",
    type: "channel",
    color: "bg-[#ff9b37]",
    description:
      "Billing, parental controls, screen name settings, help, preferences, and account tools.",
    meta: "Account help",
  },
  {
    title: "AOL Marketplace",
    type: "channel",
    color: "bg-[#cc99ff]",
    description:
      "Shop electronics, books, travel deals, software downloads, and featured partner offers.",
    meta: "Sponsored",
  },
];

const projects = [
  {
    name: "watsonx.data UX",
    tag: "Enterprise AI",
    description:
      "Dense data workflows, AI-assisted administration, and product patterns for technical users.",
  },
  {
    name: "TrungVOs",
    tag: "Personal OS",
    description:
      "A nostalgic browser desktop with apps, files, themes, and playful retro interactions.",
  },
  {
    name: "Immersive Portfolio",
    tag: "3D Web",
    description:
      "Spatial storytelling experiments with motion, sound, and artifact-driven navigation.",
  },
];

const mailItems = [
  {
    from: "AOL Welcome",
    subject: "You've Got Mail!",
    body: "Welcome back to America Online. Your mailbox, favorite places, and buddy list are ready.",
  },
  {
    from: "Member Services",
    subject: "New features in AOL 5.0",
    body: "Try improved Keyword search, updated channels, faster mail, and easier People Connection tools.",
  },
  {
    from: "AOL Channels",
    subject: "Tonight on AOL",
    body: "Chat events, downloads, news headlines, shopping deals, and staff picks are now live.",
  },
];

const buddies = [
  { group: "Friends", name: "Ryo", status: "online", note: "making weird computers" },
  { group: "Friends", name: "PixelCourier", status: "away", note: "brb uploading gifs" },
  { group: "Family", name: "HomeBase", status: "online", note: "send photos!" },
  { group: "Co-workers", name: "DesignDesk", status: "online", note: "reviewing flows" },
  { group: "Co-workers", name: "DataBuddy", status: "idle", note: "in a meeting" },
];

const caseStudyGroups = [
  {
    title: "Research and Strategy",
    items: ["User journey mapping", "Workflow audits", "Opportunity framing"],
  },
  {
    title: "Design Systems",
    items: ["Token architecture", "Component governance", "Enterprise patterns"],
  },
  {
    title: "Prototypes",
    items: ["AI task flows", "Immersive web demos", "Retro desktop interactions"],
  },
];

const winButton =
  "border border-black bg-[#c0c0c0] px-2 py-0.5 text-[11px] leading-4 shadow-[inset_1px_1px_#fff,inset_-1px_-1px_#808080] active:shadow-[inset_1px_1px_#808080,inset_-1px_-1px_#fff]";

const panelChrome =
  "border-2 border-[#808080] bg-[#c0c0c0] shadow-[2px_2px_0_#000] font-geneva-12 text-[11px]";

const formatElapsed = (start: number | null, now: number) => {
  if (!start) return "00:00";
  const seconds = Math.max(0, Math.floor((now - start) / 1000));
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
};

function AolTriangleLogo({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <img
      src="/icons/default/aol-online.png"
      alt="AOL"
      className={`${className} object-contain`}
      draggable={false}
    />
  );
}

function ToolbarIcon({
  label,
  bg,
  icon,
  onClick,
}: {
  label: string;
  bg: string;
  icon: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className="flex w-[52px] shrink-0 flex-col items-center border border-[#808080] bg-[#c0c0c0] p-0.5 shadow-[inset_1px_1px_#fff,inset_-1px_-1px_#808080] active:shadow-[inset_1px_1px_#808080,inset_-1px_-1px_#fff]"
      onClick={onClick}
    >
      <div
        className="grid h-8 w-full place-items-center text-base leading-none"
        style={{ backgroundColor: bg }}
      >
        {icon}
      </div>
      <span className="mt-0.5 w-full truncate text-center text-[9px] leading-none">
        {label}
      </span>
    </button>
  );
}

function ServiceStripButton({
  label,
  icon,
  onClick,
  highlight,
}: {
  label: string;
  icon: string;
  onClick?: () => void;
  highlight?: boolean;
}) {
  return (
    <button
      type="button"
      className={`flex w-full flex-col items-center border-b border-[#004080] px-1 py-1.5 text-white ${
        highlight ? "bg-[#004080]" : "bg-[#0066cc] hover:bg-[#0055aa]"
      }`}
      onClick={onClick}
    >
      <span className="text-lg leading-none">{icon}</span>
      <span className="mt-0.5 text-center text-[8px] leading-tight">{label}</span>
    </button>
  );
}

function BuddyListPanel({
  onOpenPeople,
}: {
  onOpenPeople: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"online" | "all">("online");

  return (
    <div className="flex min-h-0 w-[148px] shrink-0 flex-col border-2 border-[#808080] bg-[#c0c0c0] shadow-[2px_2px_0_#000]">
      <div className="flex h-5 items-center bg-[#000080] px-1 text-[10px] font-bold text-white">
        Buddy List
      </div>
      <div className="flex border-b border-[#808080] bg-[#dcdcdc]">
        {(["online", "all"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            className={`flex-1 border-r border-[#808080] px-1 py-0.5 text-[9px] last:border-r-0 ${
              activeTab === tab
                ? "bg-white font-bold"
                : "bg-[#c0c0c0] shadow-[inset_1px_1px_#808080]"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "online" ? "Buddies Online" : "All Buddies"}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-auto bg-white p-1">
        {buddyGroups.map((group) => (
          <div key={group.name} className="mb-1">
            <div className="bg-[#000080] px-1 py-0.5 text-[9px] font-bold text-white">
              {group.label} ({group.count})
            </div>
            {group.members
              .filter(
                (member) =>
                  activeTab === "all" || member.status === "online"
              )
              .map((member) => (
                <button
                  key={member.name}
                  type="button"
                  className="flex w-full items-center gap-1 border-b border-[#e0e0e0] px-1 py-0.5 text-left text-[10px] hover:bg-[#000080] hover:text-white"
                  onClick={onOpenPeople}
                >
                  <span
                    className={`h-2 w-2 shrink-0 border border-black ${
                      member.status === "online"
                        ? "bg-[#00cc00]"
                        : member.status === "away"
                          ? "bg-[#ffff00]"
                          : "bg-[#ff9900]"
                    }`}
                  />
                  {member.name}
                </button>
              ))}
          </div>
        ))}
      </div>
      <div className="flex border-t border-[#808080] bg-[#dcdcdc]">
        {["Locate", "IM", "Setup", "Buddy Chat"].map((action) => (
          <button
            key={action}
            type="button"
            className={`${winButton} flex-1 px-0.5 py-1 text-[8px]`}
            onClick={onOpenPeople}
          >
            {action}
          </button>
        ))}
      </div>
      <div className="border-t border-[#808080] bg-[#c0c0c0] px-1 py-0.5 text-[9px]">
        Keyword: BuddyView
      </div>
    </div>
  );
}

function SignOnScreen({ onSignOn }: { onSignOn: () => void }) {
  const [memberName, setMemberName] = useState("TrungVo98");

  return (
    <div className="flex h-full items-center justify-center bg-[#008080] font-geneva-12 text-[11px] text-black">
      <div className={`${panelChrome} w-[410px] max-w-[92%]`}>
        <div className="flex h-5 items-center bg-[#000080] px-1 font-bold text-white">
          America Online - Sign On
        </div>
        <div className="border-t border-white p-3">
          <div className="mb-3 flex items-center gap-3 border-2 border-[#808080] bg-white p-3">
            <AolTriangleLogo className="h-16 w-16" />
            <div>
              <div className="text-[28px] font-black leading-none text-[#003399]">
                America Online
              </div>
              <div className="mt-1 text-[12px]">Version 5.0 for Windows 98</div>
            </div>
          </div>
          <label className="mb-3 grid grid-cols-[96px_1fr] items-center gap-2">
            <span>Member Name:</span>
            <input
              className="h-6 border border-[#808080] bg-white px-1 shadow-[inset_1px_1px_#000]"
              value={memberName}
              autoComplete="username"
              onChange={(event) => setMemberName(event.target.value)}
            />
          </label>
          <div className="flex items-center justify-between">
            <button className={winButton}>Setup...</button>
            <div className="flex gap-2">
              <button className={winButton}>Cancel</button>
              <button
                className={`${winButton} min-w-20 font-bold`}
                onClick={onSignOn}
                disabled={!memberName.trim()}
              >
                Sign On
              </button>
            </div>
          </div>
          <div className="mt-3 border border-[#808080] bg-[#fffbcc] p-2">
            Tip: choose Sign On to hear your modem handshake with cyberspace.
          </div>
        </div>
      </div>
    </div>
  );
}

function DialUpScreen({
  stepIndex,
  onSkip,
}: {
  stepIndex: number;
  onSkip: () => void;
}) {
  const progress = ((stepIndex + 1) / dialSteps.length) * 100;

  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#008080] font-geneva-12 text-[12px] text-black">
      <div className="relative w-[430px] max-w-[90%] border-2 border-[#808080] bg-[#c0c0c0] p-3 shadow-[4px_4px_0_#000]">
        <div className="mb-3 flex items-center gap-3 border-2 border-[#808080] bg-white p-2">
          <AolTriangleLogo className="h-14 w-14" />
          <div>
            <div className="text-[26px] font-black leading-none tracking-tight text-[#003399]">
              America Online
            </div>
            <div className="text-[11px]">Connecting to America Online...</div>
          </div>
        </div>
        <div className={`${panelChrome} p-3 text-black`}>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-bold">Connecting to America Online...</span>
            <span>56K</span>
          </div>
          <div className="mb-2 border border-[#808080] bg-white p-2">
            {dialSteps[stepIndex]}
          </div>
          <div className="mb-3 h-4 border border-black bg-white p-[1px]">
            <div
              className="h-full bg-[#000080]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between">
            <span>Modem: Generic Hayes Compatible</span>
            <button className={winButton} onClick={onSkip}>
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AolPanelWindow({
  panel,
  index,
  isActive,
  onClose,
  onFocus,
}: {
  panel: AolPanel;
  index: number;
  isActive: boolean;
  onClose: (id: number) => void;
  onFocus: (id: number) => void;
}) {
  const style: CSSProperties = {
    left: 34 + index * 26,
    top: 46 + index * 22,
    zIndex: isActive ? 30 : 20 + index,
  };

  return (
    <div
      className={`${panelChrome} absolute w-[360px] max-w-[calc(100%-32px)]`}
      style={style}
      onMouseDown={() => onFocus(panel.id)}
    >
      <div className="flex h-5 items-center justify-between bg-[#000080] px-1 text-white">
        <span className="truncate font-bold">{panel.title}</span>
        <button
          className="grid h-4 w-4 place-items-center border border-black bg-[#c0c0c0] text-[10px] leading-none text-black"
          onClick={() => onClose(panel.id)}
          aria-label={`Close ${panel.title}`}
        >
          x
        </button>
      </div>
      <div className="max-h-[310px] overflow-auto border-t border-white bg-[#f4f4f4] p-2">
        <PanelContent panel={panel} />
      </div>
    </div>
  );
}

function PanelContent({ panel }: { panel: AolPanel }) {
  if (panel.type === "mail") {
    return (
      <div>
        <div className="mb-2 border-2 border-[#000080] bg-[#fffbcc] p-2 text-center text-base font-black text-[#000080]">
          You've Got Mail
        </div>
        <div className="mb-2 flex gap-1">
          {["Inbox", "Sent", "Drafts"].map((folder, index) => (
            <button
              key={folder}
              className={`${winButton} ${index === 0 ? "bg-white" : ""}`}
            >
              {folder}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {mailItems.map((item) => (
            <div
              key={item.subject}
              className="grid grid-cols-[78px_1fr] border border-[#808080] bg-white"
            >
              <div className="border-r border-[#808080] bg-[#e8e8e8] p-2 font-bold">
                {item.from}
              </div>
              <div className="p-2">
              <div className="font-bold">
                  {item.subject}
              </div>
              <p className="mt-1">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (panel.type === "people") {
    const groups = ["Friends", "Family", "Co-workers"];

    return (
      <div>
        <div className="mb-2 bg-[#000080] px-2 py-1 font-bold text-white">
          People Connection - Buddy List
        </div>
        {groups.map((group) => (
          <div key={group} className="mb-2 border border-[#808080] bg-white">
            <div className="bg-[#dcdcdc] px-1 py-0.5 font-bold">[-] {group}</div>
            {buddies
              .filter((buddy) => buddy.group === group)
              .map((buddy) => (
                <div
                  key={buddy.name}
                  className="flex items-start gap-2 border-t border-[#c0c0c0] p-1"
                >
                  <span
                    className={`mt-1 h-2 w-2 border border-black ${
                      buddy.status === "online"
                        ? "bg-[#00cc00]"
                        : buddy.status === "away"
                        ? "bg-[#ffff00]"
                        : "bg-[#ff9900]"
                    }`}
                  />
                  <div>
                    <div className="font-bold">
                      {buddy.name}{" "}
                      <span className="font-normal">({buddy.status})</span>
                    </div>
                    <div>{buddy.note}</div>
                  </div>
                </div>
              ))}
          </div>
        ))}
        <div className="border border-[#808080] bg-[#fffbcc] p-2">
          Double-click a buddy to view their profile card, send IM, or invite
          them to a chat room.
        </div>
      </div>
    );
  }

  if (panel.type === "channel") {
    return (
      <div className="space-y-2">
        <div className="border-2 border-[#000080] bg-[#fffbcc] p-2">
          <div className="text-sm font-black text-[#000080]">
            AOL Keyword: {panel.query || panel.title}
          </div>
          <p>
            This AOL channel is loading headlines, message boards, downloads,
            partner links, member chats, and staff picks.
          </p>
        </div>
        {["Top Stories", "Message Boards", "Downloads", "Chat Tonight"].map(
          (item) => (
            <div key={item} className="border border-[#808080] bg-white p-2">
              <div className="font-bold text-[#000080]">{item}</div>
              <p>
                Classic AOL-style channel content with tight copy, banners,
                links, and lots of tiny boxes.
              </p>
            </div>
          )
        )}
      </div>
    );
  }

  if (panel.type === "search") {
    const keyword = (panel.query || "").replace(/\s+/g, "").toUpperCase();
    const keywordMap: Record<string, PanelType> = {
      PORTFOLIO: "portfolio",
      PROJECTS: "portfolio",
      ABOUTME: "about",
      CONTACT: "contact",
    };
    const mappedType = keywordMap[keyword];

    if (mappedType) {
      return (
        <div className="space-y-2">
          <div className="border-2 border-[#000080] bg-[#fffbcc] p-2">
            <div className="text-sm font-black text-[#000080]">
              AOL Keyword: {keyword}
            </div>
            <p>
              You have entered a member-created AOL channel. Portfolio content
              appears here as a keyword page, not on AOL Home.
            </p>
          </div>
          <PanelContent panel={{ ...panel, type: mappedType }} />
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="border border-[#808080] bg-white p-2">
          Keyword results for <span className="font-bold">{panel.query}</span>
        </div>
        {channelCards.map((card) => (
          <div key={card.title} className="border border-[#808080] bg-white p-2">
            <div className="font-bold text-[#000080]">{card.title}</div>
            <p>{card.description}</p>
          </div>
        ))}
        <div className="border border-[#808080] bg-[#fffbcc] p-2">
          Portfolio keywords: PORTFOLIO, PROJECTS, ABOUTME, CONTACT.
        </div>
      </div>
    );
  }

  if (panel.type === "about") {
    return (
      <div className="space-y-2">
        <div className="border border-[#808080] bg-white p-2">
          <div className="font-bold text-[#000080]">Member Profile</div>
          <p>
            Trung Vo is a product designer focused on enterprise AI workflows,
            design systems, immersive prototypes, and expressive web interfaces.
          </p>
        </div>
        <div className="border border-[#808080] bg-[#fffbcc] p-2">
          AOL-style profile pages keep member information tucked behind Keyword
          search, just like the old service directories.
        </div>
      </div>
    );
  }

  if (panel.type === "contact") {
    return (
      <div className="space-y-2">
        {[
          ["Email", "hello@trungvo.xyz"],
          ["LinkedIn", "linkedin.com/in/trungvo"],
          ["Portfolio", "trungvo.xyz"],
          ["Resume", "Available on request"],
        ].map(([label, value]) => (
          <div key={label} className="border border-[#808080] bg-white p-2">
            <span className="font-bold">{label}: </span>
            {value}
          </div>
        ))}
      </div>
    );
  }

  if (panel.type === "portfolio") {
    return (
      <div className="grid gap-2">
        {projects.map((project) => (
          <div
            key={project.name}
            className="grid grid-cols-[54px_1fr] gap-2 border border-[#808080] bg-white p-2"
          >
            <div className="grid h-12 place-items-center border border-black bg-[#00d7ff] font-black">
              {project.name.slice(0, 2)}
            </div>
            <div>
              <div className="font-bold text-[#000080]">{project.name}</div>
              <div className="mb-1 inline-block bg-[#ffea00] px-1">
                {project.tag}
              </div>
              <p>{project.description}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (panel.type === "case-studies") {
    return (
      <div className="space-y-2">
        {caseStudyGroups.map((group) => (
          <div key={group.title} className="border border-[#808080] bg-white">
            <div className="bg-[#cc0000] px-2 py-1 font-bold text-white">
              {group.title}
            </div>
            <ul className="list-square p-2 pl-5">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  if (panel.type === "work") {
    return (
      <div className="space-y-2">
        <div className="border border-[#808080] bg-white p-2">
          <div className="font-bold text-[#000080]">Product Designer, IBM</div>
          <p>
            Designing AI-native workflows for watsonx.data with emphasis on
            enterprise clarity, operational trust, and scalable product systems.
          </p>
        </div>
        <div className="border border-[#808080] bg-white p-2">
          <div className="font-bold text-[#000080]">Independent Experiments</div>
          <p>
            Building retro OS interfaces, immersive portfolio systems, and
            expressive prototypes that make technical ideas feel tangible.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="border border-[#808080] bg-white p-2">
        <div className="font-bold text-[#000080]">AOL Channel</div>
        <p>
          This area is available through AOL Keyword search and channel links.
        </p>
      </div>
    </div>
  );
}

export function AolAppComponent({
  isForeground = true,
  onClose,
  skipInitialSound,
  instanceId,
  onNavigateNext,
  onNavigatePrevious,
}: AppProps) {
  const { play: playClick } = useSound(Sounds.BUTTON_CLICK, 0.18);
  const { play: playMail } = useSound(Sounds.ALERT_INDIGO, 0.25);
  const [connectionPhase, setConnectionPhase] = useState<
    "signon" | "dialing" | "connected"
  >("signon");
  const [dialStep, setDialStep] = useState(0);
  const [connectedAt, setConnectedAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [activeChannel, setActiveChannel] = useState("Welcome");
  const [keyword, setKeyword] = useState("");
  const [panels, setPanels] = useState<AolPanel[]>([]);
  const [activePanelId, setActivePanelId] = useState<number | null>(null);

  useEffect(() => {
    if (connectionPhase !== "dialing") return;
    setDialStep(0);
    const interval = window.setInterval(() => {
      setDialStep((current) => {
        if (current >= dialSteps.length - 1) {
          window.clearInterval(interval);
          window.setTimeout(() => {
            setConnectionPhase("connected");
            setConnectedAt(Date.now());
          }, 450);
          return current;
        }
        return current + 1;
      });
    }, 850);

    return () => window.clearInterval(interval);
  }, [connectionPhase]);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const unreadMail = 3 + panels.filter((panel) => panel.type === "mail").length;

  const openPanel = (type: PanelType, query?: string) => {
    void playClick({ suppressError: true });
    if (type === "mail") {
      void playMail({ suppressError: true });
    }
    const panelTitle: Record<PanelType, string> = {
      mail: "Mailbox - You've Got Mail",
      people: "People Connection",
      portfolio: "Portfolio Directory",
      "case-studies": "Case Study Center",
      contact: "Contact Information",
      about: "About Me",
      work: "Work Experience",
      channel: `AOL Channel: ${query || "Home"}`,
      search: `Keyword Search: ${query || "AOL"}`,
    };
    const id = Date.now();
    setPanels((current) => [
      ...current,
      { id, type, title: panelTitle[type], query },
    ]);
    setActivePanelId(id);
  };

  const statusText = useMemo(
    () =>
      connectionPhase === "connected"
        ? `Connected | 56k Modem | Online ${formatElapsed(connectedAt, now)} | Mail: ${unreadMail}`
        : dialSteps[dialStep],
    [connectedAt, connectionPhase, dialStep, now, unreadMail]
  );

  const submitKeyword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = keyword.trim();
    if (!query) return;
    openPanel("search", query);
  };

  return (
    <>
      <WindowFrame
        appId="aol"
        title="America Online"
        onClose={onClose}
        isForeground={isForeground}
        skipInitialSound={skipInitialSound}
        instanceId={instanceId}
        onNavigateNext={onNavigateNext}
        onNavigatePrevious={onNavigatePrevious}
      >
        {connectionPhase === "signon" ? (
          <SignOnScreen onSignOn={() => setConnectionPhase("dialing")} />
        ) : connectionPhase === "dialing" ? (
          <DialUpScreen
            stepIndex={dialStep}
            onSkip={() => {
              setConnectionPhase("connected");
              setConnectedAt(Date.now());
            }}
          />
        ) : (
          <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-[#c0c0c0] font-geneva-12 text-[11px] text-black">
            {/* Icon toolbar row */}
            <div className="flex shrink-0 items-stretch gap-0.5 overflow-x-auto border-b border-[#808080] bg-[#d4d0c8] px-0.5 py-0.5">
              {toolbarItems.map((item) => (
                <ToolbarIcon
                  key={item.label}
                  label={item.label}
                  bg={item.bg}
                  icon={item.icon}
                  onClick={
                    item.action
                      ? () => openPanel(item.action!, item.label)
                      : undefined
                  }
                />
              ))}
              <button
                type="button"
                className="ml-auto flex h-[52px] w-[52px] shrink-0 items-center justify-center border border-[#808080] bg-[#0066cc] shadow-[inset_1px_1px_#fff,inset_-1px_-1px_#808080]"
                onClick={() => openPanel("channel", "Welcome")}
              >
                <AolTriangleLogo className="h-10 w-10" />
              </button>
            </div>

            {/* Navigation / keyword bar */}
            <div className="flex shrink-0 flex-wrap items-center gap-1 border-b border-[#808080] bg-[#d4d0c8] px-1 py-0.5">
              {["Back", "Forward", "Stop", "Home"].map((button) => (
                <button key={button} type="button" className={winButton}>
                  {button}
                </button>
              ))}
              <button type="button" className={`${winButton} flex items-center gap-0.5`}>
                Find <span className="text-[8px]">▼</span>
              </button>
              <form
                onSubmit={submitKeyword}
                className="flex min-w-0 flex-1 items-center gap-1"
              >
                <input
                  className="h-5 min-w-0 flex-1 border border-[#808080] bg-white px-1 text-[10px] shadow-[inset_1px_1px_#000]"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="Type Keyword or Web Address here and click Go"
                />
                <button className={winButton} type="submit">
                  Go
                </button>
                <button
                  className={winButton}
                  type="button"
                  onClick={() => openPanel("search", keyword || "AOL")}
                >
                  Keyword
                </button>
              </form>
            </div>

            {/* Main welcome workspace */}
            <div className="relative flex min-h-0 flex-1 gap-1 overflow-hidden p-1">
              <div className="flex min-h-0 min-w-0 flex-1 flex-col border-2 border-[#808080] bg-[#c0c0c0] shadow-[2px_2px_0_#000]">
                {/* Welcome window title bar */}
                <div className="flex h-5 shrink-0 items-center justify-between bg-[#000080] px-1 text-[10px] font-bold text-[#ffff00]">
                  <span className="truncate">
                    Welcome, TrungVo98! Last Logout: 05-06-05 18:42:17
                  </span>
                </div>

                <div className="flex min-h-0 flex-1 overflow-hidden">
                  {/* Channel sidebar */}
                  <aside className="w-[88px] shrink-0 overflow-y-auto border-r border-[#808080] bg-[#c0c0c0]">
                    {channelItems.map((item) => (
                      <button
                        key={item}
                        type="button"
                        className={`block w-full border-b border-[#808080] px-1 py-0.5 text-left text-[10px] leading-tight ${
                          activeChannel === item
                            ? "bg-[#ffff00] font-bold text-black"
                            : "bg-[#0066cc] text-white hover:bg-[#0055aa]"
                        }`}
                        onClick={() => {
                          setActiveChannel(item);
                          if (item === "Welcome") return;
                          openPanel("channel", item);
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </aside>

                  {/* Service strip */}
                  <div className="flex w-[62px] shrink-0 flex-col border-r border-[#808080] bg-[#0066cc]">
                    <div className="border-b border-[#004080] bg-[#0066cc] p-1">
                      <div className="text-center text-[7px] font-black leading-tight text-white">
                        <div>AMERICA</div>
                        <div className="text-[#ffcc00]">Online</div>
                      </div>
                      <div className="mt-1 flex justify-center">
                        <AolTriangleLogo className="h-8 w-8" />
                      </div>
                    </div>
                    <ServiceStripButton
                      label="You've Got Mail"
                      icon="📬"
                      highlight
                      onClick={() => openPanel("mail")}
                    />
                    <ServiceStripButton
                      label="You've Got Pictures"
                      icon="🖼️"
                      onClick={() => openPanel("channel", "Pictures")}
                    />
                    <ServiceStripButton
                      label="My Calendar"
                      icon="📅"
                      onClick={() => openPanel("channel", "Calendar")}
                    />
                    <ServiceStripButton
                      label="Chat"
                      icon="💬"
                      onClick={() => openPanel("people")}
                    />
                  </div>

                  {/* Center content - Today on AOL */}
                  <main className="min-w-0 flex-1 overflow-y-auto bg-white">
                    <div className="border-b-2 border-[#0066cc] bg-gradient-to-r from-[#0066cc] via-[#00cccc] to-[#0066cc] px-2 py-1">
                      <div className="flex items-end justify-between">
                        <span className="text-xl font-black italic text-white drop-shadow-[1px_1px_0_#003399]">
                          Welcome
                        </span>
                        <span className="text-[10px] font-bold text-[#ffffcc]">
                          June 6, 2005
                        </span>
                      </div>
                    </div>

                    <div className="p-2">
                      <div className="mb-2 border-2 border-[#0066cc] bg-[#e8f4ff]">
                        <div className="bg-[#0066cc] px-2 py-0.5 text-[11px] font-bold text-white">
                          Today on AOL
                        </div>
                        <div className="grid gap-2 p-2 md:grid-cols-[1fr_100px]">
                          <div className="space-y-2">
                            {todayStories.map((story) => (
                              <div key={story.title}>
                                <button
                                  type="button"
                                  className="text-left text-[11px] font-bold text-[#000080] underline hover:text-[#cc0000]"
                                  onClick={() =>
                                    openPanel("channel", story.title)
                                  }
                                >
                                  {story.title}
                                </button>
                                <p className="text-[10px] leading-snug">
                                  {story.body}
                                </p>
                              </div>
                            ))}
                          </div>
                          <div className="space-y-2">
                            <div className="border border-[#808080] bg-[#ffcc00] p-1 text-center">
                              <div className="text-[9px] font-bold">
                                Member Spotlight
                              </div>
                              <div className="my-1 grid h-14 place-items-center bg-[#0066cc] text-2xl">
                                👤
                              </div>
                              <div className="text-[9px] font-bold text-[#000080]">
                                Trung Vo
                              </div>
                              <div className="text-[8px]">
                                Product Designer
                              </div>
                            </div>
                            <div className="border border-[#808080] bg-[#ffffcc] p-1 text-center">
                              <div className="text-[9px] font-bold text-[#cc6600]">
                                Pet of the Day
                              </div>
                              <div className="my-1 text-3xl">🐱</div>
                              <div className="text-[8px]">Mittens the Tabby</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-2 md:grid-cols-2">
                        {channelCards.slice(0, 4).map((card) => (
                          <button
                            key={card.title}
                            type="button"
                            className="border border-[#808080] bg-[#f4f4f4] p-0 text-left shadow-[1px_1px_0_#000] active:translate-x-px active:translate-y-px"
                            onClick={() => openPanel(card.type, card.title)}
                          >
                            <div
                              className={`${card.color} border-b border-black px-1 py-0.5 text-[10px] font-bold`}
                            >
                              {card.title}
                            </div>
                            <p className="p-1 text-[9px] leading-snug">
                              {card.description}
                            </p>
                          </button>
                        ))}
                      </div>

                      <div className="mt-2 border border-[#808080] bg-[#fffbcc] p-2 text-[10px]">
                        <span className="font-bold text-[#000080]">
                          Welcome back, Trung Vo!
                        </span>{" "}
                        Check your mail, browse channels, or search Keywords
                        like PORTFOLIO, PROJECTS, ABOUTME, and CONTACT.
                      </div>
                    </div>
                  </main>

                  {/* Right widgets column */}
                  <aside className="w-[130px] shrink-0 space-y-1 overflow-y-auto border-l border-[#808080] bg-[#c0c0c0] p-0.5">
                    <div className="border border-[#808080] bg-[#f0f0f0]">
                      <div className="bg-[#ff6600] px-1 py-0.5 text-[10px] font-bold text-white">
                        Search
                      </div>
                      <form
                        onSubmit={submitKeyword}
                        className="flex flex-col gap-1 p-1"
                      >
                        <input
                          className="h-5 border border-[#808080] bg-white px-1 text-[9px] shadow-[inset_1px_1px_#000]"
                          value={keyword}
                          onChange={(event) => setKeyword(event.target.value)}
                          placeholder="Keyword..."
                        />
                        <button className={`${winButton} w-full`} type="submit">
                          Search
                        </button>
                      </form>
                    </div>

                    <div className="border border-[#808080] bg-[#f0f0f0]">
                      <div className="bg-[#0066cc] px-1 py-0.5 text-[10px] font-bold text-white">
                        Top News
                      </div>
                      <ul className="space-y-1 p-1">
                        {topNewsItems.map((item) => (
                          <li key={item}>
                            <button
                              type="button"
                              className="text-left text-[9px] text-[#000080] underline hover:text-[#cc0000]"
                              onClick={() => openPanel("channel", "News")}
                            >
                              {item}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border border-[#808080] bg-[#f0f0f0]">
                      <div className="bg-[#0066cc] px-1 py-0.5 text-[10px] font-bold text-white">
                        My Weather
                      </div>
                      <div className="p-1 text-center">
                        <div className="text-2xl leading-none">⛅</div>
                        <div className="text-[10px] font-bold">Partly Cloudy</div>
                        <div className="text-[11px] font-black text-[#cc0000]">
                          78°F
                        </div>
                        <div className="text-[8px] text-[#666]">
                          San Francisco, CA
                        </div>
                      </div>
                    </div>

                    <div className="border border-[#808080] bg-[#f0f0f0]">
                      <div className="bg-[#0066cc] px-1 py-0.5 text-[10px] font-bold text-white">
                        My Places
                      </div>
                      <ul className="space-y-0.5 p-1 text-[9px]">
                        {[
                          ["Set My Places", "channel"],
                          ["AOL Help", "search"],
                          ["Parental Controls", "channel"],
                          ["Member Profile", "about"],
                          ["Portfolio", "portfolio"],
                          ["Contact", "contact"],
                        ].map(([label, type]) => (
                          <li key={label}>
                            <button
                              type="button"
                              className="text-[#000080] underline hover:text-[#cc0000]"
                              onClick={() =>
                                openPanel(type as PanelType, label)
                              }
                            >
                              {label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </aside>
                </div>
              </div>

              {/* Buddy List panel */}
              <BuddyListPanel onOpenPeople={() => openPanel("people")} />

              {panels.map((panel, index) => (
                <AolPanelWindow
                  key={panel.id}
                  panel={panel}
                  index={index}
                  isActive={activePanelId === panel.id}
                  onFocus={setActivePanelId}
                  onClose={(id) => {
                    setPanels((current) =>
                      current.filter((item) => item.id !== id)
                    );
                    setActivePanelId(null);
                  }}
                />
              ))}
            </div>

            <div className="flex shrink-0 items-center justify-between border-t-2 border-white bg-[#c0c0c0] px-2 py-1">
              <span>{statusText}</span>
              <span>Screen Name: TrungVo98</span>
            </div>
          </div>
        )}
      </WindowFrame>
    </>
  );
}

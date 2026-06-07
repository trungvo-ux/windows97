import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Sounds, useSound } from "@/hooks/useSound";
import { getAudioContext, resumeAudioContext } from "@/lib/audioContext";
import { useAppStore } from "@/stores/useAppStore";
import { Windows98BootSignOn } from "./Windows98BootSignOn";

type BootPhase = "bios" | "splash" | "signon" | "desktop" | "done";

const BIOS_DURATION_MS = 1500;
const SPLASH_DURATION_MS = 2000;
const DESKTOP_FADE_MS = 1000;
const LOADING_SEGMENT_WIDTH_PX = 6;
const LOADING_SEGMENT_GAP_PX = 2;
const LOADING_SEGMENT_MIN = 32;

function estimateSegmentCount(widthPx: number): number {
  const trackPadding = 6;
  const available = widthPx - trackPadding;
  const count = Math.floor(
    available / (LOADING_SEGMENT_WIDTH_PX + LOADING_SEGMENT_GAP_PX)
  );
  return Math.max(LOADING_SEGMENT_MIN, count);
}

const BIOS_LINES = [
  "PhoenixBIOS 4.0 Release 6.0",
  "Copyright (C) 1985-1998 Phoenix Technologies Ltd.",
  "All Rights Reserved",
  "",
  "CPU      : GenuineIntel Pentium III 500MHz",
  "Memory Test : 65536K OK",
  "Primary Master  : WDC AC31600H",
  "Primary Slave   : CD-ROM ATAPI 32X",
  "Secondary Master: None",
  "Secondary Slave : None",
  "",
  "Detecting IDE drives ... done",
  "Detecting SCSI devices ... none",
  "",
  "C:\\> booting system...",
];

const STARTUP_CHIME_NOTES = [
  { frequency: 523.25, start: 0, duration: 0.8, peak: 0.18 },
  { frequency: 659.25, start: 0.08, duration: 0.85, peak: 0.16 },
  { frequency: 783.99, start: 0.18, duration: 1.0, peak: 0.14 },
  { frequency: 1046.5, start: 0.38, duration: 1.0, peak: 0.1 },
];

interface Windows98BootSequenceProps {
  onComplete: () => void;
}

function formatClock(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

async function playWindows98StartupChime(volume: number) {
  await resumeAudioContext();

  const audioContext = getAudioContext();
  const now = audioContext.currentTime;
  const masterGain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  const delay = audioContext.createDelay();
  const feedback = audioContext.createGain();
  const wetGain = audioContext.createGain();

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(4200, now);
  delay.delayTime.setValueAtTime(0.22, now);
  feedback.gain.setValueAtTime(0.25, now);
  wetGain.gain.setValueAtTime(0.18, now);
  masterGain.gain.setValueAtTime(Math.max(0, Math.min(volume, 1)), now);

  filter.connect(masterGain);
  filter.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(wetGain);
  wetGain.connect(masterGain);
  masterGain.connect(audioContext.destination);

  STARTUP_CHIME_NOTES.forEach(({ frequency, start, duration, peak }) => {
    const oscillator = audioContext.createOscillator();
    const noteGain = audioContext.createGain();
    const noteStart = now + start;
    const noteEnd = noteStart + duration;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, noteStart);
    noteGain.gain.setValueAtTime(0.0001, noteStart);
    noteGain.gain.exponentialRampToValueAtTime(peak, noteStart + 0.12);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);

    oscillator.connect(noteGain);
    noteGain.connect(filter);
    oscillator.start(noteStart);
    oscillator.stop(noteEnd + 0.05);
  });

  window.setTimeout(() => masterGain.disconnect(), 1800);
}

export function Windows98BootSequence({ onComplete }: Windows98BootSequenceProps) {
  const [phase, setPhase] = useState<BootPhase>("bios");
  const [visibleLineCount, setVisibleLineCount] = useState(0);
  const [clock, setClock] = useState(() => formatClock(new Date()));
  const [segmentCount, setSegmentCount] = useState(() =>
    estimateSegmentCount(typeof window !== "undefined" ? window.innerWidth : 800)
  );
  const trackRef = useRef<HTMLDivElement>(null);
  const hasPlayedStartupSoundRef = useRef(false);
  const { play: playBootSound } = useSound(Sounds.BOOT, 0.55);
  const uiSoundsEnabled = useAppStore((state) => state.uiSoundsEnabled);
  const uiVolume = useAppStore((state) => state.uiVolume);
  const masterVolume = useAppStore((state) => state.masterVolume);

  const biosLines = useMemo(() => BIOS_LINES, []);

  const loadingSegments = useMemo(
    () =>
      Array.from({ length: segmentCount }, (_, index) => ({
        id: `segment-${index}`,
        delayMs: (index / segmentCount) * SPLASH_DURATION_MS,
      })),
    [segmentCount]
  );

  useLayoutEffect(() => {
    if (phase !== "splash") return;

    const track = trackRef.current;
    const width = track?.clientWidth ?? window.innerWidth;
    setSegmentCount(estimateSegmentCount(width));
  }, [phase]);

  const playStartupSound = useCallback(async () => {
    if (!uiSoundsEnabled || hasPlayedStartupSoundRef.current) return;

    hasPlayedStartupSoundRef.current = true;
    const assetPlayed = await playBootSound({ suppressError: true });
    if (!assetPlayed) {
      await playWindows98StartupChime(0.55 * uiVolume * masterVolume);
    }
  }, [masterVolume, playBootSound, uiSoundsEnabled, uiVolume]);

  const completeBoot = useCallback(() => {
    setPhase("desktop");

    window.setTimeout(() => {
      setPhase("done");
      onComplete();
    }, DESKTOP_FADE_MS);
  }, [onComplete]);

  const handleSignIn = useCallback(() => {
    void playStartupSound();
    completeBoot();
  }, [completeBoot, playStartupSound]);

  useEffect(() => {
    const splashAt = BIOS_DURATION_MS;
    const signonAt = BIOS_DURATION_MS + SPLASH_DURATION_MS;

    const phaseTimers = [
      window.setTimeout(() => setPhase("splash"), splashAt),
      window.setTimeout(() => setPhase("signon"), signonAt),
    ];

    return () => phaseTimers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (phase !== "bios") return;

    const interval = window.setInterval(() => {
      setVisibleLineCount((count) =>
        count < biosLines.length ? count + 1 : count
      );
    }, 45);

    return () => clearInterval(interval);
  }, [phase, biosLines.length]);

  useEffect(() => {
    if (phase !== "desktop" && phase !== "done") return;

    const interval = window.setInterval(() => {
      setClock(formatClock(new Date()));
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className={`win98-boot win98-boot--${phase}`}
      aria-hidden={phase === "desktop"}
    >
      <div className="win98-boot__crt" />

      {phase === "bios" && (
        <>
          <div className="win98-boot__bios">
            {biosLines.slice(0, visibleLineCount).join("\n")}
          </div>
          <div className="win98-boot__cursor" />
        </>
      )}

      {phase === "splash" && (
        <div className="win98-boot__splash">
          <p className="win98-boot__status">Booting up your system</p>
          <div
            ref={trackRef}
            className="win98-boot__loading-track"
            role="progressbar"
            aria-label="Booting up your system"
            aria-valuemin={0}
            aria-valuemax={segmentCount}
            aria-valuenow={segmentCount}
          >
            {loadingSegments.map((segment) => (
              <div
                key={segment.id}
                className="win98-boot__loading-segment"
                style={{ animationDelay: `${segment.delayMs}ms` }}
              />
            ))}
          </div>
        </div>
      )}

      {phase === "signon" && <Windows98BootSignOn onSignIn={handleSignIn} />}

      {phase === "desktop" && (
        <div className="win98-boot__desktop">
          <div className="win98-boot__taskbar">
            <div className="win98-boot__start">
              <div className="win98-boot__start-flag" aria-hidden>
                <span />
                <span />
                <span />
                <span />
              </div>
              Start
            </div>
            <div className="win98-boot__tray">{clock}</div>
          </div>
        </div>
      )}
    </div>
  );
}

import { AppManager } from "./apps/base/AppManager";
import { appRegistry } from "./config/appRegistry";
import { useEffect, useState } from "react";
import { applyDisplayMode } from "./utils/displayMode";
import { Toaster } from "./components/ui/sonner";
import { useAppStoreShallow } from "@/stores/helpers";
import { BootScreen } from "./components/dialogs/BootScreen";
import { Windows98BootSequence } from "./components/boot/Windows98BootSequence";
import { getNextBootMessage, clearNextBootMessage } from "./utils/bootMessage";
import { AnyApp } from "./apps/base/types";
import { IE_HOME_PAGE } from "./apps/internet-explorer/localPages";
import type { AppId } from "./config/appRegistry";

// Convert registry to array
const apps: AnyApp[] = Object.values(appRegistry);

export function App() {
  const { displayMode, isFirstBoot, setHasBooted } = useAppStoreShallow(
    (state) => ({
      displayMode: state.displayMode,
      isFirstBoot: state.isFirstBoot,
      setHasBooted: state.setHasBooted,
    })
  );
  const [bootScreenMessage, setBootScreenMessage] = useState<string | null>(
    null
  );
  const [showBootScreen, setShowBootScreen] = useState(false);
  const [showWin98Boot, setShowWin98Boot] = useState(() => {
    const persistedMessage = getNextBootMessage();
    return !persistedMessage;
  });

  useEffect(() => {
    applyDisplayMode(displayMode);
  }, [displayMode]);

  useEffect(() => {
    // Only show boot screen for system operations (reset/restore/format/debug)
    const persistedMessage = getNextBootMessage();
    if (persistedMessage) {
      setBootScreenMessage(persistedMessage);
      setShowBootScreen(true);
      setShowWin98Boot(false);
    }

    // Set first boot flag without showing boot screen
    if (isFirstBoot) {
      setHasBooted();
    }
  }, [isFirstBoot, setHasBooted]);

  useEffect(() => {
    if (showWin98Boot || showBootScreen) return;

    const launchTimer = window.setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("launchApp", {
          detail: {
            appId: "internet-explorer" as AppId,
            initialData: { url: IE_HOME_PAGE.displayUrl },
          },
        })
      );
    }, 1500);

    return () => clearTimeout(launchTimer);
  }, [showWin98Boot, showBootScreen]);

  if (showBootScreen) {
    return (
      <BootScreen
        isOpen={true}
        onOpenChange={() => {}}
        title={bootScreenMessage || "System Restoring..."}
        onBootComplete={() => {
          clearNextBootMessage();
          setShowBootScreen(false);
        }}
      />
    );
  }

  return (
    <>
      <AppManager apps={apps} />
      {showWin98Boot && (
        <Windows98BootSequence onComplete={() => setShowWin98Boot(false)} />
      )}
      <Toaster
        position="bottom-left"
        offset={`calc(env(safe-area-inset-bottom, 0px) + 32px)`}
      />
    </>
  );
}

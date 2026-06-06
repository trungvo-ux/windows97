import { AppContext } from "@/contexts/AppContext";
import { TerminalAppComponent } from "@/apps/terminal/components/TerminalAppComponent";
import { appRegistry } from "@/config/appRegistry";
import { useAppStoreShallow } from "@/stores/helpers";
import { AnyApp } from "@/apps/base/types";

const apps: AnyApp[] = Object.values(appRegistry);

/**
 * Fallout terminal as the entire OS: no desktop, no dock, no window chrome.
 * Full-screen ROBCO-style terminal only.
 */
export function FalloutOSView() {
  const launchApp = useAppStoreShallow((s) => s.launchApp);

  const contextValue = {
    appStates: {},
    toggleApp: launchApp,
    bringToForeground: () => {},
    apps,
    navigateToNextApp: () => {},
    navigateToPreviousApp: () => {},
  };

  return (
    <AppContext.Provider value={contextValue}>
      <TerminalAppComponent
        isWindowOpen={true}
        isForeground={true}
        onClose={() => {}}
        standalone={true}
      />
    </AppContext.Provider>
  );
}

import { FormEvent, useEffect, useState } from "react";
import { ThemedIcon } from "@/components/shared/ThemedIcon";

const SIGNON_MODAL_DELAY_MS = 2000;

const winButton =
  "border border-black bg-[#c0c0c0] px-3 py-0.5 text-[11px] leading-4 shadow-[inset_1px_1px_#fff,inset_-1px_-1px_#808080] active:shadow-[inset_1px_1px_#808080,inset_-1px_-1px_#fff] disabled:opacity-50";

const panelChrome =
  "border-2 border-[#808080] bg-[#c0c0c0] shadow-[2px_2px_0_#000]";

interface Windows98BootSignOnProps {
  onSignIn: () => void;
}

export function Windows98BootSignOn({ onSignIn }: Windows98BootSignOnProps) {
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(
      () => setShowModal(true),
      SIGNON_MODAL_DELAY_MS
    );
    return () => clearTimeout(timer);
  }, []);

  const canSignIn = userName.trim().length > 0;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSignIn) return;
    onSignIn();
  };

  if (!showModal) return null;

  return (
    <div className="win98-boot__signon">
      <form
        className={`win98-boot__signon-form ${panelChrome} w-[410px] max-w-[92%] font-geneva-12 text-[11px] text-black`}
        onSubmit={handleSubmit}
      >
        <div className="flex h-5 items-center bg-[#000080] px-1 font-bold text-white">
          Enter Network Password
        </div>

        <div className="border-t border-white p-3">
          <div className="mb-3 flex items-start gap-2">
            <ThemedIcon
              name="pc.png"
              alt="Computer"
              className="h-8 w-8 shrink-0 [image-rendering:pixelated]"
              width={32}
              height={32}
            />
            <p className="m-0 leading-snug">
              Enter your user name to log on to Microsoft Networking.
            </p>
          </div>

          <div className="mb-3 flex w-full flex-col gap-3">
            <label className="flex w-full flex-col items-start gap-1 text-left">
              <span>
                <span className="underline">U</span>ser name:
              </span>
              <input
                className="h-6 w-full border border-[#808080] bg-white px-1 text-left shadow-[inset_1px_1px_#000]"
                value={userName}
                autoComplete="username"
                required
                onChange={(event) => setUserName(event.target.value)}
              />
            </label>
          </div>

          <div className="mb-3 flex items-center justify-end">
            <button
              type="submit"
              className={`${winButton} min-w-16 font-bold`}
              disabled={!canSignIn}
            >
              OK
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

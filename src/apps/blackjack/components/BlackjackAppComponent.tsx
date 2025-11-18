import { useState, useCallback } from "react";
import { AppProps } from "../../base/types";
import { WindowFrame } from "@/components/layout/WindowFrame";
import { BlackjackMenuBar } from "./BlackjackMenuBar";
import { HelpDialog } from "@/components/dialogs/HelpDialog";
import { AboutDialog } from "@/components/dialogs/AboutDialog";
import { Button } from "@/components/ui/button";
import { helpItems, appMetadata } from "..";
import { useSound, Sounds } from "@/hooks/useSound";
import { useThemeStore } from "@/stores/useThemeStore";
import { toast } from "sonner";

type Suit = "hearts" | "diamonds" | "clubs" | "spades";
type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";

interface Card {
  suit: Suit;
  rank: Rank;
}

type GameState = "betting" | "playing" | "dealer-turn" | "finished";

const SUITS: Suit[] = ["hearts", "diamonds", "clubs", "spades"];
const RANKS: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank });
    }
  }
  return shuffleDeck(deck);
}

function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getCardValue(card: Card): number {
  if (card.rank === "A") return 11; // Ace defaults to 11
  if (["J", "Q", "K"].includes(card.rank)) return 10;
  return parseInt(card.rank);
}

function calculateHandValue(hand: Card[]): number {
  let value = 0;
  let aces = 0;

  for (const card of hand) {
    if (card.rank === "A") {
      aces++;
      value += 11;
    } else {
      value += getCardValue(card);
    }
  }

  // Adjust for aces
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }

  return value;
}

function getCardDisplay(card: Card): string {
  const suitSymbols: Record<Suit, string> = {
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
    spades: "♠",
  };
  return `${card.rank}${suitSymbols[card.suit]}`;
}

export function BlackjackAppComponent({
  onClose,
  isForeground = true,
  skipInitialSound,
  instanceId,
  onNavigateNext,
  onNavigatePrevious,
}: AppProps) {
  const [deck, setDeck] = useState<Card[]>(createDeck());
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<GameState>("betting");
  const [chips, setChips] = useState(1000);
  const [currentBet, setCurrentBet] = useState(0);
  const [message, setMessage] = useState("Place your bet to start!");
  const [hasDoubled, setHasDoubled] = useState(false);

  const { play: playSound } = useSound(Sounds.BUTTON_CLICK, 0.2);
  const currentTheme = useThemeStore((state) => state.current);
  const isXpTheme = currentTheme === "xp" || currentTheme === "win98";

  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);

  const dealInitialCards = useCallback(() => {
    const newDeck = [...deck];
    const player: Card[] = [];
    const dealer: Card[] = [];

    // Deal two cards to player and dealer
    player.push(newDeck.pop()!);
    dealer.push(newDeck.pop()!);
    player.push(newDeck.pop()!);
    dealer.push(newDeck.pop()!);

    setDeck(newDeck);
    setPlayerHand(player);
    setDealerHand(dealer);
    setGameState("playing");
    setMessage("Your turn! Hit or Stand?");
    setHasDoubled(false);

    // Check for natural blackjack
    const playerValue = calculateHandValue(player);
    if (playerValue === 21) {
      setGameState("finished");
      const dealerValue = calculateHandValue(dealer);
      if (dealerValue === 21) {
        setMessage("Both have Blackjack! Push - bet returned.");
        setChips((c) => c + currentBet);
      } else {
        setMessage("Blackjack! You win 1.5x your bet!");
        setChips((c) => c + currentBet * 2.5);
      }
    }
  }, [deck, currentBet]);

  const handleHit = useCallback(() => {
    if (gameState !== "playing") return;

    playSound();
    const newDeck = [...deck];
    const newCard = newDeck.pop()!;
    const newHand = [...playerHand, newCard];

    setDeck(newDeck);
    setPlayerHand(newHand);

    const value = calculateHandValue(newHand);
    if (value > 21) {
      setGameState("finished");
      setMessage("Bust! You lose.");
    } else if (value === 21) {
      setMessage("21! Standing...");
      setTimeout(() => {
        handleStand();
      }, 500);
    } else {
      setMessage(`Your hand: ${value}. Hit or Stand?`);
    }
  }, [gameState, deck, playerHand]);

  const handleStand = useCallback(() => {
    if (gameState !== "playing") return;

    playSound();
    setGameState("dealer-turn");
    setMessage("Dealer's turn...");

    // Dealer plays
    setTimeout(() => {
      let newDeck = [...deck];
      let newDealerHand = [...dealerHand];

      while (calculateHandValue(newDealerHand) < 17) {
        const newCard = newDeck.pop()!;
        newDealerHand.push(newCard);
        setDeck(newDeck);
        setDealerHand(newDealerHand);
        newDeck = [...newDeck];
      }

      const playerValue = calculateHandValue(playerHand);
      const dealerValue = calculateHandValue(newDealerHand);

      setGameState("finished");

      if (dealerValue > 21) {
        setMessage("Dealer busts! You win!");
        setChips((c) => c + currentBet * 2);
        toast.success("You win!");
      } else if (dealerValue > playerValue) {
        setMessage(`Dealer wins with ${dealerValue}!`);
        toast.error("You lose!");
      } else if (dealerValue < playerValue) {
        setMessage(`You win with ${playerValue}!`);
        setChips((c) => c + currentBet * 2);
        toast.success("You win!");
      } else {
        setMessage(`Push! Both have ${playerValue}. Bet returned.`);
        setChips((c) => c + currentBet);
      }
    }, 1000);
  }, [gameState, deck, dealerHand, playerHand, currentBet]);

  const handleDoubleDown = useCallback(() => {
    if (gameState !== "playing" || hasDoubled || playerHand.length !== 2) return;
    if (chips < currentBet) {
      toast.error("Not enough chips to double down!");
      return;
    }

    playSound();
    setCurrentBet((b) => b * 2);
    setChips((c) => c - currentBet);
    setHasDoubled(true);

    // Hit once and automatically stand
    const newDeck = [...deck];
    const newCard = newDeck.pop()!;
    const newHand = [...playerHand, newCard];

    setDeck(newDeck);
    setPlayerHand(newHand);

    const value = calculateHandValue(newHand);
    if (value > 21) {
      setGameState("finished");
      setMessage("Bust! You lose.");
      toast.error("Bust!");
    } else {
      // Trigger dealer turn
      setTimeout(() => {
        setGameState("dealer-turn");
        setMessage("Dealer's turn...");

        setTimeout(() => {
          let finalDeck = newDeck;
          let finalDealerHand = [...dealerHand];

          while (calculateHandValue(finalDealerHand) < 17) {
            const dealerCard = finalDeck.pop()!;
            finalDealerHand.push(dealerCard);
            setDeck([...finalDeck]);
            setDealerHand([...finalDealerHand]);
            finalDeck = [...finalDeck];
          }

          const playerValue = calculateHandValue(newHand);
          const dealerValue = calculateHandValue(finalDealerHand);

          setGameState("finished");

          if (dealerValue > 21) {
            setMessage("Dealer busts! You win!");
            setChips((c) => c + currentBet * 2);
            toast.success("You win!");
          } else if (dealerValue > playerValue) {
            setMessage(`Dealer wins with ${dealerValue}!`);
            toast.error("You lose!");
          } else if (dealerValue < playerValue) {
            setMessage(`You win with ${playerValue}!`);
            setChips((c) => c + currentBet * 2);
            toast.success("You win!");
          } else {
            setMessage(`Push! Both have ${playerValue}. Bet returned.`);
            setChips((c) => c + currentBet);
          }
        }, 1000);
      }, 500);
    }
  }, [gameState, hasDoubled, playerHand, chips, currentBet, deck, dealerHand]);

  const handleBet = useCallback(
    (amount: number) => {
      if (gameState !== "betting") return;
      if (chips < amount) {
        toast.error("Not enough chips!");
        return;
      }

      playSound();
      setCurrentBet(amount);
      setChips((c) => c - amount);
      dealInitialCards();
    },
    [gameState, chips, dealInitialCards]
  );

  const handleNewGame = useCallback(() => {
    playSound();
    setPlayerHand([]);
    setDealerHand([]);
    setGameState("betting");
    setCurrentBet(0);
    setMessage("Place your bet to start!");
    setDeck(createDeck());
    setHasDoubled(false);

    if (chips === 0) {
      setChips(1000);
      toast.info("Starting chips reset to 1000!");
    }
  }, [chips]);

  const playerValue = calculateHandValue(playerHand);
  const dealerValue = calculateHandValue(dealerHand);
  const showDealerValue = gameState === "finished" || gameState === "dealer-turn";

  const menuBar = (
    <BlackjackMenuBar
      onClose={onClose}
      onShowHelp={() => setHelpDialogOpen(true)}
      onShowAbout={() => setAboutDialogOpen(true)}
      onNewGame={handleNewGame}
    />
  );

  return (
    <>
      {!isXpTheme && menuBar}
      <WindowFrame
        menuBar={isXpTheme ? menuBar : undefined}
        onClose={onClose}
        isForeground={isForeground}
        title="Blackjack"
        appId="blackjack"
        instanceId={instanceId}
        onNavigateNext={onNavigateNext}
        onNavigatePrevious={onNavigatePrevious}
        skipInitialSound={skipInitialSound}
      >
        <div className="flex flex-col h-full bg-[#C0C0C0] p-4 gap-4">
          {/* Chips and Bet Display */}
          <div className="flex justify-between items-center bg-white border-2 border-black p-2">
            <div className="font-bold">
              Chips: <span className="text-green-600">${chips}</span>
            </div>
            {currentBet > 0 && (
              <div className="font-bold">
                Bet: <span className="text-red-600">${currentBet}</span>
              </div>
            )}
            <div className="font-bold text-sm">{message}</div>
          </div>

          {/* Dealer Section */}
          <div className="flex flex-col gap-2">
            <div className="font-bold text-lg">Dealer</div>
            <div className="flex gap-2 flex-wrap min-h-[80px] bg-white border-2 border-black p-3 items-center">
              {dealerHand.length === 0 ? (
                <div className="text-gray-400">No cards</div>
              ) : (
                <>
                  {dealerHand.map((card, idx) => (
                    <div
                      key={idx}
                      className="w-16 h-20 bg-white border-2 border-black flex items-center justify-center font-bold text-lg shadow-md"
                    >
                      {idx === 0 && gameState === "playing" ? "?" : getCardDisplay(card)}
                    </div>
                  ))}
                  {showDealerValue && (
                    <div className="ml-auto font-bold text-lg">
                      Value: {dealerValue}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Player Section */}
          <div className="flex flex-col gap-2 flex-1">
            <div className="font-bold text-lg">Your Hand</div>
            <div className="flex gap-2 flex-wrap min-h-[80px] bg-white border-2 border-black p-3 items-center">
              {playerHand.length === 0 ? (
                <div className="text-gray-400">No cards</div>
              ) : (
                <>
                  {playerHand.map((card, idx) => (
                    <div
                      key={idx}
                      className="w-16 h-20 bg-white border-2 border-black flex items-center justify-center font-bold text-lg shadow-md"
                    >
                      {getCardDisplay(card)}
                    </div>
                  ))}
                  <div className="ml-auto font-bold text-lg">Value: {playerValue}</div>
                </>
              )}
            </div>
          </div>

          {/* Betting Buttons */}
          {gameState === "betting" && (
            <div className="flex flex-col gap-2">
              <div className="font-bold">Place Your Bet:</div>
              <div className="flex gap-2 flex-wrap">
                {[10, 25, 50, 100, 250, 500].map((amount) => (
                  <Button
                    key={amount}
                    onClick={() => handleBet(amount)}
                    disabled={chips < amount}
                    className="bg-[#C0C0C0] border-2 border-black hover:bg-[#B0B0B0] active:bg-[#808080] font-bold px-4 py-2 shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_grey,inset_2px_2px_#dfdfdf]"
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Game Action Buttons */}
          {gameState === "playing" && (
            <div className="flex gap-2">
              <Button
                onClick={handleHit}
                className="bg-[#C0C0C0] border-2 border-black hover:bg-[#B0B0B0] active:bg-[#808080] font-bold px-6 py-2 shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_grey,inset_2px_2px_#dfdfdf]"
              >
                Hit
              </Button>
              <Button
                onClick={handleStand}
                className="bg-[#C0C0C0] border-2 border-black hover:bg-[#B0B0B0] active:bg-[#808080] font-bold px-6 py-2 shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_grey,inset_2px_2px_#dfdfdf]"
              >
                Stand
              </Button>
              {playerHand.length === 2 && chips >= currentBet && !hasDoubled && (
                <Button
                  onClick={handleDoubleDown}
                  className="bg-[#C0C0C0] border-2 border-black hover:bg-[#B0B0B0] active:bg-[#808080] font-bold px-6 py-2 shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_grey,inset_2px_2px_#dfdfdf]"
                >
                  Double Down
                </Button>
              )}
            </div>
          )}

          {/* New Game Button */}
          {gameState === "finished" && (
            <Button
              onClick={handleNewGame}
              className="bg-[#C0C0C0] border-2 border-black hover:bg-[#B0B0B0] active:bg-[#808080] font-bold px-6 py-2 shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_grey,inset_2px_2px_#dfdfdf]"
            >
              New Game
            </Button>
          )}
        </div>
      </WindowFrame>

      <HelpDialog
        isOpen={helpDialogOpen}
        onOpenChange={setHelpDialogOpen}
        helpItems={helpItems || []}
        appName="Blackjack"
      />
      <AboutDialog
        isOpen={aboutDialogOpen}
        onOpenChange={setAboutDialogOpen}
        metadata={appMetadata || {
          name: "Blackjack",
          version: "1.0.0",
          creator: { name: "Ryo Lu", url: "https://ryo.lu" },
          github: "https://github.com/ryokun6/ryos",
          icon: "/icons/default/minesweeper.png",
        }}
      />
    </>
  );
}


import React, { useState, useEffect, useRef, useCallback } from 'react';
import { gameService, GameSession } from './services/gameService';
import { GameState, GameEvent } from './engine/types';
import { getCurrentPlayer } from './engine/rules';
import { BOARD_TILES, GameCard } from './data/boardData';
import { WelcomeScreen } from './components/lobby/WelcomeScreen';
import { LobbyScreen } from './components/lobby/LobbyScreen';
import { Board } from './components/board/Board';
import { TopNav } from './components/hud/TopNav';
import { PlayersPanel } from './components/hud/PlayersPanel';
import { ActionBar } from './components/hud/ActionBar';
import { EventLog } from './components/hud/EventLog';
import { TurnActionFlash, TurnFlashData } from './components/hud/TurnActionFlash';
import { TitleDeedModal } from './components/modals/TitleDeedModal';
import { ManagePropertiesModal } from './components/modals/ManagePropertiesModal';
import { TradeModal } from './components/modals/TradeModal';
import { AuctionModal } from './components/modals/AuctionModal';
import { ActiveCardModal } from './components/modals/ActiveCardModal';
import { RulesModal } from './components/modals/RulesModal';
import { GameOverModal } from './components/modals/GameOverModal';
import { AlertCircle, X, Users, ScrollText } from 'lucide-react';
import { TokenRenderer } from './components/icons/TokenIcons';

export function App() {
  const [session, setSession] = useState<GameSession | null>(gameService.getSession());
  const [state, setState] = useState<GameState | null>(gameService.getLocalState());
  const [defaultJoinCode, setDefaultJoinCode] = useState<string>('');

  // 3.5s Prominent Turn Action Flash Notification State
  const [activeFlash, setActiveFlash] = useState<TurnFlashData | null>(null);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerTurnFlash = useCallback((flash: TurnFlashData) => {
    setActiveFlash(flash);
    if (flashTimerRef.current) {
      clearTimeout(flashTimerRef.current);
    }
    flashTimerRef.current = setTimeout(() => {
      setActiveFlash(null);
    }, 3500);
  }, []);

  // Theme State (Coastal Golden Hour Dark default vs Sandy Light)
  const [isLightTheme, setIsLightTheme] = useState<boolean>(() => {
    return localStorage.getItem('naroomopoly_theme') === 'light';
  });

  const toggleTheme = () => {
    setIsLightTheme((prev) => {
      const next = !prev;
      localStorage.setItem('naroomopoly_theme', next ? 'light' : 'dark');
      return next;
    });
  };

  // Mobile Drawer Toggle
  const [mobileDrawerTab, setMobileDrawerTab] = useState<'none' | 'players' | 'log'>('none');

  // Modals state
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(null);
  const [hoveredTileIndex, setHoveredTileIndex] = useState<number | null>(null);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isManagePropertiesOpen, setIsManagePropertiesOpen] = useState<boolean>(false);
  const [tradeTargetPlayerId, setTradeTargetPlayerId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleIncomingEvent = useCallback(
    (event: GameEvent) => {
      const currentSession = gameService.getSession();
      const currentState = gameService.getLocalState();
      const myId = currentSession?.playerId;
      const pld = event.payload || {};

      const findPl = (id?: string) => currentState?.players.find((p) => p.id === id);

      let flash: TurnFlashData | null = null;

      switch (event.type) {
        case 'RENT_PAID': {
          const payerId = (pld.payerId as string) || event.playerId;
          const ownerId = pld.ownerId as string;
          const rentAmount = (pld.rentAmount as number) || 0;
          const tileIndex = pld.tileIndex as number;
          const tileName =
            (pld.tileName as string) ||
            (tileIndex !== undefined ? BOARD_TILES[tileIndex]?.name : 'Property');
          const payer = findPl(payerId);
          const owner = findPl(ownerId);

          const isPayerMe = payerId === myId;
          const isOwnerMe = ownerId === myId;

          if (isPayerMe) {
            flash = {
              id: event.id,
              category: 'rent_deducted',
              title: `-$${rentAmount} RENT DEDUCTED`,
              subtitle: `You landed on ${owner?.name || 'Player'}'s ${tileName}`,
              description: `Paid $${rentAmount} rent to ${owner?.name || 'Owner'}. Cash has been deducted from your cash balance.`,
              amountChange: -rentAmount,
              oldBalance: pld.oldCash as number,
              newBalance: pld.newCash as number,
              tileIndex,
              tileName,
              player: payer ? { ...payer, isMainPlayer: true } : undefined,
              secondaryPlayer: owner,
            };
          } else if (isOwnerMe) {
            flash = {
              id: event.id,
              category: 'rent_collected',
              title: `+$${rentAmount} RENT COLLECTED!`,
              subtitle: `${payer?.name || 'Player'} landed on your ${tileName}`,
              description: `Collected $${rentAmount} rent from ${payer?.name || 'Opponent'}! Added to your balance.`,
              amountChange: rentAmount,
              oldBalance: pld.ownerOldCash as number,
              newBalance: pld.ownerNewCash as number,
              tileIndex,
              tileName,
              player: payer ? { ...payer, isMainPlayer: false } : undefined,
              secondaryPlayer: owner,
            };
          } else {
            flash = {
              id: event.id,
              category: 'rent_other',
              title: `💸 Rent Paid: $${rentAmount}`,
              subtitle: `${payer?.name || 'Player'} paid ${owner?.name || 'Owner'}`,
              description: `Landed on ${tileName}. Transferred $${rentAmount} in rent.`,
              amountChange: -rentAmount,
              tileIndex,
              tileName,
              player: payer,
              secondaryPlayer: owner,
            };
          }
          break;
        }

        case 'TAX_PAID': {
          const payerId = (pld.payerId as string) || event.playerId;
          const amount = (pld.amount as number) || 0;
          const tileIndex = pld.tileIndex as number;
          const tileName =
            (pld.tileName as string) ||
            (tileIndex !== undefined ? BOARD_TILES[tileIndex]?.name : 'Shire Rates');
          const payer = findPl(payerId);
          const isMe = payerId === myId;

          flash = {
            id: event.id,
            category: 'tax',
            title: isMe ? `-$${amount} TAX DEDUCTED` : `🏛️ Shire Tax: $${amount}`,
            subtitle: isMe ? `You landed on ${tileName}` : `${payer?.name || 'Player'} paid ${tileName}`,
            description: isMe
              ? `-$${amount} has been deducted from your cash for shire rates and maintenance.`
              : `${payer?.name || 'Player'} paid $${amount} to the shire.`,
            amountChange: -amount,
            oldBalance: pld.oldCash as number,
            newBalance: pld.newCash as number,
            tileIndex,
            tileName,
            player: payer ? { ...payer, isMainPlayer: isMe } : undefined,
          };
          break;
        }

        case 'CARD_DRAWN': {
          const card = pld.card as GameCard;
          const drawerId = (pld.drawerId as string) || event.playerId;
          const isNotice = Boolean(pld.isNotice ?? (card?.deck === 'notice'));
          const drawer = findPl(drawerId);
          const isMe = drawerId === myId;

          if (card) {
            flash = {
              id: event.id,
              category: 'card_drawn',
              title: isMe ? '🎴 YOU DREW AN ACTION CARD' : `🎴 ${drawer?.name || 'Player'} DREW A CARD`,
              subtitle: isNotice ? 'Community Notice Board' : 'Local Knowledge',
              description: `"${card.title}" — ${card.description}`,
              card,
              isNotice,
              player: drawer ? { ...drawer, isMainPlayer: isMe } : undefined,
            };
          }
          break;
        }

        case 'PASSED_GO': {
          const payerId = (pld.payerId as string) || event.playerId;
          const amount = (pld.amount as number) || 200;
          const payer = findPl(payerId);
          const isMe = payerId === myId;

          flash = {
            id: event.id,
            category: 'go',
            title: isMe ? '+$200 SALARY COLLECTED!' : '🌊 Welcome to the South Coast',
            subtitle: isMe ? 'You passed Welcome to Country!' : `${payer?.name || 'Player'} passed GO!`,
            description: isMe
              ? '+$200 has been credited to your cash for completing a circuit of the coast!'
              : `${payer?.name || 'Player'} collected $${amount} salary.`,
            amountChange: 200,
            oldBalance: pld.oldCash as number,
            newBalance: pld.newCash as number,
            tileIndex: 0,
            tileName: 'Welcome to the South Coast',
            player: payer ? { ...payer, isMainPlayer: isMe } : undefined,
          };
          break;
        }

        case 'LANDED_UNOWNED': {
          const payerId = (pld.payerId as string) || event.playerId;
          const price = (pld.price as number) || 0;
          const tileIndex = pld.tileIndex as number;
          const tileName =
            (pld.tileName as string) ||
            (tileIndex !== undefined ? BOARD_TILES[tileIndex]?.name : 'Property');
          const payer = findPl(payerId);
          const isMe = payerId === myId;

          flash = {
            id: event.id,
            category: 'unowned',
            title: isMe ? `🏖️ UNOWNED PROPERTY: ${tileName}` : '🏖️ Unowned Property Landing',
            subtitle: isMe
              ? `Purchase Price: $${price} | Your Cash: $${payer?.cash ?? 0}`
              : `${payer?.name || 'Player'} landed on ${tileName} ($${price})`,
            description: isMe
              ? `You have landed on an unowned property! Choose to BUY for $${price} or DECLINE to trigger an auction below.`
              : `${payer?.name || 'Player'} is deciding whether to buy ${tileName} or send it to auction.`,
            tileIndex,
            tileName,
            player: payer ? { ...payer, isMainPlayer: isMe } : undefined,
          };
          break;
        }

        case 'OWN_PROPERTY': {
          const payerId = (pld.payerId as string) || event.playerId;
          const tileIndex = pld.tileIndex as number;
          const tileName =
            (pld.tileName as string) ||
            (tileIndex !== undefined ? BOARD_TILES[tileIndex]?.name : 'Property');
          const payer = findPl(payerId);
          const isMe = payerId === myId;

          flash = {
            id: event.id,
            category: 'own_property',
            title: isMe ? `🏡 YOUR PROPERTY: ${tileName}` : '🏡 Landed on Own Property',
            subtitle: isMe ? 'You own this property!' : `${payer?.name || 'Player'} landed on their own property`,
            description: isMe
              ? 'No rent due! Relax and enjoy the scenic South Coast view.'
              : `${payer?.name || 'Player'} landed on ${tileName}. Safe!`,
            tileIndex,
            tileName,
            player: payer ? { ...payer, isMainPlayer: isMe } : undefined,
          };
          break;
        }

        case 'PROPERTY_BOUGHT': {
          const buyerId = (pld.buyerId as string) || event.playerId;
          const price = (pld.price as number) || 0;
          const tileIndex = pld.tileIndex as number;
          const tileName =
            (pld.tileName as string) ||
            (tileIndex !== undefined ? BOARD_TILES[tileIndex]?.name : 'Property');
          const buyer = findPl(buyerId);
          const isMe = buyerId === myId;

          flash = {
            id: event.id,
            category: 'property_bought',
            title: isMe ? `🏡 YOU BOUGHT ${tileName}!` : `🏡 ${buyer?.name || 'Player'} Bought Property`,
            subtitle: `${tileName} purchased for $${price}`,
            description: isMe
              ? `Title deed acquired! You can now collect rent when opponents land here.`
              : `${buyer?.name || 'Player'} bought ${tileName} for $${price}.`,
            amountChange: -price,
            oldBalance: pld.oldCash as number,
            newBalance: pld.newCash as number,
            tileIndex,
            tileName,
            player: buyer ? { ...buyer, isMainPlayer: isMe } : undefined,
          };
          break;
        }

        case 'SENT_TO_JAIL': {
          const pId = (pld.playerId as string) || event.playerId;
          const reason = (pld.reason as string) || event.message;
          const p = findPl(pId);
          const isMe = pId === myId;

          flash = {
            id: event.id,
            category: 'jail',
            title: isMe ? '🚨 YOU WERE SENT TO JAIL!' : `🚨 ${p?.name || 'Player'} Sent to Jail!`,
            subtitle: 'Bodalla Police Station',
            description: reason,
            tileIndex: 10,
            tileName: 'Bodalla Police Station',
            player: p ? { ...p, isMainPlayer: isMe } : undefined,
          };
          break;
        }

        case 'DICE_ROLLED': {
          const rollerId = event.playerId;
          const isMe = rollerId === myId;
          if (!isMe) {
            const roller = findPl(rollerId);
            const dice = (pld.dice as [number, number]) || [1, 1];
            const diceSum = (pld.diceSum as number) || dice[0] + dice[1];
            const isDoubles = Boolean(pld.isDoubles);
            const destIdx = pld.destinationIndex as number;
            const destName =
              (pld.destinationName as string) ||
              (destIdx !== undefined ? BOARD_TILES[destIdx]?.name : 'Board');

            flash = {
              id: event.id,
              category: 'dice_move',
              title: `🎲 ${roller?.name || 'Player'}'s Turn`,
              subtitle: `Rolled [${dice[0]}, ${dice[1]}] (${diceSum})${isDoubles ? ' - DOUBLES!' : ''}`,
              description: `Moving to ${destName}...`,
              tileIndex: destIdx,
              tileName: destName,
              player: roller ? { ...roller, isMainPlayer: false } : undefined,
            };
          }
          break;
        }

        case 'FREE_PARKING': {
          const p = findPl(event.playerId);
          const isMe = event.playerId === myId;
          flash = {
            id: event.id,
            category: 'general',
            title: '🏖️ FREE PARKING (BATEHAVEN BEACH)',
            subtitle: isMe ? 'You are taking a break!' : `${p?.name || 'Player'} is resting`,
            description: 'No rent or charges due. Relax and soak up the sunshine.',
            tileIndex: 20,
            tileName: 'Free Parking',
            player: p ? { ...p, isMainPlayer: isMe } : undefined,
          };
          break;
        }

        case 'JACKPOT_WON': {
          const p = findPl(event.playerId);
          const isMe = event.playerId === myId;
          const amt = (pld.amount as number) || 0;
          flash = {
            id: event.id,
            category: 'go',
            title: isMe ? `💰 YOU WON THE JACKPOT OF $${amt}!` : `💰 Jackpot Won: $${amt}`,
            subtitle: `Free Parking Pool awarded to ${p?.name || 'Player'}`,
            description: `All accumulated shire tax and fine fees have been won!`,
            amountChange: amt,
            tileIndex: 20,
            tileName: 'Free Parking',
            player: p ? { ...p, isMainPlayer: isMe } : undefined,
          };
          break;
        }

        case 'AUCTION_STARTED': {
          const tileIndex = pld.tileIndex as number;
          const tileName =
            (pld.tileName as string) ||
            (tileIndex !== undefined ? BOARD_TILES[tileIndex]?.name : 'Property');
          flash = {
            id: event.id,
            category: 'auction',
            title: '🔨 PROPERTY AUCTION STARTED',
            subtitle: `${tileName} is open for bidding!`,
            description: 'All players can place bids in turn. Highest bidder wins the deed.',
            tileIndex,
            tileName,
          };
          break;
        }

        case 'AUCTION_BID': {
          const bidderId = (pld.bidderId as string) || event.playerId;
          const amount = (pld.amount as number) || 0;
          const tileIndex = pld.tileIndex as number;
          const tileName =
            (pld.tileName as string) ||
            (tileIndex !== undefined ? BOARD_TILES[tileIndex]?.name : 'Property');
          const bidder = findPl(bidderId);
          const isMe = bidderId === myId;

          flash = {
            id: event.id,
            category: 'auction',
            title: isMe ? `🔨 YOU BID $${amount}!` : `🔨 ${bidder?.name || 'Player'} Bid $${amount}`,
            subtitle: `${tileName} (Next min bid: $${amount + 10})`,
            description: isMe
              ? `Your bid of $${amount} is currently the highest bid.`
              : `${bidder?.name || 'Player'} placed a bid of $${amount}.`,
            tileIndex,
            tileName,
            player: bidder ? { ...bidder, isMainPlayer: isMe } : undefined,
          };
          break;
        }

        case 'AUCTION_WON': {
          const winnerId = (pld.winnerId as string) || event.playerId;
          const finalBid = (pld.finalBid as number) || 0;
          const tileIndex = pld.tileIndex as number;
          const tileName =
            (pld.tileName as string) ||
            (tileIndex !== undefined ? BOARD_TILES[tileIndex]?.name : 'Property');
          const winner = findPl(winnerId);
          const isMe = winnerId === myId;

          flash = {
            id: event.id,
            category: 'property_bought',
            title: isMe ? `🏆 YOU WON THE AUCTION!` : `🏆 ${winner?.name || 'Player'} Won Auction!`,
            subtitle: `${tileName} won for $${finalBid}`,
            description: isMe
              ? `Congratulations! You won ${tileName} for $${finalBid}. Deed added to your properties.`
              : `${winner?.name || 'Player'} won the auction for ${tileName} for $${finalBid}.`,
            amountChange: -finalBid,
            oldBalance: pld.oldCash as number,
            newBalance: pld.newCash as number,
            tileIndex,
            tileName,
            player: winner ? { ...winner, isMainPlayer: isMe } : undefined,
          };
          break;
        }

        case 'AUCTION_UNSOLD': {
          const tileIndex = pld.tileIndex as number;
          const tileName =
            (pld.tileName as string) ||
            (tileIndex !== undefined ? BOARD_TILES[tileIndex]?.name : 'Property');

          flash = {
            id: event.id,
            category: 'general',
            title: '🔨 AUCTION CONCLUDED: UNSOLD',
            subtitle: `${tileName} remains unowned`,
            description: 'No bids were placed on this property.',
            tileIndex,
            tileName,
          };
          break;
        }

        default:
          break;
      }

      if (flash) {
        triggerTurnFlash(flash);
      }
    },
    [triggerTurnFlash]
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const joinCode = urlParams.get('join');
    if (joinCode) {
      setDefaultJoinCode(joinCode.toUpperCase());
    }

    const unsubscribe = gameService.subscribe(
      (nextState) => {
        setState(nextState);
        setSession(gameService.getSession());
      },
      (event) => {
        handleIncomingEvent(event);
      }
    );

    return () => {
      unsubscribe();
      if (flashTimerRef.current) {
        clearTimeout(flashTimerRef.current);
      }
    };
  }, [handleIncomingEvent]);

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 4000);
  };

  const handleCreateGame = async (
    name: string,
    token: string,
    settings: any,
    mode: 'online' | 'local' | 'bots'
  ) => {
    try {
      const sess = await gameService.createGame(name, token, settings, mode);
      setSession(sess);
    } catch (err: any) {
      showError(err.message || 'Failed to create game');
    }
  };

  const handleJoinGame = async (code: string, name: string, token: string) => {
    try {
      const sess = await gameService.joinGame(code, name, token);
      setSession(sess);
    } catch (err: any) {
      showError(err.message || 'Failed to join game');
    }
  };

  const handleStartGame = async () => {
    try {
      await gameService.startGame();
    } catch (err: any) {
      showError(err.message || 'Failed to start game');
    }
  };

  const handleDispatchAction = async (action: any) => {
    const res = await gameService.dispatchAction(action);
    if (!res.success && res.error) {
      showError(res.error);
    }
  };

  const handleLeaveGame = () => {
    if (window.confirm('Leave current game and return to the main menu?')) {
      gameService.leaveGame();
      setSession(null);
      setState(null);
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  // 1. Not in a game: Welcome Screen
  if (!session || !state) {
    return (
      <main className={`min-h-screen flex flex-col justify-center items-center p-3 sm:p-4 ${isLightTheme ? 'light-theme' : ''}`}>
        {errorMessage && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-red-950/90 border border-red-500 text-red-200 px-4 py-2.5 rounded-xl shadow-lg animate-in slide-in-from-top-4">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-xs font-semibold">{errorMessage}</span>
          </div>
        )}
        <WelcomeScreen
          onCreateGame={handleCreateGame}
          onJoinGame={handleJoinGame}
          onOpenRules={() => setIsRulesOpen(true)}
          defaultCode={defaultJoinCode}
        />
        {isRulesOpen && <RulesModal onClose={() => setIsRulesOpen(false)} />}
      </main>
    );
  }

  // 2. In Lobby Phase
  if (state.phase === 'lobby') {
    return (
      <main className={`min-h-screen flex flex-col justify-center items-center p-3 sm:p-4 ${isLightTheme ? 'light-theme' : ''}`}>
        {errorMessage && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-red-950/90 border border-red-500 text-red-200 px-4 py-2.5 rounded-xl shadow-lg animate-in slide-in-from-top-4">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-xs font-semibold">{errorMessage}</span>
          </div>
        )}
        <LobbyScreen
          state={state}
          myPlayerId={session.playerId}
          onStartGame={handleStartGame}
          onAddBot={(name, token) => gameService.addBot(name, token)}
          onRemovePlayer={(pId) => gameService.removePlayer(pId)}
        />
      </main>
    );
  }

  // 3. Active Playing Game Phase
  const currentPlayer = getCurrentPlayer(state);
  const isMyTurn = currentPlayer?.id === session.playerId;
  const isTradeActive = Boolean(state.activeTrade);

  return (
    <div className={`min-h-screen flex flex-col font-sans select-none ${isLightTheme ? 'light-theme' : ''}`}>
      {/* Top Navbar */}
      <TopNav
        gameCode={state.code}
        onOpenRules={() => setIsRulesOpen(true)}
        onLeaveGame={handleLeaveGame}
        isLightTheme={isLightTheme}
        onToggleTheme={toggleTheme}
      />

      {/* Floating Alert Toast */}
      {errorMessage && (
        <div className="fixed top-14 right-4 z-50 flex items-center gap-2 bg-red-950/95 border border-red-500 text-red-200 px-4 py-2 rounded-xl shadow-xl animate-in slide-in-from-top-4">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="text-xs font-semibold">{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="ml-2 text-red-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Mobile Swipeable Players Strip (Mobile portrait only) */}
      <div className="lg:hidden flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 border-b border-slate-800 overflow-x-auto">
        {state.players.map((p) => {
          const isTurn = p.id === currentPlayer?.id;
          return (
            <div
              key={p.id}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold border flex-shrink-0 ${
                isTurn
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: p.color }}
              >
                <TokenRenderer tokenId={p.token} size={10} color="#FFFFFF" />
              </div>
              <span>{p.name.split(' ')[0]}</span>
              <span className="text-emerald-400 font-extrabold">${p.cash}</span>
            </div>
          );
        })}
      </div>

      {/* Main Responsive Game Viewport */}
      <main className="flex-1 w-full max-w-[1550px] mx-auto p-1.5 sm:p-3 grid grid-cols-1 lg:grid-cols-12 gap-3 items-start overflow-hidden">
        {/* Left Column: Board + Action Bar (Perfect square fitting in viewport) */}
        <div className="lg:col-span-8 xl:col-span-8 flex flex-col items-center justify-start gap-2.5 w-full">
          <Board
            state={state}
            onSelectTile={(tileIndex) => setSelectedTileIndex(tileIndex)}
            isMyTurn={isMyTurn}
            onOpenRules={() => setIsRulesOpen(true)}
            hoveredTileIndex={hoveredTileIndex}
            onHoverTile={setHoveredTileIndex}
          />

          <ActionBar
            state={state}
            myPlayerId={session.playerId}
            onAction={handleDispatchAction}
            onOpenManageProperties={() => setIsManagePropertiesOpen(true)}
          />

          {/* Mobile Drawer Trigger Buttons */}
          <div className="lg:hidden flex items-center justify-center gap-3 w-full py-1">
            <button
              onClick={() => setMobileDrawerTab(mobileDrawerTab === 'players' ? 'none' : 'players')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200"
            >
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              Player Assets ({state.players.length})
            </button>
            <button
              onClick={() => setMobileDrawerTab(mobileDrawerTab === 'log' ? 'none' : 'log')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200"
            >
              <ScrollText className="w-3.5 h-3.5 text-amber-400" />
              Game History ({state.events.length})
            </button>
          </div>
        </div>

        {/* Right Column: Player Cards & Game Log (Desktop) */}
        <div className="hidden lg:flex lg:col-span-4 xl:col-span-4 flex-col gap-3 max-h-[calc(100vh-90px)] overflow-y-auto pr-1">
          <PlayersPanel
            state={state}
            myPlayerId={session.playerId}
            onInitiateTrade={(targetId) => setTradeTargetPlayerId(targetId)}
            onKickPlayer={(targetId) => handleDispatchAction({ type: 'KICK_PLAYER', targetPlayerId: targetId })}
            onSelectTile={(tileIndex) => setSelectedTileIndex(tileIndex)}
            onHoverTile={setHoveredTileIndex}
          />

          <EventLog events={state.events} />
        </div>
      </main>

      {/* Mobile Drawer Modal (when toggled on mobile portrait/tablet) */}
      {mobileDrawerTab !== 'none' && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col justify-end p-2 animate-in slide-in-from-bottom duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-4 max-h-[80vh] flex flex-col gap-3 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-extrabold text-sm text-amber-300">
                {mobileDrawerTab === 'players' ? 'Players & Property Deeds' : 'Live Game Activity Log'}
              </span>
              <button
                onClick={() => setMobileDrawerTab('none')}
                className="p-1 rounded-full bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {mobileDrawerTab === 'players' ? (
                <PlayersPanel
                  state={state}
                  myPlayerId={session.playerId}
                  onInitiateTrade={(targetId) => {
                    setMobileDrawerTab('none');
                    setTradeTargetPlayerId(targetId);
                  }}
                  onKickPlayer={(targetId) => handleDispatchAction({ type: 'KICK_PLAYER', targetPlayerId: targetId })}
                  onSelectTile={(tileIndex) => {
                    setMobileDrawerTab('none');
                    setSelectedTileIndex(tileIndex);
                  }}
                  onHoverTile={setHoveredTileIndex}
                />
              ) : (
                <EventLog events={state.events} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modals & Dialogs */}
      {selectedTileIndex !== null && (
        <TitleDeedModal
          tileIndex={selectedTileIndex}
          state={state}
          myPlayerId={session.playerId}
          onClose={() => setSelectedTileIndex(null)}
          onAction={handleDispatchAction}
        />
      )}

      {isManagePropertiesOpen && (
        <ManagePropertiesModal
          state={state}
          myPlayerId={session.playerId}
          onClose={() => setIsManagePropertiesOpen(false)}
          onAction={handleDispatchAction}
        />
      )}

      {(tradeTargetPlayerId !== null || isTradeActive) && (
        <TradeModal
          state={state}
          myPlayerId={session.playerId}
          targetPlayerId={tradeTargetPlayerId}
          onClose={() => setTradeTargetPlayerId(null)}
          onAction={handleDispatchAction}
        />
      )}

      {state.phase === 'auction' && (
        <AuctionModal
          state={state}
          myPlayerId={session.playerId}
          onAction={handleDispatchAction}
        />
      )}

      {/* 3.5s Prominent Turn Action & Landing Notification Flash */}
      <TurnActionFlash
        flash={activeFlash}
        onDismiss={() => setActiveFlash(null)}
      />

      {state.activeCard && (
        <ActiveCardModal
          card={state.activeCard}
          player={currentPlayer}
          isMyCard={currentPlayer?.id === session.playerId}
          onDismiss={() => handleDispatchAction({ type: 'DISMISS_ACTIVE_CARD' })}
        />
      )}

      {isRulesOpen && <RulesModal onClose={() => setIsRulesOpen(false)} />}

      {state.phase === 'game_over' && (
        <GameOverModal
          state={state}
          onPlayAgain={() => {
            gameService.leaveGame();
            setSession(null);
            setState(null);
          }}
        />
      )}
    </div>
  );
}

export default App;

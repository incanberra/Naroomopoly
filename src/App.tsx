import React, { useState, useEffect } from 'react';
import { gameService, GameSession } from './services/gameService';
import { GameState } from './engine/types';
import { getCurrentPlayer } from './engine/rules';
import { WelcomeScreen } from './components/lobby/WelcomeScreen';
import { LobbyScreen } from './components/lobby/LobbyScreen';
import { Board } from './components/board/Board';
import { TopNav } from './components/hud/TopNav';
import { PlayersPanel } from './components/hud/PlayersPanel';
import { ActionBar } from './components/hud/ActionBar';
import { EventLog } from './components/hud/EventLog';
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
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isManagePropertiesOpen, setIsManagePropertiesOpen] = useState<boolean>(false);
  const [tradeTargetPlayerId, setTradeTargetPlayerId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      () => {
        // Handled via audio in gameService
      }
    );

    return () => unsubscribe();
  }, []);

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

      {state.activeCard && (
        <ActiveCardModal
          card={state.activeCard}
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

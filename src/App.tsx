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
import { AlertCircle, X } from 'lucide-react';

export function App() {
  const [session, setSession] = useState<GameSession | null>(gameService.getSession());
  const [state, setState] = useState<GameState | null>(gameService.getLocalState());
  const [defaultJoinCode, setDefaultJoinCode] = useState<string>('');

  // Modals state
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(null);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isManagePropertiesOpen, setIsManagePropertiesOpen] = useState<boolean>(false);
  const [tradeTargetPlayerId, setTradeTargetPlayerId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check URL parameters for ?join=CODE
    const urlParams = new URLSearchParams(window.location.search);
    const joinCode = urlParams.get('join');
    if (joinCode) {
      setDefaultJoinCode(joinCode.toUpperCase());
    }

    // Subscribe to game updates & events
    const unsubscribe = gameService.subscribe(
      (nextState) => {
        setState(nextState);
        setSession(gameService.getSession());
      },
      (event) => {
        // Event triggers are also handled by sound engine in gameService
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
    if (window.confirm('Are you sure you want to leave the current game?')) {
      gameService.leaveGame();
      setSession(null);
      setState(null);
      // Clean query params
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  // 1. Not in a game: Render Welcome / Join / Create Screen
  if (!session || !state) {
    return (
      <main className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
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

  // 2. In Lobby Phase: Render Lobby Screen
  if (state.phase === 'lobby') {
    return (
      <main className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
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

  // 3. Active Board Game Phase
  const currentPlayer = getCurrentPlayer(state);
  const isMyTurn = currentPlayer?.id === session.playerId;
  const isTradeActive = Boolean(state.activeTrade);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <TopNav
        gameCode={state.code}
        onOpenRules={() => setIsRulesOpen(true)}
        onLeaveGame={handleLeaveGame}
      />

      {/* Floating Error / Notice Toast */}
      {errorMessage && (
        <div className="fixed top-16 right-4 z-50 flex items-center gap-2 bg-red-950/90 border border-red-500 text-red-200 px-4 py-2.5 rounded-xl shadow-lg animate-in slide-in-from-top-4">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="text-xs font-semibold">{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="ml-2 text-red-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Game Arena */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left / Center Column: The 40-Tile Board & Action Controls */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <Board
            state={state}
            onSelectTile={(tileIndex) => setSelectedTileIndex(tileIndex)}
            onAction={handleDispatchAction}
            isMyTurn={isMyTurn}
            onOpenRules={() => setIsRulesOpen(true)}
          />

          <ActionBar
            state={state}
            myPlayerId={session.playerId}
            onAction={handleDispatchAction}
            onOpenManageProperties={() => setIsManagePropertiesOpen(true)}
          />
        </div>

        {/* Right Column: Players Roster & Live Event Log */}
        <div className="lg:col-span-4 flex flex-col gap-3">
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

      {/* Footer */}
      <footer className="text-center text-[11px] text-slate-500 py-2 border-t border-slate-900 bg-slate-950">
        Naroom-opoly • NSW South Coast Edition • Non-commercial parody fan tribute
      </footer>

      {/* Modals */}
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

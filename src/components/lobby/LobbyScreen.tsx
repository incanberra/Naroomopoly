import React, { useState } from 'react';
import { GameState } from '../../engine/types';
import { TOKENS } from '../../data/tokens';
import { TokenRenderer } from '../icons/TokenIcons';
import {
  Share2,
  Copy,
  Check,
  Bot,
  Play,
  UserPlus,
  Settings,
  Sparkles,
  DollarSign,
  ShieldAlert,
} from 'lucide-react';

interface LobbyScreenProps {
  state: GameState;
  myPlayerId: string;
  onStartGame: () => void;
  onAddBot: (name: string, token: string) => void;
  onRemovePlayer: (playerId: string) => void;
  onUpdateSettings?: (settings: any) => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  state,
  myPlayerId,
  onStartGame,
  onAddBot,
  onRemovePlayer,
}) => {
  const [copied, setCopied] = useState(false);
  const myPlayer = state.players.find((p) => p.id === myPlayerId);
  const isHost = myPlayer?.isHost ?? false;

  const copyCode = () => {
    navigator.clipboard.writeText(state.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?join=${state.code}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Find remaining available tokens
  const takenTokens = state.players.map((p) => p.token);
  const availableTokens = TOKENS.filter((t) => !takenTokens.includes(t.id));

  const handleQuickAddBot = () => {
    if (availableTokens.length === 0) return;
    const nextToken = availableTokens[0];
    const botNames = ['Kangaroo Keith', 'Penny Pelican', 'Willy Whale', 'Broulee Surfer', 'Tuna Trawler Ted'];
    const name = botNames[state.players.length % botNames.length] + ` (Bot)`;
    onAddBot(name, nextToken.id);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col gap-6 text-slate-100 animate-in fade-in duration-300">
      {/* Title & Join Info */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Game Lobby
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent font-board">
          Naroom-opoly
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Share your game code with friends to cruise the South Coast together!
        </p>

        {/* Join Code Box */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 border border-amber-500/50 px-4 py-2 rounded-xl shadow-inner">
            <span className="text-xs uppercase font-bold text-slate-400">Join Code:</span>
            <span className="text-2xl font-black font-mono tracking-widest text-amber-300">
              {state.code}
            </span>
            <button
              onClick={copyCode}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title="Copy Code"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            Copy Invite Link
          </button>
        </div>
      </div>

      {/* Players Seated List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          <span>Players Seated ({state.players.length}/6)</span>
          <span>{6 - state.players.length} seats open</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {state.players.map((p, idx) => (
            <div
              key={p.id}
              className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3 shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-md flex-shrink-0"
                  style={{ backgroundColor: p.color }}
                >
                  <TokenRenderer tokenId={p.token} size={22} color="#FFFFFF" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-sm text-slate-100 flex items-center gap-1.5 truncate">
                    <span className="truncate">{p.name}</span>
                    {p.isHost && (
                      <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-1.5 py-0.2 rounded font-semibold">
                        Host
                      </span>
                    )}
                    {p.id === myPlayerId && (
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-1 py-0.2 rounded font-semibold">
                        You
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400">
                    Token: {TOKENS.find((t) => t.id === p.token)?.name}
                  </div>
                </div>
              </div>

              {isHost && !p.isHost && (
                <button
                  onClick={() => onRemovePlayer(p.id)}
                  className="text-slate-500 hover:text-red-400 text-xs font-semibold px-2 py-1 rounded transition-colors"
                  title="Remove player"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          {/* Empty Seats */}
          {Array.from({ length: Math.max(0, 6 - state.players.length) }).map((_, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl border-2 border-dashed border-slate-800/80 flex items-center justify-center text-slate-600 text-xs font-semibold"
            >
              Empty Seat #{state.players.length + idx + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Host Settings & Bot Controls */}
      <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Settings className="w-3.5 h-3.5" />
            Game Rules & Setup
          </span>
          {isHost && availableTokens.length > 0 && (
            <button
              onClick={handleQuickAddBot}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-800/60 text-xs font-bold transition-colors"
            >
              <Bot className="w-3.5 h-3.5" />
              Add AI Bot Player
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-slate-300">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-slate-400 text-[11px]">Starting Cash</div>
            <div className="font-bold text-emerald-400 text-sm mt-0.5">
              ${state.settings.startingCash}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-slate-400 text-[11px]">Free Parking</div>
            <div className="font-bold text-amber-400 text-sm mt-0.5">
              {state.settings.freeParkingJackpot ? 'Jackpot Pool On' : 'Standard ($0)'}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1">
            <div className="text-slate-400 text-[11px]">Board Size</div>
            <div className="font-bold text-cyan-400 text-sm mt-0.5">40 South Coast Tiles</div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex flex-col items-center gap-2">
        {isHost ? (
          <button
            onClick={onStartGame}
            disabled={state.players.length < 2}
            className={`w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all ${
              state.players.length >= 2
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white cursor-pointer active:scale-98 shadow-emerald-900/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            {state.players.length < 2 ? 'Need at least 2 players to start' : 'Start Game'}
          </button>
        ) : (
          <div className="text-center text-xs text-slate-400 italic py-2">
            Waiting for the host to start the game...
          </div>
        )}
      </div>
    </div>
  );
};

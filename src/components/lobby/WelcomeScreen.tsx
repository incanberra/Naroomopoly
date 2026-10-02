import React, { useState, useEffect } from 'react';
import { TOKENS } from '../../data/tokens';
import { TokenRenderer } from '../icons/TokenIcons';
import { PlusCircle, LogIn, Bot, Sparkles, HelpCircle } from 'lucide-react';

interface WelcomeScreenProps {
  onCreateGame: (name: string, token: string, settings: any, mode: 'online' | 'local' | 'bots') => void;
  onJoinGame: (code: string, name: string, token: string) => void;
  onOpenRules: () => void;
  defaultCode?: string;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onCreateGame,
  onJoinGame,
  onOpenRules,
  defaultCode = '',
}) => {
  const [mode, setMode] = useState<'welcome' | 'create' | 'join'>(defaultCode ? 'join' : 'welcome');
  const [name, setName] = useState<string>('');
  const [selectedToken, setSelectedToken] = useState<string>(TOKENS[0].id);
  const [joinCode, setJoinCode] = useState<string>(defaultCode);
  const [startingCash, setStartingCash] = useState<number>(1500);
  const [freeParkingJackpot, setFreeParkingJackpot] = useState<boolean>(false);
  const [gamePlayType, setGamePlayType] = useState<'multiplayer' | 'bots'>('multiplayer');

  useEffect(() => {
    if (defaultCode) {
      setJoinCode(defaultCode);
      setMode('join');
    }
  }, [defaultCode]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreateGame(
      name.trim(),
      selectedToken,
      { startingCash, freeParkingJackpot },
      gamePlayType === 'bots' ? 'bots' : 'online'
    );
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !joinCode.trim()) return;
    onJoinGame(joinCode.trim().toUpperCase(), name.trim(), selectedToken);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 sm:p-8 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col gap-6 text-slate-100 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          NSW South Coast Board Game
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent font-board">
          Naroom-opoly
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Multiplayer board game adventure from Batemans Bay to Narooma. Real South Coast places, traditional rules!
        </p>
      </div>

      {/* Main Choice Screen */}
      {mode === 'welcome' && (
        <div className="flex flex-col gap-3 py-4">
          <button
            onClick={() => setMode('create')}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-base flex items-center justify-center gap-3 shadow-xl transition-all active:scale-98 shadow-emerald-950/40"
          >
            <PlusCircle className="w-5 h-5" />
            Create a New Game
          </button>

          <button
            onClick={() => setMode('join')}
            className="w-full py-4 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-extrabold text-base flex items-center justify-center gap-3 border border-slate-700 transition-all active:scale-98 shadow-md"
          >
            <LogIn className="w-5 h-5 text-amber-400" />
            Join with Code or Link
          </button>

          <div className="pt-2 flex justify-center">
            <button
              onClick={onOpenRules}
              className="text-xs font-semibold text-slate-400 hover:text-amber-300 transition-colors flex items-center gap-1.5 py-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              How to Play / Rules
            </button>
          </div>
        </div>
      )}

      {/* Create Game Form */}
      {mode === 'create' && (
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Your Display Name
            </label>
            <input
              type="text"
              required
              maxLength={24}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Captain Clyde"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm font-semibold"
            />
          </div>

          {/* Token Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              Choose Your Coastal Token
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {TOKENS.map((token) => {
                const isSelected = selectedToken === token.id;
                return (
                  <button
                    key={token.id}
                    type="button"
                    onClick={() => setSelectedToken(token.id)}
                    className={`p-2.5 rounded-xl flex flex-col items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-2 border-amber-400 scale-105 shadow-md'
                        : 'bg-slate-950/60 border border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: token.defaultColor }}
                    >
                      <TokenRenderer tokenId={token.id} size={18} color="#FFFFFF" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 truncate w-full text-center">
                      {token.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mode Selector */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setGamePlayType('multiplayer')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                gamePlayType === 'multiplayer'
                  ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 shadow-sm'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400'
              }`}
            >
              👥 Online Multiplayer
            </button>
            <button
              type="button"
              onClick={() => setGamePlayType('bots')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                gamePlayType === 'bots'
                  ? 'bg-amber-950/60 border-amber-400 text-amber-300 shadow-sm'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400'
              }`}
            >
              🤖 Play vs AI Bots
            </button>
          </div>

          {/* Advanced Rules */}
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Starting Cash:</span>
              <select
                value={startingCash}
                onChange={(e) => setStartingCash(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs font-bold"
              >
                <option value={1000}>$1,000 (Fast Game)</option>
                <option value={1500}>$1,500 (Standard)</option>
                <option value={2000}>$2,000 (High Roller)</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Free Parking Jackpot Rule:</span>
              <input
                type="checkbox"
                checked={freeParkingJackpot}
                onChange={(e) => setFreeParkingJackpot(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setMode('welcome')}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg disabled:opacity-50"
            >
              Create Game
            </button>
          </div>
        </form>
      )}

      {/* Join Game Form */}
      {mode === 'join' && (
        <form onSubmit={handleJoinSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              5-Letter Game Code
            </label>
            <input
              type="text"
              required
              maxLength={5}
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="e.g. ABCDE"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 placeholder-slate-500 focus:outline-none focus:border-amber-400 text-lg font-black font-mono tracking-widest text-center uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Your Display Name
            </label>
            <input
              type="text"
              required
              maxLength={24}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Narooma Fisher"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm font-semibold"
            />
          </div>

          {/* Token Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              Preferred Coastal Token
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {TOKENS.map((token) => {
                const isSelected = selectedToken === token.id;
                return (
                  <button
                    key={token.id}
                    type="button"
                    onClick={() => setSelectedToken(token.id)}
                    className={`p-2.5 rounded-xl flex flex-col items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-2 border-amber-400 scale-105 shadow-md'
                        : 'bg-slate-950/60 border border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: token.defaultColor }}
                    >
                      <TokenRenderer tokenId={token.id} size={18} color="#FFFFFF" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 truncate w-full text-center">
                      {token.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setMode('welcome')}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !joinCode.trim()}
              className="flex-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg disabled:opacity-50"
            >
              Join Game
            </button>
          </div>
        </form>
      )}

      {/* Footer Disclaimer */}
      <footer className="text-center text-[10px] text-slate-500 pt-3 border-t border-slate-800/80">
        Naroom-opoly is a fan-made, non-commercial parody project celebrating the NSW South Coast. Not affiliated with Hasbro.
      </footer>
    </div>
  );
};

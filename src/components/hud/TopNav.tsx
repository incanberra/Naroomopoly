import React, { useState } from 'react';
import { Volume2, VolumeX, Share2, HelpCircle, LogOut, Check, Sun, Moon } from 'lucide-react';
import { audio } from '../../services/audioService';

interface TopNavProps {
  gameCode: string;
  onOpenRules: () => void;
  onLeaveGame: () => void;
  isLightTheme: boolean;
  onToggleTheme: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  gameCode,
  onOpenRules,
  onLeaveGame,
  isLightTheme,
  onToggleTheme,
}) => {
  const [isMuted, setIsMuted] = useState(audio.getMuted());
  const [copied, setCopied] = useState(false);

  const toggleSound = () => {
    const next = audio.toggleMute();
    setIsMuted(next);
  };

  const copyShareLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?join=${gameCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="w-full flex items-center justify-between px-3 sm:px-6 py-2 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="font-extrabold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent font-board drop-shadow-xs">
          Naroom-opoly
        </span>
        <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 px-2.5 py-1 rounded-xl shadow-inner">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
            CODE:
          </span>
          <span className="font-mono font-black text-amber-300 text-sm tracking-wider">
            {gameCode}
          </span>
          <button
            onClick={copyShareLink}
            title="Copy share link"
            className="ml-1 text-slate-400 hover:text-white transition-colors p-0.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Light / Dark Theme Toggle */}
        <button
          onClick={onToggleTheme}
          title={isLightTheme ? 'Switch to Coastal Dark Theme' : 'Switch to Sandy Light Theme'}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 transition-colors border border-slate-700/80"
        >
          {isLightTheme ? <Moon className="w-4 h-4 text-cyan-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* Mute Toggle */}
        <button
          onClick={toggleSound}
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/80"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>

        {/* Rules Guide Modal */}
        <button
          onClick={onOpenRules}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/80 text-xs font-bold"
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Rules</span>
        </button>

        {/* Leave Game */}
        <button
          onClick={onLeaveGame}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-red-100 transition-colors border border-red-800/50 text-xs font-bold"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Leave</span>
        </button>
      </div>
    </header>
  );
};

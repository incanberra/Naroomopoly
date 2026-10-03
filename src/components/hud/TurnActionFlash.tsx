import React from 'react';
import { SquareIllustration } from '../board/SquareIllustration';
import { TokenRenderer } from '../icons/TokenIcons';
import { GameCard } from '../../data/boardData';
import {
  Coins,
  TrendingDown,
  TrendingUp,
  Sparkles,
  ClipboardList,
  Building,
  Dices,
  ShieldAlert,
  Flame,
  X,
  Clock,
  Landmark,
} from 'lucide-react';

export interface TurnFlashData {
  id: string;
  category:
    | 'rent_deducted'
    | 'rent_collected'
    | 'rent_other'
    | 'card_drawn'
    | 'tax'
    | 'go'
    | 'unowned'
    | 'own_property'
    | 'jail'
    | 'dice_move'
    | 'property_bought'
    | 'auction'
    | 'general';
  title: string;
  subtitle: string;
  description?: string;
  amountChange?: number;
  oldBalance?: number;
  newBalance?: number;
  tileIndex?: number;
  tileName?: string;
  player?: {
    id: string;
    name: string;
    color: string;
    token: string;
    isMainPlayer?: boolean;
  };
  secondaryPlayer?: {
    id: string;
    name: string;
    color: string;
    token: string;
  };
  card?: GameCard;
  isNotice?: boolean;
  durationMs?: number;
}

interface TurnActionFlashProps {
  flash: TurnFlashData | null;
  onDismiss: () => void;
}

export const TurnActionFlash: React.FC<TurnActionFlashProps> = ({ flash, onDismiss }) => {
  if (!flash) return null;

  const getCategoryConfig = () => {
    switch (flash.category) {
      case 'rent_deducted':
        return {
          borderColor: 'border-red-500',
          shadow: 'shadow-[0_0_35px_rgba(239,68,68,0.45)]',
          headerBg: 'bg-red-950/70',
          badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40',
          icon: <TrendingDown className="w-4 h-4 text-red-400 animate-bounce" />,
          categoryLabel: 'RENT DEDUCTED',
          barColor: 'bg-gradient-to-r from-red-600 via-rose-500 to-amber-500',
        };
      case 'rent_collected':
        return {
          borderColor: 'border-emerald-500',
          shadow: 'shadow-[0_0_35px_rgba(16,185,129,0.45)]',
          headerBg: 'bg-emerald-950/70',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: <TrendingUp className="w-4 h-4 text-emerald-400 animate-bounce" />,
          categoryLabel: 'RENT COLLECTED',
          barColor: 'bg-gradient-to-r from-emerald-600 via-teal-400 to-amber-300',
        };
      case 'rent_other':
        return {
          borderColor: 'border-indigo-500',
          shadow: 'shadow-[0_0_30px_rgba(99,102,241,0.35)]',
          headerBg: 'bg-indigo-950/70',
          badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
          icon: <Coins className="w-4 h-4 text-indigo-400" />,
          categoryLabel: 'RENT PAYMENT',
          barColor: 'bg-gradient-to-r from-indigo-500 to-purple-400',
        };
      case 'card_drawn':
        return {
          borderColor: 'border-amber-400',
          shadow: 'shadow-[0_0_35px_rgba(245,158,11,0.45)]',
          headerBg: 'bg-amber-950/70',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: flash.isNotice ? <ClipboardList className="w-4 h-4 text-amber-400" /> : <Sparkles className="w-4 h-4 text-cyan-300" />,
          categoryLabel: flash.isNotice ? 'NOTICE BOARD CARD' : 'LOCAL KNOWLEDGE CARD',
          barColor: 'bg-gradient-to-r from-amber-500 to-yellow-300',
        };
      case 'tax':
        return {
          borderColor: 'border-rose-500',
          shadow: 'shadow-[0_0_30px_rgba(244,63,94,0.4)]',
          headerBg: 'bg-rose-950/70',
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          icon: <Landmark className="w-4 h-4 text-rose-400" />,
          categoryLabel: 'SHIRE RATES & TAX',
          barColor: 'bg-gradient-to-r from-rose-600 to-red-400',
        };
      case 'go':
        return {
          borderColor: 'border-teal-400',
          shadow: 'shadow-[0_0_35px_rgba(45,212,191,0.4)]',
          headerBg: 'bg-teal-950/70',
          badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
          icon: <Flame className="w-4 h-4 text-teal-400" />,
          categoryLabel: 'WELCOME TO THE SOUTH COAST',
          barColor: 'bg-gradient-to-r from-teal-500 to-emerald-400',
        };
      case 'unowned':
        return {
          borderColor: 'border-cyan-400',
          shadow: 'shadow-[0_0_35px_rgba(6,182,212,0.4)]',
          headerBg: 'bg-cyan-950/70',
          badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          icon: <Building className="w-4 h-4 text-cyan-400" />,
          categoryLabel: 'UNOWNED PROPERTY',
          barColor: 'bg-gradient-to-r from-cyan-500 to-blue-400',
        };
      case 'own_property':
        return {
          borderColor: 'border-blue-400',
          shadow: 'shadow-[0_0_30px_rgba(59,130,246,0.35)]',
          headerBg: 'bg-blue-950/70',
          badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          icon: <Building className="w-4 h-4 text-blue-400" />,
          categoryLabel: 'YOUR PROPERTY',
          barColor: 'bg-gradient-to-r from-blue-500 to-cyan-400',
        };
      case 'jail':
        return {
          borderColor: 'border-orange-500',
          shadow: 'shadow-[0_0_35px_rgba(249,115,22,0.45)]',
          headerBg: 'bg-orange-950/70',
          badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
          icon: <ShieldAlert className="w-4 h-4 text-orange-400 animate-pulse" />,
          categoryLabel: 'BODALLA POLICE STATION',
          barColor: 'bg-gradient-to-r from-orange-500 to-red-500',
        };
      case 'property_bought':
        return {
          borderColor: 'border-indigo-400',
          shadow: 'shadow-[0_0_30px_rgba(129,140,248,0.35)]',
          headerBg: 'bg-indigo-950/70',
          badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
          icon: <Building className="w-4 h-4 text-indigo-400" />,
          categoryLabel: 'PROPERTY PURCHASED',
          barColor: 'bg-gradient-to-r from-indigo-500 to-cyan-400',
        };
      case 'dice_move':
        return {
          borderColor: 'border-sky-500/80',
          shadow: 'shadow-[0_0_30px_rgba(14,165,233,0.35)]',
          headerBg: 'bg-sky-950/70',
          badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
          icon: <Dices className="w-4 h-4 text-sky-400" />,
          categoryLabel: "PLAYER'S TURN",
          barColor: 'bg-gradient-to-r from-sky-500 to-indigo-400',
        };
      default:
        return {
          borderColor: 'border-amber-400/80',
          shadow: 'shadow-[0_0_30px_rgba(245,158,11,0.3)]',
          headerBg: 'bg-slate-900/80',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: <Sparkles className="w-4 h-4 text-amber-400" />,
          categoryLabel: 'GAME ACTION',
          barColor: 'bg-gradient-to-r from-amber-500 to-yellow-400',
        };
    }
  };

  const cfg = getCategoryConfig();

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-14 left-1/2 -translate-x-1/2 z-50 w-[94vw] max-w-lg pointer-events-auto select-none"
    >
      <div
        className={`relative bg-slate-950/95 backdrop-blur-md border-2 ${cfg.borderColor} ${cfg.shadow} rounded-2xl overflow-hidden flex flex-col text-slate-100 animate-in slide-in-from-top-3 fade-in duration-200`}
      >
        {/* Top Header Bar */}
        <div className={`px-3.5 py-2 flex items-center justify-between border-b border-slate-800 ${cfg.headerBg}`}>
          <div className="flex items-center gap-2">
            {cfg.icon}
            <span className={`text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full border tracking-wide uppercase ${cfg.badgeBg}`}>
              {cfg.categoryLabel}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-bold">
              <Clock className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
              <span>3.5s</span>
            </div>
            <button
              onClick={onDismiss}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-3.5 flex items-center gap-3.5">
          {/* Left: Tile Illustration or Player Token */}
          {flash.tileIndex !== undefined ? (
            <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden shadow-lg border border-slate-700 bg-slate-900 flex items-center justify-center">
              <SquareIllustration index={flash.tileIndex} className="w-full h-full object-cover" />
            </div>
          ) : flash.player ? (
            <div
              className="flex-shrink-0 w-12 h-12 rounded-xl border border-white/20 shadow-lg flex items-center justify-center"
              style={{ backgroundColor: flash.player.color }}
            >
              <TokenRenderer tokenId={flash.player.token} size={26} color="#FFFFFF" />
            </div>
          ) : null}

          {/* Middle: Title, Subtitle, Description */}
          <div className="flex-1 min-w-0">
            {/* Player Attribution Badge if available */}
            {flash.player && (
              <div className="flex items-center gap-1.5 mb-0.5">
                <div
                  className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: flash.player.color }}
                >
                  <TokenRenderer tokenId={flash.player.token} size={8} color="#FFFFFF" />
                </div>
                <span className="text-[11px] font-extrabold text-slate-300 truncate">
                  {flash.player.name}
                  {flash.player.isMainPlayer ? ' (You)' : ''}
                </span>
                {flash.secondaryPlayer && (
                  <>
                    <span className="text-slate-500 text-[10px]">➔</span>
                    <div
                      className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: flash.secondaryPlayer.color }}
                    >
                      <TokenRenderer tokenId={flash.secondaryPlayer.token} size={8} color="#FFFFFF" />
                    </div>
                    <span className="text-[11px] font-extrabold text-slate-300 truncate">
                      {flash.secondaryPlayer.name}
                    </span>
                  </>
                )}
              </div>
            )}

            <h3 className="text-sm sm:text-base font-black text-white leading-snug tracking-tight truncate">
              {flash.title}
            </h3>

            <p className="text-xs font-semibold text-slate-300 leading-snug mt-0.5">
              {flash.subtitle}
            </p>

            {flash.description && (
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                {flash.description}
              </p>
            )}

            {/* Cash Impact Breakdown (e.g. Previous Cash -> New Cash) */}
            {flash.oldBalance !== undefined && flash.newBalance !== undefined && (
              <div className="flex items-center gap-2 mt-2 pt-1.5 border-t border-slate-800/80 text-[11px] font-bold">
                <span className="text-slate-400">Balance:</span>
                <span className="text-slate-400 line-through">${flash.oldBalance}</span>
                <span className="text-slate-500">➔</span>
                <span
                  className={
                    flash.newBalance > flash.oldBalance
                      ? 'text-emerald-400 font-extrabold text-xs'
                      : 'text-red-400 font-extrabold text-xs'
                  }
                >
                  ${flash.newBalance}
                </span>
                {flash.amountChange !== undefined && (
                  <span
                    className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-black border ${
                      flash.amountChange > 0
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-red-500/20 text-red-300 border-red-500/30'
                    }`}
                  >
                    {flash.amountChange > 0 ? `+$${flash.amountChange}` : `-$${Math.abs(flash.amountChange)}`}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Card Preview if Card Drawn */}
        {flash.card && (
          <div className="mx-3 mb-2.5 p-2 rounded-xl bg-slate-900 border border-slate-700/80 flex items-start gap-2">
            <div className="w-1.5 self-stretch rounded-full bg-amber-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider block">
                {flash.card.deck === 'notice' ? 'Community Notice Board' : 'Local Knowledge'}
              </span>
              <p className="text-xs font-bold text-slate-100">{flash.card.title}</p>
              <p className="text-[11px] text-slate-300 italic mt-0.5">{flash.card.description}</p>
            </div>
          </div>
        )}

        {/* 3.5s Animated Progress Countdown Bar */}
        <div className="w-full h-1.5 bg-slate-900 overflow-hidden">
          <div
            key={flash.id}
            className={`h-full ${cfg.barColor} animate-flash-timer`}
          />
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { GameState } from '../../engine/types';
import { BOARD_TILES } from '../../data/boardData';
import { getCurrentPlayer } from '../../engine/rules';
import {
  Dices,
  DollarSign,
  Gavel,
  CheckCircle2,
  Wrench,
  AlertTriangle,
  Key,
  ShieldAlert,
} from 'lucide-react';

interface ActionBarProps {
  state: GameState;
  myPlayerId: string;
  onAction: (action: any) => void;
  onOpenManageProperties: () => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  state,
  myPlayerId,
  onAction,
  onOpenManageProperties,
}) => {
  const currentPlayer = getCurrentPlayer(state);
  const isMyTurn = currentPlayer?.id === myPlayerId;
  const currentTile = BOARD_TILES[currentPlayer?.position ?? 0];
  const propState = state.properties[currentPlayer?.position ?? 0];

  if (!isMyTurn) {
    return (
      <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-3 text-center text-slate-400 text-xs sm:text-sm font-board backdrop-blur-md shadow-lg flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span>
          Waiting for <strong className="text-amber-300 font-bold">{currentPlayer?.name}</strong> to take their turn...
        </span>
      </div>
    );
  }

  const price = currentTile?.property?.price ?? currentTile?.hardware?.price ?? currentTile?.utility?.price ?? 0;
  const canAfford = currentPlayer.cash >= price;
  const canBuy = state.phase === 'rolled' && propState && propState.ownerId === null && canAfford;
  const hasJailCard = currentPlayer.jailCardsNotice > 0 || currentPlayer.jailCardsKnowledge > 0;

  return (
    <div className="w-full bg-slate-900/95 border-2 border-amber-500/80 rounded-3xl p-3 shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-3 sticky bottom-2 z-40 font-board">
      {/* Turn Status Message */}
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
        <div className="truncate text-xs sm:text-sm font-bold text-slate-100">
          {currentPlayer.inJail && state.phase === 'turn_start' && (
            <span className="text-amber-300 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              In Bodalla Police Station (Attempt {currentPlayer.jailTurns + 1}/3)
            </span>
          )}
          {!currentPlayer.inJail && state.phase === 'turn_start' && (
            <span>Your turn: Roll the dice to advance along the coast.</span>
          )}
          {state.phase === 'rolled' && (
            <span>
              Landed on <strong className="text-amber-300">{currentTile?.name}</strong>
              {price > 0 && propState?.ownerId === null && ` ($${price})`}
            </span>
          )}
          {state.phase === 'turn_end' && (
            <span>Turn complete. Manage properties or pass the dice.</span>
          )}
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Jail Decisions */}
        {currentPlayer.inJail && state.phase === 'turn_start' && (
          <>
            <button
              onClick={() => onAction({ type: 'PAY_JAIL_FINE' })}
              disabled={currentPlayer.cash < 50}
              title={currentPlayer.cash < 50 ? 'Requires $50 cash' : 'Pay $50 to release immediately'}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <DollarSign className="w-3.5 h-3.5" />
              Pay $50 Fine
            </button>

            {hasJailCard && (
              <button
                onClick={() => onAction({ type: 'USE_JAIL_CARD' })}
                className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
              >
                <Key className="w-3.5 h-3.5" />
                Use Jail Card
              </button>
            )}

            <button
              onClick={() => onAction({ type: 'ROLL_DICE' })}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg transition-all active:scale-95"
            >
              <Dices className="w-4 h-4" />
              Roll for Doubles
            </button>
          </>
        )}

        {/* Regular Roll */}
        {!currentPlayer.inJail && state.phase === 'turn_start' && (
          <button
            onClick={() => onAction({ type: 'ROLL_DICE' })}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-emerald-950/50 transition-all active:scale-95 animate-pulse"
          >
            <Dices className="w-4 h-4" />
            Roll Dice
          </button>
        )}

        {/* Buying Property or Declining to Public Auction */}
        {state.phase === 'rolled' && propState && propState.ownerId === null && (
          <>
            <button
              onClick={() => onAction({ type: 'BUY_PROPERTY' })}
              disabled={!canBuy}
              title={!canAfford ? `Insufficient funds ($${price} required)` : 'Buy this deed'}
              className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all active:scale-95 ${
                canBuy
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-white shadow-emerald-900/40'
                  : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              Buy for ${price}
            </button>

            <button
              onClick={() => onAction({ type: 'DECLINE_PROPERTY' })}
              className="px-3.5 py-2 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all active:scale-95"
              title="Decline property and put it up for public auction to all players"
            >
              <Gavel className="w-4 h-4" />
              Decline (Auction)
            </button>
          </>
        )}

        {/* Manage Properties button */}
        <button
          onClick={onOpenManageProperties}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 border border-slate-700/80 transition-colors"
          title="Build or sell houses, mortgage or unmortgage properties"
        >
          <Wrench className="w-3.5 h-3.5 text-cyan-400" />
          Manage Properties
        </button>

        {/* Roll again if doubles */}
        {!state.hasRolled && state.phase === 'turn_end' && (
          <button
            onClick={() => onAction({ type: 'ROLL_DICE' })}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg transition-all active:scale-95 animate-bounce"
          >
            <Dices className="w-4 h-4" />
            Roll Again (Doubles!)
          </button>
        )}

        {/* End Turn */}
        {state.phase === 'turn_end' && state.hasRolled && (
          <button
            onClick={() => onAction({ type: 'END_TURN' })}
            disabled={currentPlayer.cash < 0}
            title={currentPlayer.cash < 0 ? 'Clear negative balance before ending turn' : 'Complete your turn'}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xl transition-all active:scale-95 ${
              currentPlayer.cash < 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950/40'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            End Turn
          </button>
        )}

        {/* Emergency Bankruptcy */}
        {currentPlayer.cash < 0 && (
          <button
            onClick={() => {
              if (window.confirm('Declare bankruptcy? All your assets will be liquidated and you will be eliminated.')) {
                onAction({ type: 'DECLARE_BANKRUPTCY' });
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-red-800 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <AlertTriangle className="w-4 h-4" />
            Declare Bankruptcy
          </button>
        )}
      </div>
    </div>
  );
};

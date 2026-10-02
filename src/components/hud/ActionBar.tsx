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
      <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center text-slate-400 text-xs sm:text-sm font-medium backdrop-blur-md">
        Waiting for <span className="font-bold text-amber-300">{currentPlayer?.name}</span> to complete their turn...
      </div>
    );
  }

  const price = currentTile?.property?.price ?? currentTile?.hardware?.price ?? currentTile?.utility?.price ?? 0;
  const canBuy = state.phase === 'rolled' && propState && propState.ownerId === null && currentPlayer.cash >= price;
  const hasJailCard = currentPlayer.jailCardsNotice > 0 || currentPlayer.jailCardsKnowledge > 0;

  return (
    <div className="w-full bg-slate-900/95 border-2 border-amber-500/60 rounded-xl p-3 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
      {/* Status Description */}
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
        <span className="text-xs sm:text-sm font-bold text-slate-100">
          {currentPlayer.inJail && state.phase === 'turn_start' && 'You are in Bodalla Police Station!'}
          {!currentPlayer.inJail && state.phase === 'turn_start' && 'Roll the dice to move.'}
          {state.phase === 'rolled' && `Landed on ${currentTile?.name}.`}
          {state.phase === 'turn_end' && 'Manage your properties or end your turn.'}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Jail Choices */}
        {currentPlayer.inJail && state.phase === 'turn_start' && (
          <>
            {currentPlayer.cash >= 50 && (
              <button
                onClick={() => onAction({ type: 'PAY_JAIL_FINE' })}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
              >
                <DollarSign className="w-4 h-4" />
                Pay $50 Fine
              </button>
            )}

            {hasJailCard && (
              <button
                onClick={() => onAction({ type: 'USE_JAIL_CARD' })}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
              >
                <Key className="w-4 h-4" />
                Use Jail Card
              </button>
            )}

            <button
              onClick={() => onAction({ type: 'ROLL_DICE' })}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <Dices className="w-4 h-4" />
              Try Doubles
            </button>
          </>
        )}

        {/* Regular Roll */}
        {!currentPlayer.inJail && state.phase === 'turn_start' && (
          <button
            onClick={() => onAction({ type: 'ROLL_DICE' })}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all active:scale-95 animate-pulse"
          >
            <Dices className="w-4 h-4" />
            Roll Dice
          </button>
        )}

        {/* Purchase or Decline / Auction */}
        {state.phase === 'rolled' && propState && propState.ownerId === null && (
          <>
            <button
              onClick={() => onAction({ type: 'BUY_PROPERTY' })}
              disabled={!canBuy}
              className={`px-4 py-2 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all active:scale-95 ${
                canBuy
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-emerald-900/30'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              Buy for ${price}
            </button>

            <button
              onClick={() => onAction({ type: 'DECLINE_PROPERTY' })}
              className="px-3.5 py-2 rounded-lg bg-amber-700/80 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <Gavel className="w-4 h-4" />
              Decline (Auction)
            </button>
          </>
        )}

        {/* Manage Properties Modal */}
        <button
          onClick={onOpenManageProperties}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 border border-slate-700/70 transition-colors"
        >
          <Wrench className="w-3.5 h-3.5 text-cyan-400" />
          Manage Properties
        </button>

        {/* If rolled doubles and entitled to roll again */}
        {!state.hasRolled && state.phase === 'turn_end' && (
          <button
            onClick={() => onAction({ type: 'ROLL_DICE' })}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all active:scale-95 animate-bounce"
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
            className={`px-4 py-2 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all active:scale-95 ${
              currentPlayer.cash < 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            End Turn
          </button>
        )}

        {/* Bankruptcy Trigger if negative cash */}
        {currentPlayer.cash < 0 && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to declare bankruptcy and surrender your assets?')) {
                onAction({ type: 'DECLARE_BANKRUPTCY' });
              }
            }}
            className="px-3 py-1.5 rounded-lg bg-red-800 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <AlertTriangle className="w-4 h-4" />
            Declare Bankruptcy
          </button>
        )}
      </div>
    </div>
  );
};

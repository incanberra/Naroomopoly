import React from 'react';
import { BOARD_TILES, COLOR_GROUP_CONFIG } from '../../data/boardData';
import { GameState } from '../../engine/types';
import {
  canBuildHouse,
  canSellHouse,
  canMortgage,
  canUnmortgage,
} from '../../engine/rules';
import { X, Home, Building2, DollarSign, ShieldAlert, AlertCircle } from 'lucide-react';

interface ManagePropertiesModalProps {
  state: GameState;
  myPlayerId: string;
  onClose: () => void;
  onAction: (action: any) => void;
}

export const ManagePropertiesModal: React.FC<ManagePropertiesModalProps> = ({
  state,
  myPlayerId,
  onClose,
  onAction,
}) => {
  const myPlayer = state.players.find((p) => p.id === myPlayerId);
  const myProps = Object.values(state.properties).filter(
    (p) => p.ownerId === myPlayerId
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl max-h-[85vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col text-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 font-board">
        {/* Header */}
        <div className="p-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-amber-300 font-board">Property Management</h2>
            <p className="text-xs text-slate-400 font-sans">
              Build houses, hotels, mortgage or unmortgage your properties.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Inventory Summary */}
        <div className="px-4 py-2 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-300">
          <span>Your Cash: <strong className="text-emerald-400">${myPlayer?.cash}</strong></span>
          <span>Bank: {state.bankHousesRemaining} Houses • {state.bankHotelsRemaining} Hotels</span>
        </div>

        {/* Properties List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {myProps.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              You do not own any properties yet. Land on unowned spaces or trade with players!
            </div>
          ) : (
            myProps.map((prop) => {
              const tile = BOARD_TILES[prop.tileIndex];
              const colorConfig = tile.property
                ? COLOR_GROUP_CONFIG[tile.property.colorGroup]
                : null;

              const buildCheck = canBuildHouse(state, myPlayerId, prop.tileIndex);
              const sellCheck = canSellHouse(state, myPlayerId, prop.tileIndex);
              const mortgageCheck = canMortgage(state, myPlayerId, prop.tileIndex);
              const unmortgageCheck = canUnmortgage(state, myPlayerId, prop.tileIndex);

              return (
                <div
                  key={prop.tileIndex}
                  className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  {/* Property Name & Group */}
                  <div className="flex items-center gap-2.5">
                    {colorConfig ? (
                      <div
                        className="w-4 h-9 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: colorConfig.color }}
                      />
                    ) : (
                      <div className="w-4 h-9 bg-slate-600 rounded-sm flex-shrink-0" />
                    )}
                    <div>
                      <div className="font-bold text-sm text-slate-100">{tile.name}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        {tile.property && (
                          <span>
                            {prop.houses === 5 ? (
                              <strong className="text-amber-400">Hotel Built</strong>
                            ) : prop.houses > 0 ? (
                              <strong className="text-emerald-400">{prop.houses} Houses</strong>
                            ) : (
                              '0 Houses'
                            )}
                          </span>
                        )}
                        {prop.isMortgaged && (
                          <span className="text-red-400 font-bold uppercase tracking-wider text-[10px]">
                            [Mortgaged]
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions for this property */}
                  <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto justify-end">
                    {/* Build House */}
                    {tile.property && prop.houses < 5 && (
                      <button
                        onClick={() =>
                          onAction({ type: 'BUILD_HOUSE', tileIndex: prop.tileIndex })
                        }
                        disabled={!buildCheck.canBuild}
                        title={buildCheck.reason}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                          buildCheck.canBuild
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                            : 'bg-slate-700/60 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Home className="w-3.5 h-3.5" />
                        Build (${tile.property.houseCost})
                      </button>
                    )}

                    {/* Sell House */}
                    {tile.property && prop.houses > 0 && (
                      <button
                        onClick={() =>
                          onAction({ type: 'SELL_HOUSE', tileIndex: prop.tileIndex })
                        }
                        disabled={!sellCheck.canSell}
                        title={sellCheck.reason}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                          sellCheck.canSell
                            ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-sm'
                            : 'bg-slate-700/60 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        Sell (+${Math.floor(tile.property.houseCost / 2)})
                      </button>
                    )}

                    {/* Mortgage */}
                    {!prop.isMortgaged ? (
                      <button
                        onClick={() =>
                          onAction({ type: 'MORTGAGE_PROPERTY', tileIndex: prop.tileIndex })
                        }
                        disabled={!mortgageCheck.canMortgage}
                        title={mortgageCheck.reason}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                          mortgageCheck.canMortgage
                            ? 'bg-red-800/80 hover:bg-red-700 text-white shadow-sm'
                            : 'bg-slate-700/60 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        Mortgage (+${tile.property?.mortgageValue ?? tile.hardware?.mortgageValue ?? tile.utility?.mortgageValue})
                      </button>
                    ) : (
                      /* Unmortgage */
                      <button
                        onClick={() =>
                          onAction({ type: 'UNMORTGAGE_PROPERTY', tileIndex: prop.tileIndex })
                        }
                        disabled={!unmortgageCheck.canUnmortgage}
                        title={unmortgageCheck.reason}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                          unmortgageCheck.canUnmortgage
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                            : 'bg-slate-700/60 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        Unmortgage (-${unmortgageCheck.cost})
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

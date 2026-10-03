import React, { useState } from 'react';
import { BOARD_TILES, COLOR_GROUP_CONFIG } from '../../data/boardData';
import { GameState, TradeOffer } from '../../engine/types';
import { X, ArrowLeftRight, Check, Ban } from 'lucide-react';

interface TradeModalProps {
  state: GameState;
  myPlayerId: string;
  targetPlayerId: string | null;
  onClose: () => void;
  onAction: (action: any) => void;
}

export const TradeModal: React.FC<TradeModalProps> = ({
  state,
  myPlayerId,
  targetPlayerId,
  onClose,
  onAction,
}) => {
  const activeTrade = state.activeTrade;
  const isIncomingTrade = activeTrade && activeTrade.toPlayerId === myPlayerId;

  // Trading setup state for proposing a trade
  const [partnerId, setPartnerId] = useState<string>(
    targetPlayerId ||
      state.players.find((p) => p.id !== myPlayerId && !p.isBankrupt)?.id ||
      ''
  );
  const [offerCash, setOfferCash] = useState<number>(0);
  const [requestCash, setRequestCash] = useState<number>(0);
  const [offerProps, setOfferProps] = useState<number[]>([]);
  const [requestProps, setRequestProps] = useState<number[]>([]);
  const [offerJailCards, setOfferJailCards] = useState<number>(0);
  const [requestJailCards, setRequestJailCards] = useState<number>(0);

  const myPlayer = state.players.find((p) => p.id === myPlayerId);
  const partnerPlayer = state.players.find((p) => p.id === (isIncomingTrade ? activeTrade.fromPlayerId : partnerId));

  const myProperties = Object.values(state.properties).filter(
    (p) => p.ownerId === myPlayerId
  );
  const partnerProperties = Object.values(state.properties).filter(
    (p) => p.ownerId === partnerPlayer?.id
  );

  const toggleOfferProp = (idx: number) => {
    setOfferProps((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const toggleRequestProp = (idx: number) => {
    setRequestProps((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleProposeTrade = async () => {
    if (!partnerPlayer) return;
    const res: any = await onAction({
      type: 'PROPOSE_TRADE',
      offer: {
        fromPlayerId: myPlayerId,
        toPlayerId: partnerPlayer.id,
        offerCash,
        offerProperties: offerProps,
        offerJailCards,
        requestCash,
        requestProperties: requestProps,
        requestJailCards,
      },
    });
    // Keep the form open (with the error toast) if the engine rejected the offer
    if (!res || res.success !== false) onClose();
  };

  // Proposer's view after sending: offer summary + waiting state + cancel
  const isOutgoingPending = Boolean(activeTrade && activeTrade.fromPlayerId === myPlayerId);
  if (isOutgoingPending && activeTrade) {
    const recipient = state.players.find((p) => p.id === activeTrade.toPlayerId);
    const names = (list: number[]) => list.map((i) => BOARD_TILES[i]?.name).join(', ') || 'nothing';
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl text-slate-100 overflow-hidden font-board">
          <div className="p-4 bg-slate-800/90 border-b border-slate-700 flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-amber-300 font-board">Offer sent</h2>
          </div>
          <div className="p-4 space-y-3 text-sm">
            <div className="flex items-center gap-2 text-cyan-300 font-semibold font-board">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Waiting for {recipient?.name ?? 'the other player'} to respond…
            </div>
            <div className="bg-slate-800/60 rounded-2xl p-3 space-y-1.5 text-xs font-sans">
              <div>
                <span className="text-slate-400">You give: </span>
                <strong className="text-emerald-400 font-bold">${activeTrade.offerCash}</strong> + {names(activeTrade.offerProperties)}
              </div>
              <div>
                <span className="text-slate-400">You get: </span>
                <strong className="text-emerald-400 font-bold">${activeTrade.requestCash}</strong> + {names(activeTrade.requestProperties)}
              </div>
            </div>
          </div>
          <div className="p-4 bg-slate-800/90 border-t border-slate-700 flex justify-end gap-3">
            <button
              onClick={() => {
                onAction({ type: 'CANCEL_TRADE' });
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-200 text-xs font-bold font-board flex items-center gap-1.5 transition-colors"
            >
              <Ban className="w-4 h-4" />
              Cancel offer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col text-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 font-board">
        {/* Header */}
        <div className="p-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-amber-300 font-board">
                {isIncomingTrade ? 'Incoming Trade Offer' : 'Trade Negotiation'}
              </h2>
              <p className="text-xs text-slate-400">
                {isIncomingTrade
                  ? `${partnerPlayer?.name} has proposed a trade to you.`
                  : 'Trade properties, cash, or jail cards with another player.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Trade Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Partner Selector if creating trade */}
          {!isIncomingTrade && (
            <div className="flex items-center gap-2 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
              <span className="text-xs font-semibold text-slate-400">Trading with:</span>
              <select
                value={partnerId}
                onChange={(e) => {
                  setPartnerId(e.target.value);
                  setRequestProps([]);
                }}
                className="bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-2.5 py-1 text-xs font-bold"
              >
                {state.players
                  .filter((p) => p.id !== myPlayerId && !p.isBankrupt)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (${p.cash})
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Trade Offer Layout: Side by Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Left Side: What You Offer */}
            <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/70 space-y-3">
              <h3 className="font-bold text-sm text-cyan-300">
                {isIncomingTrade ? `${partnerPlayer?.name} Offers:` : 'You Offer:'}
              </h3>

              {/* Cash Slider / Input */}
              {!isIncomingTrade ? (
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Cash Offer:</span>
                    <strong className="text-emerald-400">${offerCash}</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={myPlayer?.cash ?? 0}
                    step="10"
                    value={offerCash}
                    onChange={(e) => setOfferCash(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
              ) : (
                <div className="text-sm font-bold text-emerald-400">
                  Cash: ${activeTrade.offerCash}
                </div>
              )}

              {/* Properties Offered */}
              <div>
                <span className="text-xs font-semibold text-slate-400">Properties:</span>
                <div className="mt-1.5 space-y-1 max-h-36 overflow-y-auto">
                  {!isIncomingTrade ? (
                    myProperties.length === 0 ? (
                      <div className="text-xs text-slate-500 italic">No properties owned</div>
                    ) : (
                      myProperties.map((p) => {
                        const tile = BOARD_TILES[p.tileIndex];
                        const isSelected = offerProps.includes(p.tileIndex);
                        return (
                          <label
                            key={p.tileIndex}
                            className={`flex items-center gap-2 p-1.5 rounded cursor-pointer text-xs ${
                              isSelected ? 'bg-cyan-950/60 border border-cyan-500/50' : 'bg-slate-900/60'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleOfferProp(p.tileIndex)}
                              className="accent-cyan-500"
                            />
                            <span>{tile.name}</span>
                          </label>
                        );
                      })
                    )
                  ) : (
                    activeTrade.offerProperties.map((idx) => (
                      <div key={idx} className="p-1 text-xs text-slate-200">
                        • {BOARD_TILES[idx].name}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Side: What You Request */}
            <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/70 space-y-3">
              <h3 className="font-bold text-sm text-amber-300">
                {isIncomingTrade ? 'They Request from You:' : 'You Request:'}
              </h3>

              {/* Cash Requested */}
              {!isIncomingTrade ? (
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Cash Requested:</span>
                    <strong className="text-emerald-400">${requestCash}</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={partnerPlayer?.cash ?? 0}
                    step="10"
                    value={requestCash}
                    onChange={(e) => setRequestCash(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              ) : (
                <div className="text-sm font-bold text-emerald-400">
                  Cash: ${activeTrade.requestCash}
                </div>
              )}

              {/* Properties Requested */}
              <div>
                <span className="text-xs font-semibold text-slate-400">Properties:</span>
                <div className="mt-1.5 space-y-1 max-h-36 overflow-y-auto">
                  {!isIncomingTrade ? (
                    partnerProperties.length === 0 ? (
                      <div className="text-xs text-slate-500 italic">No properties owned</div>
                    ) : (
                      partnerProperties.map((p) => {
                        const tile = BOARD_TILES[p.tileIndex];
                        const isSelected = requestProps.includes(p.tileIndex);
                        return (
                          <label
                            key={p.tileIndex}
                            className={`flex items-center gap-2 p-1.5 rounded cursor-pointer text-xs ${
                              isSelected ? 'bg-amber-950/60 border border-amber-500/50' : 'bg-slate-900/60'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleRequestProp(p.tileIndex)}
                              className="accent-amber-500"
                            />
                            <span>{tile.name}</span>
                          </label>
                        );
                      })
                    )
                  ) : (
                    activeTrade.requestProperties.map((idx) => (
                      <div key={idx} className="p-1 text-xs text-slate-200">
                        • {BOARD_TILES[idx].name}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-800/90 border-t border-slate-700 flex items-center justify-end gap-3">
          {isIncomingTrade ? (
            <>
              <button
                onClick={() => {
                  onAction({ type: 'REJECT_TRADE' });
                  onClose();
                }}
                className="px-4 py-2 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Ban className="w-4 h-4" />
                Reject Trade
              </button>
              <button
                onClick={() => {
                  onAction({ type: 'ACCEPT_TRADE' });
                  onClose();
                }}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md"
              >
                <Check className="w-4 h-4" />
                Accept Trade
              </button>
            </>
          ) : (
            <button
              onClick={handleProposeTrade}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md"
            >
              <ArrowLeftRight className="w-4 h-4" />
              Send Trade Offer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

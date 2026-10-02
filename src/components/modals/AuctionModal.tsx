import React, { useState } from 'react';
import { BOARD_TILES, COLOR_GROUP_CONFIG } from '../../data/boardData';
import { GameState } from '../../engine/types';
import { Gavel, DollarSign, Ban } from 'lucide-react';

interface AuctionModalProps {
  state: GameState;
  myPlayerId: string;
  onAction: (action: any) => void;
}

export const AuctionModal: React.FC<AuctionModalProps> = ({
  state,
  myPlayerId,
  onAction,
}) => {
  const auction = state.activeAuction;
  if (!auction) return null;

  const tile = BOARD_TILES[auction.tileIndex];
  const myPlayer = state.players.find((p) => p.id === myPlayerId);
  const highestBidder = auction.highestBidderId
    ? state.players.find((p) => p.id === auction.highestBidderId)
    : null;
  const isHighestBidder = auction.highestBidderId === myPlayerId;
  const hasPassed = !auction.activeBidderIds.includes(myPlayerId);
  const colorConfig = tile?.property ? COLOR_GROUP_CONFIG[tile.property.colorGroup] : null;

  const [customBid, setCustomBid] = useState<number>(auction.minNextBid);

  const placeBid = (amount: number) => {
    onAction({ type: 'PLACE_AUCTION_BID', amount });
  };

  const passAuction = () => {
    onAction({ type: 'PASS_AUCTION' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-amber-500 rounded-2xl shadow-2xl flex flex-col text-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-amber-600 to-amber-700 text-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gavel className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-black tracking-tight uppercase">Public Auction!</h2>
              <p className="text-xs font-semibold text-slate-900/80">
                Highest bidder claims the deed
              </p>
            </div>
          </div>
        </div>

        {/* Property Being Auctioned */}
        <div className="p-4 space-y-4">
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center gap-3">
            {colorConfig ? (
              <div
                className="w-4 h-12 rounded-sm flex-shrink-0"
                style={{ backgroundColor: colorConfig.color }}
              />
            ) : (
              <div className="w-4 h-12 bg-slate-700 rounded-sm flex-shrink-0" />
            )}
            <div>
              <div className="font-extrabold text-base text-slate-100">{tile.name}</div>
              <div className="text-xs text-slate-400">
                Original Price: ${tile.property?.price ?? tile.hardware?.price ?? tile.utility?.price}
              </div>
            </div>
          </div>

          {/* Current Bid Display */}
          <div className="text-center p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
            <div className="text-xs uppercase font-bold text-slate-400">Current Highest Bid</div>
            <div className="text-3xl font-black text-amber-400">
              ${auction.currentBid}
            </div>
            <div className="text-xs text-slate-300 font-medium">
              {highestBidder ? (
                <span>
                  Held by <strong style={{ color: highestBidder.color }}>{highestBidder.name}</strong>
                  {isHighestBidder && ' (You!)'}
                </span>
              ) : (
                <span className="italic text-slate-400">No bids placed yet</span>
              )}
            </div>
          </div>

          {/* Active Bidders Status */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Remaining Bidders:</span>
            <div className="flex gap-1.5 font-bold">
              {auction.activeBidderIds.map((id) => {
                const p = state.players.find((pl) => pl.id === id);
                return (
                  <span key={id} style={{ color: p?.color }}>
                    {p?.name}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Player controls */}
          {hasPassed ? (
            <div className="text-center p-3 rounded-xl bg-slate-800/40 text-slate-500 font-semibold text-xs">
              You have passed on this auction.
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => placeBid(auction.minNextBid)}
                  disabled={myPlayer && myPlayer.cash < auction.minNextBid}
                  className="py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  Bid ${auction.minNextBid}
                </button>
                <button
                  onClick={() => placeBid(auction.currentBid + 50)}
                  disabled={myPlayer && myPlayer.cash < auction.currentBid + 50}
                  className="py-2.5 px-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  +$50 (${auction.currentBid + 50})
                </button>
                <button
                  onClick={() => placeBid(auction.currentBid + 100)}
                  disabled={myPlayer && myPlayer.cash < auction.currentBid + 100}
                  className="py-2.5 px-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  +$100 (${auction.currentBid + 100})
                </button>
              </div>

              <button
                onClick={passAuction}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-red-950/60 text-slate-300 hover:text-red-300 border border-slate-700/80 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Ban className="w-4 h-4" />
                Pass (Withdraw from Auction)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

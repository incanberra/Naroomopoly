import React, { useState, useEffect, useRef } from 'react';
import { BOARD_TILES, COLOR_GROUP_CONFIG } from '../../data/boardData';
import { GameState } from '../../engine/types';
import { Gavel, Ban, Clock, Award } from 'lucide-react';
import { SquareIllustration } from '../board/SquareIllustration';
import { TokenRenderer } from '../icons/TokenIcons';

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

  // 6-Second Auction Hammer Countdown Timer
  const [secondsRemaining, setSecondsRemaining] = useState<number>(6);
  const lastBidRef = useRef<number>(auction.currentBid);
  const lastBidderRef = useRef<string | null>(auction.highestBidderId);

  // Reset hammer timer whenever a new bid is placed
  useEffect(() => {
    if (
      auction.currentBid !== lastBidRef.current ||
      auction.highestBidderId !== lastBidderRef.current
    ) {
      lastBidRef.current = auction.currentBid;
      lastBidderRef.current = auction.highestBidderId;
      setSecondsRemaining(6);
    }
  }, [auction.currentBid, auction.highestBidderId]);

  // Tick countdown timer every 1000ms
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [auction.currentBid, auction.highestBidderId]);

  // When timer reaches 0, cleanly conclude auction via side-effect
  const hasConcludedRef = useRef<boolean>(false);
  useEffect(() => {
    hasConcludedRef.current = false;
  }, [auction.tileIndex, auction.currentBid, auction.highestBidderId]);

  useEffect(() => {
    if (secondsRemaining === 0 && !hasConcludedRef.current) {
      hasConcludedRef.current = true;
      onAction({ type: 'CONCLUDE_AUCTION' });
    }
  }, [secondsRemaining, onAction]);

  const placeBid = (amount: number) => {
    onAction({ type: 'PLACE_AUCTION_BID', amount });
  };

  const passAuction = () => {
    onAction({ type: 'PASS_AUCTION' });
  };

  // Hammer call phrase based on remaining seconds
  const getHammerText = () => {
    if (!highestBidder) {
      return secondsRemaining <= 3 ? 'Going once... Any opening bids?' : 'Open for bids!';
    }
    if (secondsRemaining <= 1) {
      return 'Going THREE TIMES... SOLD!';
    }
    if (secondsRemaining <= 2) {
      return 'Going TWICE...';
    }
    if (secondsRemaining <= 4) {
      return 'Going ONCE...';
    }
    return 'Bidding Active';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-amber-500 rounded-2xl shadow-2xl flex flex-col text-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header with Live Gavel Hammer Status */}
        <div className="p-4 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-slate-950 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <Gavel className="w-6 h-6 animate-pulse" />
            <div>
              <h2 className="text-lg font-black tracking-tight uppercase">Public Auction!</h2>
              <p className="text-xs font-bold text-amber-950">
                {getHammerText()}
              </p>
            </div>
          </div>

          {/* Countdown Clock Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-xs border shadow-inner ${
              secondsRemaining <= 2
                ? 'bg-red-600 text-white border-red-400 animate-bounce'
                : secondsRemaining <= 4
                ? 'bg-amber-400 text-slate-950 border-amber-300'
                : 'bg-slate-950/80 text-amber-300 border-amber-500/50'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{secondsRemaining}s</span>
          </div>
        </div>

        {/* Hammer Progress Countdown Bar */}
        <div className="w-full h-1.5 bg-slate-950 overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ease-linear ${
              secondsRemaining <= 2
                ? 'bg-red-500'
                : secondsRemaining <= 4
                ? 'bg-amber-400'
                : 'bg-emerald-400'
            }`}
            style={{ width: `${(secondsRemaining / 6) * 100}%` }}
          />
        </div>

        {/* Property Being Auctioned */}
        <div className="p-4 space-y-4">
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl overflow-hidden shadow-lg border border-slate-700 bg-slate-900 flex-shrink-0">
              <SquareIllustration index={auction.tileIndex} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-black text-base text-slate-100 truncate">{tile.name}</div>
              <div className="text-xs font-semibold text-slate-400 flex items-center gap-2 mt-0.5">
                <span>
                  Original Value: ${tile.property?.price ?? tile.hardware?.price ?? tile.utility?.price ?? 100}
                </span>
                {colorConfig && (
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full border border-white/30"
                    style={{ backgroundColor: colorConfig.color }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Current Bid Display */}
          <div className="text-center p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
            <div className="text-xs uppercase font-bold text-slate-400">Current Highest Bid</div>
            <div className="text-3xl font-black text-amber-400">
              ${auction.currentBid}
            </div>
            <div className="text-xs text-slate-300 font-medium pt-1">
              {highestBidder ? (
                <div className="flex items-center justify-center gap-1.5">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: highestBidder.color }}
                  >
                    <TokenRenderer tokenId={highestBidder.token} size={10} color="#FFFFFF" />
                  </div>
                  <span>
                    Held by <strong style={{ color: highestBidder.color }}>{highestBidder.name}</strong>
                    {isHighestBidder && ' (You!)'}
                  </span>
                </div>
              ) : (
                <span className="italic text-slate-400">No bids placed yet — Starting bid is ${auction.minNextBid}</span>
              )}
            </div>
          </div>

          {/* Active Bidders Status */}
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold">Remaining Bidders:</span>
            <div className="flex flex-wrap gap-1.5 justify-end">
              {auction.activeBidderIds.map((id) => {
                const p = state.players.find((pl) => pl.id === id);
                const isMe = id === myPlayerId;
                return (
                  <span
                    key={id}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-extrabold border bg-slate-900 border-slate-700"
                    style={{ color: p?.color }}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: p?.color }}
                    />
                    {isMe ? 'You' : p?.name.split(' ')[0]}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Player controls */}
          {hasPassed ? (
            <div className="text-center p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-slate-400 font-semibold text-xs flex flex-col items-center gap-1">
              <span>You have withdrawn from this auction.</span>
              <span className="text-amber-400 text-[11px]">
                Waiting for auction to conclude ({secondsRemaining}s)...
              </span>
            </div>
          ) : isHighestBidder ? (
            <div className="space-y-2">
              <div className="text-center p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>You hold the highest bid! Auction sells to you in {secondsRemaining}s.</span>
              </div>
              <button
                onClick={passAuction}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-300 border border-slate-700/80 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Ban className="w-4 h-4" />
                Withdraw from Auction
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => placeBid(auction.minNextBid)}
                  disabled={Boolean(myPlayer && myPlayer.cash < auction.minNextBid)}
                  className="py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 disabled:opacity-40"
                >
                  Bid ${auction.minNextBid}
                </button>
                <button
                  onClick={() => placeBid(auction.currentBid + 50)}
                  disabled={Boolean(myPlayer && myPlayer.cash < auction.currentBid + 50)}
                  className="py-2.5 px-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 disabled:opacity-40"
                >
                  +${50} (${auction.currentBid + 50})
                </button>
                <button
                  onClick={() => placeBid(auction.currentBid + 100)}
                  disabled={Boolean(myPlayer && myPlayer.cash < auction.currentBid + 100)}
                  className="py-2.5 px-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 disabled:opacity-40"
                >
                  +${100} (${auction.currentBid + 100})
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

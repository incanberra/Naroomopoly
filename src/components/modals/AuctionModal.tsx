import React, { useState, useEffect, useRef } from 'react';
import { BOARD_TILES, COLOR_GROUP_CONFIG } from '../../data/boardData';
import { GameState } from '../../engine/types';
import { Gavel, Ban, Award } from 'lucide-react';
import { SquareIllustration } from '../board/SquareIllustration';
import { TokenRenderer } from '../icons/TokenIcons';

const RING_R = 18;
const RING_C = 2 * Math.PI * RING_R;

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

  // Quick-bid options: minimum, then +10/+50/+100 over the current bid (deduplicated)
  const quickBids = (() => {
    const options = [
      { label: 'Min bid', amount: auction.minNextBid, className: 'bg-emerald-600 hover:bg-emerald-500' },
      { label: '+$10', amount: auction.currentBid + 10, className: 'bg-teal-600 hover:bg-teal-500' },
      { label: '+$50', amount: auction.currentBid + 50, className: 'bg-cyan-600 hover:bg-cyan-500' },
      { label: '+$100', amount: auction.currentBid + 100, className: 'bg-sky-600 hover:bg-sky-500' },
    ].filter((o) => o.amount >= auction.minNextBid);
    return options.filter((o, i) => options.findIndex((x) => x.amount === o.amount) === i);
  })();

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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-md max-h-[96vh] overflow-y-auto bg-slate-900 border-2 border-amber-500 rounded-2xl shadow-2xl flex flex-col text-slate-100 overflow-x-hidden animate-in fade-in zoom-in-95 duration-150">
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

          {/* Countdown Ring */}
          <div
            className={`relative w-12 h-12 flex-shrink-0 ${secondsRemaining <= 2 ? 'animate-pulse' : ''}`}
            role="timer"
            aria-label={`${secondsRemaining} seconds remaining`}
          >
            <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
              <circle cx="22" cy="22" r={RING_R} fill="rgba(2,6,23,0.75)" stroke="rgba(2,6,23,0.35)" strokeWidth="4" />
              <circle
                cx="22"
                cy="22"
                r={RING_R}
                fill="none"
                strokeWidth="4"
                strokeLinecap="round"
                stroke={secondsRemaining <= 2 ? '#EF4444' : secondsRemaining <= 4 ? '#FBBF24' : '#34D399'}
                strokeDasharray={RING_C}
                strokeDashoffset={RING_C * (1 - secondsRemaining / 6)}
                style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-black text-base text-white">
              {secondsRemaining}
            </span>
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
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500 text-center">
                Quick bid {myPlayer ? `• You have $${myPlayer.cash}` : ''}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {quickBids.map((q) => (
                  <button
                    key={q.amount}
                    onClick={() => placeBid(q.amount)}
                    disabled={Boolean(myPlayer && myPlayer.cash < q.amount)}
                    className={`py-2.5 px-2 rounded-xl text-white font-extrabold text-xs shadow-md transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex flex-col items-center leading-tight ${q.className}`}
                  >
                    <span>{q.label}</span>
                    <span className="text-[10px] font-bold opacity-80">${q.amount}</span>
                  </button>
                ))}
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

import React from 'react';
import { X, BookOpen, Award, Shield, Home, Dices, Coins, AlertCircle } from 'lucide-react';

interface RulesModalProps {
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col text-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 font-board">
        {/* Header */}
        <div className="p-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-amber-300 font-board">Naroom-opoly Official Rules</h2>
              <p className="text-xs text-slate-400">NSW South Coast Edition Guide</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Rules Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {/* Objective */}
          <section className="space-y-1.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              1. Objective
            </h3>
            <p>
              Travel the iconic Princes Highway coastline from Batemans Bay down to Narooma. Buy famous beaches, headlands, hardware stores and utilities. Collect rent, develop seaside holiday homes, and be the last player standing without going bankrupt!
            </p>
          </section>

          {/* Money & Movement */}
          <section className="space-y-1.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Dices className="w-4 h-4 text-emerald-400" />
              2. Money & Movement
            </h3>
            <p>
              Each player begins with <strong>$1500</strong>. On your turn, roll two dice and move clockwise. Rolling <strong>doubles</strong> gives you an extra roll, but rolling three doubles in the same turn sends you immediately to Bodalla Police Station.
            </p>
            <p>
              Whenever you pass or land on <strong>Welcome to the South Coast (GO)</strong>, collect $200 from the bank.
            </p>
          </section>

          {/* Properties & Rent */}
          <section className="space-y-1.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Home className="w-4 h-4 text-cyan-400" />
              3. Properties, Hardware Stores & Utilities
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Unowned Properties:</strong> Landing on an unowned tile allows you to purchase it at list price. If you decline, it immediately goes to <strong>Public Auction</strong> where any player can bid!
              </li>
              <li>
                <strong>Monopolies:</strong> Owning all properties in a color group doubles unimproved rent and unlocks the ability to build houses and hotels.
              </li>
              <li>
                <strong>Hardware Stores (4):</strong> Bunnings Batemans Bay, Camerons Moruya, Woody's, and Mitre 10 Glasshouse Rocks. Rent scales by how many you own: 1=$25, 2=$50, 3=$100, 4=$200.
              </li>
              <li>
                <strong>Utilities (2):</strong> Eurobodalla Shire Water & Essential Energy. Rent is 4× the dice roll for 1 utility, or 10× for both.
              </li>
            </ul>
          </section>

          {/* Building & Mortgages */}
          <section className="space-y-1.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-yellow-400" />
              4. Even Building & Mortgages
            </h3>
            <p>
              Houses must be built <strong>evenly</strong> across a color group (you cannot build a second house on a tile until all tiles in that set have one). There are only 32 houses and 12 hotels in the bank!
            </p>
            <p>
              To mortgage, all buildings on that color group must first be sold to the bank at half price. Mortgaged properties collect no rent, and cost mortgage value + 10% interest to unmortgage.
            </p>
          </section>

          {/* Bodalla Police Station (Jail) */}
          <section className="space-y-1.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-400" />
              5. Bodalla Police Station (Jail)
            </h3>
            <p>
              Sent to Jail by landing on tile 30, drawing a card, or rolling 3 doubles. While in jail you can still collect rent, build, and trade. To get out: pay $50, use a Get Out of Jail Free card, or attempt to roll doubles (max 3 turns, then forced to pay $50).
            </p>
          </section>

          {/* Disclaimer */}
          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 italic">
            Naroom-opoly is an independent, non-commercial parody tribute game celebrating the South Coast of NSW. Not affiliated with Hasbro or Monopoly.
          </div>
        </div>
      </div>
    </div>
  );
};

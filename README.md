# 🌊 Naroom-opoly

> **A multiplayer online board game set on the stunning NSW South Coast between Batemans Bay and Narooma.**

Play authentic Monopoly rules with a true Aussie South Coast flavour: cruise down the Princes Highway, buy the Clyde River, pitch holiday shacks on Broulee, run hardware supply runs to Camerons Moruya or Bunnings Batemans Bay, get sent to Bodalla Police Station for speeding or beach camping, and aim for the ultimate crown jewel: **Montague Island (Baranguba)**!

---

## 🎲 Features & Highlights

### 🕹️ Authentic Game Engine & Classic Rules
- **Faithful Monopoly Mechanics:**
  - $1500 starting cash (customizable by game host).
  - 40-square perimeter board, 2 dice, roll again on doubles, 3 consecutive doubles sends you straight to Jail.
  - Passing or landing on GO (*"Welcome to the South Coast"*) awards $200 salary.
  - **4 Hardware Stores** replace train stations: Bunnings Batemans Bay, Camerons Moruya, Woody's, and Mitre 10 Glasshouse Rocks ($25 / $50 / $100 / $200 rent).
  - **2 Regional Utilities:** Eurobodalla Shire Water & Essential Energy ($4\times$ or $10\times$ dice roll multiplier).
  - **Even Building Rules:** Develop color groups evenly with houses ($1–4$) and upgrade to Hotels, strictly limited by bank supplies (32 houses, 12 hotels).
  - **Financial Strategy:** Mortgage properties for emergency cash (with 10% interest to unmortgage) and sell buildings back to the bank at half price.
  - **Bodalla Police Station (Jail):** Escape by paying a $50 fine, playing a Get Out of Jail Free card, or rolling doubles (3-turn maximum).
  - **Free Parking Jackpot:** Optional host setting pooling all Shire rates and fine fees into an escalating jackpot prize.
  - **32 Authentic South Coast Action Cards:** 16 *Community Notice Board* and 16 *Local Knowledge* cards filled with local lore, bushfires, oyster festivals, and tourist traps.
  - **Interactive Public Auctions:** If a player declines an unowned square, it instantly triggers a 6-second live hammer auction with animated timer ring, quick-bid buttons, and highest bidder tracking.
  - **Player-to-Player Trading:** Trade properties, cash, and jail cards with live propose, counter-offer, cancel, accept, and reject flows.

### 🎨 Coastal Visual Design & Dynamic Feedback
- **High-Definition Tile Centerpieces:** Each perimeter square features prominent, custom geometric artwork representing beaches, rivers, headlands, and landmarks.
- **Pinned Close-Up Inspection Card:** Click or tap any square on the board to pin the deed inspection card to the board center for detailed rent reading, mortgage values, and lore—built specifically for touchscreens and desktop.
- **Typography & Theme:** Cohesive board game typography powered by Google Fonts (`Fredoka` & `Outfit`) with a Sun-Drenched Coastal Dark & Sandy Light theme palette.
- **Player HUD with Net Worth & Monopoly Dots:** Real-time net worth calculation ($\text{Cash} + \text{Property Values} + \text{House Costs}$) displayed beside liquid cash, with color-set monopoly progress indicators (`● ● ○`) and golden crowns `👑`.
- **Unified 3D Card Flip Modals:** `rounded-3xl` design system with physical 3D perspective entrance card-flip animations.
- **Dynamic Feedback FX:** Multi-stage confetti cannons (Passing GO, Free Parking Jackpot, completing a monopoly, winning) and dramatic Bodalla Police Station jail screen shake with emergency police siren strobe lights.
- **Tactile Board Animations:** 3D tumbling dice rolls, token squash-and-stretch arrival hops, and floating transaction badges ($+\$$ and $-\$$).
- **Web Audio Sound Effects:** Built-in synthesizer producing authentic dice clatters, cash registers, jail door clangs, and card chimes without heavy external audio files.

### 🌐 Multiplayer & Offline Play
- **Online Cloud Multiplayer (2–6 Players):** Create a room, share a 5-letter game code or direct URL, and join seamlessly from phones, tablets, or laptops. Powered by Supabase Anonymous Auth and Realtime channels.
- **Offline "vs Bots" Mode:** Practice and play solo against intelligent AI opponents (Kangaroo Keith, Penny Pelican, Willy Whale) with adaptive pacing and trade evaluation.

---

## 🗂️ Single Data File Configuration

All board tiles, properties, prices, rents, color groups, hardware stores, utilities, and both 16-card decks are defined in a single typed configuration file:
📁 [`src/data/boardData.ts`](file:///c:/Users/incan/antigravity/Naroomopoly/src/data/boardData.ts)

You can customize square names, rent schedules, or card descriptions without touching React or engine code.

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install
```bash
git clone https://github.com/incanberra/Naroomopoly.git
cd Naroomopoly
npm install
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(If you do not configure Supabase credentials, the game automatically runs in local offline mode with full AI bot support!)*

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Run Unit Tests & Quality Suite
```bash
# Run Vitest test suite (32 unit tests)
npm test

# Run TypeScript compiler check
npx tsc -b

# Run linter
npm run lint
```

---

## ☁️ Supabase Backend Setup

To enable multi-device cloud play:

1. Create a project at [supabase.com](https://supabase.com).
2. Under **Authentication -> Providers**, enable **Anonymous Sign-ins**.
3. In the Supabase **SQL Editor**, run the two database migrations in order:
   - [`supabase/migrations/20261002000001_initial_schema.sql`](file:///c:/Users/incan/antigravity/Naroomopoly/supabase/migrations/20261002000001_initial_schema.sql)
   - [`supabase/migrations/20261002000002_game_functions.sql`](file:///c:/Users/incan/antigravity/Naroomopoly/supabase/migrations/20261002000002_game_functions.sql)
4. Set your local `.env`:
   ```env
   VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-anon-key>
   ```

---

## 🌐 Deploying to GitHub Pages

This repository includes a production-ready GitHub Actions workflow in [`.github/workflows/deploy.yml`](file:///.github/workflows/deploy.yml).

1. In GitHub, navigate to **Settings -> Pages**.
2. Under **Build and deployment -> Source**, select **GitHub Actions**.
3. Under **Settings -> Secrets and variables -> Actions**, add your Supabase repository secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Push to `main`:
   ```bash
   git push origin main
   ```
5. GitHub Actions will run tests, build the static assets, and publish the site.

---

## 🗺️ South Coast Board Map

| Tile # | Type | Location Name | Details |
|---|---|---|---|
| **0** | **GO** | **Welcome to the South Coast** | Collect $200 |
| 1 | Property (Brown) | Clyde River | $60 |
| 2 | Notice | Community Notice Board | Draw Card |
| 3 | Property (Brown) | Batemans Bay Bridge | $60 |
| 4 | Tax | Shire Rates | Pay $200 |
| 5 | Hardware | Bunnings Batemans Bay | $200 |
| 6 | Property (Light Blue) | Corrigans Beach | $100 |
| 7 | Knowledge | Local Knowledge | Draw Card |
| 8 | Property (Light Blue) | Denhams Beach | $100 |
| 9 | Property (Light Blue) | Surf Beach | $120 |
| **10** | **Jail** | **Bodalla Police Station / Visiting** | Jail / Visiting |
| 11 | Property (Pink) | Long Beach | $140 |
| 12 | Utility | Eurobodalla Shire Water | $150 |
| 13 | Property (Pink) | Malua Bay | $140 |
| 14 | Property (Pink) | Guerilla Bay | $160 |
| 15 | Hardware | Camerons Moruya | $200 |
| 16 | Property (Orange) | Tomakin | $180 |
| 17 | Notice | Community Notice Board | Draw Card |
| 18 | Property (Orange) | Mossy Point | $180 |
| 19 | Property (Orange) | Broulee | $200 |
| **20** | **Parking** | **Free Parking at Batehaven Beach** | Safe Haven / Jackpot |
| 21 | Property (Red) | Mogo Village | $220 |
| 22 | Knowledge | Local Knowledge | Draw Card |
| 23 | Property (Red) | Moruya Markets | $220 |
| 24 | Property (Red) | Moruya Heads | $240 |
| 25 | Hardware | Woody's | $200 |
| 26 | Property (Yellow) | Tuross Head | $260 |
| 27 | Property (Yellow) | Tuross Lake | $260 |
| 28 | Utility | Essential Energy | $150 |
| 29 | Property (Yellow) | Dalmeny | $280 |
| **30** | **Go to Jail** | **Go to Bodalla Police Station** | Go Directly to Jail |
| 31 | Property (Green) | Kianga | $300 |
| 32 | Property (Green) | Glasshouse Rocks | $300 |
| 33 | Notice | Community Notice Board | Draw Card |
| 34 | Property (Green) | Wagonga Inlet | $320 |
| 35 | Hardware | Mitre 10 Glasshouse Rocks | $200 |
| 36 | Knowledge | Local Knowledge | Draw Card |
| 37 | Property (Dark Blue) | Australia Rock | $350 |
| 38 | Tax | Boat Ramp Fee | Pay $100 |
| **39** | **Property (Dark Blue)** | **Montague Island (Baranguba)** | $400 |

---

## 📖 Handover Notes & Architecture

For deep-dive technical documentation, state management flows, test cases, and engineering decisions, see [`HANDOVER.md`](file:///c:/Users/incan/antigravity/Naroomopoly/HANDOVER.md).

---

## ⚖️ Legal Disclaimer

*Naroom-opoly* is an independent, non-commercial parody fan tribute celebrating the community, landmarks, and ecology of the NSW South Coast. It is not affiliated with, endorsed by, or associated with Hasbro, Inc. or the Monopoly brand.

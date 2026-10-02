# 🌊 Naroom-opoly

> **A multiplayer online board game set on the stunning NSW South Coast between Batemans Bay and Narooma.**

Play traditional Monopoly rules with an authentic Aussie South Coast flavour: buy the Clyde River, build holiday shacks on Broulee, run hardware supply runs to Camerons Moruya or Bunnings Batemans Bay, get sent to Bodalla Police Station for speeding or pitching a swag on the dunes, and aim for the ultimate jewel: **Montague Island (Baranguba)**!

---

## 🎲 Features

- **Multiplayer Online (2–6 Players):** Create a game, share a 5-letter code or invite link, and join from any phone, tablet, or laptop.
- **Authoritative Backend with Supabase:**
  - PostgreSQL schema with Row-Level Security (RLS) and stored procedures (RPC).
  - Supabase Anonymous Auth gives every player an instant identity without sign-up. Sessions persist across browser reloads.
  - Realtime subscriptions sync dice rolls, movements, purchases, card draws, auctions, and trades instantly.
- **Traditional Monopoly Rules Faithfully Implemented:**
  - $1500 starting cash (customizable by host).
  - 40-square board, 2 dice, doubles roll again, three doubles sends you to Jail.
  - Passing/Landing on GO ("Welcome to the South Coast") collects $200.
  - **4 Hardware Stores** (Bunnings Batemans Bay, Camerons Moruya, Woody's, Mitre 10 Glasshouse Rocks) replace train stations ($25/$50/$100/$200).
  - **2 Local Utilities** (Eurobodalla Shire Water, Essential Energy) with 4×/10× dice roll multiplier rent.
  - Monopolies double unimproved rent and unlock building.
  - **Even Building Rules** across color groups, capped by bank supply (32 houses, 12 hotels).
  - Mortgaging (10% interest to unmortgage) and selling buildings at half price.
  - Bodalla Police Station (Jail): escape by paying $50, using a Get Out of Jail Free card, or rolling doubles (max 3 turns).
  - Optional host toggle for **Free Parking Jackpot**.
  - **Decks:** 16 *Local Knowledge* (Chance) and 16 *Community Notice Board* (Community Chest) cards.
  - **Public Auctions:** If a player declines to buy an unowned property upon landing, it is immediately auctioned to all players.
  - **Player-to-Player Trading:** Trade properties, cash, and jail cards with live propose/accept/reject.
  - Bankruptcy liquidation to players or the bank.
- **Single-Player "vs Bots" Mode:** Practice and test offline against AI bots (Kangaroo Keith, Penny Pelican, Willy Whale).
- **Audio & Accessibility:** Synthesized Web Audio sound effects (dice clatter, cash register, jail clang, card chime) with mute toggle, high contrast coastal palette, and keyboard navigation.

---

## 🗂️ Single Data File Configuration

All board tiles, properties, prices, rents, color groups, hardware stores, utilities, and both 16-card decks are defined in a single typed file:
📁 [`src/data/boardData.ts`](file:///c:/Users/incan/antigravity/Naroomopoly/src/data/boardData.ts)

You can edit any square name, rent value, or card text without touching game engine or UI code!

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install
```bash
git clone <repo-url>
cd Naroomopoly
npm install
```

### 2. Configure Environment (Optional for local/bot play)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(If you do not configure Supabase immediately, the game automatically runs in local/in-browser mode with bot support!)*

### 3. Run Dev Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Run Unit Tests
```bash
npm test
```
Runs the 25 Vitest unit tests verifying rent, even building, mortgages, bankruptcy, auctions, cards, and jail logic.

---

## ☁️ Supabase Backend Setup

To enable cloud multiplayer across multiple devices:

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Under **Project Settings -> API**, copy:
   - **Project URL**
   - **anon / public key**

### 2. Enable Anonymous Sign-ins
1. In your Supabase Dashboard, go to **Authentication -> Providers**.
2. Click on **Anonymous** and toggle **Enable Anonymous Sign-ins** to **ON**.
3. Save changes.

### 3. Run Migrations
You can run the migrations either using the Supabase CLI or directly in the Supabase **SQL Editor**:

1. Copy the contents of [`supabase/migrations/20261002000001_initial_schema.sql`](file:///c:/Users/incan/antigravity/Naroomopoly/supabase/migrations/20261002000001_initial_schema.sql) and execute it in the SQL Editor.
2. Copy the contents of [`supabase/migrations/20261002000002_game_functions.sql`](file:///c:/Users/incan/antigravity/Naroomopoly/supabase/migrations/20261002000002_game_functions.sql) and execute it in the SQL Editor.

### 4. Set Local `.env`
Update `.env`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
```

---

## 🌐 Deploying to GitHub Pages

This repository includes a production-ready GitHub Actions workflow in [`.github/workflows/deploy.yml`](file:///.github/workflows/deploy.yml).

### Steps:
1. In your GitHub repository, go to **Settings -> Pages**.
2. Under **Build and deployment -> Source**, select **GitHub Actions**.
3. Under **Settings -> Secrets and variables -> Actions**, add two Repository Secrets:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key
4. Push your commits to `main`:
   ```bash
   git add .
   git commit -m "Deploy Naroom-opoly"
   git push origin main
   ```
5. GitHub Actions will run tests, build the static site, and deploy it to your GitHub Pages URL (e.g., `https://<username>.github.io/Naroomopoly/`).

---

## 🗺️ South Coast Board Layout

| Tile # | Type | Location Name | Details |
|---|---|---|---|
| **0** | **GO** | **Welcome to the South Coast** | Collect $200 |
| 1 | Property (Brown) | Clyde River | $60 |
| 2 | Notice | Community Notice Board | Draw Card |
| 3 | Property (Brown) | Batemans Bay Bridge | $60 |
| 4 | Tax | Council Rates | Pay $200 |
| 5 | Hardware | Bunnings Batemans Bay | $200 |
| 6 | Property (Light Blue) | Corrigans Beach | $100 |
| 7 | Knowledge | Local Knowledge | Draw Card |
| 8 | Property (Light Blue) | Denhams Beach | $100 |
| 9 | Property (Light Blue) | Surf Beach | $120 |
| **10** | **Jail** | **Moruya Courthouse / Just Visiting** | Jail / Visiting |
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

## ⚖️ Legal Disclaimer

*Naroom-opoly* is an independent, non-commercial parody fan tribute celebrating the community, landmarks, and ecology of the NSW South Coast. It is not affiliated with, endorsed by, or associated with Hasbro, Inc. or the Monopoly brand.

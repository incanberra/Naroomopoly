import React from 'react';

export interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

// 1. Clyde River - Estuary oyster and river flow
export const ClydeRiverIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 36C14 34 22 40 30 38C38 36 42 37 44 38" stroke="#38BDF8" />
    <path d="M4 28C12 26 20 32 28 30C36 28 40 29 44 30" stroke="#38BDF8" opacity="0.6" />
    <ellipse cx="24" cy="18" rx="14" ry="9" fill="#94A3B8" fillOpacity="0.25" stroke="#64748B" />
    <ellipse cx="24" cy="18" rx="9" ry="5" fill="#E2E8F0" fillOpacity="0.4" stroke="#94A3B8" />
    <circle cx="23" cy="17" r="2.5" fill="#F8FAFC" stroke="#E2E8F0" />
  </svg>
);

// 2. Batemans Bay Bridge - Iconic bridge crossing
export const BridgeIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 34H44" stroke="#94A3B8" strokeWidth="2.5" />
    <path d="M6 34C10 20 18 14 24 14C30 14 38 20 42 34" stroke="#F59E0B" fill="#F59E0B" fillOpacity="0.15" />
    <line x1="24" y1="14" x2="24" y2="34" stroke="#F59E0B" />
    <line x1="15" y1="20" x2="15" y2="34" stroke="#F59E0B" strokeDasharray="1 2" />
    <line x1="33" y1="20" x2="33" y2="34" stroke="#F59E0B" strokeDasharray="1 2" />
    <path d="M4 40C14 38 22 42 32 40C38 39 42 41 44 41" stroke="#38BDF8" />
  </svg>
);

// 3. Bunnings Batemans Bay - Hammer with green and red brand accent
export const BunningsIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    {/* Hammer Head: Bunnings Dark Green & Red accent */}
    <rect x="14" y="10" width="22" height="10" rx="2" fill="#0D5C3A" stroke="#0D5C3A" strokeWidth="2" />
    <rect x="12" y="12" width="4" height="6" rx="1" fill="#DC2626" stroke="#DC2626" />
    <path d="M36 12C38 10 41 9 43 11C41 14 39 16 36 17" fill="#0D5C3A" stroke="#0D5C3A" />
    {/* Sturdy timber handle */}
    <rect x="22" y="20" width="6" height="22" rx="2" fill="#D97706" fillOpacity="0.3" stroke="#D97706" />
    <line x1="25" y1="24" x2="25" y2="38" stroke="#B45309" strokeDasharray="2 3" />
  </svg>
);

// 4. Corrigans Beach - Striped beach umbrella and sunshine
export const UmbrellaIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 26C8 16 16 10 24 10C32 10 40 16 40 26H8Z" fill="#38BDF8" fillOpacity="0.25" stroke="#38BDF8" />
    <path d="M16 26C16 16 20 10 24 10C28 10 32 16 32 26" stroke="#F43F5E" fill="#F43F5E" fillOpacity="0.3" />
    <path d="M24 10V38C24 40 22 42 20 42" stroke="#F59E0B" />
    <circle cx="24" cy="9" r="2" fill="#F59E0B" />
    <path d="M6 42C14 40 22 43 32 41C38 40 42 42 44 42" stroke="#FDE68A" />
  </svg>
);

// 5. Denhams Beach - Sea shell & gentle surf
export const ShellIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M24 8C14 8 8 16 8 26C8 36 18 42 24 42C30 42 40 36 40 26C40 16 34 8 24 8Z" fill="#FDE68A" fillOpacity="0.2" stroke="#F59E0B" />
    <path d="M24 42L24 12" stroke="#F59E0B" />
    <path d="M24 42L14 18" stroke="#F59E0B" opacity="0.7" />
    <path d="M24 42L34 18" stroke="#F59E0B" opacity="0.7" />
    <path d="M24 42L8 28" stroke="#F59E0B" opacity="0.5" />
    <path d="M24 42L40 28" stroke="#F59E0B" opacity="0.5" />
  </svg>
);

// 6. Surf Beach - Single fin surfboard carving waves
export const SurfboardIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <g transform="rotate(30 24 24)">
      <path d="M24 4C27 12 30 24 29 40C28 43 26 44 24 44C22 44 20 43 19 40C18 24 21 12 24 4Z" fill="#EC4899" fillOpacity="0.25" stroke="#EC4899" />
      <line x1="24" y1="4" x2="24" y2="44" stroke="#FDE047" strokeWidth="2" />
    </g>
    <path d="M4 38C10 35 18 40 26 38C34 36 40 39 44 38" stroke="#38BDF8" />
  </svg>
);

// 7. Long Beach - Golden headland sun
export const LongBeachIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 28C16 22 24 18 32 20C38 22 42 28 44 32" stroke="#F59E0B" />
    <circle cx="24" cy="22" r="7" fill="#FBBF24" fillOpacity="0.4" stroke="#F59E0B" />
    <path d="M4 36C14 34 22 38 34 36C40 35 44 37 46 37" stroke="#38BDF8" />
    <path d="M4 42C12 40 24 44 36 42C42 41 44 43 46 43" stroke="#FDE68A" />
  </svg>
);

// 8. Eurobodalla Shire Water - Mountain stream tap & droplets
export const ShireWaterIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 16H30V24H14V16Z" fill="#38BDF8" fillOpacity="0.2" stroke="#0284C7" />
    <path d="M22 10V16" stroke="#0284C7" strokeWidth="3" />
    <path d="M18 10H26" stroke="#0284C7" strokeWidth="3" />
    <path d="M30 20H36V28H30" stroke="#0284C7" />
    <path d="M22 30C22 30 18 35 18 38C18 40.2 19.8 42 22 42C24.2 42 26 40.2 26 38C26 35 22 30 22 30Z" fill="#38BDF8" stroke="#0284C7" />
  </svg>
);

// 9. Malua Bay - Rockpool star and patrolled cove
export const MaluaBayIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="24" cy="24" r="16" fill="#F43F5E" fillOpacity="0.15" stroke="#F43F5E" />
    <circle cx="24" cy="24" r="8" fill="#F8FAFC" stroke="#F43F5E" />
    <path d="M16 16L32 32M16 32L32 16" stroke="#F43F5E" strokeWidth="2.5" />
    <path d="M6 40C14 38 22 42 32 40" stroke="#38BDF8" />
  </svg>
);

// 10. Guerilla Bay - Geological rock formation & cliffs
export const GuerillaBayIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 38L18 16L28 30L34 22L42 38H8Z" fill="#64748B" fillOpacity="0.3" stroke="#475569" />
    <path d="M18 16L24 38" stroke="#475569" strokeDasharray="2 3" />
    <path d="M34 22L36 38" stroke="#475569" strokeDasharray="2 3" />
    <path d="M4 42C12 40 20 44 32 42C40 41 44 43 46 43" stroke="#38BDF8" />
  </svg>
);

// 11. Camerons Moruya - Handsaw with Camerons Moruya Royal Blue accent
export const CameronsIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    {/* Saw Blade: Steel with teeth */}
    <path d="M18 14L40 24L38 27L35 26L34 29L31 28L30 31L27 30L26 33L23 32L22 35L18 34Z" fill="#E2E8F0" stroke="#1D4ED8" />
    {/* Camerons Blue Handle */}
    <path d="M18 14C12 14 8 18 8 24C8 30 12 34 18 34L18 28C14 28 14 20 18 20Z" fill="#1D4ED8" fillOpacity="0.3" stroke="#1D4ED8" strokeWidth="2.5" />
    <circle cx="13" cy="24" r="2.5" fill="#1D4ED8" />
  </svg>
);

// 12. Tomakin - Estuary fish at Tomaga river mouth
export const FishIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 24C14 16 28 14 38 24C28 34 14 32 8 24Z" fill="#FB923C" fillOpacity="0.25" stroke="#EA580C" />
    <path d="M38 24L44 18V30L38 24Z" fill="#EA580C" stroke="#EA580C" />
    <circle cx="16" cy="22" r="2" fill="#EA580C" />
    <path d="M22 20C24 24 24 26 22 28" stroke="#EA580C" strokeLinecap="round" />
    <path d="M28 19C30 24 30 26 28 29" stroke="#EA580C" strokeLinecap="round" />
  </svg>
);

// 13. Mossy Point - Stingray in clear headland shallows
export const StingrayIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M24 10C30 14 40 22 36 28C32 34 26 32 24 32C22 32 16 34 12 28C8 22 18 14 24 10Z" fill="#0D9488" fillOpacity="0.3" stroke="#0F766E" />
    <path d="M24 32V44" stroke="#0F766E" strokeWidth="2.5" />
    <circle cx="21" cy="18" r="1.5" fill="#0F766E" />
    <circle cx="27" cy="18" r="1.5" fill="#0F766E" />
  </svg>
);

// 14. Broulee - Barrel wave & Broulee island
export const BrouleeWaveIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 38C12 36 18 30 22 24C26 18 32 14 38 18C44 22 42 30 36 32C30 34 26 30 28 26C30 22 34 22 35 24" fill="#0284C7" fillOpacity="0.25" stroke="#0284C7" strokeWidth="2.5" />
    <path d="M4 42C14 40 24 43 36 41C42 40 44 42 46 42" stroke="#38BDF8" />
  </svg>
);

// 15. Mogo Village - Historic gold miner pickaxe & cottage
export const MogoIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    {/* Gold Rush Pickaxe */}
    <path d="M12 18C18 12 30 12 36 18" stroke="#F59E0B" strokeWidth="3" fill="#F59E0B" fillOpacity="0.2" />
    <line x1="24" y1="14" x2="24" y2="42" stroke="#92400E" strokeWidth="3" />
    <circle cx="24" cy="14" r="3" fill="#F59E0B" stroke="#92400E" />
    <circle cx="16" cy="34" r="2" fill="#FBBF24" />
    <circle cx="32" cy="36" r="2.5" fill="#FBBF24" />
  </svg>
);

// 16. Moruya Markets - Market stall with fresh produce & awning
export const MarketStallIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 18L14 10H34L40 18H8Z" fill="#EF4444" fillOpacity="0.25" stroke="#DC2626" />
    <path d="M8 18C10 21 14 21 16 18C18 21 22 21 24 18C26 21 30 21 32 18C34 21 38 21 40 18" stroke="#DC2626" fill="#F8FAFC" />
    <line x1="10" y1="20" x2="10" y2="38" stroke="#94A3B8" />
    <line x1="38" y1="20" x2="38" y2="38" stroke="#94A3B8" />
    <rect x="8" y="28" width="32" height="10" rx="1" fill="#D97706" fillOpacity="0.2" stroke="#B45309" />
  </svg>
);

// 17. Moruya Heads - Historic lighthouse overlooking breakwall
export const LighthouseIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 40L21 16H27L30 40H18Z" fill="#EF4444" fillOpacity="0.2" stroke="#DC2626" />
    <rect x="20" y="10" width="8" height="6" fill="#FDE047" stroke="#DC2626" />
    <path d="M19 10L24 6L29 10H19Z" fill="#DC2626" stroke="#DC2626" />
    {/* Light beams */}
    <line x1="18" y1="13" x2="6" y2="10" stroke="#FBBF24" strokeWidth="2" strokeDasharray="2 2" />
    <line x1="30" y1="13" x2="42" y2="10" stroke="#FBBF24" strokeWidth="2" strokeDasharray="2 2" />
    <path d="M10 42H38" stroke="#64748B" strokeWidth="3" />
  </svg>
);

// 18. Woody's - Power drill with Timber Brown brand accent
export const WoodysIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    {/* Drill Body: Warm timber brown accent */}
    <rect x="14" y="12" width="18" height="12" rx="3" fill="#854D0E" fillOpacity="0.3" stroke="#854D0E" strokeWidth="2.5" />
    {/* Drill Chuck & Bit */}
    <rect x="32" y="15" width="6" height="6" rx="1" fill="#475569" stroke="#334155" />
    <line x1="38" y1="18" x2="44" y2="18" stroke="#475569" strokeWidth="2.5" />
    {/* Pistol Grip Handle */}
    <path d="M18 24V38C18 40 20 42 22 42H26C28 42 28 40 28 38V24" fill="#A16207" fillOpacity="0.2" stroke="#854D0E" strokeWidth="2" />
    <path d="M22 28H25" stroke="#F59E0B" strokeWidth="2" />
  </svg>
);

// 19. Tuross Head - Norfolk Island pine on the headland
export const PineTreeIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M24 6L16 16H22L14 26H20L10 38H38L28 26H34L26 16H32L24 6Z" fill="#15803D" fillOpacity="0.3" stroke="#15803D" />
    <line x1="24" y1="38" x2="24" y2="44" stroke="#78350F" strokeWidth="3" />
  </svg>
);

// 20. Tuross Lake - Tinny boat fishing pelicans
export const TurossLakeIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 28H36L34 36H14L12 28Z" fill="#E2E8F0" fillOpacity="0.3" stroke="#0284C7" />
    <line x1="24" y1="28" x2="24" y2="14" stroke="#64748B" />
    <line x1="24" y1="14" x2="32" y2="10" stroke="#0284C7" />
    <path d="M6 38C14 36 22 40 32 38C40 37 44 39 46 39" stroke="#38BDF8" />
  </svg>
);

// 21. Essential Energy - Electric grid lightning bolt
export const EssentialEnergyIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="26,6 12,26 24,26 20,44 36,22 24,22" fill="#FACC15" fillOpacity="0.35" stroke="#EAB308" strokeWidth="2.5" strokeLinejoin="round" />
  </svg>
);

// 22. Dalmeny - Coastal campground tent & clifftop
export const DalmenyIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="24,10 10,38 38,38" fill="#10B981" fillOpacity="0.25" stroke="#059669" />
    <polygon points="24,10 24,38 38,38" fill="#047857" fillOpacity="0.35" />
    <line x1="24" y1="10" x2="24" y2="38" stroke="#059669" />
    <path d="M6 42H42" stroke="#D97706" strokeWidth="2.5" />
  </svg>
);

// 23. Kianga - Radiant coastal sunshine & cliffs
export const KiangaIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="24" cy="24" r="10" fill="#22C55E" fillOpacity="0.25" stroke="#16A34A" strokeWidth="2.5" />
    <line x1="24" y1="6" x2="24" y2="10" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="24" y1="38" x2="24" y2="42" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="6" y1="24" x2="10" y2="24" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="38" y1="24" x2="42" y2="24" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="11" y1="11" x2="14" y2="14" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
    <line x1="34" y1="34" x2="37" y2="37" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
    <line x1="11" y1="37" x2="14" y2="34" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
    <line x1="34" y1="14" x2="37" y2="11" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 24. Glasshouse Rocks - Ancient geological sea stacks
export const GlasshouseRocksIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="16,8 10,40 22,40" fill="#059669" fillOpacity="0.3" stroke="#047857" />
    <polygon points="26,14 20,40 32,40" fill="#10B981" fillOpacity="0.4" stroke="#047857" />
    <polygon points="34,22 30,40 40,40" fill="#059669" fillOpacity="0.2" stroke="#047857" />
    <path d="M4 42C12 40 24 43 36 41C42 40 44 42 46 42" stroke="#38BDF8" />
  </svg>
);

// 25. Wagonga Inlet - Sydney Rock Oysters & turquoise inlet
export const WagongaInletIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 26C10 16 18 10 26 10C36 10 42 18 42 28C42 38 32 40 24 40C14 40 10 34 10 26Z" fill="#10B981" fillOpacity="0.2" stroke="#059669" />
    <path d="M15 27C15 20 20 16 26 16C32 16 36 21 36 28C36 34 30 36 24 36C18 36 15 32 15 27Z" fill="#E2E8F0" fillOpacity="0.5" stroke="#94A3B8" />
    <circle cx="25" cy="26" r="3.5" fill="#FFFFFF" stroke="#E2E8F0" />
    <path d="M4 42C12 40 22 43 32 41" stroke="#0D9488" />
  </svg>
);

// 26. Mitre 10 Glasshouse Rocks - Paint roller with Red & Orange brand accent
export const Mitre10Icon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    {/* Roller Barrel: Mitre 10 Red and Blue/Orange accents */}
    <rect x="14" y="8" width="22" height="10" rx="3" fill="#DC2626" fillOpacity="0.3" stroke="#DC2626" strokeWidth="2.5" />
    <path d="M14 13H36" stroke="#EA580C" strokeWidth="2" strokeDasharray="3 2" />
    {/* Metal Frame */}
    <path d="M25 8V6H38V22H27V26" stroke="#475569" strokeWidth="2.5" />
    {/* Handle with brand orange grip */}
    <rect x="24" y="26" width="6" height="16" rx="2" fill="#EA580C" stroke="#EA580C" strokeWidth="2" />
  </svg>
);

// 27. Australia Rock - Headland naturally framing mainland silhouette
export const AustraliaRockIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    {/* Granite headland outer frame */}
    <path d="M6 40V12C12 8 36 8 42 12V40H6Z" fill="#1E3A8A" fillOpacity="0.2" stroke="#1D4ED8" strokeWidth="2.5" />
    {/* Australia map silhouette aperture */}
    <path d="M16 20C20 18 28 17 32 20C34 24 33 28 30 30C28 32 24 31 20 30C16 28 14 24 16 20Z" fill="#F8FAFC" stroke="#1D4ED8" />
    <circle cx="29" cy="34" r="1.5" fill="#1D4ED8" />
  </svg>
);

// 28. Montague Island (Baranguba) - Sacred island, lighthouse & whale breach
export const MontagueIslandIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    {/* Island silhouette */}
    <path d="M6 38C12 30 20 28 30 28C38 28 42 32 44 38H6Z" fill="#1E40AF" fillOpacity="0.3" stroke="#1E40AF" />
    {/* Lighthouse on peak */}
    <rect x="22" y="16" width="6" height="12" fill="#F8FAFC" stroke="#1E40AF" />
    <polygon points="21,16 25,10 29,16" fill="#DC2626" stroke="#DC2626" />
    <circle cx="25" cy="14" r="1.5" fill="#FEF08A" />
    {/* Whale tail breaching */}
    <path d="M38 22C42 18 44 14 46 16C44 20 40 22 38 24C36 22 32 20 30 16C32 14 34 18 38 22Z" fill="#38BDF8" stroke="#0284C7" />
    <path d="M4 42C12 40 24 43 36 41" stroke="#38BDF8" />
  </svg>
);

// 29. Council Rates - Tax seal
export const CouncilRatesIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="10" y="8" width="28" height="34" rx="3" fill="#64748B" fillOpacity="0.2" stroke="#475569" />
    <line x1="16" y1="16" x2="32" y2="16" stroke="#475569" />
    <line x1="16" y1="22" x2="32" y2="22" stroke="#475569" />
    <line x1="16" y1="28" x2="24" y2="28" stroke="#475569" />
    <circle cx="28" cy="32" r="4" fill="#EF4444" fillOpacity="0.3" stroke="#DC2626" />
  </svg>
);

// 30. Boat Ramp Fee - Trawler on boat ramp
export const BoatRampFeeIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 32H38C38 32 35 40 22 40C10 40 8 32 8 32Z" fill="#0284C7" fillOpacity="0.25" stroke="#0369A1" />
    <rect x="16" y="22" width="12" height="10" rx="1" fill="#F8FAFC" stroke="#0369A1" />
    <line x1="22" y1="22" x2="22" y2="14" stroke="#64748B" />
    <line x1="6" y1="42" x2="42" y2="26" stroke="#94A3B8" strokeWidth="3" />
  </svg>
);

// 31. Local Knowledge Deck Icon - Glowing nautical compass
export const LocalKnowledgeIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="24" cy="24" r="16" fill="#F59E0B" fillOpacity="0.15" stroke="#F59E0B" strokeWidth="2.5" />
    <polygon points="24,12 27,21 36,24 27,27 24,36 21,27 12,24 21,21" fill="#F59E0B" stroke="#B45309" />
    <circle cx="24" cy="24" r="2" fill="#FFFFFF" />
  </svg>
);

// 32. Community Notice Board Deck Icon - Corkboard with pinned notices
export const NoticeBoardIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="10" width="32" height="28" rx="3" fill="#D97706" fillOpacity="0.25" stroke="#B45309" strokeWidth="2.5" />
    <rect x="12" y="16" width="10" height="12" fill="#FEF08A" stroke="#CA8A04" />
    <circle cx="17" cy="15" r="1.5" fill="#EF4444" />
    <rect x="25" y="18" width="11" height="14" fill="#BFDBFE" stroke="#3B82F6" />
    <circle cx="30" cy="17" r="1.5" fill="#EF4444" />
  </svg>
);

// 33. Nelligen - Historic river punt / ferry on Clyde River
export const NelligenIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 34L12 24H36L42 34H6Z" fill="#854D0E" fillOpacity="0.25" stroke="#78350F" strokeWidth="2.2" />
    <line x1="16" y1="24" x2="16" y2="16" stroke="#78350F" strokeWidth="2.5" />
    <line x1="32" y1="24" x2="32" y2="16" stroke="#78350F" strokeWidth="2.5" />
    <line x1="14" y1="16" x2="34" y2="16" stroke="#B45309" strokeWidth="2.5" />
    <rect x="21" y="10" width="6" height="6" fill="#FDE047" stroke="#B45309" />
    <path d="M4 38C12 36 20 42 28 39C36 36 40 38 44 38" stroke="#38BDF8" strokeWidth="2" />
    <path d="M6 43C16 41 24 44 34 42" stroke="#0284C7" strokeWidth="1.8" />
  </svg>
);

// 34. Batehaven - Seaside reserve umbrella & bay
export const BatehavenIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 24C8 15 16 9 24 9C32 9 40 15 40 24H8Z" fill="#38BDF8" fillOpacity="0.25" stroke="#38BDF8" />
    <path d="M16 24C16 15 20 9 24 9C28 9 32 15 32 24" stroke="#F43F5E" fill="#F43F5E" fillOpacity="0.3" />
    <path d="M24 9V37C24 39 22 41 20 41" stroke="#F59E0B" />
    <circle cx="24" cy="8" r="2" fill="#F59E0B" />
    <path d="M6 41C14 39 22 43 32 41C38 40 42 42 44 42" stroke="#FDE68A" />
  </svg>
);

// 35. Lillipilli - Spotted gum eucalypt leaf & secluded cove
export const LillipilliIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M24 8C16 14 12 24 16 36C22 34 32 30 34 20C36 12 28 8 24 8Z" fill="#10B981" fillOpacity="0.25" stroke="#059669" />
    <path d="M16 36C20 28 24 20 28 14" stroke="#047857" strokeWidth="1.8" />
    <path d="M22 24L17 22" stroke="#047857" strokeWidth="1.5" />
    <path d="M25 18L30 17" stroke="#047857" strokeWidth="1.5" />
    <path d="M6 42C14 40 22 43 32 41C40 40 44 42 46 42" stroke="#38BDF8" />
  </svg>
);

// 36. Moruya - Granite bridge over Moruya River
export const MoruyaIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 30H42" stroke="#94A3B8" strokeWidth="3" />
    <path d="M8 30C10 18 18 14 24 14C30 14 38 18 40 30" stroke="#DC2626" fill="#EF4444" fillOpacity="0.15" />
    <line x1="24" y1="14" x2="24" y2="30" stroke="#DC2626" />
    <rect x="18" y="22" width="12" height="8" rx="1" fill="#FEF08A" stroke="#CA8A04" />
    <path d="M4 38C12 36 20 41 30 38C38 36 42 38 44 38" stroke="#38BDF8" />
  </svg>
);

// 37. Congo - Bush campsite & campfire in national park
export const CongoIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="24,10 10,38 38,38" fill="#F59E0B" fillOpacity="0.2" stroke="#D97706" />
    <polygon points="24,10 24,38 38,38" fill="#B45309" fillOpacity="0.3" />
    <line x1="24" y1="10" x2="24" y2="38" stroke="#D97706" />
    <path d="M20 42L28 42" stroke="#78350F" strokeWidth="2.5" />
    <path d="M22 39C22 35 24 33 24 33C24 33 26 35 26 39Z" fill="#EF4444" />
    <path d="M4 42H44" stroke="#D97706" strokeWidth="2" />
  </svg>
);

// 38. Meringo - Wild headland with kangaroo silhouette
export const MeringoIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 38C14 34 26 30 42 36" stroke="#F59E0B" strokeWidth="2" />
    <path d="M18 36C18 30 22 26 26 24C28 20 29 16 32 14C33 13 35 15 34 17C33 19 32 21 34 23C36 25 38 27 38 30C38 33 34 35 30 36" fill="#D97706" fillOpacity="0.3" stroke="#B45309" strokeWidth="2" />
    <path d="M24 32C20 34 16 36 12 37" stroke="#B45309" strokeWidth="2.5" />
    <circle cx="33" cy="15" r="1" fill="#78350F" />
    <path d="M4 42C14 40 24 43 36 41" stroke="#38BDF8" />
  </svg>
);

// 39. Tuross - Norfolk Island pine on the headland
export const TurossIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M24 6L16 16H22L14 26H20L10 38H38L28 26H34L26 16H32L24 6Z" fill="#15803D" fillOpacity="0.3" stroke="#15803D" />
    <line x1="24" y1="38" x2="24" y2="44" stroke="#78350F" strokeWidth="3" />
    <path d="M4 42C12 40 20 44 32 42" stroke="#38BDF8" strokeWidth="2" />
  </svg>
);

// Tile Icon Dispatcher
export const TileArtIcon: React.FC<{ index: number; className?: string; size?: number }> = ({ index, className, size = 24 }) => {
  switch (index) {
    case 1: return <NelligenIcon className={className} size={size} />;
    case 2: return <NoticeBoardIcon className={className} size={size} />;
    case 3: return <LongBeachIcon className={className} size={size} />;
    case 4: return <CouncilRatesIcon className={className} size={size} />;
    case 5: return <BunningsIcon className={className} size={size} />;
    case 6: return <SurfboardIcon className={className} size={size} />;
    case 7: return <LocalKnowledgeIcon className={className} size={size} />;
    case 8: return <ShellIcon className={className} size={size} />;
    case 9: return <BatehavenIcon className={className} size={size} />;
    case 11: return <LillipilliIcon className={className} size={size} />;
    case 12: return <ShireWaterIcon className={className} size={size} />;
    case 13: return <MaluaBayIcon className={className} size={size} />;
    case 14: return <GuerillaBayIcon className={className} size={size} />;
    case 15: return <CameronsIcon className={className} size={size} />;
    case 16: return <FishIcon className={className} size={size} />;
    case 17: return <NoticeBoardIcon className={className} size={size} />;
    case 18: return <StingrayIcon className={className} size={size} />;
    case 19: return <BrouleeWaveIcon className={className} size={size} />;
    case 21: return <MogoIcon className={className} size={size} />;
    case 22: return <LocalKnowledgeIcon className={className} size={size} />;
    case 23: return <MoruyaIcon className={className} size={size} />;
    case 24: return <LighthouseIcon className={className} size={size} />;
    case 25: return <WoodysIcon className={className} size={size} />;
    case 26: return <CongoIcon className={className} size={size} />;
    case 27: return <MeringoIcon className={className} size={size} />;
    case 28: return <EssentialEnergyIcon className={className} size={size} />;
    case 29: return <TurossIcon className={className} size={size} />;
    case 31: return <KiangaIcon className={className} size={size} />;
    case 32: return <DalmenyIcon className={className} size={size} />;
    case 33: return <NoticeBoardIcon className={className} size={size} />;
    case 34: return <WagongaInletIcon className={className} size={size} />;
    case 35: return <Mitre10Icon className={className} size={size} />;
    case 36: return <LocalKnowledgeIcon className={className} size={size} />;
    case 37: return <AustraliaRockIcon className={className} size={size} />;
    case 38: return <BoatRampFeeIcon className={className} size={size} />;
    case 39: return <MontagueIslandIcon className={className} size={size} />;
    default: return <LocalKnowledgeIcon className={className} size={size} />;
  }
};

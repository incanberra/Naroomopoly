import React from 'react';

export interface IllustrationProps {
  className?: string;
  size?: number;
}

// 0. Welcome to Country (GO) - Golden highway into radiant sunrise over Clyde River
export const GoIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="goSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="50%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#38BDF8" />
      </linearGradient>
      <linearGradient id="goHwy" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#334155" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="8" fill="url(#goSky)" />
    {/* Sun rays */}
    <circle cx="50" cy="50" r="22" fill="#FEF08A" />
    <path d="M50 15L50 25M25 50L35 50M65 50L75 50M32 32L39 39M68 32L61 39" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
    {/* Ocean waves */}
    <path d="M0 60Q25 54 50 60T100 60L100 100L0 100Z" fill="#0284C7" />
    {/* Highway stretching into sunrise */}
    <polygon points="50,55 42,100 58,100" fill="url(#goHwy)" />
    <line x1="50" y1="56" x2="50" y2="100" stroke="#FACC15" strokeWidth="2.5" strokeDasharray="4 3" />
    {/* Welcome Sign */}
    <rect x="70" y="58" width="24" height="16" rx="2" fill="#78350F" stroke="#FDE68A" strokeWidth="1" />
    <line x1="82" y1="74" x2="82" y2="92" stroke="#451A03" strokeWidth="2" />
    <text x="82" y="68" fill="#FEF08A" fontSize="4.5" fontWeight="900" textAnchor="middle">WELCOME</text>
    {/* Big Arrow */}
    <polygon points="12,85 24,85 24,78 36,88 24,98 24,91 12,91" fill="#22C55E" stroke="#14532D" strokeWidth="1" />
  </svg>
);

// 1. Nelligen - Historic river vehicular punt crossing the Clyde River
export const NelligenIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="nellSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#BAE6FD" />
        <stop offset="100%" stopColor="#E0F2FE" />
      </linearGradient>
      <linearGradient id="nellRiver" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#0369A1" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="8" fill="url(#nellSky)" />
    {/* Lush green hills */}
    <path d="M0 45Q30 30 60 42T100 35L100 60L0 60Z" fill="#15803D" />
    <path d="M0 52Q40 42 70 50T100 48L100 65L0 65Z" fill="#166534" />
    {/* Clyde River water */}
    <rect y="58" width="100" height="42" fill="url(#nellRiver)" />
    <path d="M0 66Q30 62 60 66T100 64M0 80Q40 76 80 80" stroke="#38BDF8" strokeWidth="1.5" fill="none" opacity="0.6" />
    {/* Vehicular Ferry / Punt */}
    <g transform="translate(18, 55)">
      <polygon points="5,22 15,10 55,10 65,22 0,22" fill="#854D0E" stroke="#451A03" strokeWidth="1.5" />
      {/* Ferry wheelhouse & cables */}
      <rect x="28" y="0" width="14" height="10" rx="1" fill="#FEF08A" stroke="#B45309" strokeWidth="1" />
      <line x1="-15" y1="12" x2="80" y2="12" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 2" />
      {/* Cars on ferry */}
      <rect x="8" y="12" width="16" height="8" rx="2" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
      <rect x="42" y="12" width="18" height="8" rx="2" fill="#2563EB" stroke="#1E40AF" strokeWidth="1" />
    </g>
  </svg>
);

// 2. Community Notice Board - Village corkboard with pinned flyers
export const NoticeBoardIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="8" fill="#78350F" />
    {/* Corkboard texture */}
    <rect x="8" y="8" width="84" height="84" rx="4" fill="#D97706" fillOpacity="0.4" stroke="#B45309" strokeWidth="2" />
    {/* Flyer 1: Garage Sale */}
    <rect x="14" y="14" width="32" height="34" rx="2" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
    <circle cx="30" cy="17" r="2" fill="#DC2626" />
    <rect x="18" y="23" width="24" height="3" fill="#854D0E" />
    <rect x="18" y="29" width="18" height="2" fill="#A16207" />
    <rect x="18" y="34" width="22" height="2" fill="#A16207" />
    {/* Flyer 2: Surf Carnival */}
    <rect x="52" y="18" width="34" height="38" rx="2" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1" />
    <circle cx="69" cy="21" r="2" fill="#16A34A" />
    <rect x="56" y="27" width="26" height="4" fill="#0369A1" />
    <rect x="56" y="34" width="20" height="2" fill="#0284C7" />
    <path d="M60 48L68 40L76 48Z" fill="#F59E0B" />
    {/* Flyer 3: Local Honey & Oysters */}
    <rect x="22" y="54" width="48" height="32" rx="2" fill="#FBCFE8" stroke="#DB2777" strokeWidth="1" />
    <circle cx="46" cy="57" r="2" fill="#E11D48" />
    <rect x="28" y="64" width="36" height="3" fill="#BE185D" />
    <rect x="28" y="70" width="28" height="2" fill="#9D174D" />
  </svg>
);

// 3. Long Beach - Golden arc of sand & tranquil bushland bay
export const LongBeachIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lbSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="60%" stopColor="#BAE6FD" />
        <stop offset="100%" stopColor="#7DD3FC" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="8" fill="url(#lbSky)" />
    {/* Bright Sun */}
    <circle cx="25" cy="30" r="14" fill="#FBBF24" />
    {/* Headland bush */}
    <path d="M50 45Q75 35 100 48L100 65L50 65Z" fill="#15803D" />
    {/* Sparkling turquoise bay */}
    <path d="M0 50Q40 45 75 58T100 62L100 85L0 85Z" fill="#0284C7" />
    {/* Golden Beach Sand */}
    <path d="M0 68Q45 62 100 76L100 100L0 100Z" fill="#FDE047" />
    <path d="M0 72Q45 66 100 80" stroke="#FFFFFF" strokeWidth="2" fill="none" opacity="0.7" />
    {/* Beach cricket bat & ball */}
    <rect x="22" y="80" width="3" height="14" rx="1" fill="#B45309" transform="rotate(-30 22 80)" />
    <circle cx="34" cy="88" r="2.5" fill="#DC2626" />
  </svg>
);

// 4. Council Rates - Official Shire assessment & street truck
export const CouncilRatesIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="8" fill="#1E293B" />
    {/* Assessment Document */}
    <rect x="15" y="10" width="70" height="80" rx="4" fill="#F8FAFC" stroke="#64748B" strokeWidth="2" />
    {/* Shire Header */}
    <rect x="25" y="18" width="50" height="6" rx="1" fill="#0284C7" />
    <line x1="25" y1="30" x2="75" y2="30" stroke="#94A3B8" strokeWidth="2" />
    <line x1="25" y1="36" x2="65" y2="36" stroke="#94A3B8" strokeWidth="2" />
    <line x1="25" y1="42" x2="70" y2="42" stroke="#94A3B8" strokeWidth="2" />
    {/* Official Red Stamp */}
    <g transform="translate(48, 48) rotate(-15)">
      <circle cx="16" cy="16" r="16" fill="none" stroke="#DC2626" strokeWidth="2.5" />
      <text x="16" y="14" fill="#DC2626" fontSize="5" fontWeight="900" textAnchor="middle">PAID</text>
      <text x="16" y="22" fill="#DC2626" fontSize="4.5" fontWeight="900" textAnchor="middle">$200</text>
    </g>
    {/* Council Maintenance Ute */}
    <rect x="20" y="68" width="28" height="14" rx="2" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
    <circle cx="26" cy="82" r="3" fill="#334155" />
    <circle cx="42" cy="82" r="3" fill="#334155" />
  </svg>
);

// 5. Bunnings Batemans Bay - Big green warehouse & sausage sizzle
export const BunningsIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Sky */}
    <rect width="100" height="100" rx="8" fill="#BAE6FD" />
    {/* Bunnings Green Warehouse */}
    <polygon points="10,48 50,30 90,48 90,85 10,85" fill="#0D5C3A" stroke="#064E3B" strokeWidth="2" />
    <rect x="35" y="44" width="30" height="12" rx="1" fill="#FFFFFF" />
    <text x="50" y="52" fill="#DC2626" fontSize="5.5" fontWeight="900" textAnchor="middle">BUNNINGS</text>
    {/* Asphalt ground */}
    <rect y="82" width="100" height="18" fill="#475569" />
    {/* Sausage Sizzle Gazebo Tent */}
    <g transform="translate(18, 56)">
      <polygon points="0,12 16,0 32,12" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
      <rect x="2" y="12" width="28" height="14" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
      <text x="16" y="20" fill="#991B1B" fontSize="3.5" fontWeight="900" textAnchor="middle">SNAG SIZZLE</text>
      {/* BBQ smoke */}
      <path d="M28 2Q26 -4 30 -8M30 4Q28 -2 32 -6" stroke="#CBD5E1" strokeWidth="1.5" fill="none" />
    </g>
    {/* Aussie Flags */}
    <line x1="16" y1="28" x2="16" y2="48" stroke="#64748B" strokeWidth="1.5" />
    <rect x="16" y="28" width="10" height="6" fill="#1E40AF" />
  </svg>
);

// 6. Surf Beach - Single fin surfboard planted in sand with patrol flags
export const SurfBeachIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sbSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#FEF08A" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="8" fill="url(#sbSky)" />
    {/* Breaking Surf waves */}
    <path d="M0 48C20 40 40 54 60 46C80 38 90 48 100 44L100 70L0 70Z" fill="#0284C7" />
    <path d="M0 56C25 50 50 62 75 54T100 58L100 80L0 80Z" fill="#0EA5E9" />
    {/* White foam */}
    <path d="M0 50Q30 46 60 52T100 48" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
    {/* Golden Beach Sand */}
    <path d="M0 68Q50 60 100 72L100 100L0 100Z" fill="#FDE047" />
    {/* Single Fin Surfboard planted in sand */}
    <g transform="translate(42, 38) rotate(12)">
      <path d="M6 0C10 12 14 32 12 50C10 54 6 54 4 50C2 32 6 12 6 0Z" fill="#EC4899" stroke="#9D174D" strokeWidth="1.5" />
      <line x1="6" y1="2" x2="6" y2="52" stroke="#FEF08A" strokeWidth="2" />
    </g>
    {/* Patrol Flags (Red & Yellow) */}
    <line x1="20" y1="46" x2="20" y2="78" stroke="#78350F" strokeWidth="1.5" />
    <rect x="20" y="46" width="10" height="5" fill="#DC2626" />
    <rect x="20" y="51" width="10" height="5" fill="#FACC15" />
    <line x1="80" y1="52" x2="80" y2="82" stroke="#78350F" strokeWidth="1.5" />
    <rect x="80" y="52" width="10" height="5" fill="#DC2626" />
    <rect x="80" y="57" width="10" height="5" fill="#FACC15" />
  </svg>
);

// 7. Local Knowledge - Glowing nautical brass compass over sea chart
export const LocalKnowledgeIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="lkGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#1E3A8A" />
        <stop offset="100%" stopColor="#0B132B" />
      </radialGradient>
    </defs>
    <rect width="100" height="100" rx="8" fill="url(#lkGlow)" />
    {/* Marine Navigation Chart lines */}
    <circle cx="50" cy="50" r="40" fill="none" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
    <circle cx="50" cy="50" r="32" fill="none" stroke="#F59E0B" strokeWidth="1.5" opacity="0.6" />
    <line x1="50" y1="5" x2="50" y2="95" stroke="#38BDF8" strokeWidth="1" opacity="0.3" />
    <line x1="5" y1="50" x2="95" y2="50" stroke="#38BDF8" strokeWidth="1" opacity="0.3" />
    {/* Brass Compass Rose */}
    <g transform="translate(50, 50)">
      <circle cx="0" cy="0" r="22" fill="#D97706" fillOpacity="0.2" stroke="#F59E0B" strokeWidth="2" />
      {/* 8-point star */}
      <polygon points="0,-22 4,-6 20,0 4,4 0,20 -4,4 -20,0 -4,-6" fill="#FBBF24" stroke="#B45309" strokeWidth="1" />
      <polygon points="0,-22 0,0 -4,-6" fill="#DC2626" />
      <circle cx="0" cy="0" r="4" fill="#FFFFFF" stroke="#B45309" strokeWidth="1" />
      {/* Cardinals */}
      <text x="0" y="-25" fill="#FDE047" fontSize="6" fontWeight="900" textAnchor="middle">N</text>
      <text x="27" y="2" fill="#FDE047" fontSize="5" fontWeight="900" textAnchor="middle">E</text>
      <text x="0" y="30" fill="#FDE047" fontSize="5" fontWeight="900" textAnchor="middle">S</text>
      <text x="-27" y="2" fill="#FDE047" fontSize="5" fontWeight="900" textAnchor="middle">W</text>
    </g>
  </svg>
);

// 8. Denhams Beach - Dolphins jumping in turquoise cove
export const DenhamsBeachIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="8" fill="#38BDF8" />
    {/* Headland rocks */}
    <path d="M0 35Q30 25 50 38T100 32L100 50L0 50Z" fill="#15803D" />
    <path d="M0 48L20 44L28 58L10 62Z" fill="#64748B" />
    {/* Crystal clear cove water */}
    <path d="M0 48Q50 42 100 52L100 100L0 100Z" fill="#06B6D4" />
    {/* Bottlenose Dolphins leaping */}
    <g transform="translate(38, 44)">
      <path d="M0 16C6 8 16 4 24 10C20 14 16 18 10 20C12 24 10 26 8 26C8 22 4 20 0 16Z" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
      <polygon points="12,12 16,8 16,13" fill="#1E293B" />
    </g>
    <g transform="translate(56, 52) scale(0.65)">
      <path d="M0 16C6 8 16 4 24 10C20 14 16 18 10 20C12 24 10 26 8 26C8 22 4 20 0 16Z" fill="#334155" stroke="#0F172A" strokeWidth="1" />
    </g>
    {/* Water splash */}
    <circle cx="40" cy="64" r="2" fill="#FFFFFF" />
    <circle cx="44" cy="62" r="1.5" fill="#FFFFFF" />
    {/* Striped Umbrella on beach corner */}
    <path d="M80 72C80 62 88 56 96 56L96 72Z" fill="#F43F5E" />
    <path d="M88 72C88 62 96 56 96 72Z" fill="#FBBF24" />
    <line x1="96" y1="56" x2="96" y2="88" stroke="#78350F" strokeWidth="1.5" />
  </svg>
);

// 9. Batehaven - Village playground pirate ship & giant ice cream cone
export const BatehavenIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="8" fill="#7DD3FC" />
    {/* Bay with Tollgate Islands */}
    <path d="M0 50Q50 42 100 52L100 70L0 70Z" fill="#0284C7" />
    <ellipse cx="75" cy="48" rx="8" ry="3" fill="#1E3A8A" />
    <ellipse cx="88" cy="49" rx="5" ry="2" fill="#1E3A8A" />
    {/* Grassy Foreshore reserve */}
    <path d="M0 64Q50 56 100 68L100 100L0 100Z" fill="#22C55E" />
    {/* Playground Pirate Ship */}
    <g transform="translate(14, 52)">
      <polygon points="0,16 6,4 32,4 36,16 2,18" fill="#78350F" stroke="#451A03" strokeWidth="1" />
      <line x1="18" y1="4" x2="18" y2="-12" stroke="#451A03" strokeWidth="2" />
      <polygon points="18,-12 28,-8 18,-4" fill="#DC2626" />
      <circle cx="8" cy="10" r="2" fill="#FEF08A" />
      <circle cx="16" cy="10" r="2" fill="#FEF08A" />
      <circle cx="24" cy="10" r="2" fill="#FEF08A" />
    </g>
    {/* Big 3-Scoop Ice Cream Cone */}
    <g transform="translate(68, 48)">
      <polygon points="8,38 16,18 0,18" fill="#D97706" stroke="#92400E" strokeWidth="1" />
      <circle cx="8" cy="16" r="8" fill="#10B981" />
      <circle cx="8" cy="7" r="7" fill="#F43F5E" />
      <circle cx="8" cy="-1" r="6" fill="#FEF08A" />
      <circle cx="8" cy="-7" r="2" fill="#DC2626" />
    </g>
  </svg>
);

// 10. Moruya Courthouse (Jail) - Historic granite courthouse & iron cell
export const JailIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="8" fill="#0F172A" />
    {/* Left Half: Behind Bars in Jail */}
    <rect x="5" y="5" width="45" height="90" rx="3" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
    <line x1="14" y1="10" x2="14" y2="90" stroke="#94A3B8" strokeWidth="3" />
    <line x1="23" y1="10" x2="23" y2="90" stroke="#94A3B8" strokeWidth="3" />
    <line x1="32" y1="10" x2="32" y2="90" stroke="#94A3B8" strokeWidth="3" />
    <line x1="41" y1="10" x2="41" y2="90" stroke="#94A3B8" strokeWidth="3" />
    {/* Padlock */}
    <rect x="21" y="46" width="14" height="12" rx="2" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5" />
    <path d="M24 46V40C24 36 32 36 32 40V46" stroke="#EAB308" strokeWidth="2.5" fill="none" />
    <text x="28" y="76" fill="#EF4444" fontSize="6.5" fontWeight="900" textAnchor="middle">IN JAIL</text>

    {/* Right Half: Moruya Courthouse (Just Visiting) */}
    <rect x="50" y="5" width="45" height="90" rx="3" fill="#334155" stroke="#475569" strokeWidth="1.5" />
    {/* Historic Courthouse Facade */}
    <polygon points="72,16 55,28 90,28" fill="#F59E0B" />
    <line x1="60" y1="28" x2="60" y2="56" stroke="#E2E8F0" strokeWidth="2.5" />
    <line x1="72" y1="28" x2="72" y2="56" stroke="#E2E8F0" strokeWidth="2.5" />
    <line x1="84" y1="28" x2="84" y2="56" stroke="#E2E8F0" strokeWidth="2.5" />
    <rect x="66" y="42" width="12" height="14" fill="#78350F" />
    {/* Takeaway flat white cup */}
    <rect x="68" y="64" width="8" height="10" rx="1" fill="#FFFFFF" />
    <ellipse cx="72" cy="64" rx="4" ry="1.5" fill="#78350F" />
    <text x="72" y="84" fill="#38BDF8" fontSize="5.5" fontWeight="900" textAnchor="middle">VISITING</text>
  </svg>
);

// 11. Lillipilli - Spotted gum trees framing secluded cove
export const LillipilliIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="8" fill="#BAE6FD" />
    {/* Turquoise cove */}
    <path d="M0 45Q50 35 100 48L100 80L0 80Z" fill="#0EA5E9" />
    <path d="M0 65Q50 58 100 70L100 100L0 100Z" fill="#FDE047" />
    {/* Towering Spotted Gum Trunks with distinctive dappled bark */}
    <g>
      <rect x="14" y="0" width="10" height="100" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
      <ellipse cx="19" cy="20" rx="3" ry="5" fill="#64748B" opacity="0.5" />
      <ellipse cx="18" cy="45" rx="3" ry="6" fill="#64748B" opacity="0.5" />
      <ellipse cx="20" cy="75" rx="3" ry="4" fill="#64748B" opacity="0.5" />
      {/* Leaves */}
      <circle cx="16" cy="10" r="14" fill="#15803D" opacity="0.7" />
      <circle cx="28" cy="8" r="12" fill="#166534" opacity="0.7" />
    </g>
    <g>
      <rect x="76" y="0" width="12" height="100" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
      <ellipse cx="82" cy="30" rx="4" ry="7" fill="#64748B" opacity="0.5" />
      <ellipse cx="80" cy="60" rx="4" ry="5" fill="#64748B" opacity="0.5" />
      <circle cx="82" cy="12" r="16" fill="#15803D" opacity="0.7" />
    </g>
  </svg>
);

// 12. Eurobodalla Shire Water - Mountain stream tap & reservoir
export const ShireWaterIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="swGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#082F49" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="8" fill="url(#swGrad)" />
    {/* Mountains in background */}
    <polygon points="0,50 35,25 70,50" fill="#0C4A6E" />
    <polygon points="40,50 75,20 100,50" fill="#075985" />
    {/* Reservoir Water */}
    <rect y="48" width="100" height="52" fill="#0284C7" />
    {/* Big Brass Tap */}
    <g transform="translate(32, 22)">
      <rect x="12" y="18" width="28" height="14" rx="2" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
      <path d="M26 18V8M20 8H32" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
      <path d="M38 25H46V36H38" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
      {/* Water stream pouring */}
      <path d="M42 36C42 45 40 55 42 65" stroke="#38BDF8" strokeWidth="5" strokeLinecap="round" />
      <circle cx="42" cy="52" r="3" fill="#BAE6FD" />
      <circle cx="48" cy="58" r="2" fill="#BAE6FD" />
    </g>
  </svg>
);

// 13. Malua Bay - Surf rescue boat & patrolled cove
export const MaluaBayIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="8" fill="#38BDF8" />
    {/* Rolling surf breakers */}
    <path d="M0 45C30 35 60 55 100 42L100 70L0 70Z" fill="#0284C7" />
    {/* Sandy beach */}
    <path d="M0 65Q50 55 100 70L100 100L0 100Z" fill="#FDE047" />
    {/* Red & Yellow Surf Life Saving Boat */}
    <g transform="translate(24, 46)">
      <path d="M0 16L8 6L44 6L54 16C36 18 18 18 0 16Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
      <rect x="14" y="6" width="24" height="4" fill="#FACC15" />
      {/* Oars */}
      <line x1="16" y1="4" x2="6" y2="-6" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="4" x2="42" y2="-6" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
    </g>
    {/* SLSC Clubhouse on grassy hill */}
    <rect x="68" y="32" width="24" height="16" rx="2" fill="#F8FAFC" stroke="#64748B" strokeWidth="1" />
    <polygon points="66,32 80,24 94,32" fill="#DC2626" />
  </svg>
);

// 14. Guerilla Bay - Dramatic 500-million-year-old chevron rock folds
export const GuerillaBayIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="8" fill="#7DD3FC" />
    {/* Deep ocean channel */}
    <rect y="50" width="100" height="50" fill="#0D9488" />
    {/* Dramatic ancient geological rock folds */}
    <polygon points="10,85 30,22 55,85" fill="#64748B" stroke="#334155" strokeWidth="1.5" />
    <polygon points="45,85 70,30 95,85" fill="#475569" stroke="#1E293B" strokeWidth="1.5" />
    {/* Folded Chevron lines */}
    <path d="M22 60L30 38L38 60M38 75L45 52L52 75M58 65L70 42L82 65" stroke="#F59E0B" strokeWidth="2" fill="none" opacity="0.8" />
    {/* Crashing sea spray */}
    <circle cx="30" cy="85" r="5" fill="#FFFFFF" opacity="0.7" />
    <circle cx="70" cy="85" r="6" fill="#FFFFFF" opacity="0.7" />
  </svg>
);

// 15. Camerons Moruya - Independent family hardware with Royal Blue store
export const CameronsIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="8" fill="#E2E8F0" />
    {/* Camerons Blue Building */}
    <rect x="15" y="24" width="70" height="55" rx="3" fill="#1D4ED8" stroke="#1E3A8A" strokeWidth="2" />
    <polygon points="12,24 50,12 88,24" fill="#1E40AF" />
    {/* Storefront Sign */}
    <rect x="22" y="28" width="56" height="12" rx="1" fill="#FFFFFF" />
    <text x="50" y="37" fill="#1D4ED8" fontSize="6.5" fontWeight="900" textAnchor="middle">CAMERONS</text>
    {/* Timber stacks in yard */}
    <rect x="20" y="58" width="22" height="16" fill="#D97706" stroke="#92400E" strokeWidth="1" />
    <line x1="20" y1="63" x2="42" y2="63" stroke="#92400E" />
    <line x1="20" y1="68" x2="42" y2="68" stroke="#92400E" />
    {/* Handsaw tool */}
    <g transform="translate(56, 52)">
      <polygon points="4,10 26,0 26,20" fill="#94A3B8" stroke="#475569" strokeWidth="1" />
      <rect x="0" y="6" width="6" height="12" rx="2" fill="#DC2626" />
    </g>
    <rect y="79" width="100" height="21" fill="#475569" />
  </svg>
);

// 16. Tomakin - Tomaga River mouth sandbar & flathead fishing
export const TomakinIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="8" fill="#7DD3FC" />
    {/* River curving out to sea */}
    <path d="M0 40Q40 35 60 55T100 50L100 100L0 100Z" fill="#0284C7" />
    {/* Sandbar spit */}
    <path d="M20 70Q50 55 90 75L100 100L0 100Z" fill="#FDE047" />
    {/* Pelican perched on wooden channel post */}
    <rect x="74" y="55" width="4" height="25" fill="#78350F" />
    <ellipse cx="76" cy="52" rx="6" ry="4" fill="#FFFFFF" stroke="#64748B" strokeWidth="1" />
    <polygon points="82,52 92,54 82,56" fill="#F59E0B" />
    {/* Flathead Fish leaping */}
    <g transform="translate(25, 42)">
      <ellipse cx="12" cy="8" rx="12" ry="5" fill="#FB923C" stroke="#C2410C" strokeWidth="1.5" />
      <polygon points="24,8 30,3 30,13" fill="#EA580C" />
      <circle cx="6" cy="7" r="1.5" fill="#000" />
    </g>
  </svg>
);

// 18. Mossy Point - Iconic wooden boat shed & giant smooth stingrays
export const MossyPointIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="8" fill="#BAE6FD" />
    {/* Gin-clear turquoise shallows */}
    <rect y="45" width="100" height="55" fill="#06B6D4" />
    {/* Headland green trees */}
    <path d="M0 45Q35 30 70 42T100 38L100 55L0 55Z" fill="#15803D" />
    {/* Iconic Rustic Timber Boat Shed with blue tin roof */}
    <g transform="translate(18, 30)">
      {/* Pilings */}
      <line x1="8" y1="28" x2="8" y2="45" stroke="#78350F" strokeWidth="2.5" />
      <line x1="28" y1="28" x2="28" y2="45" stroke="#78350F" strokeWidth="2.5" />
      <line x1="48" y1="28" x2="48" y2="45" stroke="#78350F" strokeWidth="2.5" />
      {/* Walls */}
      <rect x="4" y="10" width="48" height="20" fill="#A16207" stroke="#78350F" strokeWidth="1.5" />
      {/* Blue tin roof */}
      <polygon points="0,10 28,0 56,10" fill="#0284C7" stroke="#0369A1" strokeWidth="1.5" />
      <rect x="18" y="15" width="12" height="15" fill="#451A03" />
    </g>
    {/* Smooth Giant Stingray gliding in shallows */}
    <g transform="translate(48, 68)">
      <path d="M12 0C18 4 24 10 20 16C16 20 8 18 6 18C4 18 -4 20 -8 16C-12 10 -6 4 0 0Z" fill="#0F766E" stroke="#115E59" strokeWidth="1.5" />
      <line x1="6" y1="18" x2="6" y2="30" stroke="#115E59" strokeWidth="2" strokeLinecap="round" />
    </g>
  </svg>
);

// 19. Broulee - Island reserve & peeling barrel wave
export const BrouleeIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="8" fill="#38BDF8" />
    {/* Broulee Island in background */}
    <path d="M55 40Q75 28 95 38L100 50L50 50Z" fill="#15803D" />
    {/* Deep ocean */}
    <rect y="46" width="100" height="54" fill="#0369A1" />
    {/* Clean curling barrel wave */}
    <path d="M0 85C20 82 35 68 45 52C55 36 75 32 85 45C92 52 88 64 76 66C65 68 58 58 64 50" fill="#0284C7" stroke="#38BDF8" strokeWidth="3" />
    {/* White spray lip */}
    <path d="M52 40Q65 32 78 40" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" />
    <circle cx="82" cy="46" r="3" fill="#FFFFFF" />
    <circle cx="76" cy="52" r="2.5" fill="#FFFFFF" />
    {/* Low tide sandbar */}
    <polygon points="0,85 100,75 100,100 0,100" fill="#FDE047" />
  </svg>
);

// 20. Free Parking (Batehaven Beach) - Aussie 4WD ute parked on dunes
export const FreeParkingIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fpSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="60%" stopColor="#FEF08A" />
        <stop offset="100%" stopColor="#38BDF8" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="8" fill="url(#fpSky)" />
    {/* Ocean horizon */}
    <rect y="50" width="100" height="18" fill="#0284C7" />
    {/* Coastal grassy dune */}
    <path d="M0 64Q40 54 80 62T100 68L100 100L0 100Z" fill="#15803D" />
    {/* Aussie 4WD Ute */}
    <g transform="translate(18, 52)">
      {/* Cab & Tray */}
      <rect x="24" y="8" width="22" height="16" rx="2" fill="#E2E8F0" stroke="#475569" strokeWidth="1.5" />
      <polygon points="24,8 32,0 46,0 46,8" fill="#E2E8F0" stroke="#475569" strokeWidth="1.5" />
      <rect x="0" y="12" width="24" height="12" fill="#E2E8F0" stroke="#475569" strokeWidth="1.5" />
      {/* Surfboard sticking out tray */}
      <path d="M-6 8L16 16" stroke="#EC4899" strokeWidth="3" strokeLinecap="round" />
      {/* Big Wheels */}
      <circle cx="10" cy="24" r="6" fill="#0F172A" />
      <circle cx="10" cy="24" r="2" fill="#94A3B8" />
      <circle cx="38" cy="24" r="6" fill="#0F172A" />
      <circle cx="38" cy="24" r="2" fill="#94A3B8" />
    </g>
    {/* Esky cooler box */}
    <rect x="68" y="74" width="14" height="10" rx="2" fill="#2563EB" stroke="#1E40AF" strokeWidth="1" />
    <rect x="66" y="72" width="18" height="3" fill="#FFFFFF" />
  </svg>
);

// 21. Mogo Village - 1850s gold rush hamlet & jars of fudge
export const MogoIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="8" fill="#FEF08A" />
    {/* Forest hills */}
    <path d="M0 45Q30 32 60 42T100 36L100 60L0 60Z" fill="#15803D" />
    {/* 1850s Pioneer Timber Cottage */}
    <g transform="translate(15, 30)">
      <polygon points="0,16 35,2 70,16" fill="#78350F" stroke="#451A03" strokeWidth="1.5" />
      <rect x="6" y="16" width="58" height="30" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
      {/* Veranda posts */}
      <line x1="8" y1="16" x2="8" y2="46" stroke="#451A03" strokeWidth="2" />
      <line x1="35" y1="16" x2="35" y2="46" stroke="#451A03" strokeWidth="2" />
      <line x1="62" y1="16" x2="62" y2="46" stroke="#451A03" strokeWidth="2" />
      <rect x="27" y="24" width="16" height="22" fill="#451A03" />
    </g>
    {/* Gold Pan with golden nuggets */}
    <g transform="translate(56, 68)">
      <ellipse cx="18" cy="12" rx="18" ry="8" fill="#475569" stroke="#1E293B" strokeWidth="1.5" />
      <circle cx="14" cy="11" r="3" fill="#FACC15" />
      <circle cx="20" cy="13" r="2.5" fill="#FACC15" />
      <circle cx="23" cy="10" r="2" fill="#FACC15" />
    </g>
  </svg>
);

// 23. Moruya - Green river bridge & riverside farmers markets
export const MoruyaIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="8" fill="#BAE6FD" />
    {/* Moruya River */}
    <rect y="48" width="100" height="52" fill="#0284C7" />
    {/* Iconic Green Moruya River Bridge */}
    <g transform="translate(0, 32)">
      <line x1="0" y1="20" x2="100" y2="20" stroke="#334155" strokeWidth="3" />
      {/* Concrete Arches */}
      <path d="M4 20C12 4 28 4 36 20M36 20C44 4 60 4 68 20M68 20C76 4 92 4 98 20" stroke="#15803D" strokeWidth="3" fill="none" />
      <line x1="20" y1="6" x2="20" y2="20" stroke="#15803D" strokeWidth="2" />
      <line x1="52" y1="6" x2="52" y2="20" stroke="#15803D" strokeWidth="2" />
      <line x1="84" y1="6" x2="84" y2="20" stroke="#15803D" strokeWidth="2" />
    </g>
    {/* Saturday Market Marquees on the riverside */}
    <g transform="translate(10, 64)">
      <polygon points="0,8 14,0 28,8" fill="#DC2626" />
      <rect x="2" y="8" width="24" height="14" fill="#FEF08A" stroke="#CA8A04" />
      <polygon points="32,8 46,0 60,8" fill="#2563EB" />
      <rect x="34" y="8" width="24" height="14" fill="#F8FAFC" stroke="#CBD5E1" />
    </g>
  </svg>
);

// 24. Moruya Heads - Granite breakwall & Toragy Point pilot station
export const MoruyaHeadsIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="8" fill="#7DD3FC" />
    {/* Crashing sea */}
    <rect y="45" width="100" height="55" fill="#0369A1" />
    {/* Granite Rock Breakwall */}
    <g transform="translate(0, 52)">
      <polygon points="0,30 20,12 80,12 100,30" fill="#64748B" stroke="#334155" strokeWidth="1.5" />
      <rect x="15" y="16" width="14" height="10" fill="#94A3B8" stroke="#475569" />
      <rect x="35" y="14" width="18" height="12" fill="#94A3B8" stroke="#475569" />
      <rect x="60" y="15" width="16" height="11" fill="#94A3B8" stroke="#475569" />
    </g>
    {/* Pilot Station Light on Toragy Point */}
    <g transform="translate(68, 22)">
      <rect x="8" y="14" width="12" height="18" fill="#FFFFFF" stroke="#475569" strokeWidth="1" />
      <polygon points="6,14 14,6 22,14" fill="#DC2626" />
      <circle cx="14" cy="11" r="2.5" fill="#FEF08A" />
    </g>
    {/* Ocean waves crashing with white foam */}
    <path d="M0 80Q25 65 50 78T100 75" stroke="#FFFFFF" strokeWidth="3" fill="none" />
  </svg>
);

// 25. Woody's - Timber building supplies yard with forklift
export const WoodysIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="8" fill="#FEF3C7" />
    {/* Timber Warehouse Rack */}
    <g transform="translate(10, 18)">
      <rect x="0" y="0" width="80" height="48" fill="#78350F" stroke="#451A03" strokeWidth="2" />
      <rect x="8" y="6" width="64" height="10" fill="#D97706" />
      <rect x="8" y="20" width="64" height="10" fill="#D97706" />
      <rect x="8" y="34" width="64" height="10" fill="#D97706" />
      <text x="40" y="14" fill="#FEF08A" fontSize="5" fontWeight="900" textAnchor="middle">WOODY'S TIMBER</text>
    </g>
    {/* Yard Asphalt */}
    <rect y="72" width="100" height="28" fill="#334155" />
    {/* Forklift Truck */}
    <g transform="translate(32, 60)">
      <rect x="8" y="6" width="22" height="14" rx="2" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5" />
      <rect x="18" y="-2" width="10" height="8" rx="1" fill="#E2E8F0" opacity="0.7" />
      <line x1="30" y1="-8" x2="30" y2="18" stroke="#000" strokeWidth="2" />
      <line x1="30" y1="14" x2="38" y2="14" stroke="#000" strokeWidth="2" />
      <circle cx="12" cy="20" r="4" fill="#000" />
      <circle cx="26" cy="20" r="4" fill="#000" />
    </g>
  </svg>
);

// 26. Congo - Bush campground with campfire under stars
export const CongoIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="congoSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0B132B" />
        <stop offset="100%" stopColor="#1E293B" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="8" fill="url(#congoSky)" />
    {/* Stars in night sky */}
    <circle cx="20" cy="18" r="1.5" fill="#FEF08A" />
    <circle cx="45" cy="12" r="1.5" fill="#FEF08A" />
    <circle cx="75" cy="22" r="1.5" fill="#FEF08A" />
    <circle cx="85" cy="10" r="2" fill="#FEF08A" />
    {/* Tea tree silhouettes */}
    <path d="M0 65Q25 45 50 62T100 58L100 100L0 100Z" fill="#14532D" />
    {/* Camping Tent */}
    <polygon points="20,85 36,55 52,85" fill="#10B981" stroke="#047857" strokeWidth="1.5" />
    <polygon points="36,55 52,85 46,85 36,65" fill="#065F46" />
    {/* Cozy Campfire */}
    <g transform="translate(68, 75)">
      <line x1="-8" y1="10" x2="8" y2="10" stroke="#78350F" strokeWidth="3" />
      <line x1="-6" y1="8" x2="6" y2="12" stroke="#78350F" strokeWidth="2.5" />
      <path d="M0 8C-4 2 0 -6 0 -6C0 -6 4 2 0 8Z" fill="#EF4444" />
      <path d="M0 8C-2 4 0 0 0 0C0 0 2 4 0 8Z" fill="#FACC15" />
    </g>
  </svg>
);

// 27. Meringo - Wild headland dunes & kangaroos on Bingie track
export const MeringoIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="8" fill="#FDE68A" />
    {/* Crashing sea */}
    <rect y="42" width="100" height="30" fill="#0284C7" />
    {/* Wild grassy dunes */}
    <path d="M0 58Q40 45 80 55T100 62L100 100L0 100Z" fill="#15803D" />
    {/* Eastern Grey Kangaroo Silhouette */}
    <g transform="translate(42, 54)">
      <path d="M12 28C10 20 16 14 20 12C24 6 26 2 29 0C30 -1 33 1 31 3C30 5 29 8 32 10C34 12 36 15 36 19C36 24 30 27 24 28" fill="#78350F" stroke="#451A03" strokeWidth="1.5" />
      {/* Big back legs & tail */}
      <path d="M16 25C10 28 4 30 -2 31" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M22 28L26 36L32 36" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />
    </g>
  </svg>
);

// 28. Essential Energy - Regional electricity grid lightning
export const EssentialEnergyIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="eeSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1E1B4B" />
        <stop offset="100%" stopColor="#4338CA" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="8" fill="url(#eeSky)" />
    {/* Rolling dairy hills */}
    <path d="M0 70Q35 55 70 65T100 60L100 100L0 100Z" fill="#15803D" />
    {/* Wooden Power Poles with crossbeams */}
    <g transform="translate(18, 48)">
      <line x1="8" y1="0" x2="8" y2="35" stroke="#78350F" strokeWidth="3" />
      <line x1="0" y1="4" x2="16" y2="4" stroke="#78350F" strokeWidth="2.5" />
      {/* Power wires */}
      <path d="M0 4Q40 18 80 4" stroke="#94A3B8" strokeWidth="1.5" fill="none" />
    </g>
    {/* Giant Glowing Electric Lightning Bolt */}
    <polygon points="56,12 36,44 48,44 42,76 68,36 54,36" fill="#FACC15" stroke="#EAB308" strokeWidth="2" />
  </svg>
);

// 29. Tuross - Twin lakes peninsula with Norfolk pines & sailing
export const TurossIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="8" fill="#BAE6FD" />
    {/* Blue twin lakes surrounding peninsula */}
    <rect y="40" width="100" height="60" fill="#0284C7" />
    {/* Peninsula tongue */}
    <polygon points="35,100 50,45 65,100" fill="#22C55E" stroke="#16A34A" strokeWidth="1.5" />
    {/* Norfolk Island Pines */}
    <g transform="translate(47, 45)">
      <polygon points="3,0 0,6 2,6 -1,12 2,12 -2,20 8,20 4,12 7,12 4,6 6,6" fill="#14532D" />
      <line x1="3" y1="20" x2="3" y2="26" stroke="#78350F" strokeWidth="2" />
    </g>
    {/* Sailboat */}
    <g transform="translate(15, 60)">
      <polygon points="2,12 12,0 12,12" fill="#FFFFFF" stroke="#0284C7" />
      <polygon points="12,12 20,4 12,2" fill="#F43F5E" />
      <polygon points="0,12 22,12 18,17 4,17" fill="#78350F" />
    </g>
  </svg>
);

// 30. Go to Bodalla Police Station - Highway patrol radar gun & flashing lights
export const GoToJailIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="8" fill="#0F172A" />
    {/* Flashing Police Siren Bar */}
    <rect x="25" y="14" width="24" height="14" rx="2" fill="#DC2626" />
    <rect x="51" y="14" width="24" height="14" rx="2" fill="#2563EB" />
    <line x1="37" y1="6" x2="37" y2="14" stroke="#DC2626" strokeWidth="3" />
    <line x1="63" y1="6" x2="63" y2="14" stroke="#2563EB" strokeWidth="3" />
    {/* Highway Patrol Radar Gun */}
    <g transform="translate(26, 42)">
      <rect x="10" y="8" width="28" height="14" rx="2" fill="#334155" stroke="#1E293B" strokeWidth="1.5" />
      <rect x="2" y="11" width="8" height="8" rx="1" fill="#475569" />
      <rect x="22" y="22" width="6" height="14" fill="#1E293B" />
      {/* Speed Display */}
      <rect x="14" y="11" width="20" height="8" rx="1" fill="#000000" />
      <text x="24" y="17" fill="#EF4444" fontSize="5" fontWeight="900" textAnchor="middle">BUSTED</text>
    </g>
    <text x="50" y="86" fill="#FBBF24" fontSize="6.5" fontWeight="900" textAnchor="middle">GO TO JAIL</text>
  </svg>
);

// 31. Kianga - Clifftop shared coastal pathway & ocean breeze
export const KiangaIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="8" fill="#38BDF8" />
    {/* Sparkling ocean */}
    <rect y="40" width="100" height="60" fill="#0369A1" />
    {/* Clifftop shared pathway */}
    <path d="M0 65Q40 45 80 55T100 60L100 100L0 100Z" fill="#15803D" />
    <path d="M0 78Q45 62 100 74L100 86L0 88Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
    {/* Cyclist on pathway */}
    <g transform="translate(42, 60) scale(0.7)">
      <circle cx="6" cy="18" r="6" fill="none" stroke="#000" strokeWidth="2" />
      <circle cx="26" cy="18" r="6" fill="none" stroke="#000" strokeWidth="2" />
      <polygon points="6,18 16,18 20,8 10,8" fill="none" stroke="#DC2626" strokeWidth="2" />
      <circle cx="16" cy="2" r="3" fill="#F59E0B" />
    </g>
  </svg>
);

// 32. Dalmeny - Panoramic headland lookout & Mummaga Lake inlet
export const DalmenyIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="8" fill="#7DD3FC" />
    {/* Mummaga Lake Inlet meeting ocean */}
    <path d="M0 50Q30 42 60 52T100 46L100 80L0 80Z" fill="#0284C7" />
    {/* High Panoramic Headland bluff */}
    <polygon points="20,100 0,60 50,55 90,75 100,100" fill="#15803D" stroke="#166534" strokeWidth="1.5" />
    {/* Camping dome tent on bluff */}
    <g transform="translate(24, 52)">
      <path d="M0 16Q12 0 24 16Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
      <line x1="12" y1="0" x2="12" y2="16" stroke="#B45309" strokeWidth="1.5" />
    </g>
    {/* Paddleboarder on inlet */}
    <ellipse cx="78" cy="54" rx="8" ry="1.5" fill="#EC4899" />
    <line x1="78" y1="54" x2="78" y2="44" stroke="#000" strokeWidth="1.5" />
  </svg>
);

// 34. Wagonga Inlet - Turquoise boardwalk & Sydney Rock Oysters
export const WagongaInletIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="8" fill="#FEF08A" />
    {/* Famous Turquoise Lagoon Water */}
    <rect y="38" width="100" height="62" fill="#06B6D4" />
    {/* Oyster leases timber racks */}
    <g transform="translate(10, 48)">
      <line x1="0" y1="12" x2="35" y2="12" stroke="#78350F" strokeWidth="2" />
      <line x1="0" y1="18" x2="35" y2="18" stroke="#78350F" strokeWidth="2" />
      <line x1="8" y1="8" x2="8" y2="24" stroke="#78350F" strokeWidth="2" />
      <line x1="20" y1="8" x2="20" y2="24" stroke="#78350F" strokeWidth="2" />
      <line x1="32" y1="8" x2="32" y2="24" stroke="#78350F" strokeWidth="2" />
    </g>
    {/* Wooden Boardwalk hugging the inlet */}
    <polygon points="45,100 65,65 85,65 100,100" fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
    <line x1="45" y1="90" x2="100" y2="90" stroke="#78350F" strokeWidth="1.5" />
    <line x1="52" y1="80" x2="95" y2="80" stroke="#78350F" strokeWidth="1.5" />
    {/* Seal lounging on channel beacon */}
    <rect x="75" y="44" width="4" height="14" fill="#EAB308" />
    <ellipse cx="77" cy="42" rx="5" ry="3" fill="#475569" />
  </svg>
);

// 35. Mitre 10 Glasshouse Rocks - Paint roller, fishing rod & trade gear
export const Mitre10Illustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="8" fill="#F8FAFC" />
    {/* Mitre 10 Red & Blue Branding */}
    <rect x="10" y="16" width="80" height="32" rx="3" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
    <polygon points="10,16 50,6 90,16" fill="#EA580C" />
    <text x="50" y="36" fill="#FFFFFF" fontSize="7" fontWeight="900" textAnchor="middle">MITRE 10</text>
    {/* Trade Tools & Fishing Gear */}
    <rect y="75" width="100" height="25" fill="#475569" />
    {/* Paint Roller */}
    <g transform="translate(20, 52)">
      <rect x="0" y="0" width="22" height="10" rx="2" fill="#EA580C" stroke="#C2410C" strokeWidth="1" />
      <path d="M11 10V18H20V26" stroke="#1E293B" strokeWidth="2" fill="none" />
      <rect x="18" y="24" width="5" height="10" rx="1" fill="#DC2626" />
    </g>
    {/* Fishing Rod */}
    <line x1="55" y1="88" x2="85" y2="48" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="62" cy="78" r="3" fill="#EAB308" />
  </svg>
);

// 37. Australia Rock - Natural headland rock arch framing the ocean
export const AustraliaRockIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="arSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#BAE6FD" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="8" fill="url(#arSky)" />
    {/* Ocean horizon */}
    <rect y="50" width="100" height="50" fill="#0284C7" />
    {/* Granite Headland with Australia cutout aperture */}
    <path
      d="M10 100L10 32C15 20 40 18 60 20C85 24 90 40 90 100L65 100C65 75 70 55 58 50C48 45 42 55 35 60C30 65 35 85 35 100Z"
      fill="#854D0E"
      stroke="#593207"
      strokeWidth="2"
    />
    {/* Inside Aperture: Australia map shape silhouette */}
    <path
      d="M36 60C40 54 48 52 54 55C58 60 56 65 52 68C48 72 44 70 38 68C34 66 32 62 36 60Z"
      fill="#38BDF8"
      stroke="#0284C7"
      strokeWidth="1"
    />
    {/* Crashing whitewash waves */}
    <path d="M0 90Q25 80 50 88T100 85" stroke="#FFFFFF" strokeWidth="3" fill="none" />
  </svg>
);

// 38. Boat Ramp Fee - Concrete ramp, runabout tinny & pelican
export const BoatRampFeeIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="8" fill="#7DD3FC" />
    {/* Ocean / inlet water */}
    <rect y="45" width="100" height="55" fill="#0284C7" />
    {/* Concrete Boat Ramp entering water */}
    <polygon points="15,100 50,45 80,45 55,100" fill="#94A3B8" stroke="#64748B" strokeWidth="1.5" />
    <line x1="28" y1="85" x2="62" y2="85" stroke="#64748B" />
    <line x1="36" y1="72" x2="70" y2="72" stroke="#64748B" />
    {/* Aluminum Runabout Tinny Boat on trailer */}
    <g transform="translate(32, 54)">
      <polygon points="0,14 18,2 32,2 26,14" fill="#E2E8F0" stroke="#475569" strokeWidth="1.5" />
      <rect x="22" y="14" width="4" height="6" fill="#000" />
    </g>
    {/* Pelican on wooden piling */}
    <g transform="translate(76, 52)">
      <rect x="4" y="10" width="4" height="24" fill="#78350F" />
      <ellipse cx="6" cy="6" rx="5" ry="3" fill="#FFFFFF" stroke="#64748B" />
      <polygon points="10,6 18,8 10,9" fill="#F59E0B" />
    </g>
  </svg>
);

// 39. Montague Island (Baranguba) - The Crown Jewel: Granite lighthouse, fur seals & breaching whale
export const MontagueIslandIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full', size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="miSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="40%" stopColor="#FEF08A" />
        <stop offset="100%" stopColor="#38BDF8" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="8" fill="url(#miSky)" />
    {/* Golden Sun */}
    <circle cx="28" cy="35" r="14" fill="#FBBF24" />
    {/* Deep Tasman Ocean */}
    <rect y="52" width="100" height="48" fill="#0369A1" />
    {/* Majestic Volcanic Granite Island Cliffs */}
    <path d="M40 85L50 48L85 45L95 85Z" fill="#334155" stroke="#1E293B" strokeWidth="1.5" />
    {/* Historic Granite Lighthouse with Red Cap */}
    <g transform="translate(62, 22)">
      <polygon points="4,26 6,4 12,4 14,26" fill="#F8FAFC" stroke="#334155" strokeWidth="1.5" />
      <rect x="5" y="4" width="8" height="6" fill="#FEF08A" stroke="#DC2626" />
      <polygon points="4,4 9,-2 14,4" fill="#DC2626" />
      {/* Light Beam */}
      <polygon points="9,1 -20,20 -20,30" fill="#FEF08A" opacity="0.4" />
    </g>
    {/* Fur Seals sunbasking on rocks */}
    <ellipse cx="48" cy="80" rx="6" ry="3" fill="#475569" stroke="#1E293B" />
    <ellipse cx="56" cy="82" rx="5" ry="2.5" fill="#475569" stroke="#1E293B" />
    {/* Giant Humpback Whale Tail Breaching in foreground */}
    <g transform="translate(14, 52)">
      <path d="M12 28C16 18 24 10 32 12C28 18 24 22 20 25C16 28 14 34 12 36C10 34 8 28 4 25C0 22 -4 18 -8 12C0 10 8 18 12 28Z" fill="#0C4A6E" stroke="#082F49" strokeWidth="1.5" />
    </g>
    {/* White spray ripples */}
    <path d="M0 88Q25 80 50 88T100 84" stroke="#38BDF8" strokeWidth="2" fill="none" opacity="0.7" />
  </svg>
);

// Square Illustration Dispatcher for any square index (0 to 39)
export const SquareIllustration: React.FC<{ index: number; className?: string; size?: number }> = ({ index, className, size = 60 }) => {
  switch (index) {
    case 0: return <GoIllustration className={className} size={size} />;
    case 1: return <NelligenIllustration className={className} size={size} />;
    case 2: return <NoticeBoardIllustration className={className} size={size} />;
    case 3: return <LongBeachIllustration className={className} size={size} />;
    case 4: return <CouncilRatesIllustration className={className} size={size} />;
    case 5: return <BunningsIllustration className={className} size={size} />;
    case 6: return <SurfBeachIllustration className={className} size={size} />;
    case 7: return <LocalKnowledgeIllustration className={className} size={size} />;
    case 8: return <DenhamsBeachIllustration className={className} size={size} />;
    case 9: return <BatehavenIllustration className={className} size={size} />;
    case 10: return <JailIllustration className={className} size={size} />;
    case 11: return <LillipilliIllustration className={className} size={size} />;
    case 12: return <ShireWaterIllustration className={className} size={size} />;
    case 13: return <MaluaBayIllustration className={className} size={size} />;
    case 14: return <GuerillaBayIllustration className={className} size={size} />;
    case 15: return <CameronsIllustration className={className} size={size} />;
    case 16: return <TomakinIllustration className={className} size={size} />;
    case 17: return <NoticeBoardIllustration className={className} size={size} />;
    case 18: return <MossyPointIllustration className={className} size={size} />;
    case 19: return <BrouleeIllustration className={className} size={size} />;
    case 20: return <FreeParkingIllustration className={className} size={size} />;
    case 21: return <MogoIllustration className={className} size={size} />;
    case 22: return <LocalKnowledgeIllustration className={className} size={size} />;
    case 23: return <MoruyaIllustration className={className} size={size} />;
    case 24: return <MoruyaHeadsIllustration className={className} size={size} />;
    case 25: return <WoodysIllustration className={className} size={size} />;
    case 26: return <CongoIllustration className={className} size={size} />;
    case 27: return <MeringoIllustration className={className} size={size} />;
    case 28: return <EssentialEnergyIllustration className={className} size={size} />;
    case 29: return <TurossIllustration className={className} size={size} />;
    case 30: return <GoToJailIllustration className={className} size={size} />;
    case 31: return <KiangaIllustration className={className} size={size} />;
    case 32: return <DalmenyIllustration className={className} size={size} />;
    case 33: return <NoticeBoardIllustration className={className} size={size} />;
    case 34: return <WagongaInletIllustration className={className} size={size} />;
    case 35: return <Mitre10Illustration className={className} size={size} />;
    case 36: return <LocalKnowledgeIllustration className={className} size={size} />;
    case 37: return <AustraliaRockIllustration className={className} size={size} />;
    case 38: return <BoatRampFeeIllustration className={className} size={size} />;
    case 39: return <MontagueIslandIllustration className={className} size={size} />;
    default: return <LocalKnowledgeIllustration className={className} size={size} />;
  }
};

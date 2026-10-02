import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

export const WhaleIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24, color = 'currentColor' }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Water spout */}
    <path
      d="M24 16C24 10 20 6 16 6M24 16C24 9 28 5 32 5M24 16V10"
      stroke="#38BDF8"
      strokeWidth="3"
      strokeLinecap="round"
    />
    {/* Whale body */}
    <path
      d="M10 38C10 26 22 22 36 22C46 22 52 26 56 30C58 32 60 30 62 26C62 34 60 40 54 44C44 48 28 50 16 48C12 48 10 44 10 38Z"
      fill={color}
    />
    {/* Whale flipper */}
    <path
      d="M26 40C28 46 36 50 40 46C38 42 32 38 26 40Z"
      fill="#FFFFFF"
      fillOpacity="0.4"
    />
    {/* Eye */}
    <circle cx="18" cy="30" r="2.5" fill="#FFFFFF" />
  </svg>
);

export const PelicanIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24, color = 'currentColor' }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Pelican Body */}
    <ellipse cx="28" cy="42" rx="16" ry="12" fill={color} />
    {/* Neck */}
    <path
      d="M36 40C36 28 42 22 46 16"
      stroke={color}
      strokeWidth="8"
      strokeLinecap="round"
    />
    {/* Head */}
    <circle cx="48" cy="16" r="6" fill={color} />
    <circle cx="49" cy="15" r="1.5" fill="#FFFFFF" />
    {/* Large Beak & Pouch */}
    <path
      d="M50 16L62 18C60 26 48 28 44 22L50 16Z"
      fill="#F59E0B"
    />
    {/* Wing Feather Line */}
    <path
      d="M20 38C24 44 32 46 38 42"
      stroke="#FFFFFF"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeOpacity="0.5"
    />
  </svg>
);

export const OysterIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24, color = 'currentColor' }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outer Shell */}
    <path
      d="M12 36C12 22 24 14 36 14C48 14 56 22 56 36C56 50 44 54 32 54C18 54 12 48 12 36Z"
      fill="#475569"
      stroke={color}
      strokeWidth="3"
    />
    {/* Inner Nacre Shell */}
    <path
      d="M18 36C18 26 26 20 36 20C44 20 50 26 50 36C50 46 40 48 32 48C22 48 18 44 18 36Z"
      fill="#E2E8F0"
    />
    {/* Oyster Meat */}
    <path
      d="M24 38C24 30 30 26 36 28C42 30 44 36 42 40C40 44 34 44 28 42C25 41 24 39 24 38Z"
      fill="#FED7AA"
    />
    {/* Shimmering Pearl */}
    <circle cx="34" cy="34" r="4.5" fill="#FFFFFF" />
    <circle cx="32.5" cy="32.5" r="1.5" fill="#E0F2FE" />
  </svg>
);

export const SurfboardIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24, color = 'currentColor' }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="rotate(35 32 32)">
      {/* Board outline */}
      <path
        d="M32 6C36 16 40 32 38 52C37 56 34 58 32 58C30 58 27 56 26 52C24 32 28 16 32 6Z"
        fill={color}
        stroke="#FFFFFF"
        strokeWidth="2"
      />
      {/* Stringer Stripe */}
      <line x1="32" y1="6" x2="32" y2="58" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="3 3" />
      {/* Stripes accent */}
      <path d="M27 30C30 32 34 32 37 30" stroke="#FDE047" strokeWidth="3" />
      <path d="M28 36C31 38 33 38 36 36" stroke="#FDE047" strokeWidth="3" />
    </g>
  </svg>
);

export const BoatIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24, color = 'currentColor' }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Cabin */}
    <rect x="22" y="18" width="16" height="12" rx="2" fill="#E2E8F0" />
    <rect x="25" y="21" width="5" height="4" rx="1" fill="#38BDF8" />
    <rect x="32" y="21" width="4" height="4" rx="1" fill="#38BDF8" />
    {/* Mast & Antenna */}
    <line x1="30" y1="18" x2="30" y2="8" stroke="#94A3B8" strokeWidth="2.5" />
    <line x1="26" y1="12" x2="34" y2="12" stroke="#94A3B8" strokeWidth="2" />
    {/* Boat Hull */}
    <path
      d="M8 32H54C54 32 50 48 32 48C14 48 8 32 8 32Z"
      fill={color}
    />
    {/* Water Line */}
    <path
      d="M6 46C12 44 18 48 24 46C30 44 36 48 42 46C48 44 54 48 60 46"
      stroke="#38BDF8"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

export const KangarooIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24, color = 'currentColor' }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Tail */}
    <path
      d="M10 50C16 48 26 44 30 38"
      stroke={color}
      strokeWidth="6"
      strokeLinecap="round"
    />
    {/* Legs & Feet */}
    <path
      d="M28 42L24 54H36"
      stroke={color}
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Body */}
    <ellipse cx="36" cy="34" rx="9" ry="12" fill={color} />
    {/* Forearms */}
    <path
      d="M40 32L48 34"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    {/* Neck & Head */}
    <path
      d="M38 26L44 16"
      stroke={color}
      strokeWidth="6"
      strokeLinecap="round"
    />
    <ellipse cx="46" cy="15" rx="5" ry="3.5" fill={color} />
    {/* Ears */}
    <path
      d="M44 12L42 6M46 12L46 5"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
    />
    <circle cx="47" cy="14" r="1.2" fill="#FFFFFF" />
  </svg>
);

export const TokenRenderer: React.FC<{ tokenId: string; className?: string; size?: number; color?: string }> = ({
  tokenId,
  className = 'w-6 h-6',
  size = 24,
  color,
}) => {
  switch (tokenId) {
    case 'whale':
      return <WhaleIcon className={className} size={size} color={color || '#0284C7'} />;
    case 'pelican':
      return <PelicanIcon className={className} size={size} color={color || '#F59E0B'} />;
    case 'oyster':
      return <OysterIcon className={className} size={size} color={color || '#10B981'} />;
    case 'surfboard':
      return <SurfboardIcon className={className} size={size} color={color || '#EC4899'} />;
    case 'boat':
      return <BoatIcon className={className} size={size} color={color || '#8B5CF6'} />;
    case 'kangaroo':
      return <KangarooIcon className={className} size={size} color={color || '#D97706'} />;
    default:
      return <WhaleIcon className={className} size={size} color={color} />;
  }
};

export interface TokenDefinition {
  id: string;
  name: string;
  description: string;
  iconName: string;
  defaultColor: string;
  badgeBg: string;
}

export const TOKENS: TokenDefinition[] = [
  {
    id: 'whale',
    name: 'Humpback Whale',
    description: 'Breaching off Montague Island',
    iconName: 'whale',
    defaultColor: '#0284C7', // Sky-600
    badgeBg: 'bg-sky-500',
  },
  {
    id: 'pelican',
    name: 'Moruya Pelican',
    description: 'Patrolling the fish cleaning tables',
    iconName: 'pelican',
    defaultColor: '#F59E0B', // Amber-500
    badgeBg: 'bg-amber-500',
  },
  {
    id: 'oyster',
    name: 'Wagonga Oyster',
    description: 'Sydney rock oyster perfection',
    iconName: 'oyster',
    defaultColor: '#10B981', // Emerald-500
    badgeBg: 'bg-emerald-500',
  },
  {
    id: 'surfboard',
    name: 'Broulee Malibu',
    description: 'Single-fin point break cruiser',
    iconName: 'surfboard',
    defaultColor: '#EC4899', // Pink-500
    badgeBg: 'bg-pink-500',
  },
  {
    id: 'boat',
    name: 'Tuna Trawler',
    description: 'Batemans Bay Clyde River trawler',
    iconName: 'boat',
    defaultColor: '#8B5CF6', // Purple-500
    badgeBg: 'bg-purple-500',
  },
  {
    id: 'kangaroo',
    name: 'Pebbly Beach Kangaroo',
    description: 'Sunbather by the rolling surf',
    iconName: 'kangaroo',
    defaultColor: '#D97706', // Ochre/amber-600
    badgeBg: 'bg-amber-600',
  },
];

export const PLAYER_COLORS = [
  '#38BDF8', // Light blue
  '#F472B6', // Pink
  '#4ADE80', // Green
  '#FBBF24', // Amber
  '#A78BFA', // Purple
  '#FB923C', // Orange
];

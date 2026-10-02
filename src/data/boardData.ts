export type TileType = 
  | 'go'
  | 'property'
  | 'hardware'
  | 'utility'
  | 'notice'
  | 'knowledge'
  | 'tax'
  | 'jail'
  | 'parking'
  | 'gotojail';

export type ColorGroup = 
  | 'brown'
  | 'lightBlue'
  | 'pink'
  | 'orange'
  | 'red'
  | 'yellow'
  | 'green'
  | 'darkBlue';

export interface PropertyData {
  price: number;
  rent: [number, number, number, number, number, number]; // [base, 1 house, 2 houses, 3 houses, 4 houses, hotel]
  houseCost: number;
  mortgageValue: number;
  colorGroup: ColorGroup;
}

export interface HardwareData {
  price: number;
  rents: [number, number, number, number]; // 1, 2, 3, 4 hardware stores owned: [25, 50, 100, 200]
  mortgageValue: number;
}

export interface UtilityData {
  price: number;
  mortgageValue: number;
  multiplierOne: number; // 4x dice
  multiplierBoth: number; // 10x dice
}

export interface TaxData {
  amount: number;
}

export interface BoardTile {
  index: number;
  name: number extends never ? never : string;
  shortName?: string;
  type: TileType;
  description: string;
  icon: string; // SVG icon identifier
  property?: PropertyData;
  hardware?: HardwareData;
  utility?: UtilityData;
  tax?: TaxData;
}

export type CardActionType =
  | 'advance_to'
  | 'advance_nearest_hardware'
  | 'advance_nearest_utility'
  | 'collect_money'
  | 'pay_money'
  | 'pay_each_player'
  | 'collect_from_each_player'
  | 'repairs'
  | 'go_back_spaces'
  | 'go_to_jail'
  | 'get_out_of_jail_free';

export interface GameCard {
  id: string;
  title: string;
  description: string;
  deck: 'notice' | 'knowledge';
  action: CardActionType;
  targetIndex?: number;
  amount?: number;
  perHouse?: number;
  perHotel?: number;
  spaces?: number;
}

export const COLOR_GROUP_CONFIG: Record<ColorGroup, {
  name: string;
  color: string;
  textColor: string;
  propertyCount: number;
}> = {
  brown: {
    name: 'Batemans Bay Humble',
    color: '#8B4513',
    textColor: '#FFFFFF',
    propertyCount: 2,
  },
  lightBlue: {
    name: 'Batemans Bay Beaches',
    color: '#38BDF8',
    textColor: '#0F172A',
    propertyCount: 3,
  },
  pink: {
    name: 'Coastal Bays',
    color: '#F472B6',
    textColor: '#FFFFFF',
    propertyCount: 3,
  },
  orange: {
    name: 'River Mouths',
    color: '#FB923C',
    textColor: '#0F172A',
    propertyCount: 3,
  },
  red: {
    name: 'Historic Heartlands',
    color: '#EF4444',
    textColor: '#FFFFFF',
    propertyCount: 3,
  },
  yellow: {
    name: 'Headlands & Lakes',
    color: '#FACC15',
    textColor: '#0F172A',
    propertyCount: 3,
  },
  green: {
    name: 'Narooma Coastal',
    color: '#22C55E',
    textColor: '#FFFFFF',
    propertyCount: 3,
  },
  darkBlue: {
    name: 'Iconic Jewels',
    color: '#3B82F6',
    textColor: '#FFFFFF',
    propertyCount: 2,
  },
};

export const BOARD_TILES: BoardTile[] = [
  // Bottom Row (0 to 10): GO -> Jail
  {
    index: 0,
    name: 'Welcome to the South Coast',
    shortName: 'GO',
    type: 'go',
    description: 'Collect $200 as you pass or land here.',
    icon: 'compass',
  },
  {
    index: 1,
    name: 'Nelligen',
    type: 'property',
    description: 'Historic river port and timber town on the Clyde River, known for houseboats and waterskiing.',
    icon: 'waves',
    property: {
      price: 60,
      rent: [2, 10, 30, 90, 160, 250],
      houseCost: 50,
      mortgageValue: 30,
      colorGroup: 'brown',
    },
  },
  {
    index: 2,
    name: 'Community Notice Board',
    shortName: 'Notice Board',
    type: 'notice',
    description: 'Draw a Community Notice Board card.',
    icon: 'clipboard-list',
  },
  {
    index: 3,
    name: 'Long Beach',
    type: 'property',
    description: 'Stretching golden beach with tranquil waters, rockpools and bushland walks.',
    icon: 'sun',
    property: {
      price: 65,
      rent: [4, 20, 60, 180, 320, 450],
      houseCost: 50,
      mortgageValue: 32,
      colorGroup: 'brown',
    },
  },
  {
    index: 4,
    name: 'Council Rates',
    type: 'tax',
    description: 'Eurobodalla Shire rates notice. Pay $200.',
    icon: 'receipt',
    tax: {
      amount: 200,
    },
  },
  {
    index: 5,
    name: 'Bunnings Batemans Bay',
    shortName: 'Bunnings Batemans Bay',
    type: 'hardware',
    description: 'Snag sizzle on Saturdays, timber and power tools.',
    icon: 'wrench',
    hardware: {
      price: 200,
      rents: [25, 50, 100, 200],
      mortgageValue: 100,
    },
  },
  {
    index: 6,
    name: 'Surf Beach',
    type: 'property',
    description: 'Classic patrolled surf beach with vibrant seaside cafes and chip shops.',
    icon: 'waves',
    property: {
      price: 100,
      rent: [6, 30, 90, 270, 400, 550],
      houseCost: 50,
      mortgageValue: 50,
      colorGroup: 'lightBlue',
    },
  },
  {
    index: 7,
    name: 'Local Knowledge',
    shortName: 'Knowledge',
    type: 'knowledge',
    description: 'Draw a Local Knowledge card.',
    icon: 'sparkles',
  },
  {
    index: 8,
    name: 'Denhams Beach',
    type: 'property',
    description: 'Golden sandy cove loved by dolphins, rockpoolers and local swimmers.',
    icon: 'shell',
    property: {
      price: 100,
      rent: [6, 30, 90, 270, 400, 550],
      houseCost: 50,
      mortgageValue: 50,
      colorGroup: 'lightBlue',
    },
  },
  {
    index: 9,
    name: 'Batehaven',
    type: 'property',
    description: 'Bustling seaside hub with bakery, fish & chips, and reserve playground overlooking the bay.',
    icon: 'umbrella',
    property: {
      price: 120,
      rent: [8, 40, 100, 300, 450, 600],
      houseCost: 50,
      mortgageValue: 60,
      colorGroup: 'lightBlue',
    },
  },
  {
    index: 10,
    name: 'Moruya Courthouse / Just Visiting',
    shortName: 'Courthouse',
    type: 'jail',
    description: 'Historic heritage courthouse. In jail or just visiting.',
    icon: 'building-columns',
  },

  // Left Row (11 to 20): Upwards
  {
    index: 11,
    name: 'Lillipilli',
    type: 'property',
    description: 'Secluded cove framed by spotted gums, cliff trails and rock platforms.',
    icon: 'sun',
    property: {
      price: 140,
      rent: [10, 50, 150, 450, 625, 750],
      houseCost: 100,
      mortgageValue: 70,
      colorGroup: 'pink',
    },
  },
  {
    index: 12,
    name: 'Eurobodalla Shire Water',
    shortName: 'Eurobodalla Shire Water',
    type: 'utility',
    description: 'Pristine mountain and river catchment water.',
    icon: 'droplets',
    utility: {
      price: 150,
      mortgageValue: 75,
      multiplierOne: 4,
      multiplierBoth: 10,
    },
  },
  {
    index: 13,
    name: 'Malua Bay',
    type: 'property',
    description: 'Vibrant surf lifesaving club, rockpools and seaside community.',
    icon: 'life-buoy',
    property: {
      price: 140,
      rent: [10, 50, 150, 450, 625, 750],
      houseCost: 100,
      mortgageValue: 70,
      colorGroup: 'pink',
    },
  },
  {
    index: 14,
    name: 'Guerilla Bay',
    type: 'property',
    description: 'Secluded haven with ancient geological rock formations.',
    icon: 'mountain',
    property: {
      price: 160,
      rent: [12, 60, 180, 500, 700, 900],
      houseCost: 100,
      mortgageValue: 80,
      colorGroup: 'pink',
    },
  },
  {
    index: 15,
    name: 'Camerons Moruya',
    shortName: 'Camerons Moruya',
    type: 'hardware',
    description: 'Legendary independent hardware and building supplies family store.',
    icon: 'hammer',
    hardware: {
      price: 200,
      rents: [25, 50, 100, 200],
      mortgageValue: 100,
    },
  },
  {
    index: 16,
    name: 'Tomakin',
    type: 'property',
    description: 'Picturesque Tomaga River mouth and surf cove.',
    icon: 'fish',
    property: {
      price: 180,
      rent: [14, 70, 200, 550, 750, 950],
      houseCost: 100,
      mortgageValue: 90,
      colorGroup: 'orange',
    },
  },
  {
    index: 17,
    name: 'Community Notice Board',
    shortName: 'Notice Board',
    type: 'notice',
    description: 'Draw a Community Notice Board card.',
    icon: 'clipboard-list',
  },
  {
    index: 18,
    name: 'Mossy Point',
    type: 'property',
    description: 'Stingrays gliding in the headland waters and river jetty.',
    icon: 'anchor',
    property: {
      price: 180,
      rent: [14, 70, 200, 550, 750, 950],
      houseCost: 100,
      mortgageValue: 90,
      colorGroup: 'orange',
    },
  },
  {
    index: 19,
    name: 'Broulee',
    type: 'property',
    description: 'Renowned surf island reserve and crystal clear breaks.',
    icon: 'waves',
    property: {
      price: 200,
      rent: [16, 80, 220, 600, 800, 1000],
      houseCost: 100,
      mortgageValue: 100,
      colorGroup: 'orange',
    },
  },
  {
    index: 20,
    name: 'Free Parking at Batehaven Beach',
    shortName: 'Free Parking',
    type: 'parking',
    description: 'Park your ute, grab an ice-cream and watch the ocean.',
    icon: 'car',
  },

  // Top Row (21 to 30): Rightwards
  {
    index: 21,
    name: 'Mogo Village',
    type: 'property',
    description: 'Historic gold-mining hamlet filled with artisans and fudge.',
    icon: 'store',
    property: {
      price: 220,
      rent: [18, 90, 250, 700, 875, 1050],
      houseCost: 150,
      mortgageValue: 110,
      colorGroup: 'red',
    },
  },
  {
    index: 22,
    name: 'Local Knowledge',
    shortName: 'Knowledge',
    type: 'knowledge',
    description: 'Draw a Local Knowledge card.',
    icon: 'sparkles',
  },
  {
    index: 23,
    name: 'Moruya',
    type: 'property',
    description: 'Historic agricultural riverside township, famous granite quarry and Saturday markets.',
    icon: 'shopping-basket',
    property: {
      price: 220,
      rent: [18, 90, 250, 700, 875, 1050],
      houseCost: 150,
      mortgageValue: 110,
      colorGroup: 'red',
    },
  },
  {
    index: 24,
    name: 'Moruya Heads',
    type: 'property',
    description: 'Dramatic granite breakwall where the river meets the Tasman Sea.',
    icon: 'lighthouse',
    property: {
      price: 240,
      rent: [20, 100, 300, 750, 925, 1100],
      houseCost: 150,
      mortgageValue: 120,
      colorGroup: 'red',
    },
  },
  {
    index: 25,
    name: "Woody's",
    shortName: "Woody's",
    type: 'hardware',
    description: 'South Coast builders favourite hardware stop.',
    icon: 'truck',
    hardware: {
      price: 200,
      rents: [25, 50, 100, 200],
      mortgageValue: 100,
    },
  },
  {
    index: 26,
    name: 'Congo',
    type: 'property',
    description: 'National park coastal village, pristine surf and quiet bushland campground.',
    icon: 'palmtree',
    property: {
      price: 260,
      rent: [22, 110, 330, 800, 975, 1150],
      houseCost: 150,
      mortgageValue: 130,
      colorGroup: 'yellow',
    },
  },
  {
    index: 27,
    name: 'Meringo',
    type: 'property',
    description: 'Untamed ocean headland, grazing kangaroos on dunes and Bingie Dreaming track.',
    icon: 'sailboat',
    property: {
      price: 260,
      rent: [22, 110, 330, 800, 975, 1150],
      houseCost: 150,
      mortgageValue: 130,
      colorGroup: 'yellow',
    },
  },
  {
    index: 28,
    name: 'Essential Energy',
    shortName: 'Essential Energy',
    type: 'utility',
    description: 'Regional electricity grid powering the south coast.',
    icon: 'zap',
    utility: {
      price: 150,
      mortgageValue: 75,
      multiplierOne: 4,
      multiplierBoth: 10,
    },
  },
  {
    index: 29,
    name: 'Tuross',
    type: 'property',
    description: 'Idyllic coastal peninsula embraced by twin lakes, Norfolk pines and boat ramps.',
    icon: 'tent',
    property: {
      price: 280,
      rent: [24, 120, 360, 850, 1025, 1200],
      houseCost: 150,
      mortgageValue: 140,
      colorGroup: 'yellow',
    },
  },
  {
    index: 30,
    name: 'Go to Bodalla Police Station',
    shortName: 'Go to Jail',
    type: 'gotojail',
    description: 'Busted! Go directly to Bodalla Police Station.',
    icon: 'siren',
  },

  // Right Row (31 to 39): Downwards
  {
    index: 31,
    name: 'Kianga',
    type: 'property',
    description: 'Coastal settlement nestled between Dalmeny and Narooma.',
    icon: 'sun-medium',
    property: {
      price: 300,
      rent: [26, 130, 390, 900, 1100, 1275],
      houseCost: 200,
      mortgageValue: 150,
      colorGroup: 'green',
    },
  },
  {
    index: 32,
    name: 'Dalmeny',
    type: 'property',
    description: 'Panoramic headland lookout, beachside campground and Mummaga Lake inlet.',
    icon: 'gem',
    property: {
      price: 300,
      rent: [26, 130, 390, 900, 1100, 1275],
      houseCost: 200,
      mortgageValue: 150,
      colorGroup: 'green',
    },
  },
  {
    index: 33,
    name: 'Community Notice Board',
    shortName: 'Notice Board',
    type: 'notice',
    description: 'Draw a Community Notice Board card.',
    icon: 'clipboard-list',
  },
  {
    index: 34,
    name: 'Wagonga Inlet',
    type: 'property',
    description: 'Turquoise waters, boardwalk, seal hangouts and world-class oysters.',
    icon: 'fish-symbol',
    property: {
      price: 320,
      rent: [28, 150, 450, 1000, 1200, 1400],
      houseCost: 200,
      mortgageValue: 160,
      colorGroup: 'green',
    },
  },
  {
    index: 35,
    name: 'Mitre 10 Glasshouse Rocks',
    shortName: 'Mitre 10 Glasshouse Rocks',
    type: 'hardware',
    description: 'Narooma powerhouse for trade tools, paint, and fishing gear.',
    icon: 'axe',
    hardware: {
      price: 200,
      rents: [25, 50, 100, 200],
      mortgageValue: 100,
    },
  },
  {
    index: 36,
    name: 'Local Knowledge',
    shortName: 'Knowledge',
    type: 'knowledge',
    description: 'Draw a Local Knowledge card.',
    icon: 'sparkles',
  },
  {
    index: 37,
    name: 'Australia Rock',
    type: 'property',
    description: 'Naturally carved headland silhouette framing the sparkling inlet.',
    icon: 'map-pin',
    property: {
      price: 350,
      rent: [35, 175, 500, 1100, 1300, 1500],
      houseCost: 200,
      mortgageValue: 175,
      colorGroup: 'darkBlue',
    },
  },
  {
    index: 38,
    name: 'Boat Ramp Fee',
    type: 'tax',
    description: 'Annual marine facilities & boat ramp upkeep. Pay $100.',
    icon: 'anchor',
    tax: {
      amount: 100,
    },
  },
  {
    index: 39,
    name: 'Montague Island (Baranguba)',
    shortName: 'Montague Island',
    type: 'property',
    description: 'Sacred nature reserve sanctuary teeming with seals, penguins and history.',
    icon: 'crown',
    property: {
      price: 400,
      rent: [50, 200, 600, 1400, 1700, 2000],
      houseCost: 200,
      mortgageValue: 200,
      colorGroup: 'darkBlue',
    },
  },
];

export const LOCAL_KNOWLEDGE_CARDS: GameCard[] = [
  {
    id: 'lk-01',
    title: 'Welcome to Country',
    description: 'Advance to Welcome to the South Coast. Collect $200.',
    deck: 'knowledge',
    action: 'advance_to',
    targetIndex: 0,
  },
  {
    id: 'lk-02',
    title: 'Montague Island Seal Cruise',
    description: 'Take the eco-tour! Advance to Montague Island (Baranguba).',
    deck: 'knowledge',
    action: 'advance_to',
    targetIndex: 39,
  },
  {
    id: 'lk-03',
    title: 'Fudge Run to Mogo',
    description: 'Advance to Mogo Village. If you pass Welcome to the South Coast, collect $200.',
    deck: 'knowledge',
    action: 'advance_to',
    targetIndex: 21,
  },
  {
    id: 'lk-04',
    title: "Visit Ned's Forrest",
    description: 'Advance to Meringo. If you pass Welcome to the South Coast, collect $200.',
    deck: 'knowledge',
    action: 'advance_to',
    targetIndex: 27,
  },
  {
    id: 'lk-05',
    title: 'Hardware Supply Run North',
    description: 'Advance to the nearest Hardware Store. If unowned you may buy it; if owned, pay twice the rental.',
    deck: 'knowledge',
    action: 'advance_nearest_hardware',
  },
  {
    id: 'lk-06',
    title: 'Hardware Supply Run South',
    description: 'Advance to the nearest Hardware Store. If unowned you may buy it; if owned, pay twice the rental.',
    deck: 'knowledge',
    action: 'advance_nearest_hardware',
  },
  {
    id: 'lk-07',
    title: 'Utility Grid Check',
    description: 'Advance to nearest Utility. If owned, throw dice and pay owner 10 times the amount thrown.',
    deck: 'knowledge',
    action: 'advance_nearest_utility',
  },
  {
    id: 'lk-08',
    title: 'Bushfire Recovery Grant',
    description: 'Regional resilience dividend awarded! Collect $50 from the bank.',
    deck: 'knowledge',
    action: 'collect_money',
    amount: 50,
  },
  {
    id: 'lk-09',
    title: 'Local Mate in the Force',
    description: 'Get Out of Bodalla Police Station Free. This card may be kept or traded.',
    deck: 'knowledge',
    action: 'get_out_of_jail_free',
  },
  {
    id: 'lk-10',
    title: 'Scenic Coastal Detour',
    description: 'Missed your turn near Dalmeny! Go back 3 spaces.',
    deck: 'knowledge',
    action: 'go_back_spaces',
    spaces: 3,
  },
  {
    id: 'lk-11',
    title: 'Princes Highway Speed Trap',
    description: 'Caught speeding through Bodalla! Go directly to Bodalla Police Station. Do not pass Welcome to the South Coast, do not collect $200.',
    deck: 'knowledge',
    action: 'go_to_jail',
  },
  {
    id: 'lk-12',
    title: 'Bushfire Hazard Reduction',
    description: 'Council requires clearing and gutter guards. Pay $25 per house and $100 per hotel.',
    deck: 'knowledge',
    action: 'repairs',
    perHouse: 25,
    perHotel: 100,
  },
  {
    id: 'lk-13',
    title: 'Feeding the Pelicans Fine',
    description: 'Fined for feeding hot chips to the pelicans at Moruya Wharf. Pay $15.',
    deck: 'knowledge',
    action: 'pay_money',
    amount: 15,
  },
  {
    id: 'lk-14',
    title: 'Facebook Marketplace',
    description: 'Sold some old junk on Facebook, collect $100 from each player.',
    deck: 'knowledge',
    action: 'collect_from_each_player',
    amount: 100,
  },
  {
    id: 'lk-15',
    title: 'Shire Mayor Campaign',
    description: 'You are elected Mayor of Eurobodalla Shire. Shout a celebratory round! Pay each player $50.',
    deck: 'knowledge',
    action: 'pay_each_player',
    amount: 50,
  },
  {
    id: 'lk-16',
    title: 'Whale Watching Charter',
    description: 'Humpback migration in full swing! Charter boat sells out. Collect $150.',
    deck: 'knowledge',
    action: 'collect_money',
    amount: 150,
  },
];

export const COMMUNITY_NOTICE_CARDS: GameCard[] = [
  {
    id: 'cn-01',
    title: 'Welcome to Country',
    description: 'Advance to Welcome to the South Coast. Collect $200.',
    deck: 'notice',
    action: 'advance_to',
    targetIndex: 0,
  },
  {
    id: 'cn-02',
    title: 'Oyster Season Harvest',
    description: 'Oyster season is booming on Wagonga Inlet. Sell your harvest: collect $200.',
    deck: 'notice',
    action: 'collect_money',
    amount: 200,
  },
  {
    id: 'cn-03',
    title: 'Moruya Hospital Checkup',
    description: 'Dentist and medical checkup in Moruya. Pay $50.',
    deck: 'notice',
    action: 'pay_money',
    amount: 50,
  },
  {
    id: 'cn-04',
    title: 'Moruya Granite Dividend',
    description: 'Sydney Harbour Bridge memorial stone dividend pays out. Collect $50.',
    deck: 'notice',
    action: 'collect_money',
    amount: 50,
  },
  {
    id: 'cn-05',
    title: 'Community Bail Fund',
    description: 'Get Out of Bodalla Police Station Free. This card may be kept or traded.',
    deck: 'notice',
    action: 'get_out_of_jail_free',
  },
  {
    id: 'cn-06',
    title: 'Illegal Camping on the Dunes',
    description: 'Rangers catch you pitching a swag on the dunes. Go directly to Bodalla Police Station. Do not pass Welcome to the South Coast.',
    deck: 'notice',
    action: 'go_to_jail',
  },
  {
    id: 'cn-07',
    title: 'Mogo Gold Rush Days',
    description: 'You strike gold in Mogo creek! Collect $10 from each player.',
    deck: 'notice',
    action: 'collect_from_each_player',
    amount: 10,
  },
  {
    id: 'cn-08',
    title: 'Summer Holiday Letting',
    description: 'Beach shack fully booked for Christmas holidays. Collect $100.',
    deck: 'notice',
    action: 'collect_money',
    amount: 100,
  },
  {
    id: 'cn-09',
    title: 'Council Rates Rebate',
    description: 'Eurobodalla Shire overcharge rebate credited. Collect $20.',
    deck: 'notice',
    action: 'collect_money',
    amount: 20,
  },
  {
    id: 'cn-10',
    title: 'Surf Life Saving Donation',
    description: 'Support Broulee and Narooma volunteer lifesavers. Pay $50.',
    deck: 'notice',
    action: 'pay_money',
    amount: 50,
  },
  {
    id: 'cn-11',
    title: 'Moruya Vet Clinic',
    description: 'Your kelpie got chased by a goanna. Pay $50 vet fees.',
    deck: 'notice',
    action: 'pay_money',
    amount: 50,
  },
  {
    id: 'cn-12',
    title: 'Eurobodalla Show Ribbon',
    description: '1st prize for giant pumpkin and blueberry jam at Eurobodalla Show! Collect $25.',
    deck: 'notice',
    action: 'collect_money',
    amount: 25,
  },
  {
    id: 'cn-13',
    title: 'Holiday Home Maintenance',
    description: 'Salt-spray rust repairs on your beach cottages: Pay $40 per house, $115 per hotel.',
    deck: 'notice',
    action: 'repairs',
    perHouse: 40,
    perHotel: 115,
  },
  {
    id: 'cn-14',
    title: 'Tilba Cheese Rolling',
    description: 'Placed 2nd in the famous Tilba cheese rolling derby! Collect $10.',
    deck: 'notice',
    action: 'collect_money',
    amount: 10,
  },
  {
    id: 'cn-15',
    title: 'Mystery Bay Inheritance',
    description: 'Inherit an uncle’s tinny and timber cottage. Collect $100.',
    deck: 'notice',
    action: 'collect_money',
    amount: 100,
  },
  {
    id: 'cn-16',
    title: 'Batemans Bay Cruise Anchor',
    description: 'Boutique cruise ship tenders bring thirsty tourists to your stall. Collect $100.',
    deck: 'notice',
    action: 'collect_money',
    amount: 100,
  },
];

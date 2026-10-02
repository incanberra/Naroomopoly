import React from 'react';
import {
  Compass,
  Waves,
  ClipboardList,
  Wrench,
  Umbrella,
  Sparkles,
  Sun,
  Droplets,
  LifeBuoy,
  Mountain,
  Hammer,
  Fish,
  Anchor,
  Car,
  Store,
  ShoppingBag,
  Zap,
  Tent,
  Siren,
  Gem,
  Award,
  Crown,
  Receipt,
  Scale,
  Landmark,
  Shield,
  Palette,
  Truck,
} from 'lucide-react';

export const TileIcon: React.FC<{ icon: string; className?: string; size?: number }> = ({
  icon,
  className = 'w-5 h-5',
  size = 20,
}) => {
  switch (icon) {
    case 'compass':
      return <Compass className={className} size={size} />;
    case 'waves':
      return <Waves className={className} size={size} />;
    case 'clipboard-list':
      return <ClipboardList className={className} size={size} />;
    case 'bridge':
      return <Landmark className={className} size={size} />;
    case 'receipt':
      return <Receipt className={className} size={size} />;
    case 'wrench':
      return <Wrench className={className} size={size} />;
    case 'umbrella':
      return <Umbrella className={className} size={size} />;
    case 'sparkles':
      return <Sparkles className={className} size={size} />;
    case 'shell':
      return <Palette className={className} size={size} />;
    case 'building-columns':
      return <Scale className={className} size={size} />;
    case 'sun':
    case 'sun-medium':
      return <Sun className={className} size={size} />;
    case 'droplets':
      return <Droplets className={className} size={size} />;
    case 'life-buoy':
      return <LifeBuoy className={className} size={size} />;
    case 'mountain':
      return <Mountain className={className} size={size} />;
    case 'hammer':
      return <Hammer className={className} size={size} />;
    case 'fish':
    case 'fish-symbol':
      return <Fish className={className} size={size} />;
    case 'anchor':
      return <Anchor className={className} size={size} />;
    case 'car':
      return <Car className={className} size={size} />;
    case 'store':
      return <Store className={className} size={size} />;
    case 'shopping-basket':
      return <ShoppingBag className={className} size={size} />;
    case 'lighthouse':
      return <Shield className={className} size={size} />;
    case 'truck':
      return <Truck className={className} size={size} />;
    case 'palmtree':
      return <Sun className={className} size={size} />;
    case 'sailboat':
      return <Anchor className={className} size={size} />;
    case 'zap':
      return <Zap className={className} size={size} />;
    case 'tent':
      return <Tent className={className} size={size} />;
    case 'siren':
      return <Siren className={className} size={size} />;
    case 'gem':
      return <Gem className={className} size={size} />;
    case 'axe':
      return <Wrench className={className} size={size} />;
    case 'map-pin':
      return <Award className={className} size={size} />;
    case 'crown':
      return <Crown className={className} size={size} />;
    default:
      return <Waves className={className} size={size} />;
  }
};

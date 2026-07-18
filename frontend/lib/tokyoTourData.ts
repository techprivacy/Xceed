import {
  Plane,
  BedDouble,
  Factory,
  Mountain,
  ShoppingBag,
  UserCheck,
  PlaneTakeoff,
  PlaneLanding,
  Cpu,
  Landmark,
  Bus,
  UtensilsCrossed,
  ShieldCheck,
  Camera,
  Stamp,
  TrainFront,
} from 'lucide-react';

export const HIGHLIGHTS = [
  { icon: Plane, label: 'Return International Flights' },
  { icon: BedDouble, label: 'Premium Business Hotels' },
  { icon: Factory, label: 'Exclusive Visit to 4 Leading Foundry Companies' },
  { icon: Mountain, label: 'Mount Fuji Excursion' },
  { icon: ShoppingBag, label: 'Local Markets, Sightseeing & Shopping' },
  { icon: UserCheck, label: 'Comfortable Transfers & Expert Support' },
];

export const FOUNDRY_VISITS = [
  {
    title: 'Casting Manufacturer',
    text: 'Precision engineering & casting excellence.',
    image: 'https://images.unsplash.com/photo-1529479627062-5f1f0b88912a?w=500&h=380&fit=crop',
  },
  {
    title: 'Foundry Equipment Manufacturer',
    text: 'Advanced machinery & automation.',
    image: 'https://images.unsplash.com/photo-1716191299980-a6e8827ba10b?w=500&h=380&fit=crop',
  },
  {
    title: 'New Technology Innovator',
    text: 'Next-gen solutions in foundry work.',
    image: 'https://images.unsplash.com/photo-1764114441123-586d13fc6ece?w=500&h=380&fit=crop',
  },
  {
    title: 'Material Suppliers',
    text: 'High-quality raw materials & alloys.',
    image: 'https://images.unsplash.com/photo-1531053326607-9d349096d887?w=500&h=380&fit=crop',
  },
];

export const ITINERARY = [
  { day: 1, icon: PlaneTakeoff, title: 'Start from Delhi', text: 'Overnight Flight' },
  { day: 2, icon: PlaneLanding, title: 'Arrive Tokyo & Visit Expo', text: 'Airport Transfer & Expo Visit' },
  { day: 3, icon: Factory, title: 'Foundry Expo Visit', text: 'Industry Visit & Networking' },
  { day: 4, icon: Landmark, title: 'Tokyo Sightseeing', text: 'City Tour & Local Culture' },
  { day: 5, icon: Mountain, title: 'Mt. Fuji Sightseeing', text: 'Scenic Views & Owakudani' },
  { day: 6, icon: Cpu, title: 'Foundry Plant Visit', text: 'Innovation & Collaboration' },
  { day: 7, icon: Cpu, title: 'Foundry Plant Visit', text: 'Technical Exchange & Insights' },
  { day: 8, icon: ShoppingBag, title: 'Window Shopping', text: 'Ginza, Shibuya & More' },
  { day: 9, icon: PlaneTakeoff, title: 'Fly from Japan', text: 'Departure Transfer & Flight' },
  { day: 10, icon: PlaneLanding, title: 'Arrive to Delhi Airport', text: 'With Memories & Connections' },
];

export const INCLUSIONS = [
  { icon: Plane, label: 'Return Airfare' },
  { icon: Stamp, label: 'Visa Fee' },
  { icon: BedDouble, label: 'Business Hotels' },
  { icon: TrainFront, label: 'Bullet Train Tickets' },
  { icon: Bus, label: 'All Transfers & Transportation' },
  { icon: Factory, label: 'Foundry Visits & Meetings' },
  { icon: UtensilsCrossed, label: 'Daily Breakfast & Selected Meals' },
  { icon: Camera, label: 'Sightseeing & Excursions' },
  { icon: UserCheck, label: 'Expert Tour Manager' },
  { icon: ShieldCheck, label: 'Travel Insurance & Support' },
];

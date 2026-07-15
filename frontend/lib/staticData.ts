import { Product } from '@/types';

export const FALLBACK_TRENDING: Partial<Product>[] = [
  {
    _id: 'standard-holders',
    slug: 'standard-holders',
    name: 'Standard Holders',
    shortDescription: 'Square & Oval holders for secure marking',
    price: 3400,
    priceUnit: 'per_piece',
    images: ['https://images.unsplash.com/photo-1621235218811-306917c960f7?w=400&h=300&fit=crop'],
  },
  {
    _id: 'adhesive-type-holders',
    slug: 'adhesive-type-holders',
    name: 'Adhesive Type Holders',
    shortDescription: 'Strong adhesive base for easy mounting',
    price: 3400,
    priceUnit: 'per_piece',
    images: ['https://images.unsplash.com/photo-1548683726-203119be6a39?w=400&h=300&fit=crop'],
  },
  {
    _id: 'screw-type-holders',
    slug: 'screw-type-holders',
    name: 'Screw Type Holders',
    shortDescription: 'Screw fitted holders for permanent fixing',
    price: 3500,
    priceUnit: 'per_piece',
    images: ['https://images.unsplash.com/photo-1564226591723-659ff3852b2a?w=400&h=300&fit=crop'],
  },
  {
    _id: 'detachable-jigs',
    slug: 'detachable-jigs',
    name: 'Detachable Jigs',
    shortDescription: 'Quick change marking with precision',
    price: 7000,
    priceUnit: 'per_piece',
    images: ['https://images.unsplash.com/photo-1711418235334-8895331a6cf9?w=400&h=300&fit=crop'],
  },
  {
    _id: 'powerful-detachable-jigs',
    slug: 'powerful-detachable-jigs',
    name: 'Powerful Detachable Jigs',
    shortDescription: 'Heavy duty jigs for Industrial marking',
    price: 8000,
    priceUnit: 'per_piece',
    images: ['https://images.unsplash.com/photo-1775403907289-cc7fb8993d7d?w=400&h=300&fit=crop'],
  },
  {
    _id: 'magnetic-tools',
    slug: 'magnetic-tools',
    name: 'Magnetic Tools',
    shortDescription: 'Strong magnetic grip for accurate marking',
    price: 2500,
    priceUnit: 'per_piece',
    images: ['https://images.unsplash.com/photo-1611288870280-4a322b8ec7ec?w=400&h=300&fit=crop'],
  },
];

export const PRICING_ROWS = [
  { label: '5 mm Letter', price: 95 },
  { label: '6 mm Letter', price: 100 },
  { label: '7 mm Letter', price: 105 },
  { label: '8 mm Letter', price: 115 },
];

export const ACCESSORY_ROWS = [
  { label: 'Detachable Jig', price: 7000 },
  { label: 'Powerful Detachable Jig', price: 8000 },
  { label: 'Magnetic Tool', price: 2500 },
];

export const INDUSTRIES = [
  {
    name: 'Steel Plants',
    image: 'https://images.unsplash.com/photo-1697281679290-ad7be1b10682?w=300&h=200&fit=crop',
  },
  {
    name: 'Fabrication Units',
    image: 'https://images.unsplash.com/photo-1531053326607-9d349096d887?w=300&h=200&fit=crop',
  },
  {
    name: 'Automotive',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&h=200&fit=crop',
  },
  {
    name: 'Foundries',
    image: 'https://images.unsplash.com/photo-1529479627062-5f1f0b88912a?w=300&h=200&fit=crop',
  },
  {
    name: 'Warehouses',
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=300&h=200&fit=crop',
  },
  {
    name: 'Engineering Units',
    image: 'https://images.unsplash.com/photo-1764114441123-586d13fc6ece?w=300&h=200&fit=crop',
  },
  {
    name: 'Packaging Lines',
    image: 'https://images.unsplash.com/photo-1779517226310-00e5c43554f3?w=300&h=200&fit=crop',
  },
  {
    name: 'Manufacturing Facilities',
    image: 'https://images.unsplash.com/photo-1716191299980-a6e8827ba10b?w=300&h=200&fit=crop',
  },
];

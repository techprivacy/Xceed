import { LucideIcon, Newspaper, Factory, Handshake, Building2, Package, Trophy, Award, Rocket, TrendingUp } from 'lucide-react';
import { NewsIcon } from '@/types';

// Maps the string `icon` field stored on a NewsArticle (backend/src/models/
// NewsArticle.js's ICONS list) to the actual lucide-react component —
// shared by every place that renders an article (public pages + the admin
// icon picker) so they can't drift out of sync with the backend's enum.
export const NEWS_ICON_MAP: Record<NewsIcon, LucideIcon> = {
  Newspaper,
  Factory,
  Handshake,
  Building2,
  Package,
  Trophy,
  Award,
  Rocket,
  TrendingUp,
};

export const NEWS_ICON_OPTIONS = Object.keys(NEWS_ICON_MAP) as NewsIcon[];

export const formatNewsDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

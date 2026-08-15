import { LucideIcon, Newspaper, Factory, Handshake, Building2, Package } from 'lucide-react';

// Shared data source for the News & Awards section — one place backing the
// News & Awards listing page, the "All News" listing, and each individual
// article page, so they can never drift out of sync with each other.
// Placeholder copy throughout, same as the rest of News & Awards, until
// real articles are supplied.
export interface NewsArticle {
  slug: string;
  category: string;
  title: string;
  date: string;
  excerpt: string;
  body: string[];
  icon: LucideIcon;
  featured?: boolean;
}

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    slug: 'xceed-expands-marking-solutions-india',
    category: 'Company',
    title: 'XCEED Expands Advanced Marking Solutions Across India',
    date: '10 August 2026',
    excerpt:
      'XCEED continues to strengthen its presence across India with enhanced industrial marking and identification solutions — helping foundries and manufacturers achieve greater precision, durability, and consistency backed by Japanese engineering standards.',
    body: [
      "XCEED continues to strengthen its presence across India with enhanced industrial marking and identification solutions, helping foundries and manufacturers achieve greater precision, durability, and consistency backed by Japanese engineering standards.",
      "The expansion brings XCEED's cast letters, cast numbers, holders, and magnetic marking tools to a wider network of industrial partners across the country, supporting permanent, high-visibility identification for heavy equipment, components, and finished goods.",
      "This growth reflects XCEED's ongoing commitment to bridging Japanese manufacturing technology with the needs of Indian industry — building on more than two decades of cross-border partnership between the two countries.",
    ],
    icon: Newspaper,
    featured: true,
  },
  {
    slug: 'next-gen-marking-technology-heavy-industries',
    category: 'Technology',
    title: 'Next-Gen Marking Technology Launched for Heavy Industries',
    date: '10 August 2026',
    excerpt:
      'A new generation of precision marking tools designed for heavy industrial use, built to withstand demanding manufacturing environments.',
    body: [
      'XCEED has introduced a new generation of precision marking tools designed specifically for heavy industrial use, built to withstand the demanding conditions of foundries, steel plants, and fabrication units.',
      'The updated range focuses on faster application, longer tool life, and consistent legibility even after exposure to heat, abrasion, and repeated handling — addressing some of the most common pain points reported by manufacturing partners.',
      'Early rollout has begun with select partners across India, with wider availability planned in the coming months.',
    ],
    icon: Factory,
  },
  {
    slug: 'strengthening-japan-india-industrial-partnerships',
    category: 'Partnership',
    title: 'Strengthening Japan–India Industrial Partnerships',
    date: '02 August 2026',
    excerpt:
      'XCEED deepens its network of manufacturing and technology partners across Japan and India, opening new avenues for collaboration.',
    body: [
      "XCEED has taken further steps to deepen its network of manufacturing and technology partners across Japan and India, opening new avenues for collaboration between foundries, machinery suppliers, and industrial solution providers.",
      "These partnerships focus on knowledge exchange, technology transfer, and joint business development — reflecting XCEED's role as a bridge between Japanese industrial expertise and the growing needs of Indian manufacturing.",
      'More details on specific partnership initiatives will be shared as they progress.',
    ],
    icon: Handshake,
  },
  {
    slug: 'supporting-future-smart-manufacturing',
    category: 'Industry',
    title: 'Supporting the Future of Smart Manufacturing',
    date: '26 July 2026',
    excerpt:
      'XCEED explores how automation, robotics, and smart identification systems are shaping the next generation of manufacturing.',
    body: [
      'As manufacturing continues to evolve, XCEED is exploring how automation, robotics, and smart identification systems can support the next generation of industrial production.',
      'From robotic deburring systems to automated inspection and marking, the goal is to help manufacturers keep pace with rising quality and traceability expectations without compromising speed or cost-efficiency.',
      'XCEED continues to work closely with Japanese technology partners to bring these capabilities to the Indian market.',
    ],
    icon: Newspaper,
  },
  {
    slug: 'xceed-strengthens-operations-japan',
    category: 'Company',
    title: 'XCEED Strengthens Operations Support Across Japan',
    date: '18 July 2026',
    excerpt: "Expanded operational support strengthens XCEED's ability to serve Japanese manufacturers and technology partners.",
    body: [
      "XCEED has expanded its operational support across Japan, strengthening its ability to serve Japanese manufacturers and technology partners looking to grow their presence in the Indian market.",
      'This includes closer coordination on sourcing, logistics, and technical support — helping ensure a smoother experience for partners on both sides of the relationship.',
      "The expansion is part of XCEED's broader commitment to being a reliable, on-the-ground partner for cross-border industrial business.",
    ],
    icon: Building2,
  },
  {
    slug: 'new-holder-range-launched',
    category: 'Product',
    title: 'New Holder Range Launched for Industrial Marking',
    date: '05 July 2026',
    excerpt:
      'A new range of standard, adhesive, and screw-type holders designed for secure, repeatable marking across a wider range of surfaces.',
    body: [
      'XCEED has launched a new range of holders designed for secure, repeatable industrial marking across a wider range of surfaces and applications.',
      "The range includes standard, adhesive, and screw-type options, giving manufacturers more flexibility in how cast letters and numbers are mounted and maintained on equipment and components.",
      "The new holders are available now as part of XCEED's existing product catalog.",
    ],
    icon: Package,
  },
];

export const getFeaturedArticle = (): NewsArticle => NEWS_ARTICLES.find((a) => a.featured) ?? NEWS_ARTICLES[0];

export const getLatestArticles = (excludeSlug?: string, limit = 3): NewsArticle[] =>
  NEWS_ARTICLES.filter((a) => a.slug !== excludeSlug).slice(0, limit);

export const getArticleBySlug = (slug: string): NewsArticle | undefined =>
  NEWS_ARTICLES.find((a) => a.slug === slug);

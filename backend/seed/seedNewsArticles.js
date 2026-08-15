// Migrates the 6 dummy News & Awards articles (previously hardcoded in
// frontend/lib/newsData.ts) into the database, now that the frontend
// reads News from the API instead of static data. Idempotent — matches
// on slug, so re-running updates existing articles rather than
// duplicating them.
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const NewsArticle = require('../src/models/NewsArticle');

const ARTICLES = [
  {
    slug: 'xceed-expands-marking-solutions-india',
    category: 'Company',
    title: 'XCEED Expands Advanced Marking Solutions Across India',
    date: new Date('2026-08-10'),
    excerpt:
      'XCEED continues to strengthen its presence across India with enhanced industrial marking and identification solutions — helping foundries and manufacturers achieve greater precision, durability, and consistency backed by Japanese engineering standards.',
    body: [
      "XCEED continues to strengthen its presence across India with enhanced industrial marking and identification solutions, helping foundries and manufacturers achieve greater precision, durability, and consistency backed by Japanese engineering standards.",
      "The expansion brings XCEED's cast letters, cast numbers, holders, and magnetic marking tools to a wider network of industrial partners across the country, supporting permanent, high-visibility identification for heavy equipment, components, and finished goods.",
      "This growth reflects XCEED's ongoing commitment to bridging Japanese manufacturing technology with the needs of Indian industry — building on more than two decades of cross-border partnership between the two countries.",
    ].join('\n\n'),
    icon: 'Newspaper',
    featured: true,
    status: 'published',
  },
  {
    slug: 'next-gen-marking-technology-heavy-industries',
    category: 'Technology',
    title: 'Next-Gen Marking Technology Launched for Heavy Industries',
    date: new Date('2026-08-10'),
    excerpt:
      'A new generation of precision marking tools designed for heavy industrial use, built to withstand demanding manufacturing environments.',
    body: [
      'XCEED has introduced a new generation of precision marking tools designed specifically for heavy industrial use, built to withstand the demanding conditions of foundries, steel plants, and fabrication units.',
      'The updated range focuses on faster application, longer tool life, and consistent legibility even after exposure to heat, abrasion, and repeated handling — addressing some of the most common pain points reported by manufacturing partners.',
      'Early rollout has begun with select partners across India, with wider availability planned in the coming months.',
    ].join('\n\n'),
    icon: 'Factory',
    featured: false,
    status: 'published',
  },
  {
    slug: 'strengthening-japan-india-industrial-partnerships',
    category: 'Partnership',
    title: 'Strengthening Japan–India Industrial Partnerships',
    date: new Date('2026-08-02'),
    excerpt:
      'XCEED deepens its network of manufacturing and technology partners across Japan and India, opening new avenues for collaboration.',
    body: [
      "XCEED has taken further steps to deepen its network of manufacturing and technology partners across Japan and India, opening new avenues for collaboration between foundries, machinery suppliers, and industrial solution providers.",
      "These partnerships focus on knowledge exchange, technology transfer, and joint business development — reflecting XCEED's role as a bridge between Japanese industrial expertise and the growing needs of Indian manufacturing.",
      'More details on specific partnership initiatives will be shared as they progress.',
    ].join('\n\n'),
    icon: 'Handshake',
    featured: false,
    status: 'published',
  },
  {
    slug: 'supporting-future-smart-manufacturing',
    category: 'Industry',
    title: 'Supporting the Future of Smart Manufacturing',
    date: new Date('2026-07-26'),
    excerpt:
      'XCEED explores how automation, robotics, and smart identification systems are shaping the next generation of manufacturing.',
    body: [
      'As manufacturing continues to evolve, XCEED is exploring how automation, robotics, and smart identification systems can support the next generation of industrial production.',
      'From robotic deburring systems to automated inspection and marking, the goal is to help manufacturers keep pace with rising quality and traceability expectations without compromising speed or cost-efficiency.',
      'XCEED continues to work closely with Japanese technology partners to bring these capabilities to the Indian market.',
    ].join('\n\n'),
    icon: 'Newspaper',
    featured: false,
    status: 'published',
  },
  {
    slug: 'xceed-strengthens-operations-japan',
    category: 'Company',
    title: 'XCEED Strengthens Operations Support Across Japan',
    date: new Date('2026-07-18'),
    excerpt: "Expanded operational support strengthens XCEED's ability to serve Japanese manufacturers and technology partners.",
    body: [
      "XCEED has expanded its operational support across Japan, strengthening its ability to serve Japanese manufacturers and technology partners looking to grow their presence in the Indian market.",
      'This includes closer coordination on sourcing, logistics, and technical support — helping ensure a smoother experience for partners on both sides of the relationship.',
      "The expansion is part of XCEED's broader commitment to being a reliable, on-the-ground partner for cross-border industrial business.",
    ].join('\n\n'),
    icon: 'Building2',
    featured: false,
    status: 'published',
  },
  {
    slug: 'new-holder-range-launched',
    category: 'Product',
    title: 'New Holder Range Launched for Industrial Marking',
    date: new Date('2026-07-05'),
    excerpt:
      'A new range of standard, adhesive, and screw-type holders designed for secure, repeatable marking across a wider range of surfaces.',
    body: [
      'XCEED has launched a new range of holders designed for secure, repeatable industrial marking across a wider range of surfaces and applications.',
      "The range includes standard, adhesive, and screw-type options, giving manufacturers more flexibility in how cast letters and numbers are mounted and maintained on equipment and components.",
      "The new holders are available now as part of XCEED's existing product catalog.",
    ].join('\n\n'),
    icon: 'Package',
    featured: false,
    status: 'published',
  },
];

const run = async () => {
  await connectDB();
  console.log('Seeding News & Awards articles...');

  let created = 0;
  let updated = 0;

  for (const def of ARTICLES) {
    const existing = await NewsArticle.findOne({ slug: def.slug });
    if (existing) {
      await NewsArticle.updateOne({ slug: def.slug }, { $set: def });
      updated += 1;
    } else {
      await NewsArticle.create(def);
      created += 1;
    }
  }

  console.log(`Articles ready: ${ARTICLES.length} (${created} created, ${updated} updated)`);
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});

export interface MemberCompany {
  id: string;
  name: string;
  contactPerson: string;
  industry: string;
  products: string;
  location: string;
}

const INDUSTRIES = [
  'Steel Fabrication',
  'Foundries',
  'Automotive',
  'Machine Tools',
  'Sheet Metal',
  'Forging',
  'Precision Engineering',
  'Casting',
];

const PRODUCT_LINES = [
  'Cast Letters & Numbers',
  'Marking Holders',
  'Magnetic Tools',
  'Detachable Jigs',
  'Custom Marking Solutions',
  'Steel Stamps',
  'Industrial Fixtures',
];

const INDIA_CITIES = ['Pune', 'Ahmedabad', 'Chennai', 'Coimbatore', 'Rajkot', 'Ludhiana', 'Jamshedpur', 'Kolhapur'];
const JAPAN_CITIES = ['Osaka', 'Nagoya', 'Yokohama', 'Kobe', 'Hiroshima'];

const INDIA_COMPANY_NAMES = [
  'Bharat Steel Fabricators',
  'Konkan Foundries Pvt Ltd',
  'Anand Auto Components',
  'Shakti Engineering Works',
  'Vishwakarma Castings',
  'Rajlaxmi Precision Tools',
  'Deccan Machine Works',
  'Suraj Forge Industries',
  'Om Sai Metal Industries',
  'Ganesh Sheet Metal Co.',
  'Maharashtra Tool Room',
  'Indus Precision Components',
  'Sunrise Steel Traders',
  'Nakoda Engineering Pvt Ltd',
  'Bhavani Casting Works',
  'Trident Forge & Fab',
  'Amba Precision Industries',
  'Vinayak Machine Tools',
  'Krishna Industrial Works',
  'Parth Metal Fabricators',
  'Sanghvi Auto Castings',
  'Shree Ram Foundries',
  'Jai Bharat Engineering',
  'Precision Cast Industries',
  'National Steel Works',
];

const JAPAN_COMPANY_NAMES = [
  'Yamato Seiko Co., Ltd.',
  'Kobe Precision Industries',
  'Nippon Casting Works',
  'Fujimoto Machine Tools',
  'Osaka Metal Fabricators',
  'Hiroshima Forge Co.',
  'Nagoya Sheet Metal K.K.',
  'Tanaka Engineering Corp.',
  'Sakura Precision Co., Ltd.',
  'Marutec Industries Japan',
  'Kansai Foundry Group',
  'Yokohama Tool Works',
  'Suzuki Metal Industries',
  'Nakamura Fabrication K.K.',
  'Aichi Precision Casting',
  'Hitachi Marking Solutions',
  'Toyoda Machine Works',
  'Kyoto Steel Fabricators',
  'Meiwa Industrial Co.',
  'Sumitomo Engineering Works',
  'Daiwa Precision Tools',
  'Fukuoka Casting Industries',
  'Chubu Metal Works',
  'Ishikawa Forge Co., Ltd.',
  'Nissei Fabrication Group',
];

const CONTACT_FIRST_NAMES_INDIA = ['Rajesh', 'Priya', 'Suresh', 'Anita', 'Vikram', 'Neha', 'Amit', 'Kavita'];
const CONTACT_LAST_NAMES_INDIA = ['Mehta', 'Shah', 'Naik', 'Deshmukh', 'Patel', 'Joshi', 'Kulkarni', 'Rao'];
const CONTACT_NAMES_JAPAN = [
  'Kenji Tanaka',
  'Hiroshi Yamamoto',
  'Yuki Sato',
  'Takashi Suzuki',
  'Akiko Nakamura',
  'Kazuo Watanabe',
  'Miho Kobayashi',
  'Ryo Fujimoto',
];

function buildCompanies(): MemberCompany[] {
  const companies: MemberCompany[] = [];

  INDIA_COMPANY_NAMES.forEach((name, i) => {
    companies.push({
      id: `in-${i + 1}`,
      name,
      contactPerson: `${CONTACT_FIRST_NAMES_INDIA[i % CONTACT_FIRST_NAMES_INDIA.length]} ${
        CONTACT_LAST_NAMES_INDIA[(i + 3) % CONTACT_LAST_NAMES_INDIA.length]
      }`,
      industry: INDUSTRIES[i % INDUSTRIES.length],
      products: PRODUCT_LINES[i % PRODUCT_LINES.length],
      location: `${INDIA_CITIES[i % INDIA_CITIES.length]}, India`,
    });
  });

  JAPAN_COMPANY_NAMES.forEach((name, i) => {
    companies.push({
      id: `jp-${i + 1}`,
      name,
      contactPerson: CONTACT_NAMES_JAPAN[i % CONTACT_NAMES_JAPAN.length],
      industry: INDUSTRIES[(i + 2) % INDUSTRIES.length],
      products: PRODUCT_LINES[(i + 3) % PRODUCT_LINES.length],
      location: `${JAPAN_CITIES[i % JAPAN_CITIES.length]}, Japan`,
    });
  });

  return companies;
}

export const MEMBER_COMPANIES: MemberCompany[] = buildCompanies();

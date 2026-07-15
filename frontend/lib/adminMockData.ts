export const MOCK_INVENTORY = [
  { sku: 'XI-CL-05', warehouse: 'Pune Central', onHand: 12400, reserved: 800, reorderLevel: 2000, status: 'Healthy' },
  { sku: 'XI-CL-08', warehouse: 'Pune Central', onHand: 210, reserved: 150, reorderLevel: 500, status: 'Low Stock' },
  { sku: 'XI-HD-SCR', warehouse: 'Ahmedabad Depot', onHand: 95, reserved: 40, reorderLevel: 150, status: 'Low Stock' },
  { sku: 'XI-JG-PW', warehouse: 'Pune Central', onHand: 0, reserved: 0, reorderLevel: 20, status: 'Out of Stock' },
  { sku: 'XI-MT-STD', warehouse: 'Ahmedabad Depot', onHand: 410, reserved: 60, reorderLevel: 100, status: 'Healthy' },
];

export const MOCK_ORDERS = [
  { id: 'ORD-8841', customer: 'Bharat Steel Fabricators', items: 3, total: 214000, status: 'Processing', date: '2026-07-01' },
  { id: 'ORD-8840', customer: 'Anand Auto Components', items: 2, total: 87500, status: 'Shipped', date: '2026-06-29' },
  { id: 'ORD-8839', customer: 'Konkan Foundries Pvt Ltd', items: 5, total: 64000, status: 'Delivered', date: '2026-06-24' },
  { id: 'ORD-8838', customer: 'Precision Tools India', items: 1, total: 8000, status: 'Pending', date: '2026-06-22' },
  { id: 'ORD-8837', customer: 'Sundaram Engineering', items: 4, total: 132500, status: 'Cancelled', date: '2026-06-18' },
];

export const MOCK_CUSTOMERS = [
  { id: 'CU-201', name: 'Bharat Steel Fabricators', city: 'Pune', orders: 12, totalSpend: 1284000, since: '2024-02-11' },
  { id: 'CU-202', name: 'Anand Auto Components', city: 'Ahmedabad', orders: 7, totalSpend: 456000, since: '2024-08-03' },
  { id: 'CU-203', name: 'Konkan Foundries Pvt Ltd', city: 'Kolhapur', orders: 4, totalSpend: 198000, since: '2025-01-19' },
  { id: 'CU-204', name: 'Precision Tools India', city: 'Nashik', orders: 2, totalSpend: 42000, since: '2025-11-05' },
];

export const MOCK_DEALERS = [
  { id: 'DL-01', name: 'Shree Industrial Supplies', territory: 'Western Maharashtra', discount: '12%', creditLimit: 500000, status: 'Approved' },
  { id: 'DL-02', name: 'Gujarat Tool Traders', territory: 'Gujarat', discount: '10%', creditLimit: 350000, status: 'Approved' },
  { id: 'DL-03', name: 'Deccan Engineering Marts', territory: 'Telangana', discount: '8%', creditLimit: 200000, status: 'Pending Approval' },
];

export const MOCK_PRICING = [
  { tier: 'Retail', minQty: '1 - 99', discount: '0%' },
  { tier: 'Bulk Tier 1', minQty: '100 - 499', discount: '5%' },
  { tier: 'Bulk Tier 2', minQty: '500 - 999', discount: '10%' },
  { tier: 'Dealer', minQty: '1000+', discount: '15-20%' },
];

export const MOCK_CMS_PAGES = [
  { id: 'CMS-1', title: 'Homepage', slug: '/', lastUpdated: '2026-06-28', status: 'Published' },
  { id: 'CMS-2', title: 'About Us', slug: '/about-us', lastUpdated: '2026-05-14', status: 'Published' },
  { id: 'CMS-3', title: 'Industries', slug: '/industries', lastUpdated: '2026-06-02', status: 'Published' },
  { id: 'CMS-4', title: 'FAQs', slug: '/faqs', lastUpdated: '2026-04-20', status: 'Draft' },
];

export const MOCK_ACTIVITY_LOGS = [
  { id: 'AL-1', user: 'ak', action: 'Updated quote status to Negotiation', target: 'Konkan Foundries Pvt Ltd', time: '2026-07-05 14:32' },
  { id: 'AL-2', user: 'ak', action: 'Logged in', target: '—', time: '2026-07-05 14:10' },
  { id: 'AL-3', user: 'ak', action: 'Added internal note', target: 'Bharat Steel Fabricators', time: '2026-07-04 11:05' },
  { id: 'AL-4', user: 'system', action: 'Seeded sample quote requests', target: '—', time: '2026-07-05 09:00' },
];

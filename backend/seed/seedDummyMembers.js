// Ad-hoc seed for demo/test data: 1 admin (reuses seed.js's idempotent
// admin-creation block), 1 individual member account, and 10 company
// member accounts — all status: 'approved' per request, so they show up
// on the live public Member Directory alongside real companies.
//
// Deliberately separate from seed/seed.js (which also seeds categories/
// products/sample quotes) so re-running this doesn't touch that data.
//
// Every email uses the .example.com / .co.jp.example.com reserved domain
// (RFC 2606) — guaranteed to never resolve or deliver, so even if
// something later calls approveMember/forgotPassword on these accounts,
// no mail actually goes anywhere. All passwords are explicit, matching
// how seed.js's existing sample members work — that bypasses
// approveMember's email-on-approval path entirely, since these are
// created via Member.create() directly, not through the approve flow.
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const User = require('../src/models/User');
const Member = require('../src/models/Member');

const DUMMY_PASSWORD = 'Demo@12345';

const run = async () => {
  await connectDB();
  console.log('Seeding dummy admin/member/company data...');

  // ---- 1. Admin (idempotent — same check as seed.js) ----
  const adminUsername = process.env.ADMIN_USERNAME || 'ak';
  const adminPassword = process.env.ADMIN_PASSWORD || 'ak@123';
  let admin = await User.findOne({ username: adminUsername });
  if (!admin) {
    admin = await User.create({
      username: adminUsername,
      email: process.env.ADMIN_EMAIL || 'admin@xceedindia.com',
      password: adminPassword,
      role: 'admin',
    });
    console.log(`Created admin user: ${admin.username}`);
  } else {
    console.log(`Admin user already exists: ${admin.username}`);
  }

  // ---- 2. One dummy individual member ("dummy user") ----
  const dummyUser = {
    companyName: 'Test User',
    contactPerson: 'Test User',
    email: 'dummy.user@example.com',
    industry: 'Industry Professional',
    country: 'India',
    location: 'Mumbai, India',
    mobileNumber: '+91 90000 00001',
    membershipType: 'Industry Professional',
    status: 'approved',
    subscriptionStatus: 'active',
  };
  if (!(await Member.findOne({ email: dummyUser.email }))) {
    await Member.create({ ...dummyUser, password: DUMMY_PASSWORD });
    console.log(`Created dummy user: ${dummyUser.email}`);
  } else {
    console.log(`Dummy user already exists: ${dummyUser.email}`);
  }

  // ---- 3. Ten dummy companies ----
  const companies = [
    {
      companyName: 'Precision Castings India Pvt Ltd',
      contactPerson: 'Arvind Deshmukh',
      email: 'arvind@precisioncastings.example.com',
      industry: 'Foundry / Manufacturer',
      products: 'Sand Cast Components, Precision Castings',
      country: 'India',
      location: 'Pune, Maharashtra, India',
      mobileNumber: '+91 98220 10001',
      membershipType: 'Foundry / Manufacturer',
    },
    {
      companyName: 'Osaka Precision Tools Co., Ltd.',
      contactPerson: 'Kenji Tanaka',
      email: 'k.tanaka@osakaprecision.co.jp.example.com',
      industry: 'Technology / Machinery Supplier',
      products: 'CNC Marking Machines, Precision Tooling',
      country: 'Japan',
      location: 'Osaka, Japan',
      mobileNumber: '+81 6 6000 1002',
      membershipType: 'Japanese Company',
    },
    {
      companyName: 'Deccan Foundry Works',
      contactPerson: 'Ramesh Reddy',
      email: 'ramesh@deccanfoundry.example.com',
      industry: 'Foundry / Manufacturer',
      products: 'Grey Iron Castings, SG Iron Castings',
      country: 'India',
      location: 'Hyderabad, Telangana, India',
      mobileNumber: '+91 90300 10003',
      membershipType: 'Foundry / Manufacturer',
    },
    {
      companyName: 'Nagoya Robotics Corporation',
      contactPerson: 'Hiroshi Yamamoto',
      email: 'h.yamamoto@nagoyarobotics.co.jp.example.com',
      industry: 'Technology / Machinery Supplier',
      products: 'Robotic Deburring Systems, Automation Cells',
      country: 'Japan',
      location: 'Nagoya, Aichi, Japan',
      mobileNumber: '+81 52 000 1004',
      membershipType: 'Japanese Company',
    },
    {
      companyName: 'Bharat Heavy Engineering Ltd',
      contactPerson: 'Suresh Nair',
      email: 'suresh@bharatheavy.example.com',
      industry: 'Manufacturing',
      products: 'Heavy Equipment Components',
      country: 'India',
      location: 'Chennai, Tamil Nadu, India',
      mobileNumber: '+91 98400 10005',
      membershipType: 'Indian Company',
    },
    {
      companyName: 'Kansai Metal Industries',
      contactPerson: 'Takashi Sato',
      email: 't.sato@kansaimetal.co.jp.example.com',
      industry: 'Foundry / Manufacturer',
      products: 'Die Casting, Metal Finishing',
      country: 'Japan',
      location: 'Kobe, Japan',
      mobileNumber: '+81 78 000 1006',
      membershipType: 'Japanese Company',
    },
    {
      companyName: 'Rajasthan Sand Casting Co.',
      contactPerson: 'Vikram Singh',
      email: 'vikram@rajasthansandcasting.example.com',
      industry: 'Foundry / Manufacturer',
      products: 'Sand Reclamation Systems, Cast Components',
      country: 'India',
      location: 'Jaipur, Rajasthan, India',
      mobileNumber: '+91 94140 10007',
      membershipType: 'Foundry / Manufacturer',
    },
    {
      companyName: 'Yokohama Automation Systems',
      contactPerson: 'Yuki Nakamura',
      email: 'y.nakamura@yokohamaautomation.co.jp.example.com',
      industry: 'Technology / Machinery Supplier',
      products: 'Industrial Automation, Waste-Gas Purification Systems',
      country: 'Japan',
      location: 'Yokohama, Japan',
      mobileNumber: '+81 45 000 1008',
      membershipType: 'Japanese Company',
    },
    {
      companyName: 'Gujarat Precision Components',
      contactPerson: 'Nikhil Patel',
      email: 'nikhil@gujaratprecision.example.com',
      industry: 'Manufacturing',
      products: 'Precision Machined Parts',
      country: 'India',
      location: 'Ahmedabad, Gujarat, India',
      mobileNumber: '+91 99250 10009',
      membershipType: 'Indian Company',
    },
    {
      companyName: 'Tokyo Industrial Solutions',
      contactPerson: 'Daisuke Ito',
      email: 'd.ito@tokyoindustrial.co.jp.example.com',
      industry: 'Technology / Machinery Supplier',
      products: 'Industrial Gasification Machines, Environmental Technologies',
      country: 'Japan',
      location: 'Tokyo, Japan',
      mobileNumber: '+81 3 0000 1010',
      membershipType: 'Japanese Company',
    },
  ];

  let created = 0;
  for (const def of companies) {
    if (!(await Member.findOne({ email: def.email }))) {
      await Member.create({
        ...def,
        password: DUMMY_PASSWORD,
        status: 'approved',
        subscriptionStatus: 'active',
      });
      created += 1;
    }
  }
  console.log(`Companies ready: ${companies.length} (${created} newly created, ${companies.length - created} already existed)`);

  console.log('\nSeeding complete.');
  console.log(`Admin login -> username: ${adminUsername} / password: (unchanged if already existed)`);
  console.log(`Dummy user login -> email: ${dummyUser.email} / password: ${DUMMY_PASSWORD}`);
  console.log(`All 10 company logins use the same password: ${DUMMY_PASSWORD}`);
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});

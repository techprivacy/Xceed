// Ad-hoc seed for demo/test data: 20 dummy companies, each as an
// Account + MembershipApplication pair (status: 'approved') so they show
// up on the live public Directory (app/[locale]/directory) alongside real
// companies. This is the Account/MembershipApplication-era equivalent of
// seedDummyMembers.js's old "10 dummy companies" block — that script
// still exists but targets the now-superseded Member model, which the
// frontend no longer reads from for the public directory.
//
// Deliberately separate from seed/seed.js (categories/products/sample
// quotes) so re-running this doesn't touch that data.
//
// Every email uses the .example.com / .co.jp.example.com reserved domain
// (RFC 2606) — guaranteed to never resolve or deliver, so even if
// something later emails one of these accounts, no mail actually goes
// anywhere. Accounts are created with emailVerified: true directly
// (bypassing the verification-email flow entirely), same reasoning as
// the old seed bypassing approveMember's email-on-approval path.
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const Account = require('../src/models/Account');
const MembershipApplication = require('../src/models/MembershipApplication');

const DUMMY_PASSWORD = 'Demo@12345';

const COMPANIES = [
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
  {
    companyName: 'Chennai Alloy Castings Pvt Ltd',
    contactPerson: 'Karthik Subramaniam',
    email: 'karthik@chennaialloy.example.com',
    industry: 'Foundry / Manufacturer',
    products: 'Aluminium Die Castings, Sand Castings',
    country: 'India',
    location: 'Chennai, Tamil Nadu, India',
    mobileNumber: '+91 98410 10011',
    membershipType: 'Foundry / Manufacturer',
  },
  {
    companyName: 'Kyoto Forge & Machinery Co., Ltd.',
    contactPerson: 'Satoshi Kobayashi',
    email: 's.kobayashi@kyotoforge.co.jp.example.com',
    industry: 'Technology / Machinery Supplier',
    products: 'Forging Equipment, CNC Machining Centers',
    country: 'Japan',
    location: 'Kyoto, Japan',
    mobileNumber: '+81 75 000 1012',
    membershipType: 'Japanese Company',
  },
  {
    companyName: 'Ludhiana Steel Works',
    contactPerson: 'Gurpreet Singh',
    email: 'gurpreet@ludhianasteel.example.com',
    industry: 'Foundry / Manufacturer',
    products: 'Steel Castings, Machine Tool Components',
    country: 'India',
    location: 'Ludhiana, Punjab, India',
    mobileNumber: '+91 98140 10013',
    membershipType: 'Foundry / Manufacturer',
  },
  {
    companyName: 'Hiroshima Marine Components Co.',
    contactPerson: 'Ryo Matsumoto',
    email: 'r.matsumoto@hiroshimamarine.co.jp.example.com',
    industry: 'Manufacturing',
    products: 'Marine Engine Parts, Precision Components',
    country: 'Japan',
    location: 'Hiroshima, Japan',
    mobileNumber: '+81 82 000 1014',
    membershipType: 'Japanese Company',
  },
  {
    companyName: 'Coimbatore Precision Foundry',
    contactPerson: 'Senthil Kumar',
    email: 'senthil@coimbatorefoundry.example.com',
    industry: 'Foundry / Manufacturer',
    products: 'Grey Iron Castings, Pump Components',
    country: 'India',
    location: 'Coimbatore, Tamil Nadu, India',
    mobileNumber: '+91 98430 10015',
    membershipType: 'Foundry / Manufacturer',
  },
  {
    companyName: 'Sapporo Cold-Forming Industries',
    contactPerson: 'Takumi Sasaki',
    email: 't.sasaki@sapporocoldforming.co.jp.example.com',
    industry: 'Technology / Machinery Supplier',
    products: 'Cold Forming Machines, Press Tools',
    country: 'Japan',
    location: 'Sapporo, Japan',
    mobileNumber: '+81 11 000 1016',
    membershipType: 'Japanese Company',
  },
  {
    companyName: 'Indore Alloys & Metals Ltd',
    contactPerson: 'Rohit Sharma',
    email: 'rohit@indorealloys.example.com',
    industry: 'Manufacturing',
    products: 'Non-Ferrous Alloy Ingots, Metal Components',
    country: 'India',
    location: 'Indore, Madhya Pradesh, India',
    mobileNumber: '+91 94250 10017',
    membershipType: 'Indian Company',
  },
  {
    companyName: 'Fukuoka Robotics & Automation KK',
    contactPerson: 'Kazuki Endo',
    email: 'k.endo@fukuokarobotics.co.jp.example.com',
    industry: 'Technology / Machinery Supplier',
    products: 'Welding Robots, Automated Inspection Systems',
    country: 'Japan',
    location: 'Fukuoka, Japan',
    mobileNumber: '+81 92 000 1018',
    membershipType: 'Japanese Company',
  },
  {
    companyName: 'Vadodara Engineering Casting Co.',
    contactPerson: 'Mihir Trivedi',
    email: 'mihir@vadodaracasting.example.com',
    industry: 'Foundry / Manufacturer',
    products: 'Valve Body Castings, Pump Housings',
    country: 'India',
    location: 'Vadodara, Gujarat, India',
    mobileNumber: '+91 97230 10019',
    membershipType: 'Foundry / Manufacturer',
  },
  {
    companyName: 'Sendai Industrial Solutions Co., Ltd.',
    contactPerson: 'Haruto Kimura',
    email: 'h.kimura@sendaiindustrial.co.jp.example.com',
    industry: 'Technology / Machinery Supplier',
    products: 'Industrial Waste-Gas Purification, Sand Reclamation Systems',
    country: 'Japan',
    location: 'Sendai, Japan',
    mobileNumber: '+81 22 000 1020',
    membershipType: 'Japanese Company',
  },
];

const run = async () => {
  await connectDB();
  console.log('Seeding dummy directory data (20 companies)...');

  let createdAccounts = 0;
  let createdApplications = 0;

  for (const def of COMPANIES) {
    const { email, mobileNumber, contactPerson, ...applicationFields } = def;

    let account = await Account.findOne({ email });
    if (!account) {
      account = await Account.create({
        fullName: contactPerson,
        email,
        password: DUMMY_PASSWORD,
        emailVerified: true,
      });
      createdAccounts += 1;
    }

    const existingApplication = await MembershipApplication.findOne({ account: account._id });
    if (!existingApplication) {
      await MembershipApplication.create({
        ...applicationFields,
        contactPerson,
        mobileNumber,
        account: account._id,
        status: 'approved',
        subscriptionStatus: 'active',
      });
      createdApplications += 1;
    }
  }

  console.log(
    `Accounts ready: ${COMPANIES.length} (${createdAccounts} newly created, ${COMPANIES.length - createdAccounts} already existed)`
  );
  console.log(
    `Applications ready: ${COMPANIES.length} (${createdApplications} newly created, ${COMPANIES.length - createdApplications} already existed)`
  );
  console.log(`All 20 company logins use the same password: ${DUMMY_PASSWORD}`);

  console.log('\nSeeding complete.');
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});

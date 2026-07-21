require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const run = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/xceed_india';
  const client = new MongoClient(uri);

  await client.connect();
  const db = client.db();

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outDir = path.join(__dirname, '..', 'backups', stamp);
  fs.mkdirSync(outDir, { recursive: true });

  const collections = await db.listCollections().toArray();
  for (const { name } of collections) {
    const docs = await db.collection(name).find({}).toArray();
    fs.writeFileSync(path.join(outDir, `${name}.json`), JSON.stringify(docs, null, 2));
    console.log(`Backed up ${name}: ${docs.length} documents`);
  }

  await client.close();
  console.log(`\nBackup complete -> ${outDir}`);
};

run().catch((err) => {
  console.error('Backup failed:', err.message);
  process.exit(1);
});

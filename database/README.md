# Database Backup

Complete backup of the Xceed India MongoDB database, taken 2026-08-11.

## Contents

- **`schema/`** — Mongoose model definitions (the schema-of-record for this MongoDB database). Copied verbatim from `backend/src/models/`.
  - `Category.js`, `Member.js`, `Order.js`, `Product.js`, `QuoteRequest.js`, `SavedCart.js`, `ThemeSettings.js`, `User.js`
  - Note: a `holderconfigs` collection exists in the database (currently empty) but has no corresponding model file in `backend/src/models/` — it may be defined inline elsewhere or be an unused/legacy collection.
- **`data/<timestamp>/`** — Full data dump, one JSON file per collection (`<collection>.json`) plus its indexes (`<collection>.indexes.json`), and a `manifest.json` summarizing what was captured (database name, connection string with credentials redacted, timestamp, per-collection document counts).

## How this backup was taken

Connected directly to the MongoDB instance configured in `backend/.env` (`MONGO_URI`, local dev instance `mongodb://localhost:27017/xceed_india`) and exported every collection's documents and indexes as JSON. This is a logical (not binary) backup — restorable with `mongoimport` or a small script using `insertMany` per collection, or via `mongorestore` if converted to BSON.

An existing app-internal backup script (`backend/scripts/backupDb.js`) does the same collection dump (without indexes/manifest) and writes to `backend/backups/` — that mechanism is unchanged; this `database/` folder is the consolidated, versioned copy including schema.

## Restoring

```bash
# per collection, from database/data/<timestamp>/<collection>.json
mongoimport --uri "$MONGO_URI" --collection <collection> --file <collection>.json --jsonArray
```

Re-create indexes from `<collection>.indexes.json` afterward if restoring into a fresh database.

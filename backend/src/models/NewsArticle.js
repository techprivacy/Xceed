const mongoose = require('mongoose');

// icon is a string key rather than anything richer — the frontend (both
// public pages and the admin icon picker) maps this to a small fixed set
// of lucide-react components. Keeping it a plain string keeps the schema
// simple and avoids storing anything render-framework-specific in Mongo.
const ICONS = ['Newspaper', 'Factory', 'Handshake', 'Building2', 'Package', 'Trophy', 'Award', 'Rocket', 'TrendingUp'];

const newsArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true, trim: true },
    excerpt: { type: String, required: true, trim: true },
    // Paragraphs separated by a blank line — kept as plain text rather than
    // an array field so the admin form is just a single textarea, not a
    // repeatable-field UI. Split on render.
    body: { type: String, required: true },
    date: { type: Date, default: Date.now },
    icon: { type: String, enum: ICONS, default: 'Newspaper' },
    // Only one article should be "featured" at a time (drives the Featured
    // News card on the public listing) — enforced in the controller, not
    // here, by unsetting featured on every other article whenever one is
    // set to true.
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
  },
  { timestamps: true }
);

const NewsArticle = mongoose.model('NewsArticle', newsArticleSchema);
NewsArticle.ICONS = ICONS;
module.exports = NewsArticle;

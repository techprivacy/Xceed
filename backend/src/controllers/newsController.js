const NewsArticle = require('../models/NewsArticle');

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Appends -2, -3, etc. until a unique slug is found — mirrors how most
// CMS-style slug fields handle collisions (e.g. two articles both titled
// "Company Update").
const uniqueSlug = async (base, excludeId) => {
  let slug = base;
  let n = 2;
  // eslint-disable-next-line no-await-in-loop
  while (await NewsArticle.findOne({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
};

// @route GET /api/news
// Public by default (published only); admin's list page passes
// includeDrafts=true to also see drafts — same unprotected-list-with-a-
// query-flag convention as GET /api/products?includeInactive=true.
exports.getArticles = async (req, res) => {
  try {
    const { includeDrafts, category, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (includeDrafts !== 'true') filter.status = 'published';
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [articles, total] = await Promise.all([
      NewsArticle.find(filter).sort({ date: -1 }).skip(skip).limit(Number(limit)),
      NewsArticle.countDocuments(filter),
    ]);

    res.json({
      success: true,
      count: articles.length,
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
      data: articles,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/news/id/:id (admin) — any status, for the edit form.
exports.getArticleById = async (req, res) => {
  try {
    const article = await NewsArticle.findById(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    res.json({ success: true, data: article });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/news/:slug — public, published only.
exports.getArticleBySlug = async (req, res) => {
  try {
    const article = await NewsArticle.findOne({ slug: req.params.slug, status: 'published' });
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    res.json({ success: true, data: article });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route POST /api/news (admin)
exports.createArticle = async (req, res) => {
  try {
    const { title, slug, featured, ...rest } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Title is required' });

    const finalSlug = await uniqueSlug(slugify(slug || title));

    if (featured) {
      await NewsArticle.updateMany({}, { $set: { featured: false } });
    }

    const article = await NewsArticle.create({ ...rest, title, slug: finalSlug, featured: Boolean(featured) });
    res.status(201).json({ success: true, data: article });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @route PUT /api/news/:id (admin)
exports.updateArticle = async (req, res) => {
  try {
    const { slug, featured, ...rest } = req.body;
    const update = { ...rest };

    if (slug !== undefined) {
      update.slug = await uniqueSlug(slugify(slug), req.params.id);
    }
    if (featured) {
      await NewsArticle.updateMany({ _id: { $ne: req.params.id } }, { $set: { featured: false } });
    }
    if (featured !== undefined) update.featured = Boolean(featured);

    const article = await NewsArticle.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    res.json({ success: true, data: article });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @route DELETE /api/news/:id (admin)
exports.deleteArticle = async (req, res) => {
  try {
    const article = await NewsArticle.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    res.json({ success: true, message: 'Article deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

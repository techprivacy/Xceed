const ThemeSettings = require('../models/ThemeSettings');

const HEX_PATTERN = /^#[0-9A-Fa-f]{6}$/;

const DEFAULT_PALETTE = {
  primary: '#E30613',
  primaryDark: '#B8050F',
  secondary: '#0F4AA6',
  dark: '#071C3A',
  surface: '#F4F6F8',
  muted: '#5B6470',
};

const validatePalette = (palette) => {
  const keys = Object.keys(DEFAULT_PALETTE);
  for (const key of keys) {
    if (!HEX_PATTERN.test(palette?.[key])) {
      return `Invalid or missing hex color for "${key}"`;
    }
  }
  return null;
};

// GET /api/theme — public
const getLiveTheme = async (req, res) => {
  const doc = await ThemeSettings.findOne();
  res.json({ success: true, data: doc ? doc.live : DEFAULT_PALETTE });
};

// GET /api/theme/draft — admin
const getDraftTheme = async (req, res) => {
  const doc = await ThemeSettings.findOne();
  res.json({ success: true, data: doc ? doc.draft : DEFAULT_PALETTE });
};

// PUT /api/theme/draft — admin
const updateDraftTheme = async (req, res) => {
  const error = validatePalette(req.body);
  if (error) return res.status(400).json({ success: false, message: error });

  const palette = {
    primary: req.body.primary,
    primaryDark: req.body.primaryDark,
    secondary: req.body.secondary,
    dark: req.body.dark,
    surface: req.body.surface,
    muted: req.body.muted,
  };

  const doc = await ThemeSettings.findOneAndUpdate(
    {},
    { $set: { draft: palette }, $setOnInsert: { live: DEFAULT_PALETTE } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.json({ success: true, data: doc.draft });
};

// POST /api/theme/publish — admin
const publishTheme = async (req, res) => {
  const doc = await ThemeSettings.findOne();
  if (!doc) {
    return res.status(400).json({ success: false, message: 'No draft to publish yet' });
  }
  doc.live = doc.draft;
  await doc.save();
  res.json({ success: true, data: doc.live });
};

module.exports = { getLiveTheme, getDraftTheme, updateDraftTheme, publishTheme };

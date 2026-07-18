const mongoose = require('mongoose');

const HEX_PATTERN = /^#[0-9A-Fa-f]{6}$/;

const paletteSchema = new mongoose.Schema(
  {
    primary: { type: String, required: true, match: HEX_PATTERN },
    primaryDark: { type: String, required: true, match: HEX_PATTERN },
    secondary: { type: String, required: true, match: HEX_PATTERN },
    dark: { type: String, required: true, match: HEX_PATTERN },
    surface: { type: String, required: true, match: HEX_PATTERN },
    muted: { type: String, required: true, match: HEX_PATTERN },
  },
  { _id: false }
);

const themeSettingsSchema = new mongoose.Schema(
  {
    live: { type: paletteSchema, required: true },
    draft: { type: paletteSchema, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ThemeSettings', themeSettingsSchema);

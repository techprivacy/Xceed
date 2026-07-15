const Anthropic = require('@anthropic-ai/sdk');

let client;
function getClient() {
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

// @route POST /api/products/ai/description (admin)
exports.generateProductDescription = async (req, res) => {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({
        success: false,
        message: 'AI description generation is not configured (missing ANTHROPIC_API_KEY).',
      });
    }

    const { name, categoryName, tags, priceUnit } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Product name is required' });
    }

    const response = await getClient().messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 512,
      output_config: {
        format: {
          type: 'json_schema',
          schema: {
            type: 'object',
            properties: {
              shortDescription: { type: 'string' },
              description: { type: 'string' },
            },
            required: ['shortDescription', 'description'],
            additionalProperties: false,
          },
        },
      },
      messages: [
        {
          role: 'user',
          content: `Write industrial marking-tools product copy for an e-commerce catalog.
Product name: ${name}
Category: ${categoryName || 'N/A'}
Tags: ${(tags && tags.length ? tags.join(', ') : 'N/A')}
Price unit: ${priceUnit || 'per_piece'}

Return a "shortDescription" (one sentence, under 15 words, for a product card) and a "description" (2-3 sentences, for the full product page, highlighting durability and industrial use cases). Do not use markdown.`,
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === 'text');
    const parsed = JSON.parse(textBlock.text);

    res.json({ success: true, data: parsed });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const express = require('express');
const router = express.Router();
const {
  getArticles,
  getArticleById,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
} = require('../controllers/newsController');
const { protect } = require('../middlewares/auth');
const { requirePermission } = require('../middlewares/permissions');

const canManageNews = requirePermission('news');

router.get('/', getArticles);
router.get('/id/:id', protect, canManageNews, getArticleById);
router.get('/:slug', getArticleBySlug);
router.post('/', protect, canManageNews, createArticle);
router.put('/:id', protect, canManageNews, updateArticle);
router.delete('/:id', protect, canManageNews, deleteArticle);

module.exports = router;

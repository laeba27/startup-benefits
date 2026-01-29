import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  createDeal,
  getAllDeals,
  getDealById,
  getDealBySlug,
  getDealsByCategory,
  getDealsStats,
  searchDeals,
} from '../controllers/deal.controller';
import { seedDealsEndpoint } from '../controllers/seed.controller';

const router = express.Router();

// @route   POST /api/deals
// @desc    Create a new deal
// @access  Public (should be protected in production)
router.post('/', createDeal);

// @route   POST /api/deals/seed
// @desc    Seed dummy deals (development only)
// @access  Public (should be protected in production)
router.post('/seed', seedDealsEndpoint);

// @route   GET /api/deals
// @desc    Get all deals (public and restricted)
// @access  Public
router.get('/', getAllDeals);

// @route   GET /api/deals/search
// @desc    Search deals with filters
// @access  Public
router.get('/search/query', searchDeals);

// @route   GET /api/deals/stats
// @desc    Get deals statistics
// @access  Public
router.get('/stats/overview', getDealsStats);

// @route   GET /api/deals/category/:category
// @desc    Get deals by category
// @access  Public
router.get('/category/:category', getDealsByCategory);

// @route   GET /api/deals/:id
// @desc    Get single deal by ID
// @access  Public
router.get('/:id', getDealById);

// @route   GET /api/deals/slug/:slug
// @desc    Get single deal by slug
// @access  Public
router.get('/slug/:slug', getDealBySlug);

export default router;
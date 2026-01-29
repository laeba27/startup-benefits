import { Request, Response } from 'express';
import { Deal, IDeal } from '../models/Deal.model';

// Create a new deal
export const createDeal = async (req: Request, res: Response) => {
  try {
    const { name, description, company, category, value, discount, isRestricted, tags, logo } = req.body;

    // Validate required fields
    if (!name || !company || !category || !value) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: name, company, category, value',
      });
    }

    const newDeal = await Deal.create({
      name,
      description: description || '',
      company,
      category,
      value,
      discount: discount || 0,
      isRestricted: isRestricted || false,
      tags: tags || [],
      logo: logo || '',
    });

    res.status(201).json({
      success: true,
      message: 'Deal created successfully',
      data: newDeal,
    });
  } catch (error) {
    console.error('Error creating deal:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating deal',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get all deals (with optional filters)
export const getAllDeals = async (req: Request, res: Response) => {
  try {
    const { category, isRestricted, search } = req.query;

    // Build filter object
    const filter: any = {};

    if (category) {
      filter.category = category;
    }

    if (isRestricted !== undefined) {
      filter.isRestricted = isRestricted === 'true';
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } },
      ];
    }

    const deals = await Deal.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Deals retrieved successfully',
      count: deals.length,
      data: deals,
    });
  } catch (error) {
    console.error('Error fetching deals:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching deals',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get single deal by ID
export const getDealById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deal = await Deal.findById(id);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Deal retrieved successfully',
      data: deal,
    });
  } catch (error) {
    console.error('Error fetching deal:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching deal',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get single deal by slug
export const getDealBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const deal = await Deal.findOne({ slug });

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Deal retrieved successfully',
      data: deal,
    });
  } catch (error) {
    console.error('Error fetching deal by slug:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching deal by slug',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get deals by category
export const getDealsByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;

    const deals = await Deal.find({ category }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: `${category} deals retrieved successfully`,
      count: deals.length,
      data: deals,
    });
  } catch (error) {
    console.error('Error fetching deals by category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching deals by category',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get deals statistics
export const getDealsStats = async (req: Request, res: Response) => {
  try {
    const totalDeals = await Deal.countDocuments();
    const restrictedDeals = await Deal.countDocuments({ isRestricted: true });
    const publicDeals = await Deal.countDocuments({ isRestricted: false });
    const totalValue = await Deal.aggregate([
      { $group: { _id: null, total: { $sum: '$value' } } },
    ]);

    const stats = {
      totalDeals,
      restrictedDeals,
      publicDeals,
      totalValue: totalValue[0]?.total || 0,
      categories: await Deal.distinct('category'),
    };

    res.status(200).json({
      success: true,
      message: 'Deals statistics retrieved successfully',
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching deals statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching deals statistics',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Search deals
export const searchDeals = async (req: Request, res: Response) => {
  try {
    const { q, category, priceMin, priceMax } = req.query;

    const filter: any = {};

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { company: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q as string, 'i')] } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (priceMin || priceMax) {
      filter.value = {};
      if (priceMin) filter.value.$gte = parseInt(priceMin as string);
      if (priceMax) filter.value.$lte = parseInt(priceMax as string);
    }

    const deals = await Deal.find(filter).sort({ value: -1 });

    res.status(200).json({
      success: true,
      message: 'Search results retrieved successfully',
      count: deals.length,
      data: deals,
    });
  } catch (error) {
    console.error('Error searching deals:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching deals',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

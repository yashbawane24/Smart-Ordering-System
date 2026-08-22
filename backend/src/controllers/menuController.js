import prisma from '../utils/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';


export const getAllMenuItems = async (req, res, next) => {
  try {
    const { category, search, availableOnly, sort } = req.query;

    const where = {};
    if (category && category !== 'All') {
      where.category = category;
    }
    if (availableOnly === 'true') {
      where.isAvailable = true;
      where.availableQuantity = { gt: 0 };
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ];
    }

    let orderBy = { createdAt: 'desc' };
    if (sort === 'price-asc') orderBy = { price: 'asc' };
    if (sort === 'price-desc') orderBy = { price: 'desc' };
    if (sort === 'name') orderBy = { name: 'asc' };

    const items = await prisma.menuItem.findMany({
      where,
      orderBy
    });

    return successResponse(res, 200, 'Menu items retrieved', items);
  } catch (error) {
    next(error);
  }
};

export const createMenuItem = async (req, res, next) => {
  try {
    const { name, description, category, price, availableQuantity, imageUrl, isAvailable } = req.body;

    if (!name || !category || price === undefined) {
      return errorResponse(res, 400, 'Name, category, and price are required');
    }

    const item = await prisma.menuItem.create({
      data: {
        name,
        description: description || '',
        category,
        price: parseFloat(price),
        availableQuantity: availableQuantity !== undefined ? parseInt(availableQuantity) : 100,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
        isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true
      }
    });

    return successResponse(res, 201, 'Menu item created successfully', item);
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, category, price, availableQuantity, imageUrl, isAvailable } = req.body;

    const existing = await prisma.menuItem.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse(res, 404, 'Menu item not found');
    }

    const qty = availableQuantity !== undefined ? parseInt(availableQuantity) : existing.availableQuantity;
    const avail = isAvailable !== undefined ? Boolean(isAvailable) : (qty > 0 ? existing.isAvailable : false);

    const updated = await prisma.menuItem.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(category && { category }),
        ...(price !== undefined && { price: parseFloat(price) }),
        availableQuantity: qty,
        isAvailable: avail,
        ...(imageUrl && { imageUrl })
      }
    });

    return successResponse(res, 200, 'Menu item updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

export const updateItemAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isAvailable, availableQuantity } = req.body;

    const existing = await prisma.menuItem.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse(res, 404, 'Menu item not found');
    }

    const newQty = availableQuantity !== undefined ? parseInt(availableQuantity) : existing.availableQuantity;
    const newAvailability = newQty <= 0 ? false : (isAvailable !== undefined ? Boolean(isAvailable) : existing.isAvailable);

    const updated = await prisma.menuItem.update({
      where: { id },
      data: {
        availableQuantity: newQty,
        isAvailable: newAvailability
      }
    });

    return successResponse(res, 200, 'Availability updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

export const deleteMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.menuItem.delete({ where: { id } });
    return successResponse(res, 200, 'Menu item deleted successfully');
  } catch (error) {
    next(error);
  }
};

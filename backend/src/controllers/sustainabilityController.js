import { successResponse, errorResponse } from '../utils/response.js';
import {
  getPublicSustainabilityMetrics,
  getSustainabilityMethodology,
  updateSustainabilityConfig,
  recalculateSustainabilityMetrics
} from '../services/sustainabilityService.js';

export const getPublicMetrics = async (req, res, next) => {
  try {
    const metrics = await getPublicSustainabilityMetrics();
    return successResponse(res, 200, 'Public sustainability metrics retrieved', metrics);
  } catch (error) {
    next(error);
  }
};

export const getMethodology = async (req, res, next) => {
  try {
    const methodology = await getSustainabilityMethodology();
    return successResponse(res, 200, 'Sustainability methodology retrieved', methodology);
  } catch (error) {
    next(error);
  }
};

export const updateConfig = async (req, res, next) => {
  try {
    const updated = await updateSustainabilityConfig(req.body, req.user.id);
    return successResponse(res, 200, 'Sustainability configuration updated successfully', updated);
  } catch (error) {
    return errorResponse(res, 400, error.message || 'Failed to update sustainability configuration');
  }
};

export const triggerRecalculate = async (req, res, next) => {
  try {
    const { days } = req.body;
    const result = await recalculateSustainabilityMetrics(days ? Number(days) : 30);
    return successResponse(res, 200, 'Recalculated sustainability metrics successfully', result);
  } catch (error) {
    return errorResponse(res, 400, error.message || 'Failed to recalculate metrics');
  }
};

import {
  CreateGoalDTO,
  DeleteGoalQuery,
  GetGhostsQuery,
  GetGoalsQuery,
  UpdateGoalDTO,
} from '@lyra/shared';
import { Request, Response } from 'express';

import { ApiResponse } from '../http/ApiResponse';
import { asyncHandler } from '../middlewares/asyncHandler';
import * as goalService from '../services/goalService';

export const getGoals = asyncHandler(async (req: Request, res: Response) => {
  const goals = await goalService.findAll(req.userId, req.validatedQuery as GetGoalsQuery);

  return ApiResponse.ok(res, goals);
});

export const getGoalById = asyncHandler(async (req: Request, res: Response) => {
  const goal = await goalService.getGoalById(req.params.id as string, req.userId);

  return ApiResponse.ok(res, goal);
});

export const createGoal = asyncHandler(async (req: Request, res: Response) => {
  const goal = await goalService.createGoal(req.userId, req.validatedBody as CreateGoalDTO);

  return ApiResponse.created(res, goal);
});

export const updateGoal = asyncHandler(async (req: Request, res: Response) => {
  const goal = await goalService.updateGoal(
    req.userId,
    req.params.id as string,
    req.validatedBody as UpdateGoalDTO
  );

  return ApiResponse.ok(res, goal);
});

export const deleteGoal = asyncHandler(async (req: Request, res: Response) => {
  const { keepCategory } = req.validatedQuery as DeleteGoalQuery;
  const result = await goalService.deleteGoal(req.userId, req.params.id as string, keepCategory);

  return ApiResponse.ok(res, result);
});

export const getGoalProjection = asyncHandler(async (req: Request, res: Response) => {
  const projection = await goalService.getGoalProjection(req.userId, req.params.id as string);

  return ApiResponse.ok(res, projection);
});

export const getGhostContributions = asyncHandler(async (req: Request, res: Response) => {
  const { month } = req.validatedQuery as GetGhostsQuery;
  const ghosts = await goalService.getGhostContributions(req.userId, month);

  return ApiResponse.ok(res, ghosts);
});

// ============================================================================
// ElectroKart / Scientific Wala — Valuable Customer Controller
// ============================================================================
// Handles HTTP requests for valuable customer storefront display & admin operations.
// ============================================================================

import { Request, Response } from 'express';
import { ValuableCustomerService } from '../services/index.js';
import { ApiResponse, asyncHandler } from '../utils/index.js';

export const getActiveCustomers = asyncHandler(async (req: Request, res: Response) => {
  const customers = await ValuableCustomerService.getActiveCustomers();
  res.status(200).json(
    new ApiResponse(200, customers, 'Active valuable customers retrieved successfully.')
  );
});

export const getAllCustomers = asyncHandler(async (req: Request, res: Response) => {
  const result = await ValuableCustomerService.getAllCustomers(req.query);
  res.status(200).json(
    new ApiResponse(200, result.docs, 'Valuable customers retrieved successfully.', result.pagination)
  );
});

export const createCustomer = asyncHandler(async (req: Request, res: Response) => {
  const customer = await ValuableCustomerService.createCustomer(req.body);
  res.status(201).json(
    new ApiResponse(201, customer, 'Valuable customer created successfully.')
  );
});

export const updateCustomer = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const customer = await ValuableCustomerService.updateCustomer(id, req.body);
  res.status(200).json(
    new ApiResponse(200, customer, 'Valuable customer updated successfully.')
  );
});

export const deleteCustomer = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  await ValuableCustomerService.deleteCustomer(id);
  res.status(200).json(
    new ApiResponse(200, null, 'Valuable customer deleted successfully.')
  );
});

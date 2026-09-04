// ============================================================================
// ElectroKart / Scientific Wala — Valuable Customer Service
// ============================================================================
// Handles business operations for valuable customer institutions and partner logos.
// ============================================================================

import ValuableCustomer, { IValuableCustomer } from '../models/ValuableCustomer.model.js';
import { ApiError } from '../utils/index.js';
import { executePaginatedQuery } from '../utils/pagination.js';

export class ValuableCustomerService {
  /**
   * Retrieves active valuable customers for storefront display.
   */
  public static async getActiveCustomers(): Promise<IValuableCustomer[]> {
    return ValuableCustomer.find({ isActive: true }).sort({ position: 1, createdAt: -1 });
  }

  /**
   * Retrieves all valuable customers with pagination (Admin only).
   */
  public static async getAllCustomers(queryParams: any) {
    const filter: Record<string, any> = {};

    if (queryParams.search) {
      filter.name = { $regex: queryParams.search, $options: 'i' };
    }

    if (queryParams.isActive !== undefined) {
      filter.isActive = queryParams.isActive === 'true' || queryParams.isActive === true;
    }

    return executePaginatedQuery(ValuableCustomer, filter, {
      ...queryParams,
      sort: queryParams.sort || 'position',
    });
  }

  /**
   * Creates a new valuable customer entry (Admin only).
   */
  public static async createCustomer(dto: Partial<IValuableCustomer>): Promise<IValuableCustomer> {
    const customer = await ValuableCustomer.create({
      name: dto.name,
      logo: dto.logo,
      website: dto.website,
      description: dto.description,
      position: dto.position ?? 0,
      isActive: dto.isActive !== undefined ? dto.isActive : true,
    });

    return customer;
  }

  /**
   * Updates an existing valuable customer (Admin only).
   */
  public static async updateCustomer(
    id: string,
    dto: Partial<IValuableCustomer>
  ): Promise<IValuableCustomer> {
    const customer = await ValuableCustomer.findById(id);
    if (!customer) {
      throw ApiError.notFound('Valuable customer not found.');
    }

    Object.assign(customer, dto);
    await customer.save();

    return customer;
  }

  /**
   * Deletes a valuable customer (Admin only).
   */
  public static async deleteCustomer(id: string): Promise<void> {
    const customer = await ValuableCustomer.findById(id);
    if (!customer) {
      throw ApiError.notFound('Valuable customer not found.');
    }

    await ValuableCustomer.deleteOne({ _id: id });
  }
}

export default ValuableCustomerService;

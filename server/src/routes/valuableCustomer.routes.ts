// ============================================================================
// ElectroKart / Scientific Wala — Valuable Customer Routes
// ============================================================================
// Defines paths for active valuable customers on storefront and admin operations.
// ============================================================================

import { Router } from 'express';
import { z } from 'zod';
import { ValuableCustomerController } from '../controllers/index.js';
import { authenticate, authorize, validate } from '../middlewares/index.js';
import {
  createValuableCustomerSchema,
  updateValuableCustomerSchema,
  objectIdSchema,
  paginationQuerySchema,
} from '../validators/index.js';

const router = Router();

// ---------------------------------------------------------------------------
// Public Routes
// ---------------------------------------------------------------------------

/**
 * @openapi
 * /valuable-customers:
 *   get:
 *     summary: Retrieve active valuable customers list (Public)
 *     tags: [ValuableCustomers]
 *     responses:
 *       200:
 *         description: Active valuable customers fetched successfully
 */
router.get('/', ValuableCustomerController.getActiveCustomers);

// ---------------------------------------------------------------------------
// Admin Management Routes
// ---------------------------------------------------------------------------

router.use(authenticate, authorize('admin'));

/**
 * @openapi
 * /valuable-customers/admin:
 *   get:
 *     summary: List all valuable customers (Admin only)
 *     tags: [ValuableCustomers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Valuable customers retrieved successfully
 */
router.get(
  '/admin',
  validate({ query: paginationQuerySchema }),
  ValuableCustomerController.getAllCustomers
);

/**
 * @openapi
 * /valuable-customers/admin:
 *   post:
 *     summary: Create a new valuable customer (Admin only)
 *     tags: [ValuableCustomers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Valuable customer created successfully
 */
router.post(
  '/admin',
  validate({ body: createValuableCustomerSchema }),
  ValuableCustomerController.createCustomer
);

/**
 * @openapi
 * /valuable-customers/admin/{id}:
 *   patch:
 *     summary: Update an existing valuable customer (Admin only)
 *     tags: [ValuableCustomers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Valuable customer updated successfully
 */
router.patch(
  '/admin/:id',
  validate({
    params: z.object({ id: objectIdSchema }),
    body: updateValuableCustomerSchema,
  }),
  ValuableCustomerController.updateCustomer
);

/**
 * @openapi
 * /valuable-customers/admin/{id}:
 *   delete:
 *     summary: Delete a valuable customer (Admin only)
 *     tags: [ValuableCustomers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Valuable customer deleted successfully
 */
router.delete(
  '/admin/:id',
  validate({ params: z.object({ id: objectIdSchema }) }),
  ValuableCustomerController.deleteCustomer
);

export default router;

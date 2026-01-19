/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IAffirmCredentials,
	IAffirmTransaction,
	IAffirmCheckout,
	IAffirmItem,
	AffirmResource,
	TransactionOperation,
} from '../../nodes/Affirm/types';

describe('Types', () => {
	describe('IAffirmCredentials', () => {
		it('should allow valid credential structure', () => {
			const credentials: IAffirmCredentials = {
				environment: 'sandbox',
				country: 'USA',
				publicKey: 'public_key_123',
				privateKey: 'private_key_456',
			};

			expect(credentials.environment).toBe('sandbox');
			expect(credentials.country).toBe('USA');
			expect(credentials.publicKey).toBe('public_key_123');
			expect(credentials.privateKey).toBe('private_key_456');
		});

		it('should allow production environment', () => {
			const credentials: IAffirmCredentials = {
				environment: 'production',
				country: 'CAN',
				publicKey: 'public_key_123',
				privateKey: 'private_key_456',
			};

			expect(credentials.environment).toBe('production');
			expect(credentials.country).toBe('CAN');
		});
	});

	describe('IAffirmItem', () => {
		it('should allow valid item structure', () => {
			const item: IAffirmItem = {
				display_name: 'Test Product',
				sku: 'SKU123',
				unit_price: 5000,
				qty: 2,
			};

			expect(item.display_name).toBe('Test Product');
			expect(item.sku).toBe('SKU123');
			expect(item.unit_price).toBe(5000);
			expect(item.qty).toBe(2);
		});

		it('should allow optional fields', () => {
			const item: IAffirmItem = {
				display_name: 'Test Product',
				sku: 'SKU123',
				unit_price: 5000,
				qty: 1,
				item_image_url: 'https://example.com/image.jpg',
				item_url: 'https://example.com/product',
			};

			expect(item.item_image_url).toBe('https://example.com/image.jpg');
			expect(item.item_url).toBe('https://example.com/product');
		});
	});

	describe('IAffirmTransaction', () => {
		it('should allow valid transaction structure', () => {
			const transaction: IAffirmTransaction = {
				id: 'TXN123',
				created: '2024-01-15T10:30:00Z',
				currency: 'USD',
				amount: 10000,
				amount_refunded: 0,
				auth_hold: 10000,
				payable: 0,
				void: false,
				status: 'authorized',
			};

			expect(transaction.id).toBe('TXN123');
			expect(transaction.amount).toBe(10000);
			expect(transaction.status).toBe('authorized');
		});
	});

	describe('AffirmResource', () => {
		it('should allow valid resource types', () => {
			const resources: AffirmResource[] = [
				'transaction',
				'charge',
				'checkout',
				'promo',
				'webhook',
				'lease',
			];

			expect(resources).toHaveLength(6);
		});
	});

	describe('TransactionOperation', () => {
		it('should allow valid operation types', () => {
			const operations: TransactionOperation[] = [
				'authorize',
				'get',
				'update',
				'capture',
				'void',
				'refund',
			];

			expect(operations).toHaveLength(6);
		});
	});
});

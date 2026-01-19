/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	getBaseUrl,
	validateAmount,
	formatAmountToCents,
	formatCentsToAmount,
	buildItemsArray,
	LICENSE_NOTICE,
} from '../../nodes/Affirm/GenericFunctions';

import type { IAffirmCredentials } from '../../nodes/Affirm/types';

describe('GenericFunctions', () => {
	describe('getBaseUrl', () => {
		it('should return sandbox URL for USA sandbox', () => {
			const credentials: IAffirmCredentials = {
				environment: 'sandbox',
				country: 'USA',
				publicKey: 'test',
				privateKey: 'test',
			};
			expect(getBaseUrl(credentials)).toBe('https://sandbox.affirm.com/api/v1');
		});

		it('should return production URL for USA production', () => {
			const credentials: IAffirmCredentials = {
				environment: 'production',
				country: 'USA',
				publicKey: 'test',
				privateKey: 'test',
			};
			expect(getBaseUrl(credentials)).toBe('https://api.affirm.com/api/v1');
		});

		it('should return sandbox URL for Canada sandbox', () => {
			const credentials: IAffirmCredentials = {
				environment: 'sandbox',
				country: 'CAN',
				publicKey: 'test',
				privateKey: 'test',
			};
			expect(getBaseUrl(credentials)).toBe('https://sandbox.affirm.com/api/v1');
		});

		it('should return global URL for Canada production', () => {
			const credentials: IAffirmCredentials = {
				environment: 'production',
				country: 'CAN',
				publicKey: 'test',
				privateKey: 'test',
			};
			expect(getBaseUrl(credentials)).toBe('https://global.affirm.com/api/v1');
		});
	});

	describe('validateAmount', () => {
		it('should return rounded positive amount', () => {
			expect(validateAmount(100.5)).toBe(101);
		});

		it('should return zero for zero', () => {
			expect(validateAmount(0)).toBe(0);
		});

		it('should throw for negative amount', () => {
			expect(() => validateAmount(-100)).toThrow('Amount must be a positive number');
		});
	});

	describe('formatAmountToCents', () => {
		it('should convert dollars to cents', () => {
			expect(formatAmountToCents(100)).toBe(10000);
		});

		it('should handle decimals', () => {
			expect(formatAmountToCents(99.99)).toBe(9999);
		});

		it('should round correctly', () => {
			expect(formatAmountToCents(99.999)).toBe(10000);
		});
	});

	describe('formatCentsToAmount', () => {
		it('should convert cents to dollars', () => {
			expect(formatCentsToAmount(10000)).toBe(100);
		});

		it('should handle partial cents', () => {
			expect(formatCentsToAmount(9999)).toBe(99.99);
		});
	});

	describe('buildItemsArray', () => {
		it('should build items array correctly', () => {
			const input = [
				{
					displayName: 'Test Product',
					sku: 'SKU123',
					unitPrice: 5000,
					quantity: 2,
					itemImageUrl: 'https://example.com/image.jpg',
					itemUrl: 'https://example.com/product',
				},
			];

			const result = buildItemsArray(input);

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				display_name: 'Test Product',
				sku: 'SKU123',
				unit_price: 5000,
				qty: 2,
				item_image_url: 'https://example.com/image.jpg',
				item_url: 'https://example.com/product',
			});
		});

		it('should default quantity to 1', () => {
			const input = [
				{
					displayName: 'Test Product',
					sku: 'SKU123',
					unitPrice: 5000,
				},
			];

			const result = buildItemsArray(input);

			expect(result[0].qty).toBe(1);
		});

		it('should omit optional fields if not provided', () => {
			const input = [
				{
					displayName: 'Test Product',
					sku: 'SKU123',
					unitPrice: 5000,
				},
			];

			const result = buildItemsArray(input);

			expect(result[0]).not.toHaveProperty('item_image_url');
			expect(result[0]).not.toHaveProperty('item_url');
		});
	});

	describe('LICENSE_NOTICE', () => {
		it('should contain required licensing text', () => {
			expect(LICENSE_NOTICE).toContain('Velocity BPA Licensing Notice');
			expect(LICENSE_NOTICE).toContain('Business Source License 1.1');
			expect(LICENSE_NOTICE).toContain('commercial license');
			expect(LICENSE_NOTICE).toContain('velobpa.com/licensing');
		});
	});
});

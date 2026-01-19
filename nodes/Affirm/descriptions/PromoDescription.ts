/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const promoOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['promo'],
			},
		},
		options: [
			{
				name: 'Get Financing Program',
				value: 'getFinancingProgram',
				description: 'Get financing program details for an amount',
				action: 'Get financing program',
			},
			{
				name: 'Get Message',
				value: 'getMessage',
				description: 'Get promotional messaging for a product or cart',
				action: 'Get promotional message',
			},
		],
		default: 'getMessage',
	},
];

export const promoFields: INodeProperties[] = [
	// Get Message fields
	{
		displayName: 'Amount (Cents)',
		name: 'amount',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['promo'],
				operation: ['getMessage', 'getFinancingProgram'],
			},
		},
		default: 0,
		description: 'Amount in cents (e.g., 10000 = $100.00)',
	},
	{
		displayName: 'Options',
		name: 'promoOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['promo'],
				operation: ['getMessage'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Page Type',
				name: 'page_type',
				type: 'options',
				options: [
					{
						name: 'Banner',
						value: 'banner',
					},
					{
						name: 'Cart',
						value: 'cart',
					},
					{
						name: 'Category',
						value: 'category',
					},
					{
						name: 'Homepage',
						value: 'homepage',
					},
					{
						name: 'Payment',
						value: 'payment',
					},
					{
						name: 'Product',
						value: 'product',
					},
				],
				default: 'product',
				description: 'Type of page where the promo will be displayed',
			},
			{
				displayName: 'Promo ID',
				name: 'promo_id',
				type: 'string',
				default: '',
				description: 'Specific promo ID to use',
			},
			{
				displayName: 'Financing Program',
				name: 'financing_program',
				type: 'string',
				default: '',
				description: 'Specific financing program external name',
			},
			{
				displayName: 'Show CTA',
				name: 'show_cta',
				type: 'boolean',
				default: true,
				description: 'Whether to show call-to-action in the promo',
			},
			{
				displayName: 'Items',
				name: 'items',
				type: 'json',
				default: '[]',
				description: 'Array of item objects with display_name, sku, unit_price, qty',
			},
		],
	},
	{
		displayName: 'Options',
		name: 'financingOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['promo'],
				operation: ['getFinancingProgram'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Financing Program',
				name: 'financing_program',
				type: 'string',
				default: '',
				description: 'Specific financing program external name',
			},
		],
	},
];

/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const checkoutOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['checkout'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a checkout session',
				action: 'Create a checkout',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get checkout status',
				action: 'Get a checkout',
			},
		],
		default: 'create',
	},
];

export const checkoutFields: INodeProperties[] = [
	// Get checkout fields
	{
		displayName: 'Checkout ID',
		name: 'checkoutId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['checkout'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'The checkout ID to retrieve',
	},
	// Create checkout - Merchant settings
	{
		displayName: 'User Confirmation URL',
		name: 'userConfirmationUrl',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['checkout'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'URL to redirect the user after completing checkout',
	},
	{
		displayName: 'User Cancel URL',
		name: 'userCancelUrl',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['checkout'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'URL to redirect the user if they cancel checkout',
	},
	{
		displayName: 'Total (Cents)',
		name: 'total',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['checkout'],
				operation: ['create'],
			},
		},
		default: 0,
		description: 'Total amount in cents (e.g., 10000 = $100.00)',
	},
	// Shipping information
	{
		displayName: 'Shipping First Name',
		name: 'shippingFirstName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['checkout'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Shipping recipient first name',
	},
	{
		displayName: 'Shipping Last Name',
		name: 'shippingLastName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['checkout'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Shipping recipient last name',
	},
	{
		displayName: 'Shipping Address Line 1',
		name: 'shippingLine1',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['checkout'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Shipping street address',
	},
	{
		displayName: 'Shipping City',
		name: 'shippingCity',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['checkout'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Shipping city',
	},
	{
		displayName: 'Shipping State',
		name: 'shippingState',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['checkout'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Shipping state/province code (e.g., CA)',
	},
	{
		displayName: 'Shipping Zip Code',
		name: 'shippingZipcode',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['checkout'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Shipping postal code',
	},
	// Items
	{
		displayName: 'Items',
		name: 'items',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['checkout'],
				operation: ['create'],
			},
		},
		default: {},
		placeholder: 'Add Item',
		options: [
			{
				name: 'itemValues',
				displayName: 'Item',
				values: [
					{
						displayName: 'Display Name',
						name: 'displayName',
						type: 'string',
						default: '',
						required: true,
						description: 'Name of the item',
					},
					{
						displayName: 'SKU',
						name: 'sku',
						type: 'string',
						default: '',
						required: true,
						description: 'SKU or product ID',
					},
					{
						displayName: 'Unit Price (Cents)',
						name: 'unitPrice',
						type: 'number',
						default: 0,
						required: true,
						description: 'Price per unit in cents',
					},
					{
						displayName: 'Quantity',
						name: 'quantity',
						type: 'number',
						default: 1,
						description: 'Number of items',
					},
					{
						displayName: 'Item Image URL',
						name: 'itemImageUrl',
						type: 'string',
						default: '',
						description: 'URL to the item image',
					},
					{
						displayName: 'Item URL',
						name: 'itemUrl',
						type: 'string',
						default: '',
						description: 'URL to the item page',
					},
				],
			},
		],
		description: 'Items in the checkout',
	},
	// Additional options
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['checkout'],
				operation: ['create'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Confirmation URL Action',
				name: 'userConfirmationUrlAction',
				type: 'options',
				options: [
					{
						name: 'GET',
						value: 'GET',
					},
					{
						name: 'POST',
						value: 'POST',
					},
				],
				default: 'GET',
				description: 'HTTP method for confirmation redirect',
			},
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'options',
				options: [
					{
						name: 'USD',
						value: 'USD',
					},
					{
						name: 'CAD',
						value: 'CAD',
					},
				],
				default: 'USD',
				description: 'Currency code',
			},
			{
				displayName: 'Financing Program',
				name: 'financingProgram',
				type: 'string',
				default: '',
				description: 'Specific financing program to use',
			},
			{
				displayName: 'Merchant Name',
				name: 'merchantName',
				type: 'string',
				default: '',
				description: 'Merchant name to display',
			},
			{
				displayName: 'Order ID',
				name: 'orderId',
				type: 'string',
				default: '',
				description: 'Your internal order ID',
			},
			{
				displayName: 'Shipping Address Line 2',
				name: 'shippingLine2',
				type: 'string',
				default: '',
				description: 'Additional shipping address line',
			},
			{
				displayName: 'Shipping Amount (Cents)',
				name: 'shippingAmount',
				type: 'number',
				default: 0,
				description: 'Shipping cost in cents',
			},
			{
				displayName: 'Shipping Country',
				name: 'shippingCountry',
				type: 'string',
				default: 'US',
				description: 'Shipping country code',
			},
			{
				displayName: 'Shipping Phone',
				name: 'shippingPhone',
				type: 'string',
				default: '',
				description: 'Shipping contact phone',
			},
			{
				displayName: 'Tax Amount (Cents)',
				name: 'taxAmount',
				type: 'number',
				default: 0,
				description: 'Tax amount in cents',
			},
			{
				displayName: 'Use Separate Billing Address',
				name: 'useBillingAddress',
				type: 'boolean',
				default: false,
				description: 'Whether to specify a separate billing address',
			},
		],
	},
	// Billing address (conditional)
	{
		displayName: 'Billing First Name',
		name: 'billingFirstName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['checkout'],
				operation: ['create'],
				'additionalOptions.useBillingAddress': [true],
			},
		},
		default: '',
		description: 'Billing first name',
	},
	{
		displayName: 'Billing Last Name',
		name: 'billingLastName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['checkout'],
				operation: ['create'],
				'additionalOptions.useBillingAddress': [true],
			},
		},
		default: '',
		description: 'Billing last name',
	},
	{
		displayName: 'Billing Address Line 1',
		name: 'billingLine1',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['checkout'],
				operation: ['create'],
				'additionalOptions.useBillingAddress': [true],
			},
		},
		default: '',
		description: 'Billing street address',
	},
	{
		displayName: 'Billing City',
		name: 'billingCity',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['checkout'],
				operation: ['create'],
				'additionalOptions.useBillingAddress': [true],
			},
		},
		default: '',
		description: 'Billing city',
	},
	{
		displayName: 'Billing State',
		name: 'billingState',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['checkout'],
				operation: ['create'],
				'additionalOptions.useBillingAddress': [true],
			},
		},
		default: '',
		description: 'Billing state/province code',
	},
	{
		displayName: 'Billing Zip Code',
		name: 'billingZipcode',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['checkout'],
				operation: ['create'],
				'additionalOptions.useBillingAddress': [true],
			},
		},
		default: '',
		description: 'Billing postal code',
	},
];

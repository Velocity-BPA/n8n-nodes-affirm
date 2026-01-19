/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const transactionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['transaction'],
			},
		},
		options: [
			{
				name: 'Authorize',
				value: 'authorize',
				description: 'Authorize a transaction from checkout token',
				action: 'Authorize a transaction',
			},
			{
				name: 'Capture',
				value: 'capture',
				description: 'Capture an authorized transaction',
				action: 'Capture a transaction',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get transaction details',
				action: 'Get a transaction',
			},
			{
				name: 'Refund',
				value: 'refund',
				description: 'Refund a captured transaction',
				action: 'Refund a transaction',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update transaction order information',
				action: 'Update a transaction',
			},
			{
				name: 'Void',
				value: 'void',
				description: 'Void an authorized transaction',
				action: 'Void a transaction',
			},
		],
		default: 'authorize',
	},
];

export const transactionFields: INodeProperties[] = [
	// Authorize fields
	{
		displayName: 'Checkout Token',
		name: 'checkoutToken',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['authorize'],
			},
		},
		default: '',
		description: 'The checkout token received from the Affirm checkout flow',
	},
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['authorize'],
			},
		},
		default: '',
		description: 'Your internal order ID for reference',
	},
	// Transaction ID field for other operations
	{
		displayName: 'Transaction ID',
		name: 'transactionId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['get', 'update', 'capture', 'void', 'refund'],
			},
		},
		default: '',
		description: 'The Affirm transaction ID',
	},
	// Update fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['update'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Order ID',
				name: 'order_id',
				type: 'string',
				default: '',
				description: 'Updated order ID',
			},
			{
				displayName: 'Shipping Carrier',
				name: 'shipping_carrier',
				type: 'string',
				default: '',
				description: 'Shipping carrier name',
			},
			{
				displayName: 'Shipping Confirmation',
				name: 'shipping_confirmation',
				type: 'string',
				default: '',
				description: 'Shipping tracking number',
			},
		],
	},
	// Capture fields
	{
		displayName: 'Capture Options',
		name: 'captureOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['capture'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Amount (Cents)',
				name: 'amount',
				type: 'number',
				default: 0,
				description: 'Partial capture amount in cents. Leave empty for full capture.',
			},
			{
				displayName: 'Order ID',
				name: 'order_id',
				type: 'string',
				default: '',
				description: 'Order ID to associate with capture',
			},
			{
				displayName: 'Shipping Carrier',
				name: 'shipping_carrier',
				type: 'string',
				default: '',
				description: 'Shipping carrier name',
			},
			{
				displayName: 'Shipping Confirmation',
				name: 'shipping_confirmation',
				type: 'string',
				default: '',
				description: 'Shipping tracking number',
			},
		],
	},
	// Refund fields
	{
		displayName: 'Refund Options',
		name: 'refundOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['refund'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Amount (Cents)',
				name: 'amount',
				type: 'number',
				default: 0,
				description: 'Partial refund amount in cents. Leave empty for full refund.',
			},
		],
	},
];

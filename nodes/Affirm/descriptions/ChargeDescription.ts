/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const chargeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['charge'],
			},
		},
		options: [
			{
				name: 'Authorize',
				value: 'authorize',
				description: 'Authorize a charge (legacy)',
				action: 'Authorize a charge',
			},
			{
				name: 'Capture',
				value: 'capture',
				description: 'Capture an authorized charge',
				action: 'Capture a charge',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get charge details',
				action: 'Get a charge',
			},
			{
				name: 'Refund',
				value: 'refund',
				description: 'Refund a captured charge',
				action: 'Refund a charge',
			},
			{
				name: 'Void',
				value: 'void',
				description: 'Void an authorized charge',
				action: 'Void a charge',
			},
		],
		default: 'authorize',
	},
];

export const chargeFields: INodeProperties[] = [
	// Authorize fields
	{
		displayName: 'Checkout Token',
		name: 'checkoutToken',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['charge'],
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
				resource: ['charge'],
				operation: ['authorize'],
			},
		},
		default: '',
		description: 'Your internal order ID for reference',
	},
	// Charge ID field for other operations
	{
		displayName: 'Charge ID',
		name: 'chargeId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['charge'],
				operation: ['get', 'capture', 'void', 'refund'],
			},
		},
		default: '',
		description: 'The Affirm charge ID',
	},
	// Capture options
	{
		displayName: 'Capture Options',
		name: 'captureOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['charge'],
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
	// Refund options
	{
		displayName: 'Refund Options',
		name: 'refundOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['charge'],
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

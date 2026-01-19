/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const leaseOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['lease'],
			},
		},
		options: [
			{
				name: 'Capture',
				value: 'capture',
				description: 'Capture a lease',
				action: 'Capture a lease',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get lease details',
				action: 'Get a lease',
			},
			{
				name: 'Refund',
				value: 'refund',
				description: 'Refund a captured lease',
				action: 'Refund a lease',
			},
			{
				name: 'Void',
				value: 'void',
				description: 'Void an authorized lease',
				action: 'Void a lease',
			},
		],
		default: 'get',
	},
];

export const leaseFields: INodeProperties[] = [
	// Lease ID for all operations
	{
		displayName: 'Lease ID',
		name: 'leaseId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['lease'],
			},
		},
		default: '',
		description: 'The Affirm lease ID (for Affirm Card/Debit+)',
	},
	// Capture options
	{
		displayName: 'Capture Options',
		name: 'captureOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['lease'],
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
				resource: ['lease'],
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

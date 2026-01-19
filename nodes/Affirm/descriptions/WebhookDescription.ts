/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const webhookOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a webhook subscription',
				action: 'Create a webhook',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a webhook subscription',
				action: 'Delete a webhook',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get webhook details',
				action: 'Get a webhook',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all webhook subscriptions',
				action: 'List webhooks',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a webhook subscription',
				action: 'Update a webhook',
			},
		],
		default: 'list',
	},
];

export const webhookFields: INodeProperties[] = [
	// Webhook ID for get, update, delete
	{
		displayName: 'Webhook ID',
		name: 'webhookId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		description: 'The webhook ID',
	},
	// Create webhook fields
	{
		displayName: 'Webhook URL',
		name: 'webhookUrl',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The URL to receive webhook events',
	},
	{
		displayName: 'Events',
		name: 'events',
		type: 'multiOptions',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'Checkout Cancelled',
				value: 'checkout.cancelled',
			},
			{
				name: 'Checkout Completed',
				value: 'checkout.completed',
			},
			{
				name: 'Dispute Opened',
				value: 'dispute.opened',
			},
			{
				name: 'Dispute Resolved',
				value: 'dispute.resolved',
			},
			{
				name: 'Loan Approved',
				value: 'loan.approved',
			},
			{
				name: 'Loan Confirmed',
				value: 'loan.confirmed',
			},
			{
				name: 'Loan Denied',
				value: 'loan.denied',
			},
			{
				name: 'Transaction Authorized',
				value: 'transaction.authorized',
			},
			{
				name: 'Transaction Captured',
				value: 'transaction.captured',
			},
			{
				name: 'Transaction Refunded',
				value: 'transaction.refunded',
			},
			{
				name: 'Transaction Updated',
				value: 'transaction.updated',
			},
			{
				name: 'Transaction Voided',
				value: 'transaction.voided',
			},
		],
		default: [],
		description: 'Events to subscribe to',
	},
	// Update webhook fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['update'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: true,
				description: 'Whether the webhook is enabled',
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				options: [
					{
						name: 'Checkout Cancelled',
						value: 'checkout.cancelled',
					},
					{
						name: 'Checkout Completed',
						value: 'checkout.completed',
					},
					{
						name: 'Dispute Opened',
						value: 'dispute.opened',
					},
					{
						name: 'Dispute Resolved',
						value: 'dispute.resolved',
					},
					{
						name: 'Loan Approved',
						value: 'loan.approved',
					},
					{
						name: 'Loan Confirmed',
						value: 'loan.confirmed',
					},
					{
						name: 'Loan Denied',
						value: 'loan.denied',
					},
					{
						name: 'Transaction Authorized',
						value: 'transaction.authorized',
					},
					{
						name: 'Transaction Captured',
						value: 'transaction.captured',
					},
					{
						name: 'Transaction Refunded',
						value: 'transaction.refunded',
					},
					{
						name: 'Transaction Updated',
						value: 'transaction.updated',
					},
					{
						name: 'Transaction Voided',
						value: 'transaction.voided',
					},
				],
				default: [],
				description: 'Events to subscribe to',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				description: 'New webhook URL',
			},
		],
	},
];

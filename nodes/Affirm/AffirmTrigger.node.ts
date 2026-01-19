/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';

import { affirmApiRequest, logLicenseNotice } from './GenericFunctions';

export class AffirmTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Affirm Trigger',
		name: 'affirmTrigger',
		icon: 'file:affirm.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description: 'Handle Affirm webhook events',
		defaults: {
			name: 'Affirm Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'affirmApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				options: [
					{
						name: 'Checkout Cancelled',
						value: 'checkout.cancelled',
						description: 'Triggered when checkout is cancelled by customer',
					},
					{
						name: 'Checkout Completed',
						value: 'checkout.completed',
						description: 'Triggered when checkout flow is completed',
					},
					{
						name: 'Dispute Opened',
						value: 'dispute.opened',
						description: 'Triggered when a dispute is created',
					},
					{
						name: 'Dispute Resolved',
						value: 'dispute.resolved',
						description: 'Triggered when a dispute is resolved',
					},
					{
						name: 'Loan Approved',
						value: 'loan.approved',
						description: 'Triggered when customer loan is approved',
					},
					{
						name: 'Loan Confirmed',
						value: 'loan.confirmed',
						description: 'Triggered when customer confirms the loan',
					},
					{
						name: 'Loan Denied',
						value: 'loan.denied',
						description: 'Triggered when customer loan is denied',
					},
					{
						name: 'Transaction Authorized',
						value: 'transaction.authorized',
						description: 'Triggered when a transaction is authorized',
					},
					{
						name: 'Transaction Captured',
						value: 'transaction.captured',
						description: 'Triggered when payment is captured',
					},
					{
						name: 'Transaction Refunded',
						value: 'transaction.refunded',
						description: 'Triggered when a refund is processed',
					},
					{
						name: 'Transaction Updated',
						value: 'transaction.updated',
						description: 'Triggered when transaction is updated',
					},
					{
						name: 'Transaction Voided',
						value: 'transaction.voided',
						description: 'Triggered when authorization is voided',
					},
				],
				default: ['transaction.authorized'],
				description: 'The events to listen for',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const webhookData = this.getWorkflowStaticData('node');

				try {
					const response = await affirmApiRequest.call(this, 'GET', '/webhooks') as IDataObject;
					const webhooks = (response.webhooks || response) as IDataObject[];

					for (const webhook of webhooks) {
						if (webhook.url === webhookUrl) {
							webhookData.webhookId = webhook.id;
							return true;
						}
					}
				} catch {
					return false;
				}

				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const events = this.getNodeParameter('events') as string[];
				const webhookData = this.getWorkflowStaticData('node');

				const body: IDataObject = {
					url: webhookUrl,
					events,
				};

				try {
					const response = await affirmApiRequest.call(this, 'POST', '/webhooks', body) as IDataObject;
					webhookData.webhookId = response.id;
					return true;
				} catch {
					return false;
				}
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId) {
					try {
						await affirmApiRequest.call(
							this,
							'DELETE',
							`/webhooks/${webhookData.webhookId}`,
						);
					} catch {
						return false;
					}
					delete webhookData.webhookId;
				}

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		// Log license notice once per node load
		logLicenseNotice();

		const req = this.getRequestObject();
		const body = req.body as IDataObject;

		const events = this.getNodeParameter('events') as string[];

		// Extract event type from webhook payload
		const eventType = (body.event as IDataObject)?.type as string;

		// Filter events if specific events are selected
		if (events.length > 0 && !events.includes(eventType)) {
			return {
				noWebhookResponse: true,
			};
		}

		return {
			workflowData: [
				this.helpers.returnJsonArray(body),
			],
		};
	}
}

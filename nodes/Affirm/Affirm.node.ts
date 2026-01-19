/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import {
	affirmApiRequest,
	buildCheckoutObject,
	buildItemsArray,
	logLicenseNotice,
} from './GenericFunctions';

import {
	transactionOperations,
	transactionFields,
} from './descriptions/TransactionDescription';
import {
	chargeOperations,
	chargeFields,
} from './descriptions/ChargeDescription';
import {
	checkoutOperations,
	checkoutFields,
} from './descriptions/CheckoutDescription';
import {
	promoOperations,
	promoFields,
} from './descriptions/PromoDescription';
import {
	webhookOperations,
	webhookFields,
} from './descriptions/WebhookDescription';
import {
	leaseOperations,
	leaseFields,
} from './descriptions/LeaseDescription';

export class Affirm implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Affirm',
		name: 'affirm',
		icon: 'file:affirm.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume Affirm BNPL API',
		defaults: {
			name: 'Affirm',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'affirmApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Charge',
						value: 'charge',
						description: 'Manage charges (legacy API)',
					},
					{
						name: 'Checkout',
						value: 'checkout',
						description: 'Create and manage checkout sessions',
					},
					{
						name: 'Lease',
						value: 'lease',
						description: 'Manage leases (Affirm Card/Debit+)',
					},
					{
						name: 'Promo',
						value: 'promo',
						description: 'Get promotional messaging',
					},
					{
						name: 'Transaction',
						value: 'transaction',
						description: 'Manage transactions',
					},
					{
						name: 'Webhook',
						value: 'webhook',
						description: 'Manage webhook subscriptions',
					},
				],
				default: 'transaction',
			},
			// Operations and fields
			...transactionOperations,
			...transactionFields,
			...chargeOperations,
			...chargeFields,
			...checkoutOperations,
			...checkoutFields,
			...promoOperations,
			...promoFields,
			...webhookOperations,
			...webhookFields,
			...leaseOperations,
			...leaseFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Log license notice once per node load
		logLicenseNotice();

		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[] = {};

				// Transaction operations
				if (resource === 'transaction') {
					if (operation === 'authorize') {
						const checkoutToken = this.getNodeParameter('checkoutToken', i) as string;
						const orderId = this.getNodeParameter('orderId', i, '') as string;
						const body: IDataObject = { checkout_token: checkoutToken };
						if (orderId) {
							body.order_id = orderId;
						}
						responseData = await affirmApiRequest.call(this, 'POST', '/transactions', body);
					} else if (operation === 'get') {
						const transactionId = this.getNodeParameter('transactionId', i) as string;
						responseData = await affirmApiRequest.call(this, 'GET', `/transactions/${transactionId}`);
					} else if (operation === 'update') {
						const transactionId = this.getNodeParameter('transactionId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						responseData = await affirmApiRequest.call(
							this,
							'POST',
							`/transactions/${transactionId}/update`,
							updateFields,
						);
					} else if (operation === 'capture') {
						const transactionId = this.getNodeParameter('transactionId', i) as string;
						const captureOptions = this.getNodeParameter('captureOptions', i) as IDataObject;
						const body: IDataObject = {};
						if (captureOptions.amount) {
							body.amount = captureOptions.amount;
						}
						if (captureOptions.order_id) {
							body.order_id = captureOptions.order_id;
						}
						if (captureOptions.shipping_carrier) {
							body.shipping_carrier = captureOptions.shipping_carrier;
						}
						if (captureOptions.shipping_confirmation) {
							body.shipping_confirmation = captureOptions.shipping_confirmation;
						}
						responseData = await affirmApiRequest.call(
							this,
							'POST',
							`/transactions/${transactionId}/capture`,
							body,
						);
					} else if (operation === 'void') {
						const transactionId = this.getNodeParameter('transactionId', i) as string;
						responseData = await affirmApiRequest.call(
							this,
							'POST',
							`/transactions/${transactionId}/void`,
						);
					} else if (operation === 'refund') {
						const transactionId = this.getNodeParameter('transactionId', i) as string;
						const refundOptions = this.getNodeParameter('refundOptions', i) as IDataObject;
						const body: IDataObject = {};
						if (refundOptions.amount) {
							body.amount = refundOptions.amount;
						}
						responseData = await affirmApiRequest.call(
							this,
							'POST',
							`/transactions/${transactionId}/refund`,
							body,
						);
					}
				}

				// Charge operations (legacy)
				if (resource === 'charge') {
					if (operation === 'authorize') {
						const checkoutToken = this.getNodeParameter('checkoutToken', i) as string;
						const orderId = this.getNodeParameter('orderId', i, '') as string;
						const body: IDataObject = { checkout_token: checkoutToken };
						if (orderId) {
							body.order_id = orderId;
						}
						responseData = await affirmApiRequest.call(this, 'POST', '/charges', body);
					} else if (operation === 'get') {
						const chargeId = this.getNodeParameter('chargeId', i) as string;
						responseData = await affirmApiRequest.call(this, 'GET', `/charges/${chargeId}`);
					} else if (operation === 'capture') {
						const chargeId = this.getNodeParameter('chargeId', i) as string;
						const captureOptions = this.getNodeParameter('captureOptions', i) as IDataObject;
						const body: IDataObject = {};
						if (captureOptions.amount) {
							body.amount = captureOptions.amount;
						}
						if (captureOptions.order_id) {
							body.order_id = captureOptions.order_id;
						}
						if (captureOptions.shipping_carrier) {
							body.shipping_carrier = captureOptions.shipping_carrier;
						}
						if (captureOptions.shipping_confirmation) {
							body.shipping_confirmation = captureOptions.shipping_confirmation;
						}
						responseData = await affirmApiRequest.call(
							this,
							'POST',
							`/charges/${chargeId}/capture`,
							body,
						);
					} else if (operation === 'void') {
						const chargeId = this.getNodeParameter('chargeId', i) as string;
						responseData = await affirmApiRequest.call(this, 'POST', `/charges/${chargeId}/void`);
					} else if (operation === 'refund') {
						const chargeId = this.getNodeParameter('chargeId', i) as string;
						const refundOptions = this.getNodeParameter('refundOptions', i) as IDataObject;
						const body: IDataObject = {};
						if (refundOptions.amount) {
							body.amount = refundOptions.amount;
						}
						responseData = await affirmApiRequest.call(
							this,
							'POST',
							`/charges/${chargeId}/refund`,
							body,
						);
					}
				}

				// Checkout operations
				if (resource === 'checkout') {
					if (operation === 'create') {
						const userConfirmationUrl = this.getNodeParameter('userConfirmationUrl', i) as string;
						const userCancelUrl = this.getNodeParameter('userCancelUrl', i) as string;
						const total = this.getNodeParameter('total', i) as number;
						const shippingFirstName = this.getNodeParameter('shippingFirstName', i) as string;
						const shippingLastName = this.getNodeParameter('shippingLastName', i) as string;
						const shippingLine1 = this.getNodeParameter('shippingLine1', i) as string;
						const shippingCity = this.getNodeParameter('shippingCity', i) as string;
						const shippingState = this.getNodeParameter('shippingState', i) as string;
						const shippingZipcode = this.getNodeParameter('shippingZipcode', i) as string;
						const itemsInput = this.getNodeParameter('items.itemValues', i, []) as IDataObject[];
						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;

						const params: IDataObject = {
							userConfirmationUrl,
							userCancelUrl,
							total,
							shippingFirstName,
							shippingLastName,
							shippingLine1,
							shippingCity,
							shippingState,
							shippingZipcode,
							items: buildItemsArray(itemsInput),
							...additionalOptions,
						};

						const body = buildCheckoutObject(params);
						responseData = await affirmApiRequest.call(this, 'POST', '/checkout', body);
					} else if (operation === 'get') {
						const checkoutId = this.getNodeParameter('checkoutId', i) as string;
						responseData = await affirmApiRequest.call(this, 'GET', `/checkout/${checkoutId}`);
					}
				}

				// Promo operations
				if (resource === 'promo') {
					if (operation === 'getMessage') {
						const amount = this.getNodeParameter('amount', i) as number;
						const promoOptions = this.getNodeParameter('promoOptions', i, {}) as IDataObject;
						const qs: IDataObject = { amount };
						if (promoOptions.page_type) {
							qs.page_type = promoOptions.page_type;
						}
						if (promoOptions.promo_id) {
							qs.promo_id = promoOptions.promo_id;
						}
						if (promoOptions.financing_program) {
							qs.financing_program = promoOptions.financing_program;
						}
						if (promoOptions.show_cta !== undefined) {
							qs.show_cta = promoOptions.show_cta;
						}
						if (promoOptions.items) {
							qs.items = promoOptions.items;
						}
						responseData = await affirmApiRequest.call(this, 'GET', '/promos/v2', {}, qs);
					} else if (operation === 'getFinancingProgram') {
						const amount = this.getNodeParameter('amount', i) as number;
						const financingOptions = this.getNodeParameter('financingOptions', i, {}) as IDataObject;
						const qs: IDataObject = { amount };
						if (financingOptions.financing_program) {
							qs.financing_program = financingOptions.financing_program;
						}
						responseData = await affirmApiRequest.call(
							this,
							'GET',
							'/promos/v2/financing_program',
							{},
							qs,
						);
					}
				}

				// Webhook operations
				if (resource === 'webhook') {
					if (operation === 'list') {
						responseData = await affirmApiRequest.call(this, 'GET', '/webhooks');
					} else if (operation === 'create') {
						const webhookUrl = this.getNodeParameter('webhookUrl', i) as string;
						const events = this.getNodeParameter('events', i) as string[];
						const body: IDataObject = {
							url: webhookUrl,
							events,
						};
						responseData = await affirmApiRequest.call(this, 'POST', '/webhooks', body);
					} else if (operation === 'get') {
						const webhookId = this.getNodeParameter('webhookId', i) as string;
						responseData = await affirmApiRequest.call(this, 'GET', `/webhooks/${webhookId}`);
					} else if (operation === 'update') {
						const webhookId = this.getNodeParameter('webhookId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						responseData = await affirmApiRequest.call(
							this,
							'PUT',
							`/webhooks/${webhookId}`,
							updateFields,
						);
					} else if (operation === 'delete') {
						const webhookId = this.getNodeParameter('webhookId', i) as string;
						responseData = await affirmApiRequest.call(this, 'DELETE', `/webhooks/${webhookId}`);
					}
				}

				// Lease operations
				if (resource === 'lease') {
					const leaseId = this.getNodeParameter('leaseId', i) as string;
					if (operation === 'get') {
						responseData = await affirmApiRequest.call(this, 'GET', `/leases/${leaseId}`);
					} else if (operation === 'capture') {
						const captureOptions = this.getNodeParameter('captureOptions', i) as IDataObject;
						const body: IDataObject = {};
						if (captureOptions.amount) {
							body.amount = captureOptions.amount;
						}
						if (captureOptions.order_id) {
							body.order_id = captureOptions.order_id;
						}
						if (captureOptions.shipping_carrier) {
							body.shipping_carrier = captureOptions.shipping_carrier;
						}
						if (captureOptions.shipping_confirmation) {
							body.shipping_confirmation = captureOptions.shipping_confirmation;
						}
						responseData = await affirmApiRequest.call(
							this,
							'POST',
							`/leases/${leaseId}/capture`,
							body,
						);
					} else if (operation === 'void') {
						responseData = await affirmApiRequest.call(this, 'POST', `/leases/${leaseId}/void`);
					} else if (operation === 'refund') {
						const refundOptions = this.getNodeParameter('refundOptions', i) as IDataObject;
						const body: IDataObject = {};
						if (refundOptions.amount) {
							body.amount = refundOptions.amount;
						}
						responseData = await affirmApiRequest.call(
							this,
							'POST',
							`/leases/${leaseId}/refund`,
							body,
						);
					}
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as IDataObject),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

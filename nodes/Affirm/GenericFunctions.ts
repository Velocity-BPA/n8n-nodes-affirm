/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IRequestOptions,
	IWebhookFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

import type { IAffirmCredentials } from './types';

/**
 * Licensing notice - logged once per node load
 */
let licenseNoticeLogged = false;

export const LICENSE_NOTICE = `[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
`;

export function logLicenseNotice(): void {
	if (!licenseNoticeLogged) {
		console.warn(LICENSE_NOTICE);
		licenseNoticeLogged = true;
	}
}

/**
 * Get the base URL for Affirm API based on environment and country
 */
export function getBaseUrl(credentials: IAffirmCredentials): string {
	const { environment, country } = credentials;

	if (country === 'CAN') {
		return environment === 'sandbox'
			? 'https://sandbox.affirm.com/api/v1'
			: 'https://global.affirm.com/api/v1';
	}

	return environment === 'sandbox'
		? 'https://sandbox.affirm.com/api/v1'
		: 'https://api.affirm.com/api/v1';
}

/**
 * Make an authenticated request to the Affirm API
 */
export async function affirmApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<IDataObject | IDataObject[]> {
	const credentials = await this.getCredentials('affirmApi') as unknown as IAffirmCredentials;

	const baseUrl = getBaseUrl(credentials);

	const options: IRequestOptions = {
		method,
		url: `${baseUrl}${endpoint}`,
		headers: {
			'Content-Type': 'application/json',
			'Country-Code': credentials.country,
		},
		auth: {
			username: credentials.publicKey,
			password: credentials.privateKey,
		},
		json: true,
	};

	if (Object.keys(body).length > 0) {
		options.body = body;
	}

	if (Object.keys(qs).length > 0) {
		options.qs = qs;
	}

	try {
		const response = await this.helpers.request(options);
		return response as IDataObject;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Make paginated requests to the Affirm API
 */
export async function affirmApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	propertyName = 'data',
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let responseData: IDataObject;

	qs.limit = 100;
	qs.offset = 0;

	do {
		responseData = await affirmApiRequest.call(this, method, endpoint, body, qs) as IDataObject;
		const items = responseData[propertyName] as IDataObject[] || [];
		returnData.push(...items);
		qs.offset = (qs.offset as number) + (qs.limit as number);
	} while (
		responseData[propertyName] &&
		(responseData[propertyName] as IDataObject[]).length === qs.limit
	);

	return returnData;
}

/**
 * Validate that amount is a positive number
 */
export function validateAmount(amount: number): number {
	if (amount < 0) {
		throw new Error('Amount must be a positive number');
	}
	return Math.round(amount);
}

/**
 * Convert dollars to cents
 */
export function formatAmountToCents(amount: number): number {
	return Math.round(amount * 100);
}

/**
 * Convert cents to dollars
 */
export function formatCentsToAmount(cents: number): number {
	return cents / 100;
}

/**
 * Build checkout object from node parameters
 */
export function buildCheckoutObject(params: IDataObject): IDataObject {
	const checkout: IDataObject = {
		merchant: {
			user_confirmation_url: params.userConfirmationUrl,
			user_cancel_url: params.userCancelUrl,
			...(params.userConfirmationUrlAction && {
				user_confirmation_url_action: params.userConfirmationUrlAction,
			}),
			...(params.merchantName && { name: params.merchantName }),
		},
		shipping: {
			name: {
				first: params.shippingFirstName,
				last: params.shippingLastName,
			},
			address: {
				line1: params.shippingLine1,
				...(params.shippingLine2 && { line2: params.shippingLine2 }),
				city: params.shippingCity,
				state: params.shippingState,
				zipcode: params.shippingZipcode,
				country: params.shippingCountry || 'US',
			},
			...(params.shippingPhone && { phone_number: params.shippingPhone }),
		},
		items: params.items,
		total: validateAmount(params.total as number),
	};

	if (params.useBillingAddress) {
		checkout.billing = {
			name: {
				first: params.billingFirstName,
				last: params.billingLastName,
			},
			address: {
				line1: params.billingLine1,
				...(params.billingLine2 && { line2: params.billingLine2 }),
				city: params.billingCity,
				state: params.billingState,
				zipcode: params.billingZipcode,
				country: params.billingCountry || 'US',
			},
			...(params.billingPhone && { phone_number: params.billingPhone }),
			...(params.billingEmail && { email: params.billingEmail }),
		};
	}

	if (params.orderId) {
		checkout.order_id = params.orderId;
	}

	if (params.shippingAmount) {
		checkout.shipping_amount = validateAmount(params.shippingAmount as number);
	}

	if (params.taxAmount) {
		checkout.tax_amount = validateAmount(params.taxAmount as number);
	}

	if (params.currency) {
		checkout.currency = params.currency;
	}

	if (params.financingProgram) {
		checkout.financing_program = params.financingProgram;
	}

	if (params.metadata) {
		checkout.metadata = params.metadata;
	}

	return checkout;
}

/**
 * Build items array from node parameters
 */
export function buildItemsArray(itemsInput: IDataObject[]): IDataObject[] {
	return itemsInput.map((item) => ({
		display_name: item.displayName,
		sku: item.sku,
		unit_price: validateAmount(item.unitPrice as number),
		qty: item.quantity || 1,
		...(item.itemImageUrl && { item_image_url: item.itemImageUrl }),
		...(item.itemUrl && { item_url: item.itemUrl }),
	}));
}

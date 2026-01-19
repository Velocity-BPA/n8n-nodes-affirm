/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export interface IAffirmCredentials {
	environment: 'sandbox' | 'production';
	country: 'USA' | 'CAN';
	publicKey: string;
	privateKey: string;
}

export interface IAffirmAddress {
	line1: string;
	line2?: string;
	city: string;
	state: string;
	zipcode: string;
	country: string;
}

export interface IAffirmName {
	first: string;
	last: string;
	full?: string;
}

export interface IAffirmCustomer {
	name: IAffirmName;
	email: string;
	phone_number?: string;
	address?: IAffirmAddress;
}

export interface IAffirmItem {
	display_name: string;
	sku: string;
	unit_price: number;
	qty: number;
	item_image_url?: string;
	item_url?: string;
	categories?: string[][];
}

export interface IAffirmShipping {
	name: IAffirmName;
	address: IAffirmAddress;
	phone_number?: string;
}

export interface IAffirmBilling {
	name: IAffirmName;
	address: IAffirmAddress;
	phone_number?: string;
	email?: string;
}

export interface IAffirmCheckout {
	merchant: {
		user_confirmation_url: string;
		user_cancel_url: string;
		user_confirmation_url_action?: 'GET' | 'POST';
		name?: string;
	};
	shipping: IAffirmShipping;
	billing?: IAffirmBilling;
	items: IAffirmItem[];
	metadata?: Record<string, string>;
	order_id?: string;
	shipping_amount?: number;
	tax_amount?: number;
	total: number;
	currency?: string;
	financing_program?: string;
	discounts?: Record<string, {
		discount_amount: number;
		discount_display_name: string;
	}>;
}

export interface IAffirmTransaction {
	id: string;
	created: string;
	order_id?: string;
	currency: string;
	amount: number;
	amount_refunded: number;
	auth_hold: number;
	payable: number;
	void: boolean;
	status: string;
	provider_id?: number;
	details?: {
		billing?: IAffirmBilling;
		shipping?: IAffirmShipping;
		items?: IAffirmItem[];
		merchant?: {
			public_api_key: string;
			name: string;
		};
		discounts?: Record<string, unknown>;
	};
	events?: IAffirmTransactionEvent[];
}

export interface IAffirmTransactionEvent {
	id: string;
	created: string;
	currency: string;
	amount: number;
	type: string;
	transaction_id: string;
}

export interface IAffirmCharge {
	id: string;
	created: string;
	order_id?: string;
	currency: string;
	amount: number;
	auth_hold: number;
	payable: number;
	void: boolean;
	status: string;
}

export interface IAffirmLease {
	lease_id: string;
	created: string;
	order_id?: string;
	currency: string;
	amount: number;
	status: string;
	captured_amount?: number;
	refunded_amount?: number;
}

export interface IAffirmWebhook {
	id: string;
	url: string;
	events: string[];
	enabled: boolean;
	created?: string;
	updated?: string;
}

export interface IAffirmPromo {
	promo: {
		html: string;
		price_per_installment?: number;
		num_installments?: number;
		apr?: number;
		term_length?: number;
	};
}

export interface IAffirmWebhookPayload {
	event: {
		type: string;
		created_at: string;
	};
	transaction?: IAffirmTransaction;
	checkout?: {
		checkout_id: string;
		checkout_status: string;
	};
	loan?: {
		id: string;
		status: string;
	};
	dispute?: {
		id: string;
		status: string;
		reason: string;
	};
}

export interface IAffirmError {
	status_code: number;
	type: string;
	code: string;
	message: string;
	field?: string;
}

export type AffirmResource =
	| 'transaction'
	| 'charge'
	| 'checkout'
	| 'promo'
	| 'webhook'
	| 'lease';

export type TransactionOperation =
	| 'authorize'
	| 'get'
	| 'update'
	| 'capture'
	| 'void'
	| 'refund';

export type ChargeOperation =
	| 'authorize'
	| 'get'
	| 'capture'
	| 'void'
	| 'refund';

export type CheckoutOperation =
	| 'create'
	| 'get';

export type PromoOperation =
	| 'getMessage'
	| 'getFinancingProgram';

export type WebhookOperation =
	| 'list'
	| 'create'
	| 'get'
	| 'update'
	| 'delete';

export type LeaseOperation =
	| 'get'
	| 'capture'
	| 'void'
	| 'refund';

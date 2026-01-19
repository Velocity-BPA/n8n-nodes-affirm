/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class AffirmApi implements ICredentialType {
	name = 'affirmApi';
	displayName = 'Affirm API';
	documentationUrl = 'https://docs.affirm.com/developers/docs';
	properties: INodeProperties[] = [
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'options',
			options: [
				{
					name: 'Sandbox',
					value: 'sandbox',
				},
				{
					name: 'Production',
					value: 'production',
				},
			],
			default: 'sandbox',
			description: 'The Affirm environment to connect to',
		},
		{
			displayName: 'Country',
			name: 'country',
			type: 'options',
			options: [
				{
					name: 'United States',
					value: 'USA',
				},
				{
					name: 'Canada',
					value: 'CAN',
				},
			],
			default: 'USA',
			description: 'Country for global integration',
		},
		{
			displayName: 'Public API Key',
			name: 'publicKey',
			type: 'string',
			default: '',
			required: true,
			description: 'Public key from Affirm Merchant Portal',
		},
		{
			displayName: 'Private API Key',
			name: 'privateKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Private key from Affirm Merchant Portal',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization:
					'=Basic {{Buffer.from($credentials.publicKey + ":" + $credentials.privateKey).toString("base64")}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL:
				'={{$credentials.environment === "sandbox" ? "https://sandbox.affirm.com/api/v1" : "https://api.affirm.com/api/v1"}}',
			url: '/promos/v2',
			qs: {
				amount: 10000,
			},
		},
	};
}

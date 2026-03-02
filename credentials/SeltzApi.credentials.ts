import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SeltzApi implements ICredentialType {
	name = 'seltzApi';

	displayName = 'Seltz API';

	icon = 'file:seltz.svg' as const;

	documentationUrl = 'https://seltz.ai/';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			body: {
				api_key: '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			method: 'POST',
			baseURL: 'https://api.seltz.ai',
			url: '/v1/search/',
			body: {
				query: 'test',
				includes: { max_documents: 1 },
			},
			json: true,
		},
	};
}

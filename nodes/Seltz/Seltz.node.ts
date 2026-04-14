import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

export class Seltz implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Seltz',
		name: 'seltz',
		icon: 'file:seltz.svg',
		group: ['transform'],
		version: 1,
		subtitle: 'Web Search',
		description: 'Search the live web using the Seltz Web Knowledge API',
		defaults: {
			name: 'Seltz',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'seltzApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '',
				required: true,
				description: 'The search query to send to Seltz',
				placeholder: 'e.g. latest AI research papers 2025',
			},
			{
				displayName: 'Max Documents',
				name: 'maxDocuments',
				type: 'number',
				default: 5,
				description: 'Maximum number of documents to return (1–20)',
				typeOptions: {
					minValue: 1,
					maxValue: 20,
				},
			},
			{
				displayName: 'Output Mode',
				name: 'outputMode',
				type: 'options',
				default: 'splitDocuments',
				description: 'How to return the results',
				options: [
					{
						name: 'One Item per Document',
						value: 'splitDocuments',
						description: 'Each document becomes a separate n8n item',
					},
					{
						name: 'All Documents in One Item',
						value: 'allDocuments',
						description: 'Return all documents as an array in a single item',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const query = this.getNodeParameter('query', i) as string;
			const maxDocuments = this.getNodeParameter('maxDocuments', i) as number;
			const outputMode = this.getNodeParameter('outputMode', i) as string;

			let responseData: IDataObject;
			try {
				responseData = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'seltzApi',
					{
						method: 'POST',
						url: 'https://api.seltz.ai/v1/search/',
						headers: {
							'Content-Type': 'application/json',
							Accept: 'application/json',
						},
						body: {
							query,
							includes: { max_documents: maxDocuments },
						},
						json: true,
					},
				);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw new NodeApiError(this.getNode(), error as JsonObject, {
					itemIndex: i,
				});
			}

			const documents = responseData.documents as IDataObject[];

			if (!Array.isArray(documents)) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: 'Unexpected response format from Seltz API' },
						pairedItem: { item: i },
					});
					continue;
				}
				throw new NodeOperationError(
					this.getNode(),
					'Unexpected response format from Seltz API',
					{ itemIndex: i },
				);
			}

			if (outputMode === 'splitDocuments') {
				for (const doc of documents) {
					returnData.push({
						json: doc,
						pairedItem: { item: i },
					});
				}
			} else {
				returnData.push({
					json: { documents },
					pairedItem: { item: i },
				});
			}
		}

		return [returnData];
	}
}

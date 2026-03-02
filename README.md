# n8n-nodes-seltz

This is an n8n community node for [Seltz](https://seltz.ai/) — the Web Knowledge API built for AI agents. It lets you search the live web inside your n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Web Search

- **Query** — The search query to send to Seltz.
- **Max Documents** — Maximum number of documents to return (1–20).
- **Output Mode** — Choose between returning one item per document or all documents in a single item.

## Credentials

You need a Seltz API key to use this node.

1. Sign up at [seltz.ai](https://seltz.ai/).
2. Copy your API key from the dashboard.
3. In n8n, create a new **Seltz API** credential and paste the key.

## Compatibility

Tested with n8n version 1.x. No known compatibility issues.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Seltz API documentation](https://seltz.ai/)
- [GitHub repository](https://github.com/WilliamEspegren/n8n-nodes-seltz)

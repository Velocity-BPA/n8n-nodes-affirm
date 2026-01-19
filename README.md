# n8n-nodes-affirm

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

---

A comprehensive n8n community node for **Affirm** - the leading US Buy Now Pay Later (BNPL) provider with major partnerships including Amazon and Shopify. This package provides complete integration with Affirm's Transactions API, promotional messaging, webhook management, and global support for USA and Canada.

![n8n.io - Workflow Automation](https://img.shields.io/badge/n8n-community--node-brightgreen)
![License](https://img.shields.io/badge/license-BUSL--1.1-blue)
![Version](https://img.shields.io/badge/version-1.0.0-orange)

## Features

- **Transaction Management**: Full lifecycle support - authorize, capture, void, refund, and update
- **Partial Operations**: Support for partial captures and partial refunds
- **Checkout Sessions**: Create and manage checkout sessions programmatically
- **Promotional Messaging**: Retrieve promotional content for product pages and carts
- **Webhook Integration**: Subscribe to transaction, loan, checkout, and dispute events
- **Legacy API Support**: Backwards compatibility with Charges API
- **Affirm Card/Debit+**: Lease management for Affirm's card products
- **Global Integration**: Support for USA and Canada with appropriate currency handling
- **Dual Environment**: Sandbox and Production environment support

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Navigate to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-affirm`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-affirm

# Restart n8n
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-affirm.git
cd n8n-nodes-affirm

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes directory
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-affirm

# Restart n8n
n8n start
```

## Credentials Setup

### Affirm API Credentials

| Field | Description |
|-------|-------------|
| Environment | Select Sandbox or Production |
| Country | Select USA or Canada |
| Public API Key | Your public key from Affirm Merchant Portal |
| Private API Key | Your private key from Affirm Merchant Portal |

### Base URLs

| Environment | Country | Base URL |
|-------------|---------|----------|
| Sandbox | USA | `https://sandbox.affirm.com/api/v1` |
| Production | USA | `https://api.affirm.com/api/v1` |
| Sandbox | Canada | `https://sandbox.affirm.com/api/v1` |
| Production | Canada | `https://global.affirm.com/api/v1` |

## Resources & Operations

### Transaction

| Operation | Description |
|-----------|-------------|
| Authorize | Authorize a transaction from checkout token |
| Get | Get transaction details |
| Update | Update order information |
| Capture | Capture authorized amount (full or partial) |
| Void | Void an authorization |
| Refund | Refund captured amount (full or partial) |

### Charge (Legacy)

| Operation | Description |
|-----------|-------------|
| Authorize | Authorize a charge |
| Get | Get charge details |
| Capture | Capture a charge |
| Void | Void a charge |
| Refund | Refund a charge |

### Checkout

| Operation | Description |
|-----------|-------------|
| Create | Create a new checkout session |
| Get | Get checkout status |

### Promo

| Operation | Description |
|-----------|-------------|
| Get Message | Get promotional messaging for an amount |
| Get Financing Program | Get financing program details |

### Webhook

| Operation | Description |
|-----------|-------------|
| List | List all webhook subscriptions |
| Create | Create a webhook subscription |
| Get | Get webhook details |
| Update | Update a webhook |
| Delete | Delete a webhook |

### Lease (Affirm Card/Debit+)

| Operation | Description |
|-----------|-------------|
| Get | Get lease details |
| Capture | Capture a lease |
| Void | Void a lease |
| Refund | Refund a lease |

## Trigger Node

The **Affirm Trigger** node supports the following webhook events:

| Event | Description |
|-------|-------------|
| `transaction.authorized` | Transaction authorized |
| `transaction.captured` | Payment captured |
| `transaction.voided` | Authorization voided |
| `transaction.refunded` | Refund processed |
| `transaction.updated` | Transaction updated |
| `loan.approved` | Customer loan approved |
| `loan.denied` | Customer loan denied |
| `loan.confirmed` | Customer confirmed loan |
| `checkout.completed` | Checkout flow completed |
| `checkout.cancelled` | Checkout cancelled |
| `dispute.opened` | Dispute created |
| `dispute.resolved` | Dispute resolved |

## Usage Examples

### Authorize a Transaction

After a customer completes the Affirm checkout flow, you'll receive a `checkout_token`. Use it to authorize:

```
Resource: Transaction
Operation: Authorize
Checkout Token: {{ $json.checkout_token }}
Order ID: ORD-12345
```

### Capture Payment

When ready to ship, capture the authorized amount:

```
Resource: Transaction
Operation: Capture
Transaction ID: {{ $json.transaction_id }}
```

### Get Promotional Messaging

Display financing options on product pages:

```
Resource: Promo
Operation: Get Message
Amount (Cents): 99900
Page Type: product
```

## BNPL Concepts

### Amount Formatting

All amounts in Affirm's API are expressed in **cents** (minor currency units):

| Display Amount | API Value |
|----------------|-----------|
| $100.00 | 10000 |
| $25.50 | 2550 |
| $1,250.00 | 125000 |

### Transaction Lifecycle

1. **Authorize**: Reserve funds after customer completes checkout
2. **Capture**: Collect payment when order ships
3. **Refund**: Return funds for returns/cancellations
4. **Void**: Cancel authorization before capture

## Error Handling

The node handles Affirm API errors with detailed messages:

```json
{
  "status_code": 400,
  "type": "invalid-request",
  "code": "invalid-field",
  "message": "checkout_token is required",
  "field": "checkout_token"
}
```

## Security Best Practices

- Store API keys securely using n8n credentials
- Use sandbox environment for testing
- Implement webhook signature verification in production
- Never log sensitive customer data

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint

# Fix lint issues
npm run lint:fix
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

**[Velocity BPA Licensing Notice]**

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

### Free Use

Permitted for personal, educational, research, and internal business use.

### Commercial Use

Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Support

- **Documentation**: [https://velobpa.com/docs](https://velobpa.com/docs)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-affirm/issues)
- **Commercial Support**: licensing@velobpa.com

## Acknowledgments

- [Affirm Developer Documentation](https://docs.affirm.com/developers/docs)
- [n8n Community](https://community.n8n.io)

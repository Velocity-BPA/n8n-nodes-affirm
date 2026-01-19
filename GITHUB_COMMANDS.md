# Push to GitHub

```bash
# Extract and navigate
unzip n8n-nodes-affirm.zip
cd n8n-nodes-affirm

# Initialize and push
git init
git add .
git commit -m "Initial commit: n8n Affirm BNPL community node

Features:
- Transaction: Authorize, capture, void, refund, update operations
- Charge: Legacy API support for backwards compatibility
- Checkout: Session creation and status retrieval
- Promo: Promotional messaging for product pages and carts
- Webhook: Subscription management (create, list, update, delete)
- Lease: Affirm Card/Debit+ support
- Trigger: Transaction, loan, checkout, dispute webhook events
- Global: USA and Canada integration with currency support
- Environments: Sandbox and Production API endpoints
- Partial: Capture and refund support for flexible operations"

git remote add origin https://github.com/Velocity-BPA/n8n-nodes-affirm.git
git branch -M main
git push -u origin main
```

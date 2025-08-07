# Privy + Rootstock Integration

This mini page is designed to show how to impelement Privy to power authentication, making it easy for users to interact with dapps with no prior Web3 knowledge required. This is a comprehensive technical guide for integrating Privy's embedded wallet infrastructure with Rootstock (RSK) blockchain

## Quick Start

```
git clone https://github.com/sammajayi/rootstock-privy-setup.git
cd rootstock-privy-setup
cp .env.local.example .env.local
npm install
npm run dev
```

## Environment Variables

To run this app you need a Privy App ID.

```
# .env.local.example
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
```

You can get your Privy App ID from the [Privy Dashboard](https://dashboard.privy.io)

### Features Implemented

- Privy embedded wallet authentication
- Legacy transaction support (EIP-1559 not supported)
- Smart contract interaction with Viem
- Custom chain configuration, specificallhy Rootstock Testnet
- Error handling

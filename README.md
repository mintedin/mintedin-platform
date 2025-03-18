# MintedIn: Blockchain-Powered Freelance Platform

<h4 align="center">
  A decentralized freelance marketplace with evolvable NFTs for reputation and transparent on-chain history
</h4>

## 🚀 Vision

MintedIn transforms the freelance economy by using NFTs as on-chain reputation identities. Our platform leverages blockchain technology to create a more transparent, fair, and efficient marketplace for freelancers and clients.

## ✨ Key Features

### NFT-Based Reputation System

- **Evolving Freelancer NFTs**: Start at Bronze tier and evolve to Silver, Gold, and higher tiers based on performance
- **Client NFTs**: Reflect hiring history, total spend, and ratings as a client
- **On-Chain Verification**: All reputation data is transparent and immutable on the blockchain

### Transparent Marketplace

- **Lower Fees**: Significantly reduced fees compared to traditional platforms (Upwork, Fiverr)
- **Smart Contract Escrow**: Secure, automated payment release when work is completed
- **Dispute Resolution**: Fair resolution process managed by trusted community members

### Complete Job Lifecycle

- **Job Creation and Funding**: Clients create and fund jobs with native cryptocurrency
- **Work Submission and Approval**: Clear process for submitting and approving completed work
- **Rating and Feedback**: Performance metrics directly impact NFT evolution

## 🏗 Technical Architecture

MintedIn is built on three core contracts:

1. **FreelancerNFT**: ERC-721 token representing freelancer reputation and skills
2. **ClientNFT**: ERC-721 token representing client reputation and history
3. **FreelanceMarketplace**: Central contract managing jobs, payments, and the reputation system

## 🧱 Getting Started

### Requirements

- [Node (>= v18.18)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

### Setup

1. Install dependencies:

```bash
yarn install
```

2. Install Foundry dependencies:

```bash
cd packages/foundry
forge install openzeppelin/openzeppelin-contracts --no-commit
forge install foundry-rs/forge-std --no-commit
cd ../..
```

3. Run a local network:

```bash
yarn chain
```

4. Deploy the contracts:

```bash
yarn deploy
```

5. Start the frontend:

```bash
yarn start
```

Visit your app on: `http://localhost:3000`

## 🧪 Running Tests

We've created comprehensive tests for all contracts in the `packages/foundry/test` directory:

```bash
# Run all tests
yarn foundry:test

# Run specific test files
cd packages/foundry
forge test --match-path test/FreelancerNFT.t.sol
forge test --match-path test/ClientNFT.t.sol
forge test --match-path test/FreelanceMarketplace.t.sol
```

## Deployment on Scroll sepolia:

FreelancerNFT: 0x0eA71b3062Ee87Ec2EFbB3Ef1649174ab56261B5

ClientNFT: 0xE5267ad87985d9ddddE8D4962e1CD81272a68CdC

FreelanceMarketplace: 0x840FbcaaED5cA99f53F24ED4A7E904a0a11cBD91

## 💡 Why This Matters

- **Gamified Engagement**: Evolving NFTs represent growth and reliability, encouraging quality work
- **Transparent Reputation**: On-chain progression means reputations cannot be faked
- **Lower Fees**: Direct interactions reduce middleman costs
- **Portable Identity**: Your reputation travels with you across the Web3 ecosystem
- **Community Governance**: Platform rules and improvements decided by active participants

## 🛠 Development

- Smart contracts are in `packages/foundry/contracts`
- Frontend is built with NextJS in `packages/nextjs`
- Tests are in `packages/foundry/test`

---

Built with ❤️ using [Scaffold-ETH 2](https://scaffoldeth.io)

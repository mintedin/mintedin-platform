# Deployment Scripts

This directory contains deployment scripts for MintedIn contracts.

## DeployFreelanceMarketplace.s.sol

This script deploys the FreelanceMarketplace contract with the UUPS proxy pattern, making it upgradeable.

### Prerequisites

1. Make sure you have the FreelancerNFT and ClientNFT contracts already deployed, as their addresses are required.
2. Set up environment variables for the deployment.

### Environment Variables

Set the following environment variables before running the script:

```
PRIVATE_KEY=<your-private-key>
FREELANCER_NFT_ADDRESS=<address-of-deployed-freelancer-nft>
CLIENT_NFT_ADDRESS=<address-of-deployed-client-nft>
```

Optional variables (will default to the deployer address if not specified):

```
DEFAULT_ADMIN_ADDRESS=<address-for-admin-role>
PAUSER_ADDRESS=<address-for-pauser-role>
UPGRADER_ADDRESS=<address-for-upgrader-role>
MARKETPLACE_ADMIN_ADDRESS=<address-for-marketplace-admin-role>
PLATFORM_FEE=<fee-in-basis-points> # Default is 250 (2.5%)
```

### Running the Script

#### Local Development

```bash
# Set required environment variables
export PRIVATE_KEY=0x...
export FREELANCER_NFT_ADDRESS=0x...
export CLIENT_NFT_ADDRESS=0x...

# Run the deployment
forge script script/DeployFreelanceMarketplace.s.sol --rpc-url http://localhost:8545 --broadcast
```

#### Testnet Deployment (Scroll Sepolia)

```bash
# Set required environment variables
export PRIVATE_KEY=0x...
export FREELANCER_NFT_ADDRESS=0x...
export CLIENT_NFT_ADDRESS=0x...

# Deploy to Scroll Sepolia
forge script script/DeployFreelanceMarketplace.s.sol --rpc-url https://sepolia-rpc.scroll.io --broadcast --verify
```

### Verifying the Contract

To verify the contract on Etherscan (or Scrollscan for Scroll network):

```bash
forge verify-contract <IMPLEMENTATION_ADDRESS> FreelanceMarketplace --chain-id 534351 --watch --constructor-args $(cast abi-encode "constructor()")
```

For the proxy, you'll need:

```bash
forge verify-contract <PROXY_ADDRESS> ERC1967Proxy --chain-id 534351 --watch --constructor-args $(cast abi-encode "constructor(address,bytes)" <IMPLEMENTATION_ADDRESS> <INITIALIZATION_CALLDATA>)
```

### Contract Addresses

After deployment, two addresses will be printed:

1. **Proxy Address**: This is the address to use when interacting with the contract
2. **Implementation Address**: This is the address of the logic contract

Always use the proxy address for transactions and interactions.

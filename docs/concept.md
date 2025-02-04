## 1. Smart Contract Tasks

1. **NFT Membership Contract**
   - Define the **ERC-721** or **ERC-1155** contract for freelancer NFTs.
   - Implement upgrade logic (tiers: Bronze → Silver → Gold, etc.) either on-chain or via metadata.
   - Events for when a freelancer levels up (e.g., `LevelUp`, `PointsEarned`).
   - Write unit tests using Hardhat/Foundry (Mocha/Chai or Forge).
2. **Job Completion / Points Mechanism**

   - Functions that update points, manage NFT tier progression.
   - Ensure it’s secure (only authorized contract or admin can modify points).
   - Emit appropriate events for subgraph indexing.

3. **Core Marketplace / Freelance Contract**
   - Handles **job creation**, **escrow**, **fund release** upon completion.
   - Integrate events for job start, job completion, feedback rating.
4. **Governance Token & Staking** (if time permits)
   - Implement an **ERC-20** governance token.
   - Basic **staking** mechanism to unlock advanced features or voting rights.
   - Possibly integrate a minimal **DAO** structure for platform decisions.
5. **Security & Testing**
   - Perform **security checks** with Slither or Echidna.
   - Collaborate on a final **end-to-end test** that covers NFT evolution + escrow flow.

---

## 2. Backend Tasks

### Backend Engineer

1. **Subgraph Setup**

   - Define the **schema** (`schema.graphql`) to index NFT events (mint, level-up) and marketplace events (job creation, completion, feedback).
   - Write **mapping** handlers in AssemblyScript to store data (e.g., `Freelancer` entity with `points`, `NFT tier`, `jobsCompleted`).
   - Deploy subgraph to **The Graph Hosted Service** (or local test).

2. **Metadata Handling** (NFT images/metadata)
   - If using dynamic metadata, integrate with IPFS or an API that updates token URIs based on tier/points.
   - Alternatively, store a base URI and let the front end fetch tier data from the subgraph.

---

## 3. Frontend Tasks

1. **UI/UX Wireframes**

   - Sketch out **key screens**:
     - **Minting Page** (submit a form with personal information (name, username, type engineer...) and mint a NFT).
     - **Landing Page** (showing top-ranked freelancers, connect wallet).
     - **Freelancer Dashboard** (NFT tier, points, completed jobs).
     - **Client Job Posting** (create a job, track status).
   - Ensure quick, intuitive flows for minting NFTs and interacting with jobs/escrow.

2. **Wallet Connection & Contract Calls**

   - Use **ethers.js** or **viem** for contract interactions.
   - Integrate **Metamask** or **WalletConnect** for user sign-in.
   - Handle job creation and job completion flows.

3. **Data Fetching from Subgraph**
   - Implement **GraphQL queries** to fetch freelancer data, job listings, NFT tiers, etc.
   - Update UI in real-time (or near real-time) upon job completion or NFT level-up.
4. **NFT Visualization & Tier Display**
   - Show the user’s NFT image/badge with the correct tier or points.
   - If dynamic images are used, fetch from IPFS or the backend.
5. **Ranking/Leaderboard**
   - Build a **leaderboard** or **directory** of freelancers sorted by tier/points.
   - Optionally include filters (e.g., Bronze, Silver, Gold) so clients can easily browse top talent.

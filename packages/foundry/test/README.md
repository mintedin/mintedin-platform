# FreelanceMarketplace Contract Tests

This directory contains tests for the FreelanceMarketplace ecosystem contracts using the Foundry testing framework.

## Test Files

1. **FreelancerNFT.t.sol** - Tests for the FreelancerNFT contract

   - Initialization and roles
   - Minting functionality
   - Pause/unpause functionality
   - Role restrictions
   - Freelancer data management

2. **ClientNFT.t.sol** - Tests for the ClientNFT contract

   - Initialization and roles
   - Minting functionality
   - Pause/unpause functionality
   - Role restrictions
   - Multiple token handling and transfers

3. **FreelanceMarketplace.t.sol** - Tests for the FreelanceMarketplace contract
   - Contract initialization
   - Full job lifecycle (create, fund, accept, submit, approve, complete)
   - Job cancellation and withdrawal
   - Dispute resolution process
   - Admin functions (fee management, platform fee withdrawal)
   - Pause/unpause functionality
   - Role validations
   - Feedback and reputation management

## Prerequisites

Before running these tests, make sure you have Foundry installed:

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

## Installing Dependencies

The tests rely on forge-std (Forge Standard Library). Install it with:

```bash
forge install foundry-rs/forge-std --no-commit
```

## Running Tests

To run all tests:

```bash
forge test
```

To run a specific test file:

```bash
forge test --match-path test/FreelancerNFT.t.sol
forge test --match-path test/ClientNFT.t.sol
forge test --match-path test/FreelanceMarketplace.t.sol
```

To run a specific test function:

```bash
forge test --match-test testSafeMint
```

To see detailed test logs with gas reports:

```bash
forge test -vvv --gas-report
```

## Test Coverage

To generate a test coverage report:

```bash
forge coverage
```

## Notes on Test Structure

- Each test file follows a similar structure:

  1. Setup of contract instances and test addresses
  2. Tests for basic functionality
  3. Tests for more complex workflows
  4. Tests for access control and restrictions
  5. Tests for edge cases and potential vulnerabilities

- Many tests use Forge's cheatcodes such as `vm.startPrank()` to impersonate different users and test access control properly.

- The FreelanceMarketplace test includes a full workflow test which simulates the entire lifecycle of a job from creation to payment release.

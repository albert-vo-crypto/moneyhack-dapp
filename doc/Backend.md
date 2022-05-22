![Logo](./img/logo.png) 

## Backend 

[ReveFin smart contracts](https://github.com/revefin/moneyhack-dapp/tree/feature/Vault-and-vaultFactory-smart-contract/packages/hardhat/contracts) can be accessed under [this folder](https://github.com/revefin/moneyhack-dapp/tree/feature/Vault-and-vaultFactory-smart-contract/packages/hardhat/contracts).

Here are explanations for the smart contracts:

### `PaymentSplitter`
- This contract allows to split Ether payments among a group of accounts. The sender does not need to be aware that the Ether will be split in this way, since it is handled transparently by the contract.
- The split can be in equal parts or in any other arbitrary proportion. The way this is specified is by assigning each account to a number of shares. Of all the Ether that this contract receives, each account will then be able to claim an amount proportional to the percentage of total shares they were assigned.
- `PaymentSplitter` follows a _pull payment_ model. This means that payments are not automatically forwarded to the accounts but kept in this contract, and the actual transfer is triggered as a separate step by calling the {release} function.
- NOTE: This contract assumes that ERC20 tokens will behave similarly to native tokens (Ether). Rebasing tokens, and tokens that apply fees during transfers, are likely to not be supported as expected. If in doubt, we encourage you to run tests before sending real value to this contract.

### `RBFVault` (Revenue-Based Financing Vault)
- Contract allowing Lender to secure royalty revenue streams from a NFT collection of borrower and split payments between them based on agreed terms
- Should be deployed per NFT collection.

### `RBFVaultFactory`  (Revenue-Based Financing Vault Factory)
- Contract allows to create vaults which allows Lender to secure royalty revenue streams from a NFT collection of borrower and split payments between them based on agreed terms
- Should be deployed once for the app

    
**Index**

1. [Background](Background.md)
2. [Unique Value Offerings](UniqueValueOfferings.md)
3. [Design Principles](DesignPrinciples.md)
4. [System Architecture](SystemArchitecture.md)
5. **Backend**
6. [Frontend](Frontend.md)
7. [Analytics](Analytics.md)
8. [Financial Model](FinancialModel.md)
9. [Technology/Tool Stack](TechnologyStack.md)
10. [Related Projects](RelatedProjects.md)
11. [Other Resources](OtherResources.md)
12. [Future Plans](FuturePlans.md)

<hline></hline>

[Back to Main GitHub Page](../README.md) | [Back to Documentation Index Page](Documentation.md)

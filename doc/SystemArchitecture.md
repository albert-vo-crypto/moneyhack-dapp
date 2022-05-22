![Logo](./img/logo.png)

## System Architecture

The process flow in the system is as follows:

1. **NFT Creator** opens the ReveFin website.
2. **NFT Creator**, who has a ready NFT collection on the OpenSea testnet, connects the MetaMask wallet, which has at least one NFT collection in it on the OpenSea testnet, to the ReveFin dapp.
3. **NFT Creator** selects the NFT collection royalty revenue they want to sell.
4. **NFT Creator** clicks the first collection’s art icon to open the details of that revenue stream.
5. **NFT Creator** analyzes the analytics provided by ReveFin.
6. **NFT Creator** adjusts the value of the % royalty for sale using the slider, to bring the bid to 50%. 
7. **NFT Creator** clicks `List 50% royalty revenue for sale` button.
- In the future, this is where ReveFin will collect commission.
8. **ReveFin** displays the message `Collection revenue listed for sale` to confirm the sale listing.
9. **ReveFin** displays the new revenue stream under SELLER Dashboard and the `Buy Revenue` page.
10. **Investor** connects her/his MetaMask wallet to the ReveFin dapp.
11. **Investor** clicks `Buy Revenue` button to start browsing through the revenue streams on sale.
12. **Investor** goes through the metrics for each collection, where the narration mentions each metric briefly.
13. **Investor** clicks the collection’s (fifth collection, `Simple & Healthy`, in the demo video) art icon to open the details of that revenue stream.
14. **Investor** goes through the metrics/charts for each collection. These analytics are helpful to determine bid price of the transaction.
15. **Investor** adjusts the value of the bid using the slider, to bring the bid to a certain value, ex: 40.9 ETH.
16. **Investor** clicks the `BID 40.9 ETH` button. The value to bid is smaller than the value in the slider, due to the gas fees.
- In the future, this is also where ReveFin will collect commission.
17. Funds are taken from BUYER wallet and held in the ReveFin VAULT ADDRESS.
18. **ReveFin** displays the message `Bid placed successfully` to confirm the bid.
19. **ReveFin** displays the bid stream under BUYER Dashboard
20. **NFT Creator** goes to `Dashboard` to accept or decline bid
21. **NFT Creator** accepts bid
22. **NFT Creator** must go to OpenSea website (via provided link) to update royalty forwarding address
23. **NFT Creator** accepts to transfer ownership of the royalty wallet address to the ReveFin VAULT ADDRESS for the duration of the transaction term
24. **NFT Creator** accepts funds
25. **NFT Creator** wallet has receives the funds in an amount equal to the BUYER’s bid. As such the vault is empty.
26. An example transaction is shown in the demo video, whereby 50ETH worth of royalty payments are sent to the ReveFin VAULT ADDRESS, and the royalty revenue is split 50-50 according to the agreed upon transaction terms.


**Index**

1. [Background](Background.md)
2. [Unique Value Offerings](UniqueValueOfferings.md)
3. [Design Principles](DesignPrinciples.md)
4. **System Architecture**
5. [Backend](Backend.md)
6. [Frontend](Frontend.md)
7. [Analytics](Analytics.md)
8. [Financial Model](FinancialModel.md)
9. [Technology/Tool Stack](TechnologyStack.md)
10. [Related Projects](RelatedProjects.md)
11. [Other Resources](OtherResources.md)
12. [Future Plans](FuturePlans.md)


<hline></hline>

[Back to Main GitHub Page](../README.md) | [Back to Documentation Index Page](Documentation.md)

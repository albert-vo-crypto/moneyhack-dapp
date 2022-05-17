// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PaymentSplitter.sol";

//import "@openzeppelin/contracts/access/Ownable.sol";

interface ICollectionContract {
    function transferOwnership(address newOwner) external;

    function owner() external view returns (address);
}

contract RBFVault is PaymentSplitter {
    enum Status {
        Pending,
        Active,
        Expired,
        Canceled
    }

    address public collectionOwner;
    address public collectionAddress;
    uint256 public price;
    Status public status;

    constructor(
        address _collectionAddress,
        address[2] memory _parties,
        uint256[2] memory _shares
    ) payable PaymentSplitter(_parties, _shares) {
        collectionAddress = _collectionAddress;
        collectionOwner = _parties[1];
        status = Status.Pending;
        price = msg.value;
    }

    modifier termsSatisfied() {
        // check if contract time-length completed
        // check if revenue max limit has reached
        _;
    }

    function returnOwnershipToCollectionOwner() external termsSatisfied {
        ICollectionContract(collectionAddress).transferOwnership(
            collectionOwner
        );
    }

    function isVaultOwnsTheCollection() public view returns (bool) {
        return ICollectionContract(collectionAddress).owner() == address(this);
    }

    function activate() external {
        // TODO - verify collection payout address using oracle
        require(
            isVaultOwnsTheCollection(),
            "Vault: Transfer collection ownership to the the vault"
        );
         require(
            status == Status.Pending,
            "Vault: Only vault with'Pending' can be activated"
        );
        status = Status.Active;
        Address.sendValue(payable(_payees[1]), price);
    }

    function getVaultBalance() public view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @return The current state of the vault.
     */
    function vaultStatus() public view returns (Status) {
        return status;
    }

    function release(address payable account) public override {
        require(status == Status.Active, "Vault: vault is not active");
        super.release(account);
    }

    function refundTheLender() external {
        require(
            !isVaultOwnsTheCollection(),
            "Vault: Collection already owned by the vault"
        );

        require(status == Status.Pending, "Refund only available when vault is in 'Pending' status ");
        status = Status.Canceled;
        Address.sendValue(payable(_payees[0]), price);
    }
}
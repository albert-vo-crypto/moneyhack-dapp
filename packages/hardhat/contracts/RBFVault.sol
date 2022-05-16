// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PaymentSplitter.sol";

//import "@openzeppelin/contracts/access/Ownable.sol";

interface ICollectionContract {
    function transferOwnership(address newOwner) external;

    function owner() public view returns (address);
}

contract RBFVault is PaymentSplitter {
    enum Status {
        Initialized,
        Active,
        Expired,
        Canceled
    }

    address public collectionOwner;
    address public collectionAddress;
    Status public status;

    constructor(
        address _collectionAddress,
        address[2] memory _parties,
        uint256[2] memory _shares
    ) PaymentSplitter(_parties, _shares) {
        collectionAddress = _collectionAddress;
        collectionOwner = _parties[1];
        status = Status.Initialized;
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

    function isVaultOwnsTheCollection() public returns (bool) {
        return ICollectionContract(collectionAddress).owner() == address(this);
    }

    function Activate() external {
        // TODO - verify collection payout address using oracle
        require(
            isVaultOwnsTheCollection(),
            "Vault: Collection isn't owned by vault"
        );
        status = Status.Active;
    }
}

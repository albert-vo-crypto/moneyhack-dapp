// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//import "@openzeppelin/contracts/access/Ownable.sol";
import "./RBFVault.sol";

contract RBFVaultFactory {
    event RBFVaultCreated(
        address indexed collectionAddress,
        address indexed vaultAddress
    );

    mapping(address => address) public collectionVault;
    modifier collectionVaultDoesntExist(address collectionAddress) {
        require(
            collectionAddress != address(0),
            "Vault for this collection already exist"
        );
        _;
    }

    modifier sharesIsValid(uint256 share) {
        require(share <= 100, "Investor shares can not be more than 100");
        require(share > 0, "Investor shares should be more than 0");
        _;
    }

    modifier isValidAddress(
        address collectionAddress,
        address collectionOwner,
        address investorAddress
    ) {
        require(
            collectionAddress != address(0),
            "Collection can not be the 0 address"
        );
        require(
            collectionOwner != address(0),
            "Collection owner can not be the 0 address"
        );

        require(
            investorAddress != address(0),
            "Investor can not be the 0 address"
        );

        require(
            collectionOwner != investorAddress,
            "Collection owner can not be the investor"
        );

        _;
    }

    function createVault(
        address collectionAddress,
        address collectionOwner,
        address investorAddress,
        uint256 investorShare
    )
        external
        collectionVaultDoesntExist(collectionAddress)
        isValidAddress(collectionAddress, collectionOwner, investorAddress)
        sharesIsValid(investorShare)
    {
        address[2] memory parties = [investorAddress, collectionOwner];
        uint256[2] memory shares = [investorShare, 100 - investorShare];
        RBFVault vault = new RBFVault(collectionAddress, parties, shares);
        collectionVault[collectionAddress] = address(vault);

        emit RBFVaultCreated(collectionAddress, address(vault));
    }
}

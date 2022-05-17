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
            collectionVault[collectionAddress] == address(0),
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
        public
        payable
        collectionVaultDoesntExist(collectionAddress)
        isValidAddress(collectionAddress, collectionOwner, investorAddress)
        sharesIsValid(investorShare)
    {
        address[2] memory parties = [investorAddress, collectionOwner];
        uint256[2] memory shares = [investorShare, 100 - investorShare];
        RBFVault vault = new RBFVault{value: msg.value}(
            collectionAddress,
            parties,
            shares
        );
        collectionVault[collectionAddress] = address(vault);

        emit RBFVaultCreated(collectionAddress, address(vault));
    }

    //TODO - Remove, use with remix js vm accounts
    function createTestVault() public payable {
        createVault(
            0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B,
            0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2,
            0x5B38Da6a701c568545dCfcB03FcB875f56beddC4,
            50
        );
    }
}

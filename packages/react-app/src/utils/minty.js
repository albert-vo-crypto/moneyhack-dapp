import { NFTStorage } from 'nft.storage';
import { Contract } from "@ethersproject/contracts";
const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider, USE_BURNER_WALLET);
const userSigner = userProviderAndSigner.signer;
const NftCollectionABI = hardhat_contracts[1].contracts.SimpleAndHealthy.abi;
const NftCollectionAddress = hardhat_contracts[1].contracts.SimpleAndHealthy.address;
const nftContract = new Contract(NftCollectionAddress, NftCollectionABI, userSigner);


async function mintNFT({setStatus, image, name, description}) {
    
    // First we use the nft.storage client library to add the image and metadata to IPFS / Filecoin
    const client = new NFTStorage({ token: process.env.REACT_APP_PINNING_SERVICE_KEY });
    setStatus("Uploading to nft.storage...")
    const metadata = await client.store({
      name,
      description,
      image,
    });
    setStatus(`Upload complete! Minting token with metadata URI: ${metadata.url}`);
  
    // the returned metadata.url has the IPFS URI we want to add.
    // our smart contract already prefixes URIs with "ipfs://", so we remove it before calling the `mintToken` function
    //const metadataURI = metadata.url.replace(/^ipfs:\/\//, "");
    const metadataURI = metadata;

    const tokenId = await nftContract.mintToken(metadataURI);
  
    setStatus("Blockchain transaction sent, waiting confirmation...");    
  
    setStatus(`Minted token #${tokenId}`);
    return 0;
  }

  export { mintNFT }
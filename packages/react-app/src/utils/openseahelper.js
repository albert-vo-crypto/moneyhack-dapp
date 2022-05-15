import * as Web3 from "web3";
import { OpenSeaPort, Network } from "opensea-js";
import { DEMO_NFT_COLL_OWNER_ADDRESS } from "../constants";

// This example provider won't let you make transactions, only read-only calls:
const provider = new Web3.providers.HttpProvider("https://mainnet.infura.io");

const seaport = new OpenSeaPort(provider, {
  networkName: Network.Main,
  apiKey: process.env.OPENSEA_API_KEY || "",
});

export const openseaGetCollections = async (ownerAddress = DEMO_NFT_COLL_OWNER_ADDRESS, limit = 30) => {
  const options = { method: "GET", headers: { Accept: "application/json" } };
  const fetchStr = `https://api.opensea.io/api/v1/collections?asset_owner=${ownerAddress}&offset=0&limit=${limit}`;
  try {
    const response = await fetch(fetchStr, options);
    const json = await response.json();
    return json;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

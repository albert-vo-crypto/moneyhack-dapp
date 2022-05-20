import * as Web3 from "web3";
import { OpenSeaPort, Network } from "opensea-js";
import _ from "lodash";

import { DEMO_NFT_COLL_OWNER_ADDRESS } from "../constants";
import { log } from "./commons";

// This example provider won't let you make transactions, only read-only calls:
const provider = new Web3.providers.HttpProvider("https://mainnet.infura.io");

const seaport = new OpenSeaPort(provider, {
  networkName: Network.Main,
  apiKey: process.env.OPENSEA_API_KEY || "",
});

export const openseaGetCollections = async (
  ownerAddress = DEMO_NFT_COLL_OWNER_ADDRESS,
  limit = 300,
  useTestNet = false,
) => {
  const options = { method: "GET", headers: { Accept: "application/json" } };
  const fetchStr = `https://${
    useTestNet ? "testnets-api" : "api"
  }.opensea.io/api/v1/collections?asset_owner=${ownerAddress}&offset=0&limit=${limit}`;
  try {
    const response = await fetch(fetchStr, options);
    const json = await response.json();
    return json;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const openseaGetCollectionsWithAddress = async (ownerAddress = DEMO_NFT_COLL_OWNER_ADDRESS, limit = 300) => {
  const openseaColls = await openseaGetCollections(ownerAddress, limit);
  log("openseaColls", _.size(openseaColls));

  const openseaCollsWithAddress = _.filter(openseaColls, function (c) {
    return (
      c.primary_asset_contracts &&
      c.primary_asset_contracts.length > 0 &&
      c.primary_asset_contracts[0].address &&
      (c.primary_asset_contracts[0].opensea_seller_fee_basis_points > 0 ||
        c.primary_asset_contracts[0].dev_seller_fee_basis_points > 0) &&
      c.primary_asset_contracts[0].asset_contract_type === "non-fungible"
    );
  });
  log("openseaCollsWithAddress", _.size(openseaCollsWithAddress));

  const filteredOpenseaColls = _.take(_.orderBy(openseaCollsWithAddress, ["stats.total_sales"], ["desc"]), 20);
  log("filteredOpenseaColls", _.size(filteredOpenseaColls));
  return filteredOpenseaColls;
};

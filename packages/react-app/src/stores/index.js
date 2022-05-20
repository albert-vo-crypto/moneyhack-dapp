import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import _ from "lodash";

import appContextReducer from "./reducers/appContext";
import nftReducer, {
  nftBidableCollectionsSelector,
  nftTradingCollectionsMapSelector,
  nftSelectedCollectionSelector,
} from "./reducers/nft";
import logger from "./middlewares/logger";
import processor from "./middlewares/processor";
import { appContextCurrentSignerAddressSelector } from "./reducers/appContext";
import { TEST_CREATOR_NFT_COLL_OWNER_ADDRESS, DEMO_CREATOR_NFT_COLL_OWNER_ADDRESS } from "../constants";
import { log } from "../utils/commons";

const combinedReducer = combineReducers({
  appContext: appContextReducer,
  nft: nftReducer,
});

export const makeStore = () =>
  configureStore({
    reducer: combinedReducer,
    middleware: [logger, processor],
  });

export const store = makeStore();

// Selectors ================================================================

export const activeBidableNftCollectionsSelector = createSelector(nftBidableCollectionsSelector, colls => {
  return _.orderBy(
    _.filter(colls, obj => obj?.isActive),
    //["listedAt", "historicalDatas.stats.ethTotalRoyaltyRevenue"],
    ["historicalDatas.stats.ethTotalRoyaltyRevenue"],
    //["desc", "desc"],
    ["desc"],
  );
});

export const selectedTradingCollectionSelector = createSelector(
  nftSelectedCollectionSelector,
  nftTradingCollectionsMapSelector,
  (selectedColl, nftTradingCollectionsMap) => {
    const tradingCollections = _.values(nftTradingCollectionsMap);
    return _.filter(tradingCollections, coll => coll?.collectionAddress === selectedColl?.collectionAddress);
  },
);

export const registeredCollectionsOfCurrentSignerSelector = createSelector(
  appContextCurrentSignerAddressSelector,
  nftTradingCollectionsMapSelector,
  (signerAddress, nftTradingCollectionsMap) => {
    const tradingCollections = _.values(nftTradingCollectionsMap);
    return _.filter(
      tradingCollections,
      coll => coll?.ownerAddress === signerAddress || coll?.signerAddress === signerAddress,
    );
  },
);

export const investedCollectionsOfCurrentSignerSelector = createSelector(
  appContextCurrentSignerAddressSelector,
  nftTradingCollectionsMapSelector,
  (signerAddress, nftTradingCollectionsMap) => {
    const tradingCollections = _.values(nftTradingCollectionsMap);
    return _.filter(tradingCollections, coll => _.some(coll?.bidDetails, { investorAddress: signerAddress }));
  },
);

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import _ from "lodash";

import appContextReducer from "./reducers/appContext";
import nftReducer, { nftBidableCollectionsSelector } from "./reducers/nft";
import logger from "./middlewares/logger";
import processor from "./middlewares/processor";

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
    ["listedAt"],
    ["desc"],
  );
});

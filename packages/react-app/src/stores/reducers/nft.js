import { createSlice, createAction } from "@reduxjs/toolkit";
import _ from "lodash";

import { log } from "../../utils/commons";

const initialState = {
  creatorCollections: [],
  bidableCollections: [],
  selectedCollection: null,
  collectionDetailsMap: {},
  tradingCollectionsMap: {},
};

const slice = createSlice({
  name: "nft",
  initialState,
  reducers: {
    creatorCollectionsUpdatedAction: (state, action) => {
      state.creatorCollections = action?.payload && _.size(action.payload) > 0 ? [...action.payload] : [];
    },
    bidableCollectionsUpdatedAction: (state, action) => {
      state.bidableCollections = action?.payload && _.size(action.payload) > 0 ? [...action.payload] : [];
    },
    selectedCollectionUpdatedAction: (state, action) => {
      state.selectedCollection = action?.payload ? _.cloneDeep(action.payload) : null;
    },
    collectionDetailUpdatedAction: (state, action) => {
      const collAddress = _.get(action, "payload.collAddress");
      if (collAddress) {
        state.collectionDetailsMap[collAddress] = _.get(action, "payload.items");
      }
    },
    tradingCollectionUpdatedAction: (state, action) => {
      if (action?.payload && action.payload?.collectionAddress) {
        state.tradingCollectionsMap[action.payload?.collectionAddress] = _.cloneDeep(action.payload);
      }
    },
  },
});

export const {
  creatorCollectionsUpdatedAction,
  bidableCollectionsUpdatedAction,
  selectedCollectionUpdatedAction,
  collectionDetailUpdatedAction,
  tradingCollectionUpdatedAction,
} = slice.actions;
export const reloadBidableCollectionsAction = createAction("nft/reloadBidableCollectionsAction");
export const addBidableCollectionAction = createAction("nft/addBidableCollectionAction");

export const nftStateSelector = state => state.nft;
export const nftCreatorCollectionsSelector = state => state.nft.creatorCollections;
export const nftBidableCollectionsSelector = state => state.nft.bidableCollections;
export const nftSelectedCollectionSelector = state => state.nft.selectedCollection;
export const nftCollectionDetailsMapSelector = state => state.nft.collectionDetailsMap;
export const nftTradingCollectionsMapSelector = state => state.nft.tradingCollectionsMap;

export default slice.reducer;

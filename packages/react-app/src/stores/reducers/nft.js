import { createSlice, createAction } from "@reduxjs/toolkit";
import _ from "lodash";

const initialState = {
  creatorCollections: [],
  bidableCollections: [],
  selectedCollection: null,
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
  },
});

export const { creatorCollectionsUpdatedAction, bidableCollectionsUpdatedAction, selectedCollectionUpdatedAction } =
  slice.actions;
export const reloadBidableCollectionsAction = createAction("nft/reloadBidableCollectionsAction");
export const addBidableCollectionAction = createAction("nft/addBidableCollectionAction");

export const nftStateSelector = state => state.nft;
export const nftCreatorCollectionsSelector = state => state.nft.creatorCollections;
export const nftBidableCollectionsSelector = state => state.nft.bidableCollections;
export const nftselectedCollectionSelector = state => state.nft.selectedCollection;

export default slice.reducer;

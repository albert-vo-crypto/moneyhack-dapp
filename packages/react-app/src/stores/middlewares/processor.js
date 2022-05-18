import _ from "lodash";

import {
  reloadBidableCollectionsAction,
  bidableCollectionsUpdatedAction,
  creatorCollectionsUpdatedAction,
  addBidableCollectionAction,
} from "../reducers/nft";
import { currentSignerAddressUpdatedAction } from "../reducers/appContext";
import { openseaGetCollections, openseaGetCollectionsWithAddress } from "../../utils/openseahelper";
import {
  getRevefinFromOpenseaCollection,
  mockBidableFromOpenseaCollection,
  getBidableFromRevefinCollection,
} from "../../models/nftcollection";
import { DEMO_CREATOR_NFT_COLL_OWNER_ADDRESS, LOCAL_OWNER_ADDRESS_TO_SKIP } from "../../constants";
import { log } from "../../utils/commons";
import { covalentGetCollectionsWithHistorialDatas } from "../../utils/covalenthelper";

const processor =
  ({ dispatch, getState }) =>
  next =>
  async action => {
    try {
      log("processing", action.type);
      if (action.type === reloadBidableCollectionsAction.type) {
        const openseaColls = await openseaGetCollectionsWithAddress();
        const collsWithHistoricalDatas = await covalentGetCollectionsWithHistorialDatas(openseaColls);
        const bidableColls = collsWithHistoricalDatas.map(coll => {
          const bColl = mockBidableFromOpenseaCollection(coll);
          return bColl;
        });
        dispatch(bidableCollectionsUpdatedAction(bidableColls));
      } else if (action.type === currentSignerAddressUpdatedAction.type) {
        if (action.payload === null) {
          dispatch(creatorCollectionsUpdatedAction([]));
        } else {
          reloadCreatorNFTCollections(dispatch, getState, action.payload);
        }
      } else if (action.type === addBidableCollectionAction.type) {
        if (
          action &&
          action.payload &&
          action.payload.collection &&
          action.payload.ownerAddress &&
          action.payload.fractionForSale
        ) {
          addBidableCollection(
            dispatch,
            getState,
            action.payload.collection,
            action.payload.ownerAddress,
            action.payload.fractionForSale,
          );
        } else {
          throw new Error(`addBidableCollectionAction: invalid payload ${action.payload}`);
        }
      }
    } catch (err) {
      console.error(err);
    }
    next(action);
  };

const reloadCreatorNFTCollections = async (dispatch, getState, ownerAddress) => {
  const openseaColls = await openseaGetCollections(ownerAddress);
  if (_.size(openseaColls) > 5 && ownerAddress !== LOCAL_OWNER_ADDRESS_TO_SKIP) {
    const revefinColls = openseaColls.map(coll => {
      const rColl = getRevefinFromOpenseaCollection(coll);
      return rColl;
    });
    dispatch(creatorCollectionsUpdatedAction(revefinColls));
  } else {
    //TODO: remove this hack
    //For NFT collection is available from this ownerAddress
    //For demo purpose, sub the collections from a test ownerAddress instead
    log("reloadCreatorNFTCollections with DEMO_CREATOR_NFT_COLL_OWNER_ADDRESS", DEMO_CREATOR_NFT_COLL_OWNER_ADDRESS);
    const openseaColls = await openseaGetCollections(DEMO_CREATOR_NFT_COLL_OWNER_ADDRESS);
    const revefinColls = openseaColls.map(coll => {
      const rColl = getRevefinFromOpenseaCollection(coll);
      return rColl;
    });
    dispatch(creatorCollectionsUpdatedAction(revefinColls));
  }
};

const addBidableCollection = async (dispatch, getState, collection, ownerAddress, fractionForSale) => {
  const bidableColl = getBidableFromRevefinCollection(collection, ownerAddress, fractionForSale);
  log("addBidableCollection", bidableColl);
  dispatch(bidableCollectionsUpdatedAction([...getState().nft.bidableCollections, bidableColl]));
};

export default processor;

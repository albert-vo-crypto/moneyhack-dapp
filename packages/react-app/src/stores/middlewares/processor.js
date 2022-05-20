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
import { TEST_CREATOR_NFT_COLL_OWNER_ADDRESS, DEMO_CREATOR_NFT_COLL_OWNER_ADDRESS } from "../../constants";
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
        const filteredColls = collsWithHistoricalDatas.filter(coll => {
          return coll && coll.historicalDatas && coll.historicalDatas.stats;
        });
        const bidableColls = filteredColls.map(coll => {
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
        if (action && action.payload && action.payload.collection && action.payload.fractionForSale) {
          addBidableCollection(dispatch, getState, action.payload.collection, action.payload.fractionForSale);
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
  //TODO: remove this hack
  //Load Test Owner's collection from testnet
  const openseaCollsTest = await openseaGetCollections(TEST_CREATOR_NFT_COLL_OWNER_ADDRESS, 300, true);
  //Load Demo creator's collection from mainnet
  const openseaCollsDemo = await openseaGetCollections(DEMO_CREATOR_NFT_COLL_OWNER_ADDRESS);
  //Load ownerAddress's collection from testnet
  const openseaCollsThis = await openseaGetCollections(ownerAddress);

  const bidableCollections = getState()?.nft?.bidableCollections;
  const mockHistoricalDatas = bidableCollections ? bidableCollections[0]?.historicalDatas : null;

  const openseaColls = [...openseaCollsTest, ...openseaCollsDemo, ...openseaCollsThis];
  const revefinColls = openseaColls.map(coll => {
    const rColl = getRevefinFromOpenseaCollection(coll);
    return _.assign(rColl, { historicalDatas: mockHistoricalDatas });
  });
  log({ revefinColls });
  dispatch(creatorCollectionsUpdatedAction(revefinColls));
};

const addBidableCollection = async (dispatch, getState, collection, fractionForSale) => {
  const bidableColl = getBidableFromRevefinCollection(collection, fractionForSale);
  log("addBidableCollection", bidableColl);
  dispatch(bidableCollectionsUpdatedAction([...getState().nft.bidableCollections, bidableColl]));
};

export default processor;

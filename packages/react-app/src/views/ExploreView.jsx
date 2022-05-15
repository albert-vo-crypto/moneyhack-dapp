import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

//import { reloadBidableCollectionsAction } from "../stores/reducers/nft";
import { activeBidableNftCollectionsSelector } from "../stores";
import NFTCollectionCardsList from "../components/NFT/NFTCollectionCardsList";
import HeaderText from "../components/Commons/HeaderText";

const ExploreView = () => {
  //const dispatch = useDispatch();

  const nftCollections = useSelector(activeBidableNftCollectionsSelector);

  return (
    <div>
      <HeaderText children="NFT Collections With Investment Opportunity" />
      <NFTCollectionCardsList nftCollections={nftCollections} />
    </div>
  );
};

export default ExploreView;

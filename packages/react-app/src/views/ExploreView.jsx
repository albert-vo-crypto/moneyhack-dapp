import React from "react";
import { useSelector } from "react-redux";

import { activeBidableNftCollectionsSelector } from "../stores";
import NFTCollectionCardsList from "../components/NFT/NFTCollectionCardsList";
import HeaderText from "../components/Commons/HeaderText";

const ExploreView = () => {
  const nftCollections = useSelector(activeBidableNftCollectionsSelector);

  return (
    <div>
      <HeaderText children="NFT Collections With Investment Opportunity" />
      <NFTCollectionCardsList nftCollections={nftCollections} />
    </div>
  );
};

export default ExploreView;

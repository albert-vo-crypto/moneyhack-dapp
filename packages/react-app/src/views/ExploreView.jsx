import React from "react";
import { useSelector } from "react-redux";
import { Spin } from "antd";
import _ from "lodash";

import { activeBidableNftCollectionsSelector } from "../stores";
import HeaderText from "../components/Commons/HeaderText";
import NFTCollectionDetailsList from "../components/NFT/NFTCollectionDetailsList";

const ExploreView = () => {
  const nftCollections = useSelector(activeBidableNftCollectionsSelector);

  return (
    <div>
      <HeaderText children="Revenue Streams for Sale" />
      {_.size(nftCollections) > 0 ? (
        <NFTCollectionDetailsList nftCollections={nftCollections} />
      ) : (
        <div class="grid place-items-center h-[70vh]">
          <Spin tip="Loading..." size="large" />
        </div>
      )}
    </div>
  );
};

export default ExploreView;

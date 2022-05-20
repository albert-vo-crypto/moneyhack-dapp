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
    <div className="mt-10">
      <div className="text-left pb-5 border-b border-gray-200">
      <HeaderText children="Revenue Streams for Sale" />
      </div>
 
      <div className=" bg-gray-100 rounded-lg shadow">
        {_.size(nftCollections) > 0 ? (
          <NFTCollectionDetailsList nftCollections={nftCollections} />
        ) : (
          <div class="grid place-items-center h-[70vh]">
            <Spin tip="Loading..." size="large" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreView;

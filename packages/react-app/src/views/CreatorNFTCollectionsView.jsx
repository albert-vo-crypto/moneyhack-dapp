import React from "react";
import { useSelector } from "react-redux";
import _ from "lodash";
import { Spin } from "antd";

import { appContextCurrentSignerAddressSelector } from "../stores/reducers/appContext";
import { nftCreatorCollectionsSelector } from "../stores/reducers/nft";
import HeaderText from "../components/Commons/HeaderText";
import NFTCollectionDetailsList from "../components/NFT/NFTCollectionDetailsList";

const CreatorNFTCollectionsView = () => {
  const address = useSelector(appContextCurrentSignerAddressSelector);
  const nftCollections = useSelector(nftCreatorCollectionsSelector);

  return (
    <div className="mt-10">
      <div className="text-left pb-5 border-b border-gray-200">
        <HeaderText children="Select your NFT Collections to list" />
      </div>
      {address ? (
        <div>
          {_.size(nftCollections) > 0 ? (
            <NFTCollectionDetailsList nftCollections={nftCollections} />
          ) : (
            <div class="grid place-items-center h-[70vh]">
              <Spin tip="Loading..." size="large" />
            </div>
          )}
        </div>
      ) : (
        <div class="grid place-items-center h-[70vh]">
          <HeaderText children="Please connect wallet with owner account" />
        </div>
      )}
    </div>
  );
};

export default CreatorNFTCollectionsView;

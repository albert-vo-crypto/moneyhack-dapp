import React from "react";
import { useSelector } from "react-redux";
import _ from "lodash";

import { appContextCurrentSignerAddressSelector } from "../stores/reducers/appContext";
import { nftCreatorCollectionsSelector } from "../stores/reducers/nft";
import NFTCollectionCardsList from "../components/NFT/NFTCollectionCardsList";
import HeaderText from "../components/Commons/HeaderText";

const CreatorNFTCollectionsView = () => {
  const address = useSelector(appContextCurrentSignerAddressSelector);
  const nftCollections = useSelector(nftCreatorCollectionsSelector);

  return (
    <div>
      <HeaderText children="Select your NFT Collections to list on ReveFin" />
      {address ? (
        _.size(nftCollections) > 0 ? (
          <div>
            <NFTCollectionCardsList nftCollections={nftCollections} />
          </div>
        ) : (
          <div class="grid place-items-center h-[70vh]">
            <HeaderText children="Loading NFT collections" />
          </div>
        )
      ) : (
        <div class="grid place-items-center h-[70vh]">
          <HeaderText children="Please connect wallet with owner account" />
        </div>
      )}
    </div>
  );
};

export default CreatorNFTCollectionsView;

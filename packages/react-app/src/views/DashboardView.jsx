import React from "react";
import { useSelector } from "react-redux";
import _ from "lodash";
import { Spin } from "antd";

import { appContextCurrentSignerAddressSelector } from "../stores/reducers/appContext";
import { nftCreatorCollectionsSelector } from "../stores/reducers/nft";
import HeaderText from "../components/Commons/HeaderText";
import NFTCollectionDetailsList from "../components/NFT/NFTCollectionDetailsList";
import { registeredCollectionsOfCurrentSignerSelector, investedCollectionsOfCurrentSignerSelector } from "../stores";

const DashboardView = () => {
  const address = useSelector(appContextCurrentSignerAddressSelector);
  const registeredCollection = useSelector(registeredCollectionsOfCurrentSignerSelector);
  const investedCollection = useSelector(investedCollectionsOfCurrentSignerSelector);

  return (
    <div>
      <HeaderText children="Dashboard" />
      {address ? (
        <div>
          {_.size(registeredCollection) > 0 || _.size(investedCollection) > 0 ? (
            <NFTCollectionDetailsList nftCollections={[...registeredCollection, ...investedCollection]} />
          ) : (
            <div class="grid place-items-center h-[70vh]">
              <HeaderText children="Time to start trading" />
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

export default DashboardView;

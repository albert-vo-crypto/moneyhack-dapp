import React from "react";
import { useSelector } from "react-redux";
import _ from "lodash";
import { Spin } from "antd";

import { appContextCurrentSignerAddressSelector } from "../stores/reducers/appContext";
import { nftCreatorCollectionsSelector } from "../stores/reducers/nft";
import HeaderText from "../components/Commons/HeaderText";
import NFTCollectionTradingsList from "../components/NFT/NFTCollectionTradingsList";
import { registeredCollectionsOfCurrentSignerSelector, investedCollectionsOfCurrentSignerSelector } from "../stores";

const DashboardView = ({ ethPrice }) => {
  const address = useSelector(appContextCurrentSignerAddressSelector);
  const registeredCollection = useSelector(registeredCollectionsOfCurrentSignerSelector);
  const investedCollection = useSelector(investedCollectionsOfCurrentSignerSelector);

  return (
    <div>
      <HeaderText children="Dashboard" />
      {address ? (
        <div>
          {_.size(registeredCollection) > 0 ? (
            <div>
              <h1>Listed for sale</h1>
              <NFTCollectionTradingsList nftCollections={registeredCollection} ethPrice={ethPrice} opMode="creator" />
            </div>
          ) : null}
          {_.size(investedCollection) > 0 ? (
            <div>
              <h1>Bid placed</h1>
              <NFTCollectionTradingsList nftCollections={investedCollection} ethPrice={ethPrice} opMode="investor" />
            </div>
          ) : null}
          {_.size(registeredCollection) === 0 && _.size(investedCollection) === 0 ? (
            <div class="grid place-items-center h-[70vh]">
              <HeaderText children="Time to start trading" />
            </div>
          ) : null}
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

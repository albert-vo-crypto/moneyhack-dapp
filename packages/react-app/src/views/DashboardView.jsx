import React from "react";
import { useSelector } from "react-redux";
import _ from "lodash";
import { Spin } from "antd";

import { appContextCurrentSignerAddressSelector } from "../stores/reducers/appContext";
import { nftCreatorCollectionsSelector } from "../stores/reducers/nft";
import HeaderText from "../components/Commons/HeaderText";
import NFTCollectionTradingsList from "../components/NFT/NFTCollectionTradingsList";
import {
  forSaleCollectionsOfCurrentSignerSelector,
  soldCollectionsOfCurrentSignerSelector,
  biddedCollectionsOfCurrentSignerSelector,
  boughtCollectionsOfCurrentSignerSelector,
} from "../stores";
import { Tabs } from "antd";
import { log } from "../utils/commons";

const DashboardView = ({ ethPrice }) => {
  const address = useSelector(appContextCurrentSignerAddressSelector);
  const forSaleCollections = useSelector(forSaleCollectionsOfCurrentSignerSelector);
  const soldCollections = useSelector(soldCollectionsOfCurrentSignerSelector);
  const biddedCollections = useSelector(biddedCollectionsOfCurrentSignerSelector);
  const boughtCollections = useSelector(boughtCollectionsOfCurrentSignerSelector);
  log({ forSaleCollections }); //!!!

  const { TabPane } = Tabs;
  function callback(key) {
    console.log(key);
  }
  return (
    <div className="mt-10">
      <div className="text-left pb-2 border-b border-gray-200">
        <HeaderText children="Dashboard" />
      </div>
      <div className="bg-white p-10">
        {address ? (
          <div>
            <Tabs defaultActiveKey="1" onChange={callback}>
              <TabPane tab="For Sale" key="1">
                <NFTCollectionTradingsList nftCollections={forSaleCollections} ethPrice={ethPrice} opMode="creator" />
              </TabPane>
              <TabPane tab="Sold" key="2">
                <NFTCollectionTradingsList nftCollections={soldCollections} ethPrice={ethPrice} opMode="creator" />
              </TabPane>
              <TabPane tab="Bids" key="3">
                <NFTCollectionTradingsList nftCollections={biddedCollections} ethPrice={ethPrice} opMode="investor" />
              </TabPane>
              <TabPane tab="Bought" key="4">
                <NFTCollectionTradingsList nftCollections={boughtCollections} ethPrice={ethPrice} opMode="investor" />
              </TabPane>
            </Tabs>
          </div>
        ) : (
          <div class="grid place-items-center h-[70vh]">
            <HeaderText children="Please connect wallet with owner account" />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardView;

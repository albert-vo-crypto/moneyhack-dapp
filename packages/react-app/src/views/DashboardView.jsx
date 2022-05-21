import React from "react";
import { useSelector } from "react-redux";
import _ from "lodash";
import { Spin } from "antd";

import { appContextCurrentSignerAddressSelector } from "../stores/reducers/appContext";
import { nftCreatorCollectionsSelector } from "../stores/reducers/nft";
import HeaderText from "../components/Commons/HeaderText";
import NFTCollectionTradingsList from "../components/NFT/NFTCollectionTradingsList";
import { registeredCollectionsOfCurrentSignerSelector, investedCollectionsOfCurrentSignerSelector } from "../stores";
import { Tabs } from 'antd';


const DashboardView = ({ ethPrice }) => {
  const address = useSelector(appContextCurrentSignerAddressSelector);
  const registeredCollection = useSelector(registeredCollectionsOfCurrentSignerSelector);
  const investedCollection = useSelector(investedCollectionsOfCurrentSignerSelector);


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
                <NFTCollectionTradingsList nftCollections={registeredCollection} ethPrice={ethPrice} opMode="creator" />
              </TabPane>
              <TabPane tab="Sold" key="2">
                Content of Tab Pane 2
              </TabPane>
              <TabPane tab="Bids" key="3">
                <NFTCollectionTradingsList nftCollections={investedCollection} ethPrice={ethPrice} opMode="investor" />
              </TabPane>
              <TabPane tab="Bought" key="4">
                Content of Tab Pane 4
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

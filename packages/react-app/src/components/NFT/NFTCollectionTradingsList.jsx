import React from "react";
import { Table } from "antd";
import _ from "lodash";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

import { selectedCollectionUpdatedAction } from "../../stores/reducers/nft";
import {
  ROUTE_PATH_BID_REVENUE_STREAM,
  ROUTE_PATH_EXPLORE_REVENUE_STREAMS,
  ROUTE_PATH_REG_REVENUE_STREAM,
  ROUTE_PATH_EXPLORE_CREATOR_COLLECTIONS,
} from "../../constants";
import NFTImagesBar from "./NFTImagesBar";
import { getFormatedCurrencyValue } from "../../utils/commons";
import SecondaryButton from "../Buttons/SecondaryButton";
import HighlightButton from "../Buttons/HighlightButton";

const NFTCollectionTradingsList = ({ nftCollections, ethPrice, opMode = "creator" }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();

  const goToAcceptBidNextSteps = coll => {
    dispatch(selectedCollectionUpdatedAction(coll));
    //TODO: history.push(ROUTE_PATH_BID_NEXT_STEPS);
  };

  const columns = [
    {
      title: "Art",
      dataIndex: "imageSrc",
      key: "imageSrc",
      render: (imageSrc, nftCollection) => {
        return (
          <div class="group block w-[20vw] aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-primary overflow-hidden">
            <img src={imageSrc} alt="" class="object-cover pointer-events-none group-hover:opacity-75" />
          </div>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Prior Period Revnue (ETH)",
      dataIndex: "historicalDatas.stats.ethTotalRoyaltyRevenue",
      key: "historicalDatas.stats.ethTotalRoyaltyRevenue",
      render: (value, nftCollection) => {
        const val = nftCollection?.historicalDatas?.stats?.ethTotalRoyaltyRevenue || 0;
        return <h3>{val >= 0.0001 ? val?.toFixed(4) : val}</h3>;
      },
    },
    {
      title: "Fraction For Sale",
      dataIndex: "fractionForSale",
      key: "fractionForSale",
      render: (rating, nftCollection) => {
        return <h3 class="text-center">{rating?.toFixed(4)}</h3>;
      },
    },
    {
      title: "Status",
      dataIndex: "bidDetails",
      key: "bidDetails",
      render: (bidDetails, nftCollection) => {
        if (nftCollection && nftCollection.bidDetails && nftCollection.bidDetails.length > 0) {
          const bidDetail = nftCollection.bidDetails[0];
          const bidStatus = bidDetail?.status || "Status";
          return <h3 class="text-center">{bidStatus}</h3>;
        } else {
          return <h3>No bid yet</h3>;
        }
      },
    },
    {
      title: "Highest Bid (ETH)",
      dataIndex: "bidDetails",
      key: "bidDetails",
      render: (bidDetails, nftCollection) => {
        if (nftCollection && nftCollection.bidDetails && nftCollection.bidDetails.length > 0) {
          const bidDetail = nftCollection.bidDetails[0];
          const bidAmount = bidDetail.bidPriceInETH || 0;
          return <h3 class="text-center">{getFormatedCurrencyValue(bidAmount)}</h3>;
        } else {
          return <h3></h3>;
        }
      },
    },
    {
      title: "Highest Bid (USD)",
      dataIndex: "bidDetails",
      key: "bidDetails",
      render: (bidDetails, nftCollection) => {
        if (nftCollection && nftCollection.bidDetails && nftCollection.bidDetails.length > 0) {
          const bidDetail = nftCollection.bidDetails[0];
          const bidAmountUSD = bidDetail.bidPriceInETH * ethPrice || 0;
          return <h3 class="text-center">{"$" + getFormatedCurrencyValue(bidAmountUSD)}</h3>;
        } else {
          return <h3></h3>;
        }
      },
    },
    {
      title: "Inventor",
      dataIndex: "bidDetails",
      key: "bidDetails",
      render: (bidDetails, nftCollection) => {
        if (nftCollection && nftCollection.bidDetails && nftCollection.bidDetails.length > 0) {
          const bidDetail = nftCollection.bidDetails[0];
          const investorAddress = bidDetail.investorAddress || "0x01";
          return <h3 class="text-center">{_.truncate(investorAddress, { length: 8 })}</h3>;
        } else {
          return <h3></h3>;
        }
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (value, nftCollection) => {
        if (nftCollection && nftCollection.bidDetails && nftCollection.bidDetails.length > 0) {
          return opMode === "creator" ? (
            <SecondaryButton
              onClick={() => {
                goToAcceptBidNextSteps(nftCollection);
              }}
              children={"Accept Bid Offer"}
            />
          ) : (
            <HighlightButton
              onClick={() => {
                //TODO: to be implemented
              }}
              children={"Withdraw Bid Offer"}
            />
          );
        } else {
          return <h3></h3>;
        }
      },
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={nftCollections}
        pagination={false}
        onRow={(record, rowIndex) => {
          return {
            onClick: async event => {
              if (location?.pathname === ROUTE_PATH_EXPLORE_REVENUE_STREAMS) {
                await dispatch(selectedCollectionUpdatedAction(record));
                history.push(ROUTE_PATH_BID_REVENUE_STREAM);
              } else if (location?.pathname === ROUTE_PATH_EXPLORE_CREATOR_COLLECTIONS) {
                await dispatch(selectedCollectionUpdatedAction(record));
                history.push(ROUTE_PATH_REG_REVENUE_STREAM);
              }
            }, // click row
          };
        }}
        expandable={{
          expandedRowRender: record => <NFTImagesBar nftCollection={record} />,
          rowExpandable: record => true,
        }}
      />
    </div>
  );
};

export default NFTCollectionTradingsList;

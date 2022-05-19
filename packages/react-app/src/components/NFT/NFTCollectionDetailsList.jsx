import React from "react";
import { Table } from "antd";
import _ from "lodash";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

import { selectedCollectionUpdatedAction } from "../../stores/reducers/nft";
import { ROUTE_PATH_BID_REVENUE_STREAM, ROUTE_PATH_EXPLORE_REVENUE_STREAMS } from "../../constants";
import NFTImagesBar from "./NFTImagesBar";

const NFTCollectionDetailsList = ({ nftCollections }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();

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
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating, nftCollection) => {
        return <h3 class="text-center">B</h3>;
      },
    },
    {
      title: "Revenue Period (months)",
      dataIndex: "revenuePeriod",
      key: "revenuePeriod",
      render: (revenuePeriod, nftCollection) => {
        return <h3>12</h3>;
      },
    },
    {
      title: "Prior Period Revnue (ETH)",
      dataIndex: "historicalDatas.stats.ethTotalRoyaltyRevenue",
      key: "historicalDatas.stats.ethTotalRoyaltyRevenue",
      render: (value, nftCollection) => {
        const val = nftCollection?.historicalDatas?.stats?.ethTotalRoyaltyRevenue || 0;
        return <h3>{val >= 0.0001 ? val?.toFixed(4) : val}</h3>;
      },
      defaultSortOrder: "descend",
      sorter:
        location?.pathname === ROUTE_PATH_EXPLORE_REVENUE_STREAMS
          ? (a, b) =>
              a.historicalDatas?.stats?.ethTotalRoyaltyRevenue - b.historicalDatas?.stats?.ethTotalRoyaltyRevenue
          : null,
    },
    {
      title: "Floor Volume (ETH)",
      dataIndex: "historicalDatas.stats.ethFloorVolume",
      key: "historicalDatas.stats.ethFloorVolume",
      render: (value, nftCollection) => {
        const val = nftCollection?.historicalDatas?.stats?.ethFloorVolume || 0;
        return <h3>{val >= 0.0001 ? val?.toFixed(4) : val}</h3>;
      },
    },
    {
      title: "Coef. of Variation",
      dataIndex: "historicalDatas.stats.ethCoefofVariationRoyaltyRevenue",
      key: "historicalDatas.stats.ethCoefofVariationRoyaltyRevenue",
      render: (value, nftCollection) => {
        const val = nftCollection?.historicalDatas?.stats?.ethCoefofVariationRoyaltyRevenue || 0;
        return <h3>{val > 0.0001 ? val?.toFixed(4) : val}</h3>;
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (value, nftCollection) => {
        const val = nftCollection?.description || "";
        return <h3>{_.truncate(val, { length: 200 })}</h3>;
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

export default NFTCollectionDetailsList;

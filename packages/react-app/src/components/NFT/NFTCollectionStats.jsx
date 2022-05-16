import React from "react";

import NFTCollectionStatsLabel from "./NFTCollectionStatsLabel";

const NFTCollectionStats = ({ nftCollection }) => {
  return (
    <div>
      {/*
      <h3 class="text-left text-lg leading-6 font-medium text-gray-900">Last 30 days</h3>
      <dl class="mt-5 grid grid-cols-1 rounded-lg overflow-hidden md:grid-cols-3">
        <NFTCollectionStatsLabel
          title={"Volume"}
          primaryText={nftCollection?.stats?.thirty_day_volume?.toFixed(2)}
          percentageChanged={nftCollection?.stats?.thirty_day_change}
        />
        <NFTCollectionStatsLabel title={"#Sales"} primaryText={nftCollection?.stats?.thirty_day_sales} />
        <NFTCollectionStatsLabel
          title={"Avg. Price"}
          primaryText={nftCollection?.stats?.thirty_day_average_price?.toFixed(4)}
        />
          </dl>
        */}
      <h3 class="text-left text-lg leading-6 font-medium text-gray-900">Stats</h3>
      <dl class="mt-5 grid grid-cols-1 rounded-lg overflow-hidden md:grid-cols-3">
        <NFTCollectionStatsLabel title={"Volume"} primaryText={nftCollection?.stats?.total_volume?.toFixed(2)} />
        <NFTCollectionStatsLabel title={"#Sales"} primaryText={nftCollection?.stats?.total_sales} />
        <NFTCollectionStatsLabel title={"Avg. Price"} primaryText={nftCollection?.stats?.average_price?.toFixed(4)} />
      </dl>
    </div>
  );
};

export default NFTCollectionStats;

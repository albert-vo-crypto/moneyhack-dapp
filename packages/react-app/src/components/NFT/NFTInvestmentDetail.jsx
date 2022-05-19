import React from "react";
import NFTRevenueScheduleChart from "./NFTRevenueScheduleChart";
import NFTHistoricalRevenueChart from "./NFTHistoricalRevenueChart";

const NFTInvestmentDetail = ({ nftCollection, rev, bidAmount }) => {
  return (
    <div class="w-full">
      <div class="grid grid-cols-2 place-items-center">
        <NFTHistoricalRevenueChart nftCollection={nftCollection} />
        <NFTRevenueScheduleChart rev={rev} bidAmount={bidAmount} />
      </div>
    </div>
  );
};

export default NFTInvestmentDetail;

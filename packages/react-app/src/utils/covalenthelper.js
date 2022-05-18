import axios from "axios";
import axiosRetry from "axios-retry";
import "dotenv/config";
import _ from "lodash";
import moment from "moment";

import { COVALENT_TARGET_BLOCKCHAIN_ID } from "../constants";
import { log } from "./commons";

const { ethers } = require("ethers");

axiosRetry(axios, {
  retries: 3,
  retryDelay: retryCount => {
    console.log(`retry attempt: ${retryCount}`);
    return retryCount * 2000;
  },
  retryCondition: error => {
    return error.response.status === 503;
  },
});

export const getCollectionDetailItemsBetweenDate = (items, startDateStr, endDateStr) => {
  return _.filter(items, item => {
    return item?.opening_date >= startDateStr && item?.opening_date < endDateStr;
  });
};

export const getStatsOfItems = items => {
  return _.reduce(
    items,
    (acc, item) => {
      acc.totalWeiVolume = acc.totalWeiVolume.add(item?.volume_wei_day);
      return acc;
    },
    { totalWeiVolume: ethers.utils.parseEther("0") },
  );
};

export const getTwelveMonthStatsFromItems = (items, percRoyaltyCreator) => {
  const startOfMonthStr = moment(moment().format("YYYY-MM")).format("YYYY-MM-DD");
  const twelveMonthsAgoStr = moment(startOfMonthStr).subtract(12, "month").format("YYYY-MM-DD");
  const twelveMonthItems = _.filter(items, item => {
    return item?.opening_date >= twelveMonthsAgoStr && item?.opening_date < startOfMonthStr;
  });
  let itemsGroupedByMonthMap = _.groupBy(twelveMonthItems, item => {
    return moment(item?.opening_date, "YYYY-MM-DD").format("YYYY-MM");
  });

  const twelveMonthStats = _.reduce(
    itemsGroupedByMonthMap,
    (acc, items, groupedKey) => {
      const groupedStats = getStatsOfItems(items);
      groupedStats.ethTotalRoyaltyRevenue = +ethers.utils.formatEther(
        groupedStats.totalWeiVolume.mul(percRoyaltyCreator),
      );
      acc.ethTotalRoyaltyRevenue = acc.ethTotalRoyaltyRevenue + groupedStats.ethTotalRoyaltyRevenue;
      acc.ethRoyaltyRevenues.push(groupedStats.ethTotalRoyaltyRevenue);

      if (!acc.ethMinGroupedRoyaltyRevenue || groupedStats.ethTotalRoyaltyRevenue < acc.ethMinGroupedRoyaltyRevenue) {
        acc.ethMinGroupedRoyaltyRevenue = groupedStats.ethTotalRoyaltyRevenue;
      }
      acc[groupedKey] = groupedStats;
    },
    { ethTotalRoyaltyRevenue: 0, ethMinGroupedRoyaltyRevenue: null, ethRoyaltyRevenues: [] },
  );

  twelveMonthStats.floorVolume = twelveMonthStats.ethMinGroupedRoyaltyRevenue * 12.0;
  log({ twelveMonthStats });

  return twelveMonthStats;
};

export const covalentGetCollectionDetail = async (collAddress, opensea_seller_fee_basis_points = 500) => {
  try {
    const resp = await axios.get(
      `https://api.covalenthq.com/v1/${COVALENT_TARGET_BLOCKCHAIN_ID}/nft_market/collection/${collAddress}/`,
      {
        auth: { username: process.env.REACT_APP_COVALENT_API_KEY },
      },
    );

    //TODO: historical stats calculation
    const percRoyaltyCreator = opensea_seller_fee_basis_points / (100 * 100);
    //const items12Months = get12MonthsOfCollectionDetailItemsFrom(resp?.data?.data?.items);
    //log({ items12Months: _.size(items12Months) });

    //"opening_date":"2022-04-06"
    //"volume_wei_day":"1243935000000000000000"

    const stats = getTwelveMonthStatsFromItems(resp?.data?.data?.items, percRoyaltyCreator);

    const detail = {
      collAddress,
      stats,
      items: [...resp?.data?.data?.items],
    };
    return detail;
  } catch (err) {
    console.error(err);
  }
};

export const covalentGetCollectionsWithHistorialDatas = async colls => {
  const collsWithHistoricalDatas = await Promise.all(
    colls.map(async coll => {
      if (
        coll &&
        coll.primary_asset_contracts &&
        coll.primary_asset_contracts.length > 0 &&
        coll.primary_asset_contracts[0].address
      ) {
        //TODO: include all primary_asset_contracts instead of just the first one
        const historicalDatas = await covalentGetCollectionDetail(
          coll.primary_asset_contracts[0].address,
          coll.primary_asset_contracts[0].opensea_seller_fee_basis_points,
        );
        return _.assign(_.cloneDeep(coll), { historicalDatas });
      }
      return coll;
    }),
  );
  return collsWithHistoricalDatas;
};

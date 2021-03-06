import axios from "axios";
import axiosRetry from "axios-retry";
import "dotenv/config";
import _ from "lodash";
import moment from "moment";
import stats from "stats-lite";

import { COVALENT_TARGET_BLOCKCHAIN_ID } from "../constants";
import { log, logErr } from "./commons";

const { ethers } = require("ethers");

axiosRetry(axios, {
  retries: 0,
  retryDelay: retryCount => {
    log(`retry attempt: ${retryCount}`);
    return retryCount * 2000;
  },
  retryCondition: error => {
    logErr(error);
    return error.response.status === 503;
  },
});

export const getCollectionDetailItemsBetweenDate = (items, startDateStr, endDateStr) => {
  const output = _.filter(items, item => {
    return item?.opening_date >= startDateStr && item?.opening_date < endDateStr;
  });
  return output;
};

export const getStatsOfItems = items => {
  const stats = _.reduce(
    items,
    (acc, item) => {
      if (item && item.volume_wei_day && _.size(item.volume_wei_day) > 0) {
        acc.totalWeiVolume = acc.totalWeiVolume.add(item.volume_wei_day);
      }
      return acc;
    },
    { totalWeiVolume: ethers.utils.parseEther("0") },
  );
  return stats;
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

      groupedStats.totalEthVolume = +ethers.utils.formatEther(groupedStats.totalWeiVolume);
      groupedStats.ethTotalRoyaltyRevenue = groupedStats.totalEthVolume * percRoyaltyCreator;

      acc.ethTotalRoyaltyRevenue = acc.ethTotalRoyaltyRevenue + groupedStats.ethTotalRoyaltyRevenue;
      acc.ethRoyaltyRevenues.push(groupedStats.ethTotalRoyaltyRevenue);
      acc.ethRoyaltyRevenueDatas.push({ x: groupedKey, y: groupedStats.ethTotalRoyaltyRevenue });

      if (!acc.ethMinGroupedRoyaltyRevenue || groupedStats.ethTotalRoyaltyRevenue < acc.ethMinGroupedRoyaltyRevenue) {
        acc.ethMinGroupedRoyaltyRevenue = groupedStats.ethTotalRoyaltyRevenue;
      }
      acc[groupedKey] = groupedStats;
      //log("twelveMonthStats", "done", { acc, items: _.size(items), groupedKey });
      return acc;
    },
    {
      ethTotalRoyaltyRevenue: 0,
      ethMinGroupedRoyaltyRevenue: null,
      ethRoyaltyRevenues: [],
      ethRoyaltyRevenueDatas: [],
    },
  );

  twelveMonthStats.ethFloorVolume = twelveMonthStats.ethMinGroupedRoyaltyRevenue * 12.0;
  twelveMonthStats.ethMeanRoyaltyRevenue = stats.mean(twelveMonthStats.ethRoyaltyRevenues);
  twelveMonthStats.ethStDevRoyaltyRevenue = stats.stdev(twelveMonthStats.ethRoyaltyRevenues);
  twelveMonthStats.ethCoefofVariationRoyaltyRevenue =
    twelveMonthStats.ethStDevRoyaltyRevenue / twelveMonthStats.ethMeanRoyaltyRevenue;

  return twelveMonthStats;
};

export const covalentGetCollectionDetail = async (contract, contractIndex) => {
  try {
    if (contractIndex >= contract.length) {
      return null;
    }
    const collAddress = contract[contractIndex].address;
    const seller_fee_basis_points =
      contract[contractIndex].opensea_seller_fee_basis_points ||
      contract[contractIndex].dev_seller_fee_basis_points ||
      500;
    log("covalentGetCollectionDetail", { state: "start", contractIndex, collAddress, seller_fee_basis_points });
    const resp = await axios.get(
      `https://api.covalenthq.com/v1/${COVALENT_TARGET_BLOCKCHAIN_ID}/nft_market/collection/${collAddress}/`,
      {
        auth: { username: process.env.REACT_APP_COVALENT_API_KEY },
      },
    );

    const percRoyaltyCreator = seller_fee_basis_points / (100 * 100);
    const stats = getTwelveMonthStatsFromItems(resp?.data?.data?.items, percRoyaltyCreator);
    log("covalentGetCollectionDetail", { stats });

    const detail = {
      collAddress,
      percRoyaltyCreator,
      stats,
      items: [...resp?.data?.data?.items],
    };
    return detail;
  } catch (err) {
    logErr(err);
    const detail = await covalentGetCollectionDetail(contract, contractIndex + 1);
    return detail;
  }
};

export const covalentGetCollectionsWithHistorialDatas = async colls => {
  const collsWithHistoricalDatas = await Promise.all(
    colls.map(async coll => {
      if (coll && coll.primary_asset_contracts && coll.primary_asset_contracts.length > 0) {
        const contracts = coll.primary_asset_contracts.filter(contract => {
          return contract && contract.address && contract.asset_contract_type === "non-fungible";
        });
        const historicalDatas = await covalentGetCollectionDetail(contracts, 0);
        return _.assign(_.cloneDeep(coll), { historicalDatas });
      }
      return coll;
    }),
  );
  return collsWithHistoricalDatas;
};

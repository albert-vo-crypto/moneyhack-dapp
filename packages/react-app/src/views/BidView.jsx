import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Table } from "antd";
import _ from "lodash";

import { DEFAULT_BID_SLIDER_PERCENTAGE } from "../constants";
import { nftSelectedCollectionSelector } from "../stores/reducers/nft";
import NFTCollectionCard from "../components/NFT/NFTCollectionCard";
import SecondaryButton from "../components/Buttons/SecondaryButton";
import PercentageSlider from "../components/Inputs/PercentageSlider";
import HeaderText from "../components/Commons/HeaderText";
import { getFormatedCurrencyValue } from "../utils/commons";
import NFTCollectionStats from "../components/NFT/NFTCollectionStats";
import NFTCollectionDetailsList from "../components/NFT/NFTCollectionDetailsList";

const BidView = () => {
  const selectedNFTCollection = useSelector(nftSelectedCollectionSelector);
  const [bidAmount, setBidAmount] = useState(selectedNFTCollection?.estAnnRev);
  //const [bidPercentage, setBidPercentage] = useState(DEFAULT_BID_SLIDER_PERCENTAGE);

  const onSliderValueChange = value => {
    //setBidPercentage(value);
    setBidAmount((value / 100) * selectedNFTCollection?.estAnnRev * selectedNFTCollection?.fractionForSale);
  };

  /*
  const columns = [
    {
      title: "Purchase price",
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
      sorter: (a, b) =>
        a.historicalDatas?.stats?.ethTotalRoyaltyRevenue - b.historicalDatas?.stats?.ethTotalRoyaltyRevenue,
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
    Table.EXPAND_COLUMN,
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
*/

  return (
    <div>
      <HeaderText children="Purchase NFT Collection Royalty Revenue" />
      <NFTCollectionDetailsList nftCollections={[selectedNFTCollection]} />

      {/*
      <div class="mx-10 my-10 grid grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6 xl:gap-x-8">
        <NFTCollectionCard nftCollection={selectedNFTCollection} />
        <div class="col-span-2">
          <NFTCollectionStats nftCollection={selectedNFTCollection} />
        </div>
      </div>
      <div class="fixed bottom-20 right-20 sm:bottom-10 sm:right-10 md:bottom-12 md:right-12">
        <div class="my-10">
          <h3 class="text-primarytext">Adjust bid price:</h3>
          <PercentageSlider defaultValue={DEFAULT_BID_SLIDER_PERCENTAGE} onChange={onSliderValueChange} />
        </div>
        <SecondaryButton onClick={() => {}} children={"BID $" + getFormatedCurrencyValue(bidAmount)} />
      </div>
      */}
    </div>
  );
};

export default BidView;

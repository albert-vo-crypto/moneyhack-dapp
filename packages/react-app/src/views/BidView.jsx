import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Table } from "antd";
import _ from "lodash";

import { DEFAULT_BID_SLIDER_PERCENTAGE, DEFAULT_NFT_COLL_IMAGE_SRC } from "../constants";
import { nftSelectedCollectionSelector } from "../stores/reducers/nft";
import SecondaryButton from "../components/Buttons/SecondaryButton";
import PercentageSlider from "../components/Inputs/PercentageSlider";
import HeaderText from "../components/Commons/HeaderText";
import { getFormatedCurrencyValue } from "../utils/commons";
import NFTCollectionDetailsList from "../components/NFT/NFTCollectionDetailsList";
import NFTImagesBar from "../components/NFT/NFTImagesBar";
import NFTInvestmentDetail from "../components/NFT/NFTInvestmentDetail";

const BidView = ({ ethPrice }) => {
  const selectedNFTCollection = useSelector(nftSelectedCollectionSelector);
  const rev =
    (selectedNFTCollection?.historicalDatas?.stats?.ethTotalRoyaltyRevenue || 0) *
    (selectedNFTCollection?.fractionForSale || 0);
  const [bidAmount, setBidAmount] = useState((rev * DEFAULT_BID_SLIDER_PERCENTAGE) / 100);

  const onSliderValueChange = value => {
    setBidAmount((value / 100) * rev);
  };

  const columns = [
    {
      title: "Fraction for Sale",
      dataIndex: "fractionForSale",
      key: "fractionForSale",
      render: (value, nftCollection) => {
        return <h3>{value}</h3>;
      },
    },
    {
      title: "Implied Purchase Discount",
      dataIndex: "imageSrc",
      key: "imageSrc",
      render: (value, nftCollection) => {
        return <h3>{(bidAmount / rev)?.toFixed(4)}</h3>;
      },
    },
    {
      title: "Bid Price",
      dataIndex: "name",
      key: "name",
      render: (value, nftCollection) => {
        return <h3>{"$" + getFormatedCurrencyValue(bidAmount * ethPrice) + " USD"}</h3>;
      },
    },
    {
      title: "Adjust Price",
      dataIndex: "rating",
      key: "rating",
      render: (rating, nftCollection) => {
        return (
          <div class="grid place-items-center">
            <div class="my-10 w-full">
              <PercentageSlider defaultValue={DEFAULT_BID_SLIDER_PERCENTAGE} onChange={onSliderValueChange} />
            </div>
            <SecondaryButton onClick={() => {}} children={"BID " + getFormatedCurrencyValue(bidAmount) + " ETH"} />
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <HeaderText children="Purchase NFT Collection Royalty Revenue" />
      <NFTCollectionDetailsList nftCollections={[selectedNFTCollection]} />
      <Table
        columns={columns}
        dataSource={[selectedNFTCollection]}
        pagination={false}
        expandable={{
          expandedRowRender: record => <NFTInvestmentDetail rev={rev} bidAmount={bidAmount} />,
          rowExpandable: record => true,
        }}
      />
    </div>
  );
};

export default BidView;

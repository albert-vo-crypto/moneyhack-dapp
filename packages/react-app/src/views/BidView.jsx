import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table } from "antd";
import _ from "lodash";

import { DEFAULT_BID_SLIDER_PERCENTAGE, DEFAULT_NFT_COLL_IMAGE_SRC } from "../constants";
import { nftSelectedCollectionSelector } from "../stores/reducers/nft";
import SecondaryButton from "../components/Buttons/SecondaryButton";
import PercentageSlider from "../components/Inputs/PercentageSlider";
import HeaderText from "../components/Commons/HeaderText";
import { getFormatedCurrencyValue } from "../utils/commons";
import NFTCollectionDetailsList from "../components/NFT/NFTCollectionDetailsList";
import NFTInvestmentDetail from "../components/NFT/NFTInvestmentDetail";
import { appContextCurrentSignerAddressSelector } from "../stores/reducers/appContext";
import { selectedTradingCollectionSelector } from "../stores";
import { tradingCollectionUpdatedAction } from "../stores/reducers/nft";

const BidView = ({ ethPrice }) => {
  const dispatch = useDispatch();
  const selectedNFTCollection = useSelector(nftSelectedCollectionSelector);
  const rev =
    (selectedNFTCollection?.historicalDatas?.stats?.ethTotalRoyaltyRevenue || 0) *
    (selectedNFTCollection?.fractionForSale || 0);
  const [bidAmount, setBidAmount] = useState((rev * DEFAULT_BID_SLIDER_PERCENTAGE) / 100);

  const onSliderValueChange = value => {
    setBidAmount((value / 100) * rev);
  };

  //TODO: Gunvant to integrate smart contract function
  const signerAddress = useSelector(appContextCurrentSignerAddressSelector);
  const onBidClick = () => {
    const collectionAddress = selectedNFTCollection?.primary_asset_contracts[0]?.address;
    const ownerAddress = selectedNFTCollection?.ownerAddress;
    const fractionForSale = selectedNFTCollection?.fractionForSale || 0;
    const investorAddress = signerAddress;
    const bidPriceInETH = bidAmount;

    onSuccessfulBidTransaction(); //For testing //TODO: move to after getting a success response from smart contract
  };
  //TODO: call onSuccessfulBidTransaction upon successful bid staking transaction
  //TODO: reading bidding details from smart contract instead of local data store
  const onSuccessfulBidTransaction = () => {
    //Add bidDetail to selectedNFTCollection
    const bidDetail = {
      collectionAddress: selectedNFTCollection?.primary_asset_contracts[0]?.address,
      fractionForSale: selectedNFTCollection?.fractionForSale || 0,
      investorAddress: signerAddress,
      bidPriceInETH: bidAmount,
    };
    const coll = _.assign(
      _.cloneDeep(selectedNFTCollection),
      selectedNFTCollection?.bidDetails
        ? { bidDetails: [...selectedNFTCollection.bidDetails, bidDetail] }
        : { bidDetails: [bidDetail] },
    );
    dispatch(tradingCollectionUpdatedAction(coll));
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
            <SecondaryButton
              onClick={() => {
                onBidClick();
              }}
              children={"BID " + getFormatedCurrencyValue(bidAmount) + " ETH"}
            />
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
          expandedRowRender: record => (
            <NFTInvestmentDetail nftCollection={selectedNFTCollection} rev={rev} bidAmount={bidAmount} />
          ),
          rowExpandable: record => true,
        }}
      />
    </div>
  );
};

export default BidView;

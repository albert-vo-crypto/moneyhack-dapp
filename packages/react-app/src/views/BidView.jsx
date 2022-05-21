import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table } from "antd";
import _ from "lodash";
import { useHistory } from "react-router-dom";

import { DEFAULT_BID_SLIDER_PERCENTAGE, BID_STATUS_PENDING_ACCEPT, ROUTE_PATH_REVEFIN_DASHBOARD } from "../constants";
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
import { utils } from "ethers";

const BidView = ({
  ethPrice,
  address,
  localProvider,
  yourLocalBalance,
  tx,
  readContracts,
  writeContracts,
  userSigner }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const selectedNFTCollection = useSelector(nftSelectedCollectionSelector);

  const rev =
    (selectedNFTCollection?.historicalDatas?.stats?.ethTotalRoyaltyRevenue || 0) *
    (selectedNFTCollection?.fractionForSale || 0);
  const [bidAmount, setBidAmount] = useState((rev * DEFAULT_BID_SLIDER_PERCENTAGE) / 100);

  const onSliderValueChange = value => {
    setBidAmount((value / 100) * rev);
  };

  const signerAddress = useSelector(appContextCurrentSignerAddressSelector);

  const onBidClick = () => {
    const collectionAddress = selectedNFTCollection?.primary_asset_contracts[0]?.address;
    const ownerAddress = selectedNFTCollection?.ownerAddress;
    const fractionForSale = selectedNFTCollection?.fractionForSale * 100 || 0;
    const investorAddress = signerAddress;
    const bidPriceInETH = bidAmount.toString();;

    tx(
      writeContracts.RBFVaultFactory.createVault(collectionAddress, ownerAddress, investorAddress, fractionForSale, {
        value: utils.parseEther(bidPriceInETH),
      }),
    );
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
      status: BID_STATUS_PENDING_ACCEPT,
    };
    const coll = _.assign(
      _.cloneDeep(selectedNFTCollection),
      selectedNFTCollection?.bidDetails
        ? { bidDetails: [...selectedNFTCollection.bidDetails, bidDetail] }
        : { bidDetails: [bidDetail] },
    );
    dispatch(tradingCollectionUpdatedAction(coll));
    history.push(ROUTE_PATH_REVEFIN_DASHBOARD);
  };


  return (
    <div className="mt-10">
      <div className="text-left pb-2 border-b border-gray-200">
        <HeaderText children="Purchase NFT Collection Royalty Revenue" />
      </div>
      <div>
        <div className="bg-white">
          <div>
            {/* info */}
            <div className="max-w-2xl mx-auto pt-10 pb-16 px-4 sm:px-6 lg:max-w-7xl lg:pt-10 lg:pb-24 lg:px-8 lg:grid lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8">
              <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                <div className="flex justify-start">
                  <div className="hidden w-36 h-36 rounded-lg overflow-hidden lg:block content-center mr-10">
                    <img
                      src={selectedNFTCollection.imageSrc}
                      className="w-full h-full object-center object-cover"
                    />
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{selectedNFTCollection.name}</h1>
                </div>
              </div>

              {/* Terms */}
              <div className="mt-4 lg:mt-0 lg:row-span-3">             

                <div>
                  <h3 className="text-lg text-gray-900">TERMS</h3>
                  <dl className="mt-2 border-t border-b border-gray-200 divide-y divide-gray-200">

                    <div className="py-3 flex justify-between text-sm font-medium">
                      <dt className="text-gray-500">Revenue Period (Months)</dt>
                      <dd className="text-gray-900">{selectedNFTCollection?.revenuePeriod}</dd>
                    </div>

                    <div className="py-3 flex justify-between text-sm font-medium">
                      <dt className="text-gray-500">Fraction for Sale</dt>
                      <dd className="text-lg text-gray-900">{selectedNFTCollection?.fractionForSale * 100 + "%"}</dd>
                    </div>

                    <div className="py-3 flex justify-between text-sm font-medium">
                      <dt className="text-gray-500">Implied Purchase Discount</dt>
                      <dd className="text-lg text-gray-900">{(bidAmount / rev)?.toFixed(4)}</dd>
                    </div>

                    <div className="py-3 flex justify-between text-sm font-medium">
                      <dt className="text-gray-500">Bid Price</dt>
                      <dd className="text-lg text-gray-900">{"$" + getFormatedCurrencyValue(bidAmount * ethPrice) + " USD"}</dd>
                    </div>
                  </dl>
                  <div class="grid place-items-center">
                    <div class="mt-5 w-full">
                      <PercentageSlider defaultValue={DEFAULT_BID_SLIDER_PERCENTAGE} onChange={onSliderValueChange} />
                      <p className="font-bold text-lg">{bidAmount.toFixed(2) + " ETH"}</p>
                    </div>
                    <button
                      className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => {
                        onBidClick();
                      }}
                      children={"BID " + getFormatedCurrencyValue(bidAmount) + " ETH"}
                    />
                  </div>
                </div>

              </div>

              <div className="py-10 lg:pt-6 lg:pb-16 lg:col-start-1 lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                {/* Description and details */}

                <div>
                  <h3 className="sr-only">Description</h3>

                  <div className="space-y-6">
                    <p className="text-base text-gray-900">{selectedNFTCollection.description}</p>
                  </div>
                </div>

                <div className="mt-10 mb-10">
                  <div>
                    <h3 className="text-lg text-gray-900">COLLECTION STATS</h3>
                    <dl className="mt-2 border-t border-b border-gray-200 divide-y divide-gray-200">
                      <div className="py-3 flex justify-between text-sm font-medium">
                        <dt className="text-gray-500">Ratings</dt>
                        <dd className="text-gray-900">{selectedNFTCollection?.rating}</dd>
                      </div>
                      <div className="py-3 flex justify-between text-sm font-medium">
                        <dt className="text-gray-500">Prior Period Revnue (ETH)</dt>
                        <dd className="text-gray-900">{selectedNFTCollection?.historicalDatas.stats.ethTotalRoyaltyRevenue}</dd>
                      </div>

                      <div className="py-3 flex justify-between text-sm font-medium">
                        <dt className="text-gray-500">Floor Volume (ETH)</dt>
                        <dd className="text-gray-900">{selectedNFTCollection?.historicalDatas.stats.ethFloorVolume}</dd>
                      </div>

                      <div className="py-3 flex justify-between text-sm font-medium">
                        <dt className="text-gray-500">Coef. of Variation</dt>
                        <dd className="text-gray-900">{selectedNFTCollection?.historicalDatas.stats.ethCoefofVariationRoyaltyRevenue}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
                <NFTInvestmentDetail nftCollection={selectedNFTCollection} rev={rev} bidAmount={bidAmount} />

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


  );
};

export default BidView;

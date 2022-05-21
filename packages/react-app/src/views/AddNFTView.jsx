import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import {
  DEFAULT_LIST_SLIDER_PERCENTAGE,
  ROUTE_PATH_EXPLORE_REVENUE_STREAMS,
  ROUTE_PATH_REVEFIN_DASHBOARD,
} from "../constants";
import NFTCollectionCard from "../components/NFT/NFTCollectionCard";
import SecondaryButton from "../components/Buttons/SecondaryButton";
import PercentageSlider from "../components/Inputs/PercentageSlider";
import HeaderText from "../components/Commons/HeaderText";
import { nftSelectedCollectionSelector, addBidableCollectionAction } from "../stores/reducers/nft";
import { appContextCurrentSignerAddressSelector } from "../stores/reducers/appContext";
import NFTCollectionStats from "../components/NFT/NFTCollectionStats";

const ListNFTView = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const signerAddress = useSelector(appContextCurrentSignerAddressSelector);
  const selectedNFTCollection = useSelector(nftSelectedCollectionSelector);
  const [percentageForSale, setPercentageForSale] = useState(DEFAULT_LIST_SLIDER_PERCENTAGE);

  const onSliderValueChange = value => {
    setPercentageForSale(value);
  };

  const addBidableCollection = (collection, fractionForSale) => {
    const payload = {
      collection,
      fractionForSale,
      signerAddress,
    };
    dispatch(addBidableCollectionAction(payload));
  };

  return (
    <div className="mt-10">
      {signerAddress && selectedNFTCollection ? (

        <div>
          <div className="text-left pb-2 border-b border-gray-200">
            <HeaderText children="Turn Future Revenue To Capital Now" />
          </div>
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
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{selectedNFTCollection.name}</h1>
                      <div class="flex space-x-2">
                        <div class="flex items-center h-5">
                          <input
                            id="collection-ownership-confirmed"
                            name="collection-ownership-confirmed"
                            type="checkbox"
                            checked
                            class="h-4 w-4 border-gray-300 rounded text-secondarylight focus:ring-indigo-500"
                          />
                        </div>
                        <label for="collection-ownership-confirmed" class="text-sm font-medium text-gray-900">
                          Collection ownership confirmed
                        </label>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Terms */}
                <div className="mt-4 lg:mt-0 lg:row-span-3">
                  <h2 className="sr-only">Product information</h2>

                  <div>
                    <div class="grid place-items-center">

                      <div class="my-10">
                        <p className="text-lg">Adjust % of royalty for sale</p>
                        <PercentageSlider
                          min={1}
                          max={100}
                          defaultValue={DEFAULT_LIST_SLIDER_PERCENTAGE}
                          onChange={onSliderValueChange}
                        />
                        <p className="font-bold text-lg">{percentageForSale + "%"}</p>
                      </div>

                      <button
                        className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => {
                          addBidableCollection(selectedNFTCollection, percentageForSale / 100.0);
                          //TODO: on successful transaction
                          history.push(ROUTE_PATH_REVEFIN_DASHBOARD);
                        }}
                        children={"List " + percentageForSale + "% royalty revenue for sale"}
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
                          <dt className="text-gray-500">Volume</dt>
                          <dd className="text-gray-900">{selectedNFTCollection?.stats?.total_volume?.toFixed(2)}</dd>
                        </div>

                        <div className="py-3 flex justify-between text-sm font-medium">
                          <dt className="text-gray-500">#Sales</dt>
                          <dd className="text-gray-900">{selectedNFTCollection?.stats?.total_sales}</dd>
                        </div>

                        <div className="py-3 flex justify-between text-sm font-medium">
                          <dt className="text-gray-500">Avg. Price</dt>
                          <dd className="text-gray-900">{selectedNFTCollection?.stats?.average_price?.toFixed(4)}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div class="grid place-items-center h-[70vh]">
          <HeaderText children="Please select a valid NFT collection that you own first" />
        </div>
      )}
    </div>
  );
};

export default ListNFTView;

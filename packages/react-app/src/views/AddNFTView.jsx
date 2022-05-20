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
  const ownerAddress = useSelector(appContextCurrentSignerAddressSelector);
  const selectedNFTCollection = useSelector(nftSelectedCollectionSelector);
  const [percentageForSale, setPercentageForSale] = useState(DEFAULT_LIST_SLIDER_PERCENTAGE);

  const onSliderValueChange = value => {
    setPercentageForSale(value);
  };

  const addBidableCollection = (collection, fractionForSale) => {
    const payload = {
      collection,
      fractionForSale,
    };
    dispatch(addBidableCollectionAction(payload));
  };

  return (
    <div>
      {ownerAddress && selectedNFTCollection ? (
        <div>
          <HeaderText children="Turn Future Revenue To Capital Now" />
          <div class="mx-10 my-10 grid grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6 xl:gap-x-8">
            <NFTCollectionCard nftCollection={selectedNFTCollection} />
            <div class="col-span-2">
              <NFTCollectionStats nftCollection={selectedNFTCollection} />
            </div>
          </div>
          <div class="fixed bottom-20 right-20 sm:bottom-10 sm:right-10 md:bottom-12 md:right-12">
            <div class="mt-6 flex space-x-2">
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

            <div class="my-10">
              <h3 class="text-primarytext">Adjust % of royalty for sale</h3>
              <PercentageSlider
                min={1}
                max={100}
                defaultValue={DEFAULT_LIST_SLIDER_PERCENTAGE}
                onChange={onSliderValueChange}
              />
            </div>

            <SecondaryButton
              onClick={() => {
                addBidableCollection(selectedNFTCollection, percentageForSale / 100.0);
                //TODO: on successful transaction
                history.push(ROUTE_PATH_REVEFIN_DASHBOARD);
              }}
              children={"List " + percentageForSale + "% royalty revenue for sale"}
            />
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

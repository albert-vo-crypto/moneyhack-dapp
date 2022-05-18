import React, { useState } from "react";
import { useSelector } from "react-redux";

import { DEFAULT_BID_SLIDER_PERCENTAGE } from "../constants";
import { nftselectedCollectionSelector } from "../stores/reducers/nft";
import NFTCollectionCard from "../components/NFT/NFTCollectionCard";
import SecondaryButton from "../components/Buttons/SecondaryButton";
import PercentageSlider from "../components/Inputs/PercentageSlider";
import HeaderText from "../components/Commons/HeaderText";
import { getFormatedCurrencyValue } from "../utils/commons";
import NFTCollectionStats from "../components/NFT/NFTCollectionStats";

const BidView = () => {
  const selectedNFTCollection = useSelector(nftselectedCollectionSelector);
  const [bidAmount, setBidAmount] = useState(selectedNFTCollection?.estAnnRev);
  //const [bidPercentage, setBidPercentage] = useState(DEFAULT_BID_SLIDER_PERCENTAGE);

  const onSliderValueChange = value => {
    //setBidPercentage(value);
    setBidAmount((value / 100) * selectedNFTCollection?.estAnnRev * selectedNFTCollection?.fractionForSale);
  };

  return (
    <div>
      <HeaderText children="Purchase NFT Collection Royalty Revenue" />
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
    </div>
  );
};

export default BidView;

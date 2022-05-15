import React, { useState } from "react";
import { useSelector } from "react-redux";

import { DEFAULT_EST_ANN_REVENUE, DEFAULT_BID_SLIDER_PERCENTAGE } from "../constants";
import { nftSelectedProjectSelector } from "../stores/reducers/nft";
import NFTProjectCard from "../components/NFTProject/NFTProjectCard";
import SecondaryButton from "../components/Buttons/SecondaryButton";
import PercentageSlider from "../components/Inputs/PercentageSlider";
import HeaderText from "../components/Commons/HeaderText";
import { getFormatedCurrencyValue } from "../utils/commons";

const BidView = () => {
  const selectedNftProject = useSelector(nftSelectedProjectSelector);
  const [bidAmount, setBidAmount] = useState(selectedNftProject?.estAnnualizedRevenue || DEFAULT_EST_ANN_REVENUE);
  const [bidPercentage, setBidPercentage] = useState(DEFAULT_BID_SLIDER_PERCENTAGE);

  const onSliderValueChange = value => {
    setBidPercentage(value);
    setBidAmount((value / 100) * (selectedNftProject?.estAnnualizedRevenue || DEFAULT_EST_ANN_REVENUE));
  };

  return (
    <div>
      <HeaderText children="NFT Collection Royalty Revenue" />
      <div class="mx-10 my-10 grid grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6 xl:gap-x-8">
        <NFTProjectCard nftProject={selectedNftProject} />
      </div>
      <div class="fixed bottom-20 right-20 sm:bottom-10 sm:right-10 md:bottom-12 md:right-12">
        <div class="my-10">
          <h3 class="text-primarytext">{bidPercentage}% of Revenue</h3>
          <PercentageSlider onChange={onSliderValueChange} />
        </div>
        <SecondaryButton onClick={() => {}} children={"BID " + getFormatedCurrencyValue(bidAmount)} />
      </div>
    </div>
  );
};

export default BidView;

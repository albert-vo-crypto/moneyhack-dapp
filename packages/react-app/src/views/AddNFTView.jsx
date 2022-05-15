import React, { useState } from "react";
import { useSelector } from "react-redux";

import { DEFAULT_EST_ANN_REVENUE, DEFAULT_BID_SLIDER_PERCENTAGE } from "../constants";
import NFTProjectCard from "../components/NFTProject/NFTProjectCard";
import SecondaryButton from "../components/Buttons/SecondaryButton";
import PercentageSlider from "../components/Inputs/PercentageSlider";
import HeaderText from "../components/Commons/HeaderText";
import { getFormatedCurrencyValue } from "../utils/commons";
import { getEmptyNFTProject } from "../models/nftproject";

const ListNFTView = () => {
  const [nftProject, setNftProject] = useState(getEmptyNFTProject());
  const [listPercentage, setListPercentage] = useState(DEFAULT_BID_SLIDER_PERCENTAGE);

  const onSliderValueChange = value => {
    setListPercentage(value);
  };

  return (
    <div>
      <HeaderText children="Turn Future Revenue To Capital Now" />
      <div class="mx-10 my-10 grid grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6 xl:gap-x-8">
        <NFTProjectCard nftProject={nftProject} />
      </div>
      <div class="fixed bottom-20 right-20 sm:bottom-10 sm:right-10 md:bottom-12 md:right-12">
        <div class="my-10">
          <h3 class="text-primarytext">{listPercentage}% of Revenue</h3>
          <PercentageSlider min={1} max={100} onChange={onSliderValueChange} />
        </div>

        <SecondaryButton onClick={() => {}} children={"List " + listPercentage + "% royalty revenue for trading"} />
      </div>
    </div>
  );
};

export default ListNFTView;

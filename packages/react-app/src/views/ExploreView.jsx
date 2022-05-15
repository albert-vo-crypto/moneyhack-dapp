import React from "react";
import { useSelector } from "react-redux";

import { activeNftProjectsSelector } from "../stores";
import NFTProjectCardsList from "../components/NFTProject/NFTProjectCardsList";
import HeaderText from "../components/Commons/HeaderText";

const ExploreView = () => {
  const activeNftProjects = useSelector(activeNftProjectsSelector);

  return (
    <div>
      <HeaderText children="NFT Collections" />
      <NFTProjectCardsList nftProjects={activeNftProjects} />
    </div>
  );
};

export default ExploreView;

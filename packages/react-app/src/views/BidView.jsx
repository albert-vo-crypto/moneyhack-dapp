/* eslint-disable jsx-a11y/no-redundant-roles */
/* eslint-disable react/jsx-no-comment-textnodes */
import React from "react";
import { useSelector } from "react-redux";

import { nftSelectedProjectSelector } from "../stores/reducers/nft";
import NFTProjectCard from "../components/NFTProject/NFTProjectCard";

const BidView = () => {
  const selectedNftProjects = useSelector(nftSelectedProjectSelector);

  return (
    <div>
      <ul
        role="list"
        class="mx-10 my-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
      >
        <NFTProjectCard nftProject={selectedNftProjects} />{" "}
      </ul>
      <button
        type="button"
        class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-black bg-secondary hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        BID 1M DAI
      </button>
    </div>
  );
};

export default BidView;

import React from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import { selectedProjectUpdatedAction } from "../../stores/reducers/nft";

const defaultImageSrc =
  "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80";
const defaultTitle = "NFT Project";
const defaultDescription = "Description";
const defaultEstAnnualizedRevenue = "1M";

const NFTProjectCard = ({ nftProject }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  return (
    // eslint-disable-next-line jsx-a11y/no-redundant-roles
    <li class="relative">
      <div
        class="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden"
        onClick={async () => {
          await dispatch(selectedProjectUpdatedAction(nftProject));
          history.push("/bid");
        }}
      >
        <img
          src={nftProject?.imageSrc || defaultImageSrc}
          alt=""
          class="object-cover pointer-events-none group-hover:opacity-75"
        />
        <button type="button" class="absolute inset-0 focus:outline-none">
          <span class="sr-only">{nftProject?.title || defaultTitle}</span>
        </button>
      </div>
      <p class="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">
        {nftProject?.title || defaultTitle}
      </p>
      <p class="block text-sm font-medium text-gray-500 pointer-events-none">
        {nftProject?.description || defaultDescription}
      </p>
      <p class="block text-sm font-medium text-gray-500 pointer-events-none">
        Revenue: {nftProject?.estAnnualizedRevenue || defaultEstAnnualizedRevenue}
      </p>
    </li>
  );
};

export default NFTProjectCard;

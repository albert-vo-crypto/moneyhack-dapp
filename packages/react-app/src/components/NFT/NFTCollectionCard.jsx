import React from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import _ from "lodash";
import { useLocation } from "react-router-dom";

import { selectedCollectionUpdatedAction } from "../../stores/reducers/nft";
import { getFormatedCurrencyValue } from "../../utils/commons";
import {
  ROUTE_PATH_EXPLORE_REVENUE_STREAMS,
  ROUTE_PATH_BID_REVENUE_STREAM,
  ROUTE_PATH_REG_REVENUE_STREAM,
} from "../../constants";

const NFTCollectionCard = ({ nftCollection }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();

  return (
    <div class="relative">
      <div
        class="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-primary overflow-hidden"
        onClick={async () => {
          await dispatch(selectedCollectionUpdatedAction(nftCollection));
          if (location?.pathname === ROUTE_PATH_EXPLORE_REVENUE_STREAMS) {
            history.push(ROUTE_PATH_BID_REVENUE_STREAM);
          } else if (location?.pathname === "/creatornftcollections") {
            history.push(ROUTE_PATH_REG_REVENUE_STREAM);
          }
        }}
      >
        <img src={nftCollection?.imageSrc} alt="" class="object-cover pointer-events-none group-hover:opacity-75" />
        <button type="button" class="absolute inset-0 focus:outline-none">
          <span class="sr-only">{nftCollection?.name}</span>
        </button>
      </div>
      <p class="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">{nftCollection?.name}</p>
      <p class="block text-sm font-medium text-gray-500 pointer-events-none">
        {_.truncate(nftCollection?.description, { length: 200 })}
      </p>
      <p class="block text-sm font-medium text-gray-500 pointer-events-none">
        Revenue: {"$" + getFormatedCurrencyValue(nftCollection?.estAnnRev, 2)}
      </p>
      {location?.pathname === ROUTE_PATH_EXPLORE_REVENUE_STREAMS ||
      location?.pathname === ROUTE_PATH_BID_REVENUE_STREAM ? (
        <p class="block text-sm font-medium text-gray-500 pointer-events-none">
          Fraction for sale: {nftCollection?.fractionForSale * 100 + "%"}
        </p>
      ) : null}
    </div>
  );
};

export default NFTCollectionCard;

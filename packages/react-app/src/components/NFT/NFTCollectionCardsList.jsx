import React from "react";

import NFTCollectionCard from "./NFTCollectionCard";

const NFTCollectionCardsList = ({ nftCollections, gridCols = 4 }) => {
  const ulClassString =
    "mx-10 my-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-" + gridCols + " xl:gap-x-8";
  return (
    <div class={ulClassString}>
      {nftCollections.map(coll => (
        <NFTCollectionCard nftCollection={coll} />
      ))}
    </div>
  );
};

export default NFTCollectionCardsList;

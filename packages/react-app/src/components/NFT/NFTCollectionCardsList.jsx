import React from "react";

import NFTCollectionCard from "./NFTCollectionCard";

const NFTCollectionCardsList = ({ nftCollections }) => {
  const ulClassString =
    "mx-10 my-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8 sm:gap-x-6 xl:gap-x-8";
  return (
    <div class={ulClassString}>
      {nftCollections.map(coll => (
        <NFTCollectionCard nftCollection={coll} />
      ))}
    </div>
  );
};

export default NFTCollectionCardsList;

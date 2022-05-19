import React from "react";

import { DEFAULT_NFT_COLL_IMAGE_SRC } from "../../constants";
import NFTImage from "./NFTImage";

const NFTImagesBar = ({ nftCollection }) => {
  return (
    <div class="w-full">
      <div class="grid grid-cols-5 place-items-center">
        <NFTImage
          src={
            nftCollection?.historicalDatas?.items
              ? nftCollection?.historicalDatas?.items[0]?.first_nft_image_256
              : DEFAULT_NFT_COLL_IMAGE_SRC
          }
        />
        <NFTImage
          src={
            nftCollection?.historicalDatas?.items
              ? nftCollection?.historicalDatas?.items[0]?.second_nft_image_256
              : DEFAULT_NFT_COLL_IMAGE_SRC
          }
        />
        <NFTImage
          src={
            nftCollection?.historicalDatas?.items
              ? nftCollection?.historicalDatas?.items[0]?.third_nft_image_256
              : DEFAULT_NFT_COLL_IMAGE_SRC
          }
        />
        <NFTImage
          src={
            nftCollection?.historicalDatas?.items
              ? nftCollection?.historicalDatas?.items[0]?.fourth_nft_image_256
              : DEFAULT_NFT_COLL_IMAGE_SRC
          }
        />
        <NFTImage
          src={
            nftCollection?.historicalDatas?.items
              ? nftCollection?.historicalDatas?.items[0]?.fifth_nft_image_256
              : DEFAULT_NFT_COLL_IMAGE_SRC
          }
        />
      </div>
    </div>
  );
};

export default NFTImagesBar;

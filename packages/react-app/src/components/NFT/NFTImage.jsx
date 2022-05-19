import React from "react";

import { DEFAULT_NFT_COLL_IMAGE_SRC } from "../../constants";

const NFTImage = ({ src }) => {
  return (
    <div class="mx-10">
      <img
        src={src || DEFAULT_NFT_COLL_IMAGE_SRC}
        alt=""
        class="object-cover pointer-events-none group-hover:opacity-75"
      />
    </div>
  );
};

export default NFTImage;

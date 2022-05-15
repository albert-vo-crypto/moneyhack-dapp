import _ from "lodash";
import { log } from "../utils/commons";

import {
  DEFAULT_NFT_COLL_IMAGE_SRC,
  DEFAULT_NFT_COLL_NAME,
  DEFAULT_NFT_COLL_DES,
  DEFAULT_NFT_COLL_EST_ANN_REV,
  DEFAULT_NFT_COLL_REV_FRACTION_FOR_SALE,
  DEMO_NFT_COLL_OWNER_ADDRESS,
} from "../constants";

export const getRevefinFromOpenseaCollection = coll => {
  const estAnnRev = coll?.stats?.market_cap * 1000000 || DEFAULT_NFT_COLL_EST_ANN_REV;
  return _.assign(_.cloneDeep(coll), {
    name: _.get(coll, "name", DEFAULT_NFT_COLL_NAME),
    imageSrc: _.get(coll, "banner_image_url", DEFAULT_NFT_COLL_IMAGE_SRC),
    description: _.get(coll, "description", DEFAULT_NFT_COLL_DES),
    estAnnRev,
  });
};

export const getBidableFromRevefinCollection = (coll, ownerAddress, fractionForSale) => {
  const listedAt = Date.now();
  return _.assign(_.cloneDeep(coll), {
    isActive: true,
    fractionForSale,
    listedAt,
    ownerAddress,
  });
};

export const mockBidableFromOpenseaCollection = (
  coll,
  ownerAddress = DEMO_NFT_COLL_OWNER_ADDRESS,
  fractionForSale = DEFAULT_NFT_COLL_REV_FRACTION_FOR_SALE,
) => {
  const revefinColl = getRevefinFromOpenseaCollection(coll);
  return getBidableFromRevefinCollection(revefinColl, ownerAddress, fractionForSale);
};

export const getTestNFTBidableCollections = () => {
  return [
    {
      name: "NFT01",
      imageSrc:
        "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
      description: "NFT01 description",
      isActive: true,
      estAnnRev: DEFAULT_NFT_COLL_EST_ANN_REV,
      fractionForSale: DEFAULT_NFT_COLL_REV_FRACTION_FOR_SALE,
    },
    {
      name: "HackMoney",
      imageSrc:
        "https://lh3.googleusercontent.com/vebR8XpqsxUXMeMNx84rYzEyYpldAaa7v0jna_0QqbizbT4SmK8w1E2tzkck-8tHxKsPzO219dacelCZ5v7v25lfZQ=w600",
      description: "ETHGlobal Hackathon",
      isActive: true,
      estAnnRev: DEFAULT_NFT_COLL_EST_ANN_REV,
      fractionForSale: DEFAULT_NFT_COLL_REV_FRACTION_FOR_SALE,
    },
  ];
};

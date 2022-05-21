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
  const name = _.get(coll, "name", DEFAULT_NFT_COLL_NAME);
  const imageSrc =
    coll?.banner_image_url ||
    coll?.featured_image_url ||
    coll?.image_url ||
    coll?.large_image_url ||
    DEFAULT_NFT_COLL_IMAGE_SRC;
  const description = _.get(coll, "description", DEFAULT_NFT_COLL_DES);
  const estAnnRev = coll?.stats?.market_cap * 1000000 || DEFAULT_NFT_COLL_EST_ANN_REV;
  return _.assign(_.cloneDeep(coll), {
    name: _.size(name) > 0 ? name : DEFAULT_NFT_COLL_NAME,
    imageSrc: _.size(imageSrc) > 0 ? imageSrc : DEFAULT_NFT_COLL_IMAGE_SRC,
    description: _.size(description) > 0 ? description : DEFAULT_NFT_COLL_DES,
    estAnnRev,
  });
};

export const getBidableFromRevefinCollection = (coll, fractionForSale, signerAddress) => {
  const listedAt = Date.now();
  return _.assign(_.cloneDeep(coll), {
    isActive: true,
    fractionForSale,
    listedAt,
    collectionAddress: _.size(coll?.primary_asset_contracts) > 0 ? coll.primary_asset_contracts[0]?.address : "0x01",
    signerAddress: signerAddress || "0x01",
  });
};

export const mockBidableFromOpenseaCollection = (coll, fractionForSale = DEFAULT_NFT_COLL_REV_FRACTION_FOR_SALE) => {
  const revefinColl = getRevefinFromOpenseaCollection(coll);
  return getBidableFromRevefinCollection(revefinColl, fractionForSale);
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

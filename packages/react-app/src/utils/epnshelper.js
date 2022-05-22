import EpnsSDK from "@epnsproject/backend-sdk-staging";

import { EPNS_CHANNEL_PK, EPNS_CTA_URL } from "../constants";
import { log } from "./commons";

const epnsSdk = new EpnsSDK(EPNS_CHANNEL_PK);

export const publishEpnsNotification = async ({ address, title, msg }) => {
  const tx = await epnsSdk.sendNotification(
    address,
    title,
    msg,
    title,
    msg,
    3, //this is the notificationType
    EPNS_CTA_URL, // a url for users to be redirected to
    "", // an image url, or an empty string
    null, //this can be left as null
  );
  log({ caller: "publishEpnsNotification", tx });
};

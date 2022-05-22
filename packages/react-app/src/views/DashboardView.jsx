import React from "react";
import { useSelector } from "react-redux";
import _ from "lodash";
import { Spin } from "antd";

import { appContextCurrentSignerAddressSelector } from "../stores/reducers/appContext";
import { nftCreatorCollectionsSelector } from "../stores/reducers/nft";
import HeaderText from "../components/Commons/HeaderText";
import NFTCollectionTradingsList from "../components/NFT/NFTCollectionTradingsList";
import { registeredCollectionsOfCurrentSignerSelector, investedCollectionsOfCurrentSignerSelector } from "../stores";


import { DEFAULT_NOTIFICATIONS } from "./data";
import {
  OnSubscribeModal,
  NotificationItem,
  utils,
  api,
  channels,
  EmbedSDK
} from "@epnsproject/frontend-sdk-staging";
import { useEffect, useState } from "react";
import "./App.scss";
import ConnectButton from "../components/connect";
import { useWeb3React } from "@web3-react/core";
import { fakePromise, addSecretNotifications } from './utils'


//const WALLET_ADDRESS = "0x57c1D4dbFBc9F8cB77709493cc43eaA3CD505432";
const WALLET_ADDRESS = "0x417bC635C793E77F8C67D2e3a1392Ba1d85EeE90";
const PAGINATION_PARAMS = {
  page: 1,
  itemsPerPage: 20,
};
const BASE_URL = "https://backend-kovan.epns.io/apis";
const CHANNEL_ADDRESS = "0x94c3016ef3e503774630fC71F59B8Da9f7D470B7";


const DashboardView = ({ ethPrice }) => {
  const address = useSelector(appContextCurrentSignerAddressSelector);
  const registeredCollection = useSelector(registeredCollectionsOfCurrentSignerSelector);
  const investedCollection = useSelector(investedCollectionsOfCurrentSignerSelector);


  const { library, active, account, chainId } = useWeb3React();

  // create state components to fetch all the notifications.
  // notification details
  const [notifications, setNotifications] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const testSpamCondition = (iNotif) =>  iNotif === notifications.length - 1

  const onDecrypt = async (i) => {
    // do the actual decrypt thing here and return the result of that promise
    await fakePromise();
    // return the decrypted { title, body }
    return { title: 'Secret title REVEALED!', body: `Secret body REVEALED! for ${i}` };
  };

  /**
   * Fetch notifications for the user
   */
  useEffect(() => {
    if (!active) return;
    // on page load, fetch all the notifications
    api
      .fetchNotifications(
        account,
        PAGINATION_PARAMS.itemsPerPage,
        PAGINATION_PARAMS.page,
        BASE_URL
      )
      .then((notificationsData) => {
        const { results } = notificationsData || {};
        // console.log(`${count} notifications loaded:`, results);
        // parse the notifications into the required format
        let response = utils.parseApiResponse([
          ...results,
          ...DEFAULT_NOTIFICATIONS,
        ]);
        console.log({ unparsed: results });
        // const response = utils.parseApiResponse(results);
        // console.log("Parsed response to:", response);
        console.log({ parsed: response });

        response = addSecretNotifications(response); // remove this line to remove test secret notifs
        setNotifications(response);
      });
  }, [active, account]);
  // notification details


  // channel details
  const [channel, setChannel] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  // load channel details on start
  useEffect(() => {
    if (!account) return;
    // on page load, fetch channel details
    channels.getChannelByAddress(CHANNEL_ADDRESS, BASE_URL).then((data) => {
      setChannel(data);
    });
    // fetch if user is subscribed to channel
    channels.isUserSubscribed(account, CHANNEL_ADDRESS).then((res) => {
      console.log(res);
      setIsSubscribed(res);
    });
  }, [account]);


  useEffect(() => {
    if (account && active) {
      EmbedSDK.init({
        headerText: 'Test App Header', // optional
        targetID: 'sdk-trigger-id', // mandatory
        appName: 'consumerApp', // mandatory
        user: account, // mandatory
        viewOptions: {
          type: 'sidebar', // optional [default: 'sidebar', 'modal']
          showUnreadIndicator: true, // optional
          unreadIndicatorColor: '#cc1919',
          unreadIndicatorPosition: 'top-right',
        },
        theme: 'light',
        onOpen: () => {
          console.log('-> client dApp onOpen callback');
        },
        onClose: () => {
          console.log('-> client dApp onClose callback');
        }
      });
    }

    return () => {
      EmbedSDK.cleanup()
    };

  }, [account, active]);

  
  return (
    <div>
      <HeaderText children="Dashboard" />
      {address ? (
        <div>
          {_.size(registeredCollection) > 0 ? (
            <div>
              <h1>Listed for sale</h1>
              <NFTCollectionTradingsList nftCollections={registeredCollection} ethPrice={ethPrice} opMode="creator" />
            </div>
          ) : null}
          {_.size(investedCollection) > 0 ? (
            <div>
              <h1>Bid placed</h1>
              <NFTCollectionTradingsList nftCollections={investedCollection} ethPrice={ethPrice} opMode="investor" />
            </div>
          ) : null}
          {_.size(registeredCollection) === 0 && _.size(investedCollection) === 0 ? (
            <div class="grid place-items-center h-[70vh]">
              <HeaderText children="Time to start trading" />
            </div>
          ) : null}
        </div>
      ) : (
        <div class="grid place-items-center h-[70vh]">
          <HeaderText children="Please connect wallet with owner account" />
        </div>
      )}
      {modalOpen && <OnSubscribeModal onClose={() => setModalOpen(false)} />}
      {/* define the header */}
      <h2 className="App__header">
        <span> EPNS Playground </span>
        <ConnectButton />
      </h2>
      {/* define the header */}


      
    </div>
  );
};

export default DashboardView;

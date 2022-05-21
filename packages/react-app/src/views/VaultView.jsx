import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table } from "antd";
import _ from "lodash";
import { useHistory } from "react-router-dom";
import { useEventListener } from "eth-hooks/events/useEventListener";
import { Contract } from "@ethersproject/contracts";
import { DEFAULT_BID_SLIDER_PERCENTAGE, BID_STATUS_PENDING_ACCEPT, ROUTE_PATH_REVEFIN_DASHBOARD } from "../constants";
import { nftSelectedCollectionSelector } from "../stores/reducers/nft";
import SecondaryButton from "../components/Buttons/SecondaryButton";
import PercentageSlider from "../components/Inputs/PercentageSlider";
import HeaderText from "../components/Commons/HeaderText";
import { getFormatedCurrencyValue } from "../utils/commons";
import NFTCollectionDetailsList from "../components/NFT/NFTCollectionDetailsList";
import NFTInvestmentDetail from "../components/NFT/NFTInvestmentDetail";
import {
  appContextCurrentSignerAddressSelector,
  showErrorNotificationAction,
  showNotificationAction,
} from "../stores/reducers/appContext";
import { selectedTradingCollectionSelector } from "../stores";
import { tradingCollectionUpdatedAction } from "../stores/reducers/nft";
import { utils } from "ethers";
import { log } from "../utils/commons";
import externalContracts from "../contracts/external_contracts";

const VaultView = ({
  ethPrice,
  address,
  localProvider,
  yourLocalBalance,
  tx,
  readContracts,
  writeContracts,
  userSigner,
  mainnetProvider,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const selectedNFTCollection = useSelector(nftSelectedCollectionSelector);
  const [isWaitForVaultCreation, setIsWaitForVaultCreation] = useState(false);
  const RBFVAULTABI = externalContracts[1].contracts.RBFVAULT.abi;

  const scEvents = useEventListener(readContracts, "RBFVaultFactory", "RBFVaultCreated", localProvider, 1);
  useEffect(() => {
    log({ scEvents });
    if (scEvents && scEvents.length > 0 && isWaitForVaultCreation) {
      setIsWaitForVaultCreation(false);
      const scEvent = scEvents[scEvents.length - 1];
      if (scEvent?.args?.vaultAddress) {
        onSuccessfulBidTransaction(scEvent?.args?.vaultAddress);
      } else {
        dispatch(showErrorNotificationAction("Missing vaultAddress"));
      }
    }
  }, [scEvents]);

  const rev =
    (selectedNFTCollection?.historicalDatas?.stats?.ethTotalRoyaltyRevenue || 0) *
    (selectedNFTCollection?.fractionForSale || 0);
  const [bidAmount, setBidAmount] = useState((rev * DEFAULT_BID_SLIDER_PERCENTAGE) / 100);

  const onSliderValueChange = value => {
    setBidAmount((value / 100) * rev);
  };

  const signerAddress = useSelector(appContextCurrentSignerAddressSelector);

  const onBidClick = async () => {
    const collectionAddress = selectedNFTCollection?.primary_asset_contracts[0]?.address;
    const ownerAddress = selectedNFTCollection?.ownerAddress;
    const fractionForSale = selectedNFTCollection?.fractionForSale * 100 || 0;
    const investorAddress = signerAddress;
    const bidPriceInETH = bidAmount.toString();

    setIsWaitForVaultCreation(true);
    const result = await tx(
      writeContracts.RBFVaultFactory.createVault(collectionAddress, ownerAddress, investorAddress, fractionForSale, {
        value: utils.parseEther(bidPriceInETH),
      }),
      update => {
        log({ update });
        if (update?.status === "confirmed" || update?.status === 1) {
        } else {
          setIsWaitForVaultCreation(false);
          dispatch(showErrorNotificationAction(update?.data?.message));
        }
      },
    );
    log({ result });
  };

  //TODO: reading bidding details from smart contract instead of local data store
  const onSuccessfulBidTransaction = vaultAddress => {
    //Add bidDetail to selectedNFTCollection
    const bidDetail = {
      collectionAddress: selectedNFTCollection?.primary_asset_contracts[0]?.address,
      fractionForSale: selectedNFTCollection?.fractionForSale || 0,
      investorAddress: signerAddress,
      bidPriceInETH: bidAmount,
      status: BID_STATUS_PENDING_ACCEPT,
      vaultAddress,
    };
    log({ bidDetail });
    const coll = _.assign(
      _.cloneDeep(selectedNFTCollection),
      selectedNFTCollection?.bidDetails
        ? { bidDetails: [...selectedNFTCollection.bidDetails, bidDetail] }
        : { bidDetails: [bidDetail] },
    );
    dispatch(tradingCollectionUpdatedAction(coll));
    dispatch(showNotificationAction("Bid placed successfully"));
    history.push(ROUTE_PATH_REVEFIN_DASHBOARD);
  };

  return (
    <div className="mt-10">
      <div className="pb-2 border-b border-gray-200">

      </div>
      <div>
        <div className="bg-gray-100 p-10">
          <div className="flex justify-between mb-10">
            <div className="text-3xl text-left font-extrabold text-gray-900 ">Vault - {selectedNFTCollection.name}</div>
            <button
              type="button"
              className="float-right bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => {
                //todo - wire up vault address
                const vaultContract = new Contract("vaultAddress", RBFVAULTABI, userSigner);
                tx(vaultContract.activate());
              }}
            >
              Withdraw fund
            </button>
          </div>

          <div>
            <dl className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">

              <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue Recieved</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">100 ETH</dd>
              </div>

              <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Investor Share</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">50 ETH</dd>
              </div>
              <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Owner Shares</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">50 ETH</dd>
              </div>
            </dl>
          </div>
          <div>
            <h3 className="mt-10 text-lg leading-6 font-medium text-gray-900 text-left">Overview</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultView;

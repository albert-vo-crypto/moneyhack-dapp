import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table } from "antd";
import _ from "lodash";
import { useHistory } from "react-router-dom";

import {
  DEFAULT_BID_SLIDER_PERCENTAGE,
  DEFAULT_NFT_COLL_IMAGE_SRC,
  ROUTE_PATH_REVEFIN_DASHBOARD,
  BID_STATUS_SOLD,
} from "../constants";
import { nftSelectedCollectionSelector, tradingCollectionUpdatedAction } from "../stores/reducers/nft";
import SecondaryButton from "../components/Buttons/SecondaryButton";
import PercentageSlider from "../components/Inputs/PercentageSlider";
import HeaderText from "../components/Commons/HeaderText";
import { getFormatedCurrencyValue } from "../utils/commons";
import NFTCollectionDetailsList from "../components/NFT/NFTCollectionDetailsList";
import NFTInvestmentDetail from "../components/NFT/NFTInvestmentDetail";
import { utils } from "ethers";
import StepWizard from "react-step-wizard";
import externalContracts from "../contracts/external_contracts";
import { Contract } from "@ethersproject/contracts";
import { isOpenseaCollectionUsingTargetPayoutAddress } from "../utils/openseahelper";
import { selectedCollectionFirstBidDetailSelector } from "../stores";
import { log } from "../utils/commons";
import {
  appContextCurrentSignerAddressSelector,
  showErrorNotificationAction,
  showNotificationAction,
} from "../stores/reducers/appContext";
import { publishEpnsNotification } from "../utils/epnshelper";

const AcceptBidView = ({
  ethPrice,
  address,
  localProvider,
  yourLocalBalance,
  tx,
  readContracts,
  writeContracts,
  userSigner,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const selectedNFTCollection = useSelector(nftSelectedCollectionSelector);
  const selectedBidDetail = useSelector(selectedCollectionFirstBidDetailSelector);
  const vaultAddress = selectedBidDetail?.vaultAddress || "0x005143293be22AE74a46b51310DB2ab93c0D5410";
  const collectionAddress = selectedNFTCollection?.collectionAddress || "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

  const [isOwnershipTransferred, setIsOwnershipTransferred] = useState(false);
  const [isAcceptFundsTransferred, setIsAcceptFundsTransferred] = useState(false);

  const OWNABLEABI = externalContracts[1].contracts.OWNABLE.abi;
  const RBFVAULTABI = externalContracts[1].contracts.RBFVAULT.abi;

  //TODO: reading bidding details from smart contract instead of local data store
  const onFinishingAcceptingFlow = () => {
    //Update bidDetail of selectedNFTCollection to SOLD
    const bidDetail = _.cloneDeep(selectedBidDetail);
    const updatedBidDetail = _.assign(bidDetail, { status: BID_STATUS_SOLD });
    log({ updatedBidDetail });
    //TODO: support multiple bidDetail
    const coll = _.assign(_.cloneDeep(selectedNFTCollection), { bidDetails: [updatedBidDetail] });
    dispatch(tradingCollectionUpdatedAction(coll));
    dispatch(showNotificationAction("Funds transferred successfully"));
    publishEpnsNotification({
      address: bidDetail?.investorAddress,
      title: "Bid Accepted",
      msg: `for NFT royalty revenue of collection ${selectedNFTCollection?.name}`,
    });
    history.push(ROUTE_PATH_REVEFIN_DASHBOARD);
  };

  const steps = [
    { id: "Step 1", name: "Update payout address", href: "#", status: "complete" },
    { id: "Step 2", name: "Transfer ownership", href: "#", status: "current" },
    { id: "Step 3", name: "Get fund", href: "#", status: "upcoming" },
  ];

  const updateStepStatus = (stepId, status) => {
    const step = (step, index) => {
      if (step.id === stepId) {
        step.status = status;
      }
    };
  };

  const Step1 = props => {
    return (
      <>
        <div className="sm:rounded-lg text-left">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg text-gray-900 text-left">Update royalty payout wallet address</h3>
            <div className="mt-2 max-w-xl ">
              <p>
                You have to update the royalty payout address on opensea. This has to be done because this payout
                address is maintained off-chain by opensea. Plese follow the direction below.
              </p>
              <h1>Instruction:</h1>
              <ol className="list-decimal">
                <li>Navigate to your collection editor, button below will take you to your collection at opensea.</li>
                <li>
                  Under the Creator Earnings heading, adjust the Percentage fee field. You can set a percentage of up to
                  10% and you can change this percentage at any time.
                </li>
                <li>
                  Specify this '{vaultAddress}' payout wallet address which will split royalty earnings based on agreed
                  terms.
                </li>
              </ol>
            </div>
            <div className="mt-5">
              <button
                type="button"
                className="bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <a
                  class="button text-white"
                  href="https://testnets.opensea.io/collection/simpleandhealthy/edit"
                  target="_blank"
                  rel="noreferrer"
                >
                  Update royalty payout wallet address
                </a>
              </button>
            </div>
            {/* TODO: const isPayoutAddressUpdated = await isOpenseaCollectionUsingTargetPayoutAddress(selectedNFTCollection, true, vaultAddress); */}
            <button
              type="button"
              className="float-right inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
              onClick={props.nextStep}
            >
              Next
            </button>
          </div>
        </div>
      </>
    );
  };

  const Step2 = props => {
    return (
      <>
        <div className="text-left">
          <h3 className="text-lg mt-10 text-gray-900">Transfer ownership to vault</h3>
          <p>
            We'll transfer your collection ownership to the vault contract for the duration of the terms(12 months).
          </p>
          <button
            type="button"
            className="bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={async () => {
              //pass in the address for the vault&collection in context below
              const ownableContract = new Contract(collectionAddress, OWNABLEABI, userSigner);
              const result = await tx(ownableContract.transferOwnership(vaultAddress), update => {
                log({ update });
                if (update?.status === "confirmed" || update?.status === 1) {
                  dispatch(showNotificationAction("Collection ownership transferred successfully"));
                  setIsOwnershipTransferred(true);
                  props.nextStep();
                } else {
                  dispatch(showErrorNotificationAction(update?.data?.message));
                }
              });
              log({ result });
            }}
          >
            Transfer ownership
          </button>

          <button
            type="button"
            className="float-right inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            onClick={props.nextStep}
            disabled={!isOwnershipTransferred}
          >
            Next
          </button>
        </div>
      </>
    );
  };

  const Step3 = props => {
    return (
      <>
        <div className="text-left">
          <h3 className="text-lg mt-10 text-gray-900">Get Funds</h3>
          <p>Click 'Accept funds' button below to accept the fund and activate the contract.</p>
          <button
            type="button"
            className="bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={async () => {
              //pass in the address for the vault in context below
              const vaultContract = new Contract(vaultAddress, RBFVAULTABI, userSigner);
              const result = await tx(vaultContract.activate(), update => {
                log({ update });
                if (update?.status === "confirmed" || update?.status === 1) {
                  setIsAcceptFundsTransferred(true);
                  onFinishingAcceptingFlow();
                } else {
                  dispatch(showErrorNotificationAction(update?.data?.message));
                }
              });
              log({ result });
            }}
          >
            Accept funds
          </button>

          <button
            type="button"
            className="float-right inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            onClick={props.nextStep}
            disabled={!isAcceptFundsTransferred}
          >
            Finish
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="mt-10 mb-10 p-10 bg-white">
      <nav aria-label="Progress">
        <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
          {steps.map(step => (
            <li key={step.name} className="md:flex-1">
              {step.status === "complete" ? (
                <a
                  href={step.href}
                  className="group pl-4 py-2 flex flex-col border-l-4 border-indigo-600 hover:border-indigo-800 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4"
                >
                  <span className="text-xs text-indigo-600 font-semibold tracking-wide uppercase group-hover:text-indigo-800">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </a>
              ) : step.status === "current" ? (
                <a
                  href={step.href}
                  className="pl-4 py-2 flex flex-col border-l-4 border-indigo-600 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4"
                  aria-current="step"
                >
                  <span className="text-xs text-indigo-600 font-semibold tracking-wide uppercase">{step.id}</span>
                  <span className="text-sm font-medium">{step.name}</span>
                </a>
              ) : (
                <a
                  href={step.href}
                  className="group pl-4 py-2 flex flex-col border-l-4 border-gray-200 hover:border-gray-300 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4"
                >
                  <span className="text-xs text-gray-500 font-semibold tracking-wide uppercase group-hover:text-gray-700">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <StepWizard>
        <Step1 />
        <Step2 />
        <Step3 />
      </StepWizard>
    </div>
  );
};

export default AcceptBidView;

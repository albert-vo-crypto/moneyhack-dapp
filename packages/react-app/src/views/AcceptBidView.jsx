import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Table } from "antd";
import _ from "lodash";

import { DEFAULT_BID_SLIDER_PERCENTAGE, DEFAULT_NFT_COLL_IMAGE_SRC } from "../constants";
import { nftSelectedCollectionSelector } from "../stores/reducers/nft";
import SecondaryButton from "../components/Buttons/SecondaryButton";
import PercentageSlider from "../components/Inputs/PercentageSlider";
import HeaderText from "../components/Commons/HeaderText";
import { getFormatedCurrencyValue } from "../utils/commons";
import NFTCollectionDetailsList from "../components/NFT/NFTCollectionDetailsList";
import NFTInvestmentDetail from "../components/NFT/NFTInvestmentDetail";
import { appContextCurrentSignerAddressSelector } from "../stores/reducers/appContext";
import { utils } from "ethers";
import StepWizard from "react-step-wizard";
import externalContracts from "../contracts/external_contracts";
import { Contract } from "@ethersproject/contracts";

const AcceptBidView = ({
  ethPrice,
  address,
  localProvider,
  yourLocalBalance,
  tx,
  readContracts,
  writeContracts,
  userSigner }) => {
  const selectedNFTCollection = useSelector(nftSelectedCollectionSelector);
  const rev =
    (selectedNFTCollection?.historicalDatas?.stats?.ethTotalRoyaltyRevenue || 0) *
    (selectedNFTCollection?.fractionForSale || 0);
  const [bidAmount, setBidAmount] = useState((rev * DEFAULT_BID_SLIDER_PERCENTAGE) / 100);

  const onSliderValueChange = value => {
    setBidAmount((value / 100) * rev);
  };

  const OWNABLEABI = externalContracts[1].contracts.OWNABLE.abi
  const RBFVAULTABI = externalContracts[1].contracts.RBFVAULT.abi
  const signerAddress = useSelector(appContextCurrentSignerAddressSelector);
  const onBidClick = () => {
    const collectionAddress = selectedNFTCollection?.primary_asset_contracts[0]?.address;
    const ownerAddress = selectedNFTCollection?.ownerAddress;
    const fractionForSale = selectedNFTCollection?.fractionForSale * 100 || 0;
    const investorAddress = signerAddress;
    const bidPriceInETH = bidAmount.toString();;

    tx(
      writeContracts.RBFVaultFactory.createVault(collectionAddress, ownerAddress, investorAddress, fractionForSale, {
        value: utils.parseEther(bidPriceInETH),
      }),
    );

  };


  const steps = [
    { id: 'Step 1', name: 'Update payout address', href: '#', status: 'complete' },
    { id: 'Step 2', name: 'Transfer ownership', href: '#', status: 'current' },
    { id: 'Step 3', name: 'Get fund', href: '#', status: 'upcoming' },
  ]


  const Step1 = (props) => {
    return (
      <>
        <div className="bg-gray-50 sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Update royalty payout wallet address</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>You have to update the royalty payout address on opensea. This has to be done because this payout address is maintained off-chain by opensea. Plese follow the direction below.</p>
              <p>
                <ol type="1">
                  <li>Navigate to your collection editor, button below will take you to your collection at opensea.</li>
                  <li>Under the Creator Earnings heading, adjust the Percentage fee field. You can set a percentage of up to 10% and you can change this percentage at any time.</li>
                  <li>Specify the payout wallet address where you wish to receive the earnings. OpenSea is unable to split creator earnings to multiple addresses</li>
                </ol></p>
            </div>
            <div className="mt-5">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
              >
                <a class="button" href="https://testnets.opensea.io/collection/simpleandhealthy/edit" target="_blank">Update royalty payout wallet address</a>

              </button>

            </div>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
              onClick={props.nextStep}>
              Next
            </button>
          </div>
        </div>
      </>
    );
  };



  const Step2 = (props) => {
    return (
      <>
        <div>
          <p>We'll transfer your collection ownership to the vault contract for the duration of the terms(12 months).
          </p>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            onClick={() => {
              const ownableContract = new Contract("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", OWNABLEABI, userSigner);
              tx(
                ownableContract.transferOwnership("0x005143293be22AE74a46b51310DB2ab93c0D5410")
              );

            }}
          >
            Transfer ownership
          </button>

          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            onClick={props.nextStep}>
            Next
          </button>
        </div>
      </>
    );
  };

  const Step3 = (props) => {
    return (
      <>
        <div>
          <p>Click 'Accept fund' button below to accept the fund and activate the contract.</p>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            onClick={() => {
              const vaultContract = new Contract("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", RBFVAULTABI, userSigner);
              tx(
                vaultContract.activate()
              );

            }}
          >
            Accept fund
          </button>

          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            onClick={props.nextStep}>
            Finish
          </button>
        </div>
      </>
    );
  };


  return (
    <div>
      <nav aria-label="Progress">
        <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
          {steps.map((step) => (
            <li key={step.name} className="md:flex-1">
              {step.status === 'complete' ? (
                <a
                  href={step.href}
                  className="group pl-4 py-2 flex flex-col border-l-4 border-indigo-600 hover:border-indigo-800 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4"
                >
                  <span className="text-xs text-indigo-600 font-semibold tracking-wide uppercase group-hover:text-indigo-800">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </a>
              ) : step.status === 'current' ? (
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

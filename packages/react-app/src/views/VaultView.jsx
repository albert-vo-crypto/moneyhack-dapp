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
import { selectedTradingCollectionSelector, selectedCollectionFirstBidDetailSelector } from "../stores";
import { tradingCollectionUpdatedAction } from "../stores/reducers/nft";
import { utils } from "ethers";
import { log } from "../utils/commons";
import externalContracts from "../contracts/external_contracts";
import { useBalance, useContractReader } from "eth-hooks";

const BidView = ({
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
    const selectedBidDetail = useSelector(selectedCollectionFirstBidDetailSelector);
    const vaultAddress = selectedBidDetail?.vaultAddress;
    const vaultContract = new Contract(vaultAddress, RBFVAULTABI, userSigner);
    const [vaultBalance, setBalance] = useState("");
    const [vaultStatus, setVaultStatus] = useState("");
    const [ownerShares, setOwnerShares] = useState("");
    const [investorAmount, setInvestorAmount] = useState("");
    const [ownerAmount, setOwnerAmount] = useState("");
    const fetchData = async () => {
        setVaultStatus(utils.formatEther(await vaultContract.vaultStatus()) * 1e18);
        setOwnerShares(utils.formatEther(await vaultContract.shares(selectedNFTCollection?.ownerAddress)) * 1e18);
        setBalance(utils.formatEther(await vaultContract.getVaultBalance()));

        if (vaultStatus == 1) {
            setInvestorAmount((vaultBalance * (100 - ownerShares)) / 100);
            setOwnerAmount((vaultBalance * (ownerShares)) / 100);
        } else {
            setInvestorAmount(0);
            setOwnerAmount(0);
        }
    };
    useEffect(() => {
        fetchData();
    }, [vaultAddress, vaultBalance, vaultContract]);

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
            <div className="pb-2 border-b border-gray-200"></div>
            <div>
                <div className="bg-gray-100 p-10 shadow">
                    <div className="flex justify-between mb-10">
                        <div className="text-3xl text-left font-extrabold text-gray-900 ">Vault - {selectedNFTCollection.name}</div>
                        <div className="text-left text-gray-900 ">{vaultAddress}</div>
                        <button
                            type="button"
                            className="float-right bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={() => {
                                tx(vaultContract.release(address));
                            }}
                        >
                            Withdraw funds
                        </button>
                    </div>

                    <div>
                        <dl className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
                            <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue Recieved</dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">{vaultBalance} ETH</dd>
                            </div>

                            <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">Investor Share</dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">{investorAmount} ETH</dd>
                            </div>
                            <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">Owner Share</dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">{ownerAmount} ETH</dd>
                            </div>
                        </dl>
                    </div>
                    <div>
                        <h3 className="mt-10 text-lg leading-6 font-medium text-gray-900 text-left">Overview</h3>
                        <div className="mt-4 lg:mt-0 lg:row-span-3">
                            <dl className="mt-2 border-t border-b border-gray-200 divide-y divide-gray-200">
                                <div className="py-3 flex justify-between text-sm font-medium">
                                    <dt className="text-gray-500">Revenue Period left</dt>
                                    <dd className="text-gray-900">12 Months</dd>
                                </div>

                                <div className="py-3 flex justify-between text-sm font-medium">
                                    <dt className="text-gray-500">Owner % share</dt>
                                    <dd className="text-gray-900">{ownerShares}</dd>
                                </div>
                                <div className="py-3 flex justify-between text-sm font-medium">
                                    <dt className="text-gray-500">Investor % share</dt>
                                    <dd className="text-gray-900">{100 - ownerShares}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <div>
                        <h3 className="mt-10 text-lg leading-6 font-medium text-gray-900 text-left">Manage</h3>

                        <button
                            type="button"
                            className="mt-5 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-gray-700 bg-white hover:bg-gray-50  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={() => {
                                tx(vaultContract.refundTheLender());
                            }}
                        >
                            Get Refund
                        </button>

                        <button
                            type="button"
                            className="mt-5 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-gray-700 bg-white hover:bg-gray-50  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={() => {
                                tx(vaultContract.returnOwnershipToCollectionOwner());
                            }}
                        >
                            Get Ownership back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BidView;

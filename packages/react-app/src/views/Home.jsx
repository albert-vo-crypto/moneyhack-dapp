import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import React from "react";
import { Link, useHistory } from "react-router-dom";

import { ROUTE_PATH_EXPLORE_REVENUE_STREAMS } from "../constants";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home({ yourLocalBalance, readContracts }) {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract
  const purpose = useContractReader(readContracts, "YourContract", "purpose");
  const history = useHistory();

  return (
    <main className="lg:relative">
      <div className="mx-auto max-w-7xl w-full pt-16 pb-20 text-center lg:py-48 lg:text-left">
        <div className="px-4 lg:w-1/2 sm:px-8 xl:pr-16">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
            <span className="block xl:inline">A better way to</span>{" "}
            <span className="block text-indigo-600 xl:inline">Raise capital</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
            Revefin transforms recurring revenue into up-front capital for growth without dilution or restrictive debt.
          </p>
          <div className="mt-10 sm:flex sm:justify-center lg:justify-start">
            <div className="rounded-md shadow">
              <button
                type="button"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                onClick={() => history.push(ROUTE_PATH_EXPLORE_REVENUE_STREAMS)}
              >
                Get started
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full h-64 sm:h-72 md:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 lg:h-full">
        <img src="./hero1.jpg" alt="" class="object-cover pointer-events-none group-hover:opacity-75" />
      </div>
    </main>
  );
}

export default Home;

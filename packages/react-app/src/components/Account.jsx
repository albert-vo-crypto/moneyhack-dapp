import { Button } from "antd";
import React from "react";
import { useThemeSwitcher } from "react-css-theme-switcher";

import Address from "./Address";
import Balance from "./Balance";
import Wallet from "./Wallet";

/** 
  ~ What it does? ~

  Displays an Address, Balance, and Wallet as one Account component,
  also allows users to log in to existing accounts and log out

  ~ How can I use? ~

  <Account
    useBurner={boolean}
    address={address}
    localProvider={localProvider}
    userProvider={userProvider}
    mainnetProvider={mainnetProvider}
    price={price}
    web3Modal={web3Modal}
    loadWeb3Modal={loadWeb3Modal}
    logoutOfWeb3Modal={logoutOfWeb3Modal}
    blockExplorer={blockExplorer}
    isContract={boolean}
  />

  ~ Features ~

  - Provide address={address} and get balance corresponding to the given address
  - Provide localProvider={localProvider} to access balance on local network
  - Provide userProvider={userProvider} to display a wallet
  - Provide mainnetProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth")
  - Provide price={price} of ether and get your balance converted to dollars
  - Provide web3Modal={web3Modal}, loadWeb3Modal={loadWeb3Modal}, logoutOfWeb3Modal={logoutOfWeb3Modal}
              to be able to log in/log out to/from existing accounts
  - Provide blockExplorer={blockExplorer}, click on address and get the link
              (ex. by default "https://etherscan.io/" or for xdai "https://blockscout.com/poa/xdai/")
**/

export default function Account({
  useBurner,
  address,
  userSigner,
  localProvider,
  mainnetProvider,
  price,
  minimized = true,
  web3Modal,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  blockExplorer,
  isContract,
}) {
  const { currentTheme } = useThemeSwitcher();

  const modalButtons = [];
  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      modalButtons.push(
        <button
          onClick={logoutOfWeb3Modal}
          type="button"
          class="h-10 w-10 inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-navbg bg-gray hover:bg-highlight focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-highlight"
        >
          <svg class="h-full w-full text-navtext" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </button>,
      );
    } else {
      modalButtons.push(
        <button
          onClick={loadWeb3Modal}
          type="button"
          class="inline-flex items-center px-4 py-2 border border-navtext text-sm font-medium rounded-md shadow-sm text-navtext hover:text-highlight hover:border-highlight focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-highlight focus:text-highlight"
        >
          Connect Wallet
        </button>,
      );
    }
  }
  const display = minimized ? (
    ""
  ) : (
    <span>
      {web3Modal && web3Modal.cachedProvider ? (
        <>
          {address && <Address address={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} />}
          <Balance address={address} provider={localProvider} price={price} />
          <Wallet
            address={address}
            provider={localProvider}
            signer={userSigner}
            ensProvider={mainnetProvider}
            price={price}
            color={currentTheme === "light" ? "#1890ff" : "#2caad9"}
          />
        </>
      ) : useBurner ? (
        ""
      ) : isContract ? (
        <>
          {address && <Address address={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} />}
          <Balance address={address} provider={localProvider} price={price} />
        </>
      ) : (
        ""
      )}
      {useBurner && web3Modal && !web3Modal.cachedProvider ? (
        <>
          <Address address={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} />
          <Balance address={address} provider={localProvider} price={price} />
          <Wallet
            address={address}
            provider={localProvider}
            signer={userSigner}
            ensProvider={mainnetProvider}
            price={price}
            color={currentTheme === "light" ? "#1890ff" : "#2caad9"}
          />
        </>
      ) : (
        <></>
      )}
    </span>
  );

  return (
    <div>
      {display}
      {modalButtons}
    </div>
  );
}

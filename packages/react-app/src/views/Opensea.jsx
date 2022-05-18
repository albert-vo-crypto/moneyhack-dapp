import { Select } from "antd";
import React, { useState, useEffect } from "react";
import { utils } from "ethers";

import { useTokenList } from "eth-hooks/dapps/dex";
import { Address, AddressInput, Balance, Events } from "../components";
//import { OpenSeaPort, Network, api } from 'opensea-js';



//////
import { Button, Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { Stocks } from "./Stocks";

const { Option } = Select;

// const options = {method: 'GET', headers: {Accept: 'application/json'}};

// fetch('https://api.opensea.io/api/v1/collection/doodles-official/stats', options)
// .then(response => response.json())
// .then(response => console.log(response))
// .catch(err => console.error(err));

export const stockData = [
  {
    company: "Twitter Inc",
    ticker: "TWTR",
    stockPrice: "22.76 USD",
    timeElapsed: "5 sec ago",
  },
  {
    company: "Square Inc",
    ticker: "SQ",
    stockPrice: "45.28 USD",
    timeElapsed: "10 sec ago",
  },
  {
    company: "Shopify Inc",
    ticker: "SHOP",
    stockPrice: "341.79 USD",
    timeElapsed: "3 sec ago",
  },
  {
    company: "Sunrun Inc",
    ticker: "RUN",
    stockPrice: "9.87 USD",
    timeElapsed: "4 sec ago",
  },
  {
    company: "Adobe Inc",
    ticker: "ADBE",
    stockPrice: "300.99 USD",
    timeElapsed: "10 sec ago",
  },
  {
    company: "HubSpot Inc",
    ticker: "HUBS",
    stockPrice: "115.22 USD",
    timeElapsed: "12 sec ago",
  },
];


  // useEffect(() => {
  //   // declare the data fetching function
  //   const fetchData = async () => {
  //     console.log("--------------------before fetch opensea");
  //     const opensea_response = await fetch('https://api.opensea.io/api/v1/collection/doodles-official/stats', options)
  //     const opensea_result = await opensea_response.json(); 
  //     console.log("--------------------after fetch opensea", opensea_result);
  //     setOpenseaResult(opensea_result);
  //   }}, [])
  // console.log("THIS IS FOR OPENSEA API")


  // const UsingFetch = () => {
  //   const [users, setUsers] = useState([])

  //   const fetchData = () => {
  //     fetch("https://jsonplaceholder.typicode.com/users")
  //       .then(response => {
  //         return response.json()
  //       })
  //       .then(data => {
  //         setUsers(data)
  //       })
  //   }

  //   useEffect(() => {
  //     fetchData()
  //   }, [])


  //   return (
  //     <div>
  //       {users.length > 0 && (
  //         <ul>
  //           {users.map(user => (
  //             <li key={user.id}>{user.name}</li>
  //           ))}
  //         </ul>
  //       )}
  //     </div>
  //   )
  // }


export default function Opensea({
  purpose,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
  response
}) {
  const [newPurpose, setNewPurpose] = useState("loading...");

  const [openseaResult, setOpenseaResult] = useState([]);

  const options = {method: 'GET', headers: {Accept: 'application/json'}};


  const [users, setUsers] = useState([])

  const fetchData = async () => {
    await fetch("https://jsonplaceholder.typicode.com/users")
      .then(response => {
        return response.json()
      })
      .then(data => {
        setUsers(data)
      })
  }
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData2 = () => {
    fetch("https://api.opensea.io/api/v1/collection/doodles-official/stats")
      .then(response => {
        return response.json()
      })
      .then(data => {
        setOpenseaResult(data)
      })
  }
  useEffect(() => {
    console.log('*******fetchData2')
    fetchData2()
  }, [])

  // async function postData() {

  //   console.log("--------------------before fetch opensea");
  //   const opensea_response = await fetch('https://api.opensea.io/api/v1/collection/doodles-official/stats', options)
  //   const opensea_result = await opensea_response.json(); 
  //   console.log("--------------------after fetch opensea", opensea_result);
  //   return opensea_result;
  // } 

  const collections = [
    'cryptopunks',
    'boredapeyachtclub',
    'mutant-ape-yacht-club',
  ];

  const promises = collections.map(collection => { // note the map
      // note the return
      return fetch(`https://api.opensea.io/api/v1/collection/${collection}/stats`)
        .then(response => response.json());
    });
  const results =  Promise.all(promises);
  console.log('-----Opensea results', results);
  //console.log(results);


  const openseadata = collections.map(collection => { // note the map
      // note the return
      return fetch(`https://api.opensea.io/api/v1/collection/${collection}`)
        .then(response => response.json());
    });
  const newresults =  Promise.all(openseadata);
  console.log('-----NEW Opensea results');
  console.log(newresults);
  return (

    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div>
        {users.length > 0 && (
          <ul>
            {users.map(user => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        )}
        {promises.length > 0 && (
          <ul>
            {users.map(user => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        )}

{/*          {results}*/}
{/*          <ul>
                {openseaResult.map( stats => (
              
                  <li key={stats.id}>{stats.one_day_volume}</li>
                  ))}
              }
          </ul>*/}
{/*          {promises.length > 0 && (
          <ul>
            // {Promise.map(stats => (
              <li key={promises.id}>{promises.stats}</li>
            ))}

          </ul>
        )}*/}
{/*          <ul>
{/*          {results}*/}
{/*            {results.map(stats => <div>{home.name}</div>)}
          </ul>}}
          {users.length > 0 && (
          <ul>
            {users.map(user => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        )}

{/*          {openseaResult.length > 0 && (
          <ul>
            {users.map(user => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        )}*/}
      </div>

      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
        <h2>Example UI:</h2>
        <h4>purpose: {purpose}</h4>

        <Divider />
        <div style={{ margin: 8 }}>
          <Input
            onChange={e => {
              setNewPurpose(e.target.value);
            }}
          />
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {
              /* look how you call setPurpose on your contract: */
              /* notice how you pass a call back for tx updates too */
              const result = tx(writeContracts.YourContract.setPurpose(newPurpose), update => {
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                      update.gasUsed +
                      "/" +
                      (update.gasLimit || update.gas) +
                      " @ " +
                      parseFloat(update.gasPrice) / 1000000000 +
                      " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);
            }}
          >
            Set Purpose!
          </Button>
        </div>
        <Divider />
        Your Address:
        <Address address={address} ensProvider={mainnetProvider} fontSize={16} />
        <Divider />
        ENS Address Example:
        <Address
          address="0x34aA3F359A9D614239015126635CE7732c18fDF3" /* this will show as austingriffith.eth */
          ensProvider={mainnetProvider}
          fontSize={16}
        />
        <Divider />
        {/* use utils.formatEther to display a BigNumber: */}
        <h2>Your Balance: {yourLocalBalance ? utils.formatEther(yourLocalBalance) : "..."}</h2>
        <div>OR</div>
        <Balance address={address} provider={localProvider} price={price} />
        <Divider />
        <div>🐳 Example Whale Balance:</div>
        <Balance balance={utils.parseEther("1000")} provider={localProvider} price={price} />
        <Divider />
        {/* use utils.formatEther to display a BigNumber: */}
        <h2>Your Balance: {yourLocalBalance ? utils.formatEther(yourLocalBalance) : "..."}</h2>
        <Divider />
        Your Contract Address:
        <Address
          address={readContracts && readContracts.YourContract ? readContracts.YourContract.address : null}
          ensProvider={mainnetProvider}
          fontSize={16}
        />
        <Divider />
        <div style={{ margin: 8 }}>
          <Button
            onClick={() => {
              /* look how you call setPurpose on your contract: */
              tx(writeContracts.YourContract.setPurpose("🍻 Cheers"));
            }}
          >
            Set Purpose to &quot;🍻 Cheers&quot;
          </Button>
        </div>
        <div style={{ margin: 8 }}>
          <Button
            onClick={() => {
              /*
              you can also just craft a transaction and send it to the tx() transactor
              here we are sending value straight to the contract's address:
            */
              tx({
                to: writeContracts.YourContract.address,
                value: utils.parseEther("0.001"),
              });
              /* this should throw an error about "no fallback nor receive function" until you add it */
            }}
          >
            Send Value
          </Button>
        </div>
        <div style={{ margin: 8 }}>
          <Button
            onClick={() => {
              /* look how we call setPurpose AND send some value along */
              tx(
                writeContracts.YourContract.setPurpose("💵 Paying for this one!", {
                  value: utils.parseEther("0.001"),
                }),
              );
              /* this will fail until you make the setPurpose function payable */
            }}
          >
            Set Purpose With Value
          </Button>
        </div>
        <div style={{ margin: 8 }}>
          <Button
            onClick={() => {
              /* you can also just craft a transaction and send it to the tx() transactor */
              tx({
                to: writeContracts.YourContract.address,
                value: utils.parseEther("0.001"),
                data: writeContracts.YourContract.interface.encodeFunctionData("setPurpose(string)", [
                  "🤓 Whoa so 1337!",
                ]),
              });
              /* this should throw an error about "no fallback nor receive function" until you add it */
            }}
          >
            Another Example
          </Button>
        </div>
      </div>

      {/*
        📑 Maybe display a list of events?
          (uncomment the event and emit line in YourContract.sol! )
      */}
      <Events
        contracts={readContracts}
        contractName="YourContract"
        eventName="SetPurpose"
        localProvider={localProvider}
        mainnetProvider={mainnetProvider}
        startBlock={1}
      />

      <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 256 }}>
        <Card>
          Check out all the{" "}
          <a
            href="https://github.com/austintgriffith/scaffold-eth/tree/master/packages/react-app/src/components"
            target="_blank"
            rel="noopener noreferrer"
          >
            📦 components
          </a>
        </Card>

        <Card style={{ marginTop: 32 }}>
          <div>
            There are tons of generic components included from{" "}
            <a href="https://ant.design/components/overview/" target="_blank" rel="noopener noreferrer">
              🐜 ant.design
            </a>{" "}
            too!
          </div>

          <div style={{ marginTop: 8 }}>
            <Button type="primary">Buttons</Button>
          </div>

          <div style={{ marginTop: 8 }}>
            <SyncOutlined spin /> Icons
          </div>

          <div style={{ marginTop: 8 }}>
            Date Pickers?
            <div style={{ marginTop: 2 }}>
              <DatePicker onChange={() => {}} />
            </div>
          </div>

          <div style={{ marginTop: 32 }}>
            <Slider range defaultValue={[20, 50]} onChange={() => {}} />
          </div>

          <div style={{ marginTop: 32 }}>
            <Switch defaultChecked onChange={() => {}} />
          </div>

          <div style={{ marginTop: 32 }}>
            <Progress percent={50} status="active" />
          </div>

          <div style={{ marginTop: 32 }}>
            <Spin />
          </div>
        </Card>
      </div>
    </div>
  );
}


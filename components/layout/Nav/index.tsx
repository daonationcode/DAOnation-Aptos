import React, { useState, useEffect } from "react";
import { Button } from "@heathmont/moon-core-tw";
import { SoftwareLogOut } from "@heathmont/moon-icons-tw";
import isServer from "../../../components/isServer";
import { AptosClient, AptosAccount, CoinClient, FaucetClient } from "aptos";
import config from '../../../services/config.json';


declare let window: any;
let running = false;
export function Nav(): JSX.Element {
  const [acc, setAcc] = useState('');
  const [accFull, setAccFull] = useState('');
  const [Balance, setBalance] = useState("");
  const [count, setCount] = useState(0);

  const [isSigned, setSigned] = useState(false);
  async function fetchInfo() {
    if (typeof window.aptos === "undefined") {
      window.document.getElementById("withoutSign").style.display = "none";
      window.document.getElementById("withSign").style.display = "none";
      window.document.getElementById("installPetra").style.display = "";
      running = false;
      return;
    } else {
      window.document.getElementById("withoutSign").style.display = "";
      window.document.getElementById("withSign").style.display = "none";
      window.document.getElementById("installPetra").style.display = "none";
    }
    if (await window?.aptos?.isConnected()) {
      let aptos_account = (await window.aptos.account()).address ;
      if (aptos_account !== false) {
        try {
          const client = new AptosClient(config.network);
          const coinClient = new CoinClient(client); // <:!:section_1a



          let Balance = Number(await coinClient.checkBalance(aptos_account));
          let subbing = 10;

          if (window.innerWidth > 500) {
            subbing = 20;
          }
          setAcc(aptos_account.toString().substring(0, subbing) + "...");
          setAccFull(aptos_account.toString());
          console.log(Balance)
          setBalance(Balance / 1e8 + " APT");
          if (!isSigned)
            setSigned(true);

          window.document.getElementById("withoutSign").style.display = "none";
          window.document.getElementById("withSign").style.display = "";
          running = false;
          return;
        } catch (error) {
          console.error(error);
          running = false;
          return;
        }


      } else {
        running = false;
        return;
      }

    } else {
      setSigned(false);
      window.document.getElementById("withoutSign").style.display = "";
      window.document.getElementById("withSign").style.display = "none";
    }
  }
  useEffect(() => {
    if (!running) {
      if (!isSigned || acc === "") {

        running = true;
        fetchInfo();
      }
    }
    if (acc !== "") { running = false; }
  }, [count]);


  setInterval(() => {
    if (!isServer()) {

      if (document.readyState === "complete" && !running) {
        setCount(count + 1);

      }
    }
  }, 1000)


  async function onClickDisConnect() {
    await window.aptos.disconnect();
    window.location.href = "/";
  }

  return (
    <nav className="main-nav w-full flex justify-between items-center">
      <ul className="flex justify-between items-center w-full">
        {isSigned ? (<>

          <li>
            <a href="/daos" >
              <Button style={{ background: 'none', border: '0px', color: 'white' }}> DAO</Button>
            </a>
          </li>
          <li>
            <a href="/CreateDao">
              <Button style={{ background: 'none', border: '0px', color: 'white' }}>Create DAO</Button>
            </a>
          </li>
        </>) : (<></>)}

        <li className="Nav walletstatus flex flex-1 justify-end">
          <div className="py-2 px-4 flex row items-center" id="withoutSign">

            <a href="/login?[/]">
              <Button variant="tertiary">Log in</Button>
            </a>
          </div>
          <div
            id="installPetra"
            style={{ display: "none" }}
            className="wallets"
          >
            <div className="wallet">
            <Button variant="tertiary" onClick={() => { window.open("https://chrome.google.com/webstore/detail/petra-aptos-wallet/ejjladinnckdgjemekebdpeokbikhfci", "_blank") }}>Petra</Button>
             </div>
          </div>

          <div id="withSign" className="wallets" style={{ display: "none" }}>
            <div className="wallet" style={{ height: 48, display: "flex", alignItems: "center" }}>
              <div className="wallet__wrapper gap-4 flex items-center">
                <div className="wallet__info flex flex-col items-end">
                  <a href={"/Profile/"+accFull} rel="noreferrer" className="text-primary">
                    <div className="font-medium " style={{color: 'var(--title-a-text)'}}>{acc}</div>
                  </a>
                  <div className="text-goten">{Balance}</div>
                </div>
                <Button iconOnly onClick={onClickDisConnect}>
                  <SoftwareLogOut
                    className="text-moon-24"
                    transform="rotate(180)"
                  ></SoftwareLogOut>
                </Button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  );
}

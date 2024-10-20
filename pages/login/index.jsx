import React, { useState, useEffect } from "react";
import { Header } from "../../components/layout/Header";
import Head from "next/head";
import styles from "./Login.module.scss";
import Button from "@heathmont/moon-core-tw/lib/button/Button";
import GenericClose from "@heathmont/moon-icons-tw/icons/GenericClose";
import GenericCheckRounded from "@heathmont/moon-icons-tw/icons/GenericCheckRounded";
import isServer from "../../components/isServer";

let redirecting = "";
export default function Login() {
  const [ConnectStatus, setConnectStatus] = useState(false);

  if (!isServer()) {
    const regex = /\[(.*)\]/g;
    const str = decodeURIComponent(window.location.search);
    let m;

    while ((m = regex.exec(str)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      redirecting = m[1];
    }
  }



  const fetchDataStatus = async () => {
    if (await window.aptos.isConnected()) {
      setConnectStatus(true);
      window.location.href = redirecting;

    } else {
      setConnectStatus(false);
    }

  };
  useEffect(() => {
    if (!isServer()) {
      setInterval(() => {
       
        fetchDataStatus();
      }, 1000);
    }
  }, []);
  if (isServer()) return null;



  function Wallet() {
    if (typeof window.aptos === "undefined") {
      return (
        <>
          <div className="flex gap-6 flex w-full items-center">
            <div
              style={{ height: 80, width: 80, border: "1px solid #EBEBEB" }}
              className="p-4 rounded-xl"
            >
              <img src="https://petra.app/favicon.ico" />
            </div>
            <div className="flex flex-1 flex-col">
              <span className="font-bold">Petra Wallet</span>

            </div>
            <Button onClick={onClickConnect} style={{ width: 148 }}>
              Install Petra
            </Button>
          </div>
        </>
      );
    }
    if (!ConnectStatus) {
      return (
        <>
          <div className="flex gap-6 flex w-full items-center">
            <div
              style={{ height: 80, width: 80, border: "1px solid #EBEBEB" }}
              className="p-4 rounded-xl"
            >
              <img src="https://petra.app/favicon.ico" />
            </div>
            <div className="flex flex-1 flex-col">
              <span className="font-bold">Petra wallet</span>
              <span
                className="flex items-center gap-1"
                style={{ color: "#FF4E64" }}
              >
                <GenericClose
                  className="text-moon-32"
                  color="#FF4E64"
                ></GenericClose>
                Disconnected
              </span>
            </div>
            <Button onClick={onClickConnect} style={{ width: 112 }}>
              Connect
            </Button>
          </div>
        </>
      );
    }
    if (ConnectStatus) {
      return (
        <>
          <div className="flex gap-6 flex-1 w-full items-center">
            <div
              style={{ height: 80, width: 80, border: "1px solid #EBEBEB" }}
              className="p-4 rounded-xl"
            >
              <img src="https://petra.app/favicon.ico" />
            </div>
            <div className="flex flex-1 flex-col">
              <span className="font-bold">Petra wallet</span>
              <span
                className="flex items-center gap-1"
                style={{ color: "#40A69F" }}
              >
                <GenericCheckRounded
                  className="text-moon-32"
                  color="#40A69F"
                ></GenericCheckRounded>
                Connected
              </span>
            </div>
            <Button
              onClick={onClickDisConnect}
              variant="secondary"
              style={{ width: 112 }}
            >
              Disconnect
            </Button>
          </div>
        </>
      );
    }
    return <> </>
  }
  async function onClickConnect() {
    await window.aptos.connect();
    if ((await window.aptos.account()).address != null) {
      setConnectStatus(true);
    } else {
      setConnectStatus(false);
    }

  }
  async function onClickDisConnect() {
    await window.aptos.disconnect();
  }



  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="DAOnation - Login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header></Header>
      <div className={`${styles.container} flex items-center flex-col gap-8`}>
        <div className={`${styles.title} gap-8 flex flex-col`}>
          <h1 className="text-moon-32 font-bold">Login to your account</h1>
          <p className="text-trunks">Please connect to Petra wallet in order to login.</p>
        </div>
        <div className={styles.divider}></div>
        <div className={`${styles.title} flex flex-col items-center gap-8`}>
          <Wallet />
        </div>

      </div>
    </>
  );
}

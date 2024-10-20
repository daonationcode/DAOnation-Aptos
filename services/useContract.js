import { useState, useEffect } from "react";
import { Network, Provider } from "aptos";
import { Aptos, AptosConfig } from "@aptos-labs/ts-sdk";

import config from './config.json'

const NETWORK= "devnet";
const aptosClient = new Aptos(new AptosConfig({ network: NETWORK }));

export const moduleAddress = config.moduleAddress;

export default function useContract() {
	const [contractInstance, setContractInstance] = useState({
		contract: null,
		signerAddress: null,
		sendTransaction: sendTransaction,
		formatTemplate: formatTemplate
	})

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (await window?.aptos?.isConnected()){
				
					const contract = { contract: null, signerAddress: null, sendTransaction: sendTransaction, formatTemplate: formatTemplate };
					// contract.contract =  await window?.tronWeb?.contract().at('TEUDyT7MoxQooefepkZP2UAJs9u5xJRA1Q');
					contract.signerAddress =  (await window?.aptos?.account())?.address ;
					window.contract = aptosClient;

					window.sendTransaction = sendTransaction;

					setContractInstance(contract);
					console.clear();
				}
			} catch (error) {
				console.error(error)
			}
		}

		fetchData()
	}, [])


	async function sendTransaction(function_name,args=[], addSigner = true) {
		let aptos_account = (await window.aptos.account()).address ;
		if (!aptos_account) return ;
		if (addSigner ) args = [moduleAddress,...args];
		const payload = {
			type: "entry_function_payload",
			function: `${moduleAddress}::${config.moduleName}::${function_name}`,
			type_arguments: [],
			arguments: args,
		  };
		await window.aptos.signAndSubmitTransaction(payload);
		
	}

	return contractInstance
}


export function formatTemplate(template, changings) {



	for (let i = 0; i < changings.length; i++) {
		const element = changings[i];
		template = template.replaceAll("{{" + element.key + "}}", element.value);
	}
	return template;

}
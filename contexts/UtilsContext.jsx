"use client";
import { useContext, useEffect, useState } from "react";
import { createContext } from "react";

const AppContext = createContext({
	BatchDonate: async () => { },
	BatchJoin: async () => { },
	BatchVoteConviction: async () => { },
});

export function UtilsProvider({ children }) {



	// async function BatchDonate(amount, Recipient, ideas_id,Coin) {
	// 	if (Number(window.ethereum.networkVersion) === 1287 && Coin == "TRX") { //If Coin is TRX then it will use normal batch
	// 		let to = [];
	// 		let value = [];
	// 		let callData = [];
	// 		let gasLimit = [];

	// 		//Adding Sending amount to Batch paramaters:
	// 		to.push(Recipient);
	// 		value.push(`${(amount* 1e18).toFixed(0)}`)
	// 		callData.push("0x");

	// 		//Adding save information into smart contract
	// 		to.push(DAOnation.address);


	// 		let web3 = new Web3(window.ethereum);
	// 		const DAOnationContract = new web3.eth.Contract(DAOnation.abi, DAOnation.address).methods

	// 		let encodedCallData = DAOnationContract.add_donation(ideas_id, `${amount * 1e18}`).encodeABI();

	// 		callData.push(encodedCallData);


	// 		//Sending Batch Transaction
	// 		let batchAdd = "0x0000000000000000000000000000000000000808";
	// 		let targetSigner = new ethers.providers.Web3Provider(window.ethereum).getSigner();
	// 		let BatchContract = new ethers.Contract(batchAdd, BatchABI.abi, targetSigner);

	// 		await (await BatchContract.batchAll(to, value, callData, gasLimit)).wait();
	// 	}
	// 	if (Number(window.ethereum.networkVersion) === 1287 && Coin == "xcvGLMR") { //If Coin is TRX then it will use normal batch
	
	// 		let to = [];
	// 		let value = [];
	// 		let callData = [];
	// 		let gasLimit = [];

	// 		const provider = new ethers.providers.Web3Provider(window.ethereum);
	// 		//Approve the amount first
	// 		const vTokenContract = new ethers.Contract(vTokenAbi.address, vTokenAbi.abi, provider)
	// 		let encodedCallData = await vTokencontract.approve(MoonbeamSlpx.address,(amount* 1e18));
	// 		to.push(vTokenAbi.address);
	// 		callData.push(encodedCallData.data);
		

	// 		//Transfer to recipient address
	// 		const MoonbeamSlpxContract = new ethers.Contract(MoonbeamSlpx.address, MoonbeamSlpx.abi, provider)
	// 		let encodedCallData2 =  await MoonbeamSlpxcontract.swapAssetsForExactNativeAssets(vTokenAbi.address,(amount* 1e18),(amount* 1e17),Recipient);
	// 		to.push(MoonbeamSlpx.address);
	// 		callData.push(encodedCallData2.data);
		


	// 		//Adding save information into smart contract
	// 		to.push(DAOnation.address);

	// 		let web3 = new Web3(window.ethereum);
	// 		const DAOnationContract = new web3.eth.Contract(DAOnation.abi, DAOnation.address).methods
	// 		let encodedCallData3 = DAOnationContract.add_donation(ideas_id, `${amount * 1e18}`).encodeABI();
	// 		callData.push(encodedCallData3);


			
	// 		//Sending Batch Transaction
	// 		let batchAdd = "0x0000000000000000000000000000000000000808";
	// 		let targetSigner = new ethers.providers.Web3Provider(window.ethereum).getSigner();
	// 		let BatchContract = new ethers.Contract(batchAdd, BatchABI.abi, targetSigner);

	// 		await (await BatchContract.batchAll(to, value, callData, gasLimit)).wait();
	// 	}


	// }

	// async function BatchJoin(amount, Recipient, dao_id) {
	// 	if (Number(window.ethereum.networkVersion) === 1287) { //If it is sending from Moonbase then it will not use Biconomy Batch Transactions
	// 		let to = [];
	// 		let value = [];
	// 		let callData = [];
	// 		let gasLimit = [];

	// 		//Adding Sending amount to Batch paramaters:
	// 		to.push(Recipient);
	// 		value.push(`${ (amount* 1e18).toFixed(0)}`)
	// 		callData.push("0x");

	// 		//Adding save information into smart contract
	// 		to.push(DAOnation.address);


	// 		let web3 = new Web3(window.ethereum);
	// 		const DAOnationContract = new web3.eth.Contract(DAOnation.abi, DAOnation.address).methods

	// 		let encodedCallData = DAOnationContract.join_community(dao_id, window?.tronWeb?.defaultAddress?.base58.toString().toLocaleLowerCase()).encodeABI();

	// 		callData.push(encodedCallData);


	// 		//Sending Batch Transaction
	// 		let batchAdd = "0x0000000000000000000000000000000000000808";
	// 		let targetSigner = new ethers.providers.Web3Provider(window.ethereum).getSigner();
	// 		let BatchContract = new ethers.Contract(batchAdd, BatchABI.abi, targetSigner);

	// 		await (await BatchContract.batchAll(to, value, callData, gasLimit)).wait();
	// 	}
	// }

	// async function BatchVoteConviction( Goalid,id,voteType,PollIndex,VoteAmount,Conviction,SplitInfo,AbstainInfo) {
		
	// 	let targetSigner = new ethers.providers.Web3Provider(window.ethereum).getSigner();
	// 	let ConvictionAddr = "0x0000000000000000000000000000000000000812";
	
	// 	let web3 = new Web3(window.ethereum);
	// 	const DAOnationContract = new web3.eth.Contract(DAOnation.abi, DAOnation.address).methods
	
	// 	if (Number(window.ethereum.networkVersion) === 1287) { //If it is sending from Moonbase then it will not use Biconomy Batch Transactions
	// 		let to = [];
	// 		let value = [];
	// 		let callData = [];
	// 		let gasLimit = [];

	
	// 		//Create Goal Ideas into smart contract
	// 		let encodedCallData = DAOnationContract.create_goal_ideas_vote(Number(Goalid), Number(id), window?.tronWeb?.defaultAddress?.base58.toString().toLocaleLowerCase()).encodeABI();
			
	// 		to.push(DAOnation.address);
	// 		callData.push(encodedCallData);

	// 		//Conviction Vote
			
	// 		let encodedCallData2 = null;
			
	// 		if (voteType=="aye"){
	// 			encodedCallData2 = await ConvictionVotingcontract.voteYes(Number(PollIndex), Number(VoteAmount), Number(Conviction));
	// 		}else if (voteType=="nay"){
	// 			encodedCallData2 =  await ConvictionVotingcontract.voteNo(Number(PollIndex), Number(VoteAmount), Number(Conviction));
	// 		}else if (voteType=="split"){
	// 			encodedCallData2 =  await ConvictionVotingcontract.voteSplit(Number(PollIndex), Number(SplitInfo[0]), Number(SplitInfo[1]));
	// 		}else if (voteType=="abstain"){
	// 			encodedCallData2 =  await ConvictionVotingcontract.voteSplitAbstain(Number(PollIndex), Number(AbstainInfo[0]), Number(AbstainInfo[1], Number(AbstainInfo[2])));

	// 		}

	// 		to.push(ConvictionAddr);
		
	// 		callData.push(encodedCallData2.data);



	// 		//Sending Batch Transaction
	// 		let batchAdd = "0x0000000000000000000000000000000000000808";
	// 		let targetSigner = new ethers.providers.Web3Provider(window.ethereum).getSigner();
	// 		let BatchContract = new ethers.Contract(batchAdd, BatchABI.abi, targetSigner);

	// 		await (await BatchContract.batchAll(to, value, callData, gasLimit)).wait();



	// 	}else{
				
	// 		if (voteType=="aye"){
	// 			await window.sendTransaction(await  ConvictionVotingcontract.voteYes(Number(PollIndex), Number(VoteAmount), Number(Conviction)))
	// 		}else if (voteType=="nay"){
	// 			await window.sendTransaction(await  ConvictionVotingcontract.voteNo(Number(PollIndex), Number(VoteAmount), Number(Conviction)))
	// 		}else if (voteType=="split"){
	// 			await window.sendTransaction(await  ConvictionVotingcontract.voteSplit(Number(PollIndex), Number(SplitInfo[0]), Number(SplitInfo[1])))
	// 		}else if (voteType=="abstain"){
	// 			await window.sendTransaction(await  ConvictionVotingcontract.voteSplitAbstain(Number(PollIndex), Number(AbstainInfo[0]), Number(AbstainInfo[1], Number(AbstainInfo[2]))))

	// 		}
	// 		await window.sendTransaction(await  DAOnationcontract.create_goal_ideas_vote(Number(Goalid), Number(id), window?.tronWeb?.defaultAddress?.base58.toString().toLocaleLowerCase()))
	// 	}
	// }

	return (
		<AppContext.Provider value={{ BatchDonate: BatchDonate, BatchJoin: BatchJoin,BatchVoteConviction:BatchVoteConviction }}>
			{children}
		</AppContext.Provider>
	);
}

export const useUtilsContext = () => useContext(AppContext);
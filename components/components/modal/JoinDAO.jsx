import React, { useState, useEffect } from "react";
import Dialog, { DialogProps } from "@mui/material/Dialog";

import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";

import LoadingButton from "@mui/lab/LoadingButton";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import useContract from "../../../services/useContract";
import {sendTransfer} from "../../../services/useSwap.jsx";


export default function JoinDAO({ SubsPrice, show, onHide, address, title,dao_id }) {
	const [Balance, setBalance] = useState("");
	const [isLoading, setisLoading] = useState(false);
	const [isSent, setisSent] = useState(false);
	const [Amount, setAmount] = useState(0);
	const { sendTransaction } = useContract()

	let alertBox = null;
	const [transaction, setTransaction] = useState({
		link: "",
		token: ""
	});



	function ShowAlert(type = "default", message) {
		const pendingAlert = alertBox.children["pendingAlert"];
		const successAlert = alertBox.children["successAlert"];
		const errorAlert = alertBox.children["errorAlert"];

		alertBox.style.display = "block";
		pendingAlert.style.display = "none";
		successAlert.style.display = "none";
		errorAlert.style.display = "none";
		switch (type) {
			case "pending":
				pendingAlert.querySelector(".MuiAlert-message").innerText = message;
				pendingAlert.style.display = "flex";
				break;
			case "success":
				successAlert.querySelector(".MuiAlert-message").innerText = message;
				successAlert.style.display = "flex";
				break;
			case "error":
				errorAlert.querySelector(".MuiAlert-message").innerText = message;
				errorAlert.style.display = "flex";
				break;
		}
	}

	async function JoinSubmission(e) {
		e.preventDefault();
		console.clear();
		setisSent(false);
		const { amount } = e.target;
		alertBox = e.target.querySelector("[name=alertbox]");
		setisLoading(true);


		let output = await sendTransfer(Number(window.ethereum.networkVersion), amount.value, address, ShowAlert);
		setTransaction({
			link: output.transaction
		});
		ShowAlert("pending", `Saving Joined Information...`);
		// Saving Joined Person on smart contract
		await sendTransaction(await window.contract.join_community(dao_id, window?.tronWeb?.defaultAddress?.base58.toString().toLocaleLowerCase()));
		ShowAlert("success", `Successfully Joined! `);


		LoadData();
		setisLoading(false);
		setisSent(true);
	}
	const StyledPaper = styled(Paper)(({ theme }) => ({
		backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
		...theme.typography.body2,
		padding: theme.spacing(2),
		color: theme.palette.text.primary
	}));
	async function LoadData() {
		let Balance = await window?.tronWeb?.trx.getBalance();

		setBalance((Balance / 1e6).toPrecision(5) + " TRX");

		setAmount(SubsPrice)
	}

	useEffect(() => {
		LoadData();
	}, [show]);

	return (
		<Dialog open={show} onClose={onHide} fullWidth="true" aria-labelledby="contained-modal-title-vcenter" centered="true">
			<DialogTitle>Join Community</DialogTitle>
			<DialogContent>
				<Container>
					<form id="doanteForm" onSubmit={JoinSubmission} autoComplete="off">
						<div name="alertbox" hidden="true">
							<Alert variant="filled" sx={{ my: 1 }} name="pendingAlert" severity="info">
								Pending....
							</Alert>
							<Alert variant="filled" sx={{ my: 1 }} name="successAlert" severity="success">
								Success....
							</Alert>
							<Alert variant="filled" sx={{ my: 1 }} name="errorAlert" severity="error">
								Error....
							</Alert>
						</div>
						{isSent ? (
							<>

								<StyledPaper sx={{ my: 1, mx: "auto", p: 2 }}>
									<div variant="standard" className="overflow-hidden">
										<InputLabel sx={{ color: "black" }}>Transaction</InputLabel>
										<a href={transaction.link} className="text-[#0000ff]" rel="noreferrer" target="_blank">
											{transaction.link}
										</a>
									</div>
								</StyledPaper>
							</>
						) : (
							<></>
						)}

						<StyledPaper sx={{ my: 1, mx: "auto", p: 2 }}>
							<div variant="standard">
								<InputLabel>DAO</InputLabel>
								<span>{title}</span>
							</div>
						</StyledPaper>

						<StyledPaper sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", my: 1, mx: "auto", p: 2 }}>
							<FormControl variant="standard">
								<InputLabel>Amount (TRX)</InputLabel>

								<Input name="amount" defaultValue={Amount} disabled onChange={(e) => setAmount(Number(e.target.value))} />
								<div>
									<p>Balance {Balance}</p>
								</div>
							</FormControl>
						
						</StyledPaper>

						<DialogActions>
							{Amount <= Balance ? (<><LoadingButton type="submit" name="JoinBTN" loading={isLoading} className="btn-secondary" size="medium">
								Join
							</LoadingButton></>) : (<>
							<span style={{color:"red"}}>
							Insufficent funds

							</span>
							</>)}

						</DialogActions>
					</form>
				</Container>
			</DialogContent>
		</Dialog>
	);
}

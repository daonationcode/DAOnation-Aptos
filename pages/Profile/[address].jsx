import React, { useState, useEffect } from "react";

import Head from "next/head"
import useContract from "../../services/useContract"
import { Header } from "../../components/layout/Header"
import isServer from "../../components/isServer"
import styles from "../daos/daos.module.css"
import Card from "../../components/components/Card/Card"
import { ControlsPlus, ControlsChevronRight, ControlsChevronLeft } from "@heathmont/moon-icons-tw"
import { Button } from "@heathmont/moon-core-tw"
import Skeleton from "@mui/material/Skeleton"


let running = true;
export default function Profile() {
	//Variables
	const [list, setList] = useState([])
	const [ProfileURI, setProfileURI] = useState({ Title: "", Description: "", SubsPrice: 0, Start_Date: "", End_Date: "", logo: "", wallet: "", typeimg: "", allFiles: [], isOwner: false })
	const { contract, signerAddress } = useContract()
	const [Daos, setDaos] = useState([])
	const [Ideas, setIdeas] = useState([])


	useEffect(() => {
		fetchContractData();
	}, [contract])


	if (isServer()) return null;
	let address = window.location.pathname.replace("/Profile/", "");


	async function fetchContractData() {
		if (!contract) return false;
		running = true;
		//Fetching data from Smart contract
		let allDaos = await contract.get_all_daos().call();
		let allIdeas = await contract.get_all_ideas().call();
		let founddao = [];
		for (let i = 0; i < allDaos.length; i++) {
			let dao_info = JSON.parse(allDaos[i]);
			if (dao_info.properties.wallet.description.toLocaleLowerCase() == address.toLocaleLowerCase()) {
				dao_info.id = i;
				let goal = await contract.get_all_goals_by_dao_id(i).call();;
				dao_info.goals = goal.filter(e => { return e !== "" });

				founddao.push(dao_info);

			}
		}
		founddao.sort(function (a, b) { return b.goals.length - a.goals.length });
		let foundidea = [];

		for (let i = 0; i < allIdeas.length; i++) {
			let idea_uri_json = allIdeas[i];

			let goalid = Number(await contract.get_goal_id_from_ideas_uri(idea_uri_json).call());
			let idea_uri = JSON.parse(idea_uri_json);
			idea_uri.id = i;

			if (idea_uri.properties.wallet.description.toLocaleLowerCase() == address.toLocaleLowerCase()) {
				let votes = await contract.get_ideas_votes_from_goal(goalid, i).call();
				idea_uri.votes = votes;

				foundidea.push(idea_uri);
			}
		}

		foundidea.sort(function (a, b) { return b.votes.length - a.votes.length });

		setDaos(founddao);
		setIdeas(foundidea);


		// try {
		// 	if (contract ) {


		// 		//Load everything-----------
		// 		const daoURI = JSON.parse(await contract.dao_uri(Number(id)).call()) //Getting dao URI

		// 		const totalGoals = await contract.get_all_goals_by_dao_id(Number(id)).call() //Getting all goals by dao id
		// 		const arr = []
		// 		for (let i = 0; i < Object.keys(totalGoals).length; i++) {
		// 			//total dao number Iteration
		// 			const goalid = await contract.get_goal_id_by_goal_uri(totalGoals[i]).call()
		// 			let goal = totalGoals[i];
		// 			if (goal == "") continue;
		// 			const object = JSON.parse(goal)

		// 			if (object) {
		// 				arr.push({
		// 					//Pushing all data into array
		// 					goalId: goalid,
		// 					Title: object.properties.Title.description,
		// 					Description: object.properties.Description.description,
		// 					Budget: object.properties.Budget.description,
		// 					End_Date: object.properties.End_Date.description,
		// 					logo: object.properties.logo.description.url,
		// 				})
		// 			}
		// 		}
		// 		setList(arr)
		// 		let daoURIShort = {
		// 			Title: daoURI.properties.Title.description,
		// 			Description: daoURI.properties.Description.description,
		// 			Start_Date: daoURI.properties.Start_Date.description,
		// 			logo: daoURI.properties.logo.description,
		// 			wallet: daoURI.properties.wallet.description,
		// 			typeimg: daoURI.properties.typeimg.description,
		// 			allFiles: daoURI.properties.allFiles.description,
		// 			SubsPrice: daoURI.properties?.SubsPrice?.description,
		// 			isOwner: daoURI.properties.wallet.description.toString().toLocaleLowerCase() === signerAddress.toString().toLocaleLowerCase() ? true : false
		// 		};
		// 		setDaoURI(daoURIShort);

		// 		setIsJoined(await contract.is_person_joined(window?.tronWeb?.defaultAddress?.base58.toString().toLocaleLowerCase()).call())

		// 		const template_html = await contract._template_uris(Number(id)).call();
		// 		document.querySelector("#dao-container").innerHTML = template_html;
		// 		document.querySelector(".btn-back").addEventListener('click', () => {
		// 			window.history.back();
		// 		});
		// 		let join_community_block = document.querySelector(".join-community-block");
		// 		let create_goal_block = document.querySelector(".create-goal-block");
		// 		if (create_goal_block != null) {
		// 			document.querySelector(".create-goal-block").addEventListener('click', () => {
		// 				window.location.href = `/CreateGoal?[${id}]`;
		// 			});
		// 		}

		// 		if (join_community_block != null) {
		// 			join_community_block.addEventListener('click', JoinCommunity);
		// 		};

		// 		if (daoURIShort.isOwner) {
		// 			if (join_community_block != null){

		// 				join_community_block.style.display = "none";
		// 			}
		// 		} else {
		// 			if (create_goal_block != null) {
		// 				create_goal_block.style.display = "none";
		// 			}
		// 		}
		// 		const root = createRoot(document.getElementById("goal-container"));


		// 		root.render(goal(arr))


		// 		/** TODO: Fix fetch to get completed ones as well */
		// 		if (document.getElementById("Loading")) document.getElementById("Loading").style = "display:none";
		// 	}
		// } catch (error) {
		// 	console.error(error);
		// }
		running = false
	}


	function Loader({ element, type = "rectangular", width = "50", height = "23", many = 1 }) {
		if (running) {
			let allElements = [];
			for (let i = 0; i < many; i++) {
				allElements.push(<Skeleton variant={type} width={width} height={height} />)
				allElements.push(<div style={{ marginBottom: "5px" }}></div>)
			}
			return allElements;
		} else {
			return element;
		}
	}

	function showPanel(panelIndex, colorCode) {
		var tabButtons = document.querySelectorAll(".tabContainer .buttonContainer button");
		var tabPanels = document.querySelectorAll(".tabContainer  .tabPanel");
		if (!(tabButtons.length > 0)) return false;
		tabButtons.forEach(function (node) {
			node.style.backgroundColor = "";
			node.style.color = "";
		});
		tabButtons[panelIndex].style.backgroundColor = "white";
		tabButtons[panelIndex].style.color = "#7e8b93";
		tabPanels.forEach(function (node) {
			node.style.display = "none";
		});
		tabPanels[panelIndex].style.display = "block";
		tabPanels[panelIndex].style.backgroundColor = "white";
	}



	return (
		<>
			<Header></Header>
			<Head>
				<title>Profile</title>
				<meta name="description" content="Profile" />
				<link rel="icon" href="/favicon.ico" />
			</Head>


			<div className={`${styles.container} flex items-center flex-col gap-8 relative`}>
				<div className={`${styles.title} gap-8 flex flex-col relative`}>
					<div className={styles.avatarContainer}>
						<div className={styles.topicAvatar}>
							<div className="post-avatar">
								<a className="trigger-user-card main-avatar " aria-hidden="true" tabIndex={-1}>
									<svg width={45} height={45} xmlns="http://www.w3.org/2000/svg" style={{ fill: "var(--foreground)" }} viewBox="0 0 459 459">
										<g>
											<g>
												<path d="M229.5,0C102.53,0,0,102.845,0,229.5C0,356.301,102.719,459,229.5,459C356.851,459,459,355.815,459,229.5    C459,102.547,356.079,0,229.5,0z M347.601,364.67C314.887,393.338,273.4,409,229.5,409c-43.892,0-85.372-15.657-118.083-44.314    c-4.425-3.876-6.425-9.834-5.245-15.597c11.3-55.195,46.457-98.725,91.209-113.047C174.028,222.218,158,193.817,158,161    c0-46.392,32.012-84,71.5-84c39.488,0,71.5,37.608,71.5,84c0,32.812-16.023,61.209-39.369,75.035    c44.751,14.319,79.909,57.848,91.213,113.038C354.023,354.828,352.019,360.798,347.601,364.67z" />
											</g>
										</g>
									</svg>
								</a>
							</div>
						</div>
						<a href={`https://nile.tronscan.org/#/address/${address}`} rel="noreferrer" target="_blank">
							<h1 className="font-bold" style={{ color: 'var(--title-a-text)', width: "78%" }} >
								{address}
							</h1>

						</a>
					</div>
				</div>

				<div className={styles.divider}></div>

				<div className="tabContainer">
					<div className="buttonContainer">
						<button style={{
							backgroundColor: 'white',
							color: 'rgb(126, 139, 147)'
						}} onClick={() => { showPanel(0, '#f44336') }} >
							Summary
						</button>
						<button onClick={() => { showPanel(1, '#4caf50') }} >
							Activity
						</button>

					</div>
					<div
						className="tabPanel"
						style={{ display: "block", backgroundColor: "white" }}
					>

						<div className="top-section stats-section">
							<h3 className="stats-title">Stats</h3>
							<Loader
								element={
									<ul>

										<li className="stats-topic-count linked-stat">
											<a
												id="ember1267"
												className="ember-view"
												href="/u/trondao/activity/topics"
											>
												<div id="ember1268" className="user-stat ember-view">
													<span className="value">
														<span className="number">{Daos.length}</span>
													</span>
													<span className="label">
														dao created
													</span>
												</div>
											</a>
										</li>
										<li className="stats-post-count linked-stat">
											<a
												id="ember1269"
												className="ember-view"
												href="/u/trondao/activity/replies"
											>
												<div id="ember1270" className="user-stat ember-view">
													<span className="value">
														<span className="number">{Ideas.length}</span>
													</span>
													<span className="label">
														ideas created
													</span>
												</div>
											</a>
										</li>
										<li className="stats-post-count linked-stat">
											<a
												id="ember1269"
												className="ember-view"
												href="/u/trondao/activity/replies"
											>
												<div id="ember1270" className="user-stat ember-view">
													<span className="value">
														<span className="number">5</span>
													</span>
													<span className="label">
														donated
													</span>
												</div>
											</a>
										</li>
										<li className="stats-post-count linked-stat">
											<a
												id="ember1269"
												className="ember-view"
												href="/u/trondao/activity/replies"
											>
												<div id="ember1270" className="user-stat ember-view">
													<span className="value">
														<span className="number">5</span>
													</span>
													<span className="label">
														ideas replied
													</span>
												</div>
											</a>
										</li>
									</ul>
								}
								width="100%"
								height={54}
							/>

						</div>
						<div className="top-section" style={{ height: '22rem' }}>
							<div
								id="ember152"
								className="replies-section pull-left top-sub-section ember-view"
							>
								<h3 className="stats-title">Top Daos</h3>
								<ul>
									<Loader
										element={
											Daos.map((item, idx) => {
												return <li id="ember154" key={idx} className="ember-view">
													<span className="topic-info">
														<span className="like-count"><span className="number">{item.goals.length} Goals</span></span>
													</span>
													<br></br>
													<a href={"/daos/dao?["+item.id+"]"}>
														{item.properties.Title.description}
													</a>
												</li>
											})
										}
										width="100%"
										height={54}
										many={5}
									/>
								</ul>
							</div>
							<div
								id="ember152"
								className="replies-section pull-left top-sub-section ember-view"
							>
								<h3 className="stats-title">Top Ideas</h3>
								<ul>
									<Loader
										element={
											Ideas.map((item, idx) => {
												return <li id="ember154" key={idx} className="ember-view">
													<span className="topic-info">
														<span className="like-count"><span className="number">{item.votes.length} Votes</span></span>
													</span>
													<br></br>
													<a href={"/daos/dao/goal/ideas?["+item.id+"]"}>
														{item.properties.Title.description}
													</a>
												</li>
											})
										}
										width="100%"
										height={54}
										many={5}
									/>
								</ul>
							</div>
							<div
								id="ember152"
								className="replies-section pull-left top-sub-section ember-view"
							>
								<h3 className="stats-title">Top Donated Ideas</h3>
								<ul>
									<Loader
										element={<li id="ember154" className="ember-view">
											<span className="topic-info">
												<span className="like-count"><span className="number">18 TRX</span></span>
											</span>
											<br></br>
											<a href="/t/cukies-world-animal-crossing-type-play-and-earn-game/4245/27">
												Cukies World – Animal Crossing type Play-and-Earn game
											</a>
										</li>}
										width="100%"
										height={54}
										many={5}
									/>
								</ul>
							</div>
							<div
								id="ember152"
								className="replies-section pull-left top-sub-section ember-view"
							>
								<h3 className="stats-title">Top Replies</h3>
								<ul>
									<Loader
										element={<li id="ember154" className="ember-view">
											<div className="topic-info">
												<svg
													className="fa d-icon d-icon-reply svg-icon svg-string"
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 512 512"
												>
													<path d="M8.309 189.836L184.313 37.851C199.719 24.546 224 35.347 224 56.015v80.053c160.629 1.839 288 34.032 288 186.258 0 61.441-39.581 122.309-83.333 154.132-13.653 9.931-33.111-2.533-28.077-18.631 45.344-145.012-21.507-183.51-176.59-185.742V360c0 20.7-24.3 31.453-39.687 18.164l-176.004-152c-11.071-9.562-11.086-26.753 0-36.328z" />
												</svg>
												<span className="replies">
													<span className="number">143</span>
												</span>
											</div>
											<a href="/t/cukies-world-animal-crossing-type-play-and-earn-game/4245/27">
												Cukies World – Animal Crossing type Play-and-Earn game
											</a>
										</li>}
										width="100%"
										height={54}
										many={5}
									/>
								</ul>
							</div>
						</div>

					</div>
					<div
						className="tabPanel"
						style={{ display: "none", backgroundColor: "rgb(76, 175, 80)" }}
					>
						Tab 2:Content
					</div>

				</div>

			</div>

		</>
	)
}

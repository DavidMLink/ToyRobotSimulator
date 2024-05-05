import React, { useState } from 'react';
import './App.css';
import { ToyRobotSimulator } from './ToyRobotSimulator/ToyRobotSimulator';
import { ScrapGame } from './ScrapGame/ScrapGame';

const App = () => {
	const [playScrapGame, setPlayScrapGame] = useState(false);

	return (
		<div className='App'>
			<div
				className='switch-game-button'
				style={{ position: 'absolute', top: 10, right: 10 }}
			>
				<button
					onClick={() => {
						setPlayScrapGame(!playScrapGame);
					}}
				>
					{playScrapGame
						? 'Switch to Toy Robot Simulator'
						: 'Switch to Scrap Game'}
				</button>
			</div>
			<h1 className='game-title'>
				{playScrapGame ? 'Scrap Game' : 'Toy Robot Simulator'}
			</h1>
			{playScrapGame ? (
				<ScrapGame></ScrapGame>
			) : (
				<ToyRobotSimulator></ToyRobotSimulator>
			)}
			{/* <Overlay></Overlay> */}
		</div>
	);
};

export default App;

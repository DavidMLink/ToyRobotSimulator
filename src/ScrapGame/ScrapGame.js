import React, { useState, useEffect, useRef } from 'react';
import './index.css';

const gridSize = 10; // Defines the number of rows and columns

const initializeCells = () => {
	let newCells = Array(gridSize)
		.fill()
		.map(() => Array(gridSize).fill({ dug: false, content: 'sand' }));
	// Randomly place treasures
	let count = 0;
	while (count < 2) {
		let x = Math.floor(Math.random() * gridSize);
		let y = Math.floor(Math.random() * gridSize);
		if (newCells[y][x].content === 'sand') {
			newCells[y][x].content = 'treasure';
			count++;
		}
	}
	return newCells;
};

export const ScrapGame = () => {
	const [robot, setRobot] = useState({
		x: 0,
		y: 0,
		facing: 'NORTH',
		placed: true,
	});
	const [money, setMoney] = useState(0); // Track money collected
	const [cells, setCells] = useState(() => initializeCells()); // Initialize cells with sand
	const [digsLeft, setDigsLeft] = useState(3); // Start with 3 digs per day
	const [day, setDay] = useState(1); // Total 10 days
	const [overlayActive, setOverlayActive] = useState(false);

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (overlayActive) return; // Prevent interaction when overlay is active
			switch (event.key) {
				case 'ArrowUp':
				case 'w':
					prepareMove('NORTH');
					break;
				case 'ArrowDown':
				case 's':
					prepareMove('SOUTH');
					break;
				case 'ArrowLeft':
				case 'a':
					prepareMove('WEST');
					break;
				case 'ArrowRight':
				case 'd':
					prepareMove('EAST');
					break;
				case ' ':
					if (digsLeft > 0) {
						dig();
					}
					break;
				default:
					break;
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [robot, cells, digsLeft, overlayActive]);

	useEffect(() => {
		if (digsLeft === 0) {
			setOverlayActive(true);
		}
	}, [digsLeft]);

	const closeOverlay = () => {
		if (day < 10) {
			setDay((prevDay) => prevDay + 1); // Increment the day
			setDigsLeft(3); // Reset digs left for the new day
			setCells(initializeCells()); // Reinitialize the cells for a new day
			setRobot({
				// Reset robot's position and facing
				x: 0,
				y: 0,
				facing: 'NORTH',
				placed: true,
			});
		} else {
			console.log('Game Over');
			// Additional actions can be added here for when the game is over.
		}
		setOverlayActive(false); // Close the overlay
	};

	const dig = () => {
		let { x, y } = robot;
		let cell = cells[y][x];

		// Check if the cell has already been dug
		if (cell.dug) {
			console.log(
				'This spot has already been dug. Move to a new spot to dig again.'
			);
			return; // Exit the function if the spot has been dug
		}

		// Process digging at an undug spot
		if (cell.content === 'treasure') {
			setMoney((prev) => prev + 100); // Add money for finding a treasure
			console.log("Congratulations! You've found a treasure!");
		} else {
			setMoney((prev) => prev + 10); // Add money for collecting scrap metal
			console.log('You collected some scrap metal.');
		}

		// Update the cell to mark it as dug
		const newCells = cells.map((row, rowIndex) =>
			row.map((cell, colIndex) => {
				if (rowIndex === y && colIndex === x) {
					return { ...cell, dug: true }; // Set dug to true to prevent further digs
				}
				return cell;
			})
		);

		setCells(newCells);
		setDigsLeft((prev) => prev - 1); // Reduce the number of digs left for the day
	};

	const prepareMove = (desiredDirection) => {
		if (!robot.placed) return;
		if (robot.facing !== desiredDirection) {
			setRobot((prev) => ({ ...prev, facing: desiredDirection }));
		} else {
			moveRobot(desiredDirection);
		}
	};

	const moveRobot = (direction) => {
		let { x, y } = robot;
		switch (direction) {
			case 'NORTH':
				y = Math.max(0, y - 1);
				break;
			case 'SOUTH':
				y = Math.min(gridSize - 1, y + 1);
				break;
			case 'EAST':
				x = Math.min(gridSize - 1, x + 1);
				break;
			case 'WEST':
				x = Math.max(0, x - 1);
				break;
			default:
				break;
		}
		setRobot({ ...robot, x, y });
	};

	return (
		<div className='App'>
			{overlayActive && (
				<div className='overlay'>
					<div className='modal-content'>
						{day < 10 ? (
							<p>Day {day} is over. Click 'Next Day' to continue.</p>
						) : (
							<p>Game Over! Thanks for playing.</p>
						)}
						<button onClick={closeOverlay}>
							{day < 10 ? 'Next Day' : 'Close'}
						</button>
					</div>
				</div>
			)}
			<div className='legend'>
				<p>
					Use <strong>Arrow Keys</strong> or <strong>WASD</strong> to move.
				</p>
				<p>
					Press <strong>Space</strong> to dig at your location. Discover
					treasure or scrap metal!
				</p>
				<p>
					Digs Left Today: <strong>{digsLeft}</strong>
				</p>
				<p>
					Money Collected: <strong>${money}</strong>
				</p>
			</div>
			<div className='grid'>
				<h2 style={{ textAlign: 'center' }}>Day {day}</h2>
				{cells.map((row, y) => (
					<div
						key={y}
						className='row'
					>
						{row.map((cell, x) => (
							<div
								key={x}
								className='cell'
								onClick={() => setRobot({ ...robot, x, y })}
							>
								<img
									src={getImageSrc(cell, robot, x, y)}
									alt={`Cell at ${x},${y}`}
									width='30'
									height='30'
								/>
							</div>
						))}
					</div>
				))}
			</div>
			<p>Collect as much as possible before 10 days are over!</p>
		</div>
	);
};

const getImageSrc = (cell, robot, x, y) => {
	if (robot.x === x && robot.y === y) {
		return `images/walle-${robot.facing.toLowerCase()}.png`;
	} else if (cell.dug) {
		// Show the appropriate image based on what was found when dug
		return cell.content === 'treasure'
			? 'images/treasure.png'
			: 'images/scrap-metal.png';
	}
	return 'images/sand.png'; // Default image before digging
};

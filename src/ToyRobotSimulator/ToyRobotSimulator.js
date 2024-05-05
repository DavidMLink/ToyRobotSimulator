import React, { useState, useEffect } from 'react';
import './index.css';

export const ToyRobotSimulator = () => {
	const [position, setPosition] = useState({ x: -1, y: -1, f: 'NORTH' });
	const [placed, setPlaced] = useState(false);

	// Handle keyboard input for movement and rotation
	useEffect(() => {
		const handleKeyDown = (event) => {
			if (!placed) return;
			switch (event.key) {
				case 'w':
				case 'ArrowUp':
					prepareMove('NORTH');
					break;
				case 's':
				case 'ArrowDown':
					prepareMove('SOUTH');
					break;
				case 'd':
				case 'ArrowRight':
					prepareMove('EAST');
					break;
				case 'a':
				case 'ArrowLeft':
					prepareMove('WEST');
					break;
				default:
					break;
			}
		};
		document.addEventListener('keydown', handleKeyDown);

		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [placed, position]);

	const placeRobot = (x, y, f = 'NORTH') => {
		if (x >= 0 && x < 5 && y >= 0 && y < 5) {
			setPosition({ x, y, f });
			setPlaced(true);
			console.log(`PLACE ${x},${y},${f}`);
		}
	};

	const moveRobot = () => {
		if (!placed) return;
		const { x, y, f } = position;
		let newX = x;
		let newY = y;

		switch (f) {
			case 'NORTH':
				newY++;
				break;
			case 'SOUTH':
				newY--;
				break;
			case 'EAST':
				newX++;
				break;
			case 'WEST':
				newX--;
				break;
			default:
				break;
		}

		if (newX >= 0 && newX < 5 && newY >= 0 && newY < 5) {
			setPosition({ x: newX, y: newY, f });
			console.log('MOVE');
		}
	};

	const rotateRobot = (direction) => {
		if (!placed) return;
		const directions = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
		let index = directions.indexOf(position.f);
		if (direction === 'RIGHT') {
			index = (index + 1) % 4;
		} else {
			index = (index + 3) % 4; // equivalent to -1 mod 4
		}
		setPosition({ x: position.x, y: position.y, f: directions[index] });
		console.log(direction.toUpperCase());
	};

	const reportPosition = () => {
		if (!placed) return;
		console.log('REPORT');
		console.log(`Output: ${position.x},${position.y},${position.f}`);
	};

	const prepareMove = (desiredDirection) => {
		console.log('here');
		if (!placed) return;
		console.log('here2');
		if (position.f !== desiredDirection) {
			console.log('here3');
			setPosition((prev) => ({ ...prev, f: desiredDirection }));
		} else {
			moveRobot(desiredDirection);
		}
	};

	return (
		<div className='App'>
			<div className='grid'>
				{Array.from({ length: 5 }, (_, index) => 4 - index).map((y) => (
					<div
						key={y}
						className='row'
					>
						{Array.from({ length: 5 }, (_, x) => (
							<div
								key={x}
								className='cell'
								onClick={() => placeRobot(x, y)}
							>
								{position.x === x && position.y === y ? (
									<img
										src={`images/arrow-${position.f.toLowerCase()}.png`}
										alt='Robot'
										width='30'
										height='30'
									/>
								) : null}
							</div>
						))}
					</div>
				))}
			</div>
			<div className='controls'>
				<button onClick={moveRobot}>Move</button>
				<button onClick={() => rotateRobot('LEFT')}>Left</button>
				<button onClick={() => rotateRobot('RIGHT')}>Right</button>
				<button onClick={reportPosition}>Report</button>
			</div>
		</div>
	);
};

import { useEffect, useState } from "react";
import "./App.scss";
import { Board } from "./components/Board";
import { GameArea } from "./components/GameArea";
import { Hand } from "./components/Hand";
import { LetterBag } from "./helpers/LetterBag";
import { IHandTile } from "./react-app-env";

export const HAND_SIZE = 7;

function App() {
	const [hand, setHand] = useState<IHandTile[]>([]);

	useEffect(() => {
		const letterBag = new LetterBag();
	});

	useEffect(() => {
		const newHand = [];

		for (let i = 0; i < HAND_SIZE; i++) {
			newHand.push({
				letter: "A",
				used: false,
			});
		}

		setHand(newHand);
	}, []);

	return (
		<div className='app'>
			<GameArea>
				<Board hand={hand} />
				<Hand hand={hand} />
			</GameArea>
		</div>
	);
}

export default App;

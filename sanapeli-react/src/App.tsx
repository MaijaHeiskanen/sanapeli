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
	const [letterBag, setLetterBag] = useState<LetterBag>();

	useEffect(() => {
		const letterBag = new LetterBag();
		setLetterBag(letterBag);
	}, [setLetterBag]);

	useEffect(() => {
		fillHand();
	}, [letterBag]);

	const fillHand = () => {
		if (!letterBag) return;

		const newHand = hand.slice();

		for (let i = hand.length; i < HAND_SIZE; i++) {
			const newLetter = letterBag.getNextLetter();

			if (newLetter === null) {
				break;
			}

			newHand.push({ letter: newLetter, used: false });
		}

		setHand(newHand);
	};

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

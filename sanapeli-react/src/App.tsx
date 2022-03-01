import { useCallback, useEffect, useState } from "react";
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

	const fillHand = useCallback(
		(existingHand?: IHandTile[]) => {
			if (!letterBag) return;

			const newHand = existingHand || hand.slice();

			for (let i = hand.length; i < HAND_SIZE; i++) {
				const newLetter = letterBag.getNextLetter();

				if (newLetter === null) {
					break;
				}

				newHand.push({ letter: newLetter, used: false });
			}

			setHand(newHand);
		},
		[letterBag, hand]
	);

	const useHandTile = (letter: string): boolean => {
		const upperCaseLetter = letter.toUpperCase();
		const currentHand = hand.slice();

		for (let i = 0, len = currentHand.length; i < len; i++) {
			const handTile = currentHand[i];

			if (upperCaseLetter === handTile.letter && !handTile.used) {
				handTile.used = true;

				setHand(currentHand);

				return true;
			}
		}

		return false;
	};

	const unUseHandTile = (letter: string): boolean => {
		const upperCaseLetter = letter.toUpperCase();
		const currentHand = hand.slice();

		for (let i = 1, len = currentHand.length; i <= len; i++) {
			const handTile = currentHand[len - i];

			if (upperCaseLetter === handTile.letter && handTile.used) {
				handTile.used = false;

				setHand(currentHand);

				return true;
			}
		}

		return false;
	};

	useEffect(() => {
		const letterBag = new LetterBag();
		setLetterBag(letterBag);
	}, [setLetterBag]);

	useEffect(() => {
		fillHand();
	}, [letterBag]);

	return (
		<div className='app'>
			<GameArea>
				<Board hand={hand} useHandTile={useHandTile} unUseHandTile={unUseHandTile} />
				<Hand hand={hand} />
			</GameArea>
		</div>
	);
}

export default App;

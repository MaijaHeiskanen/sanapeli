import { useCallback, useEffect, useState } from "react";
import "./App.scss";
import { Board } from "./components/Board";
import { Direction } from "./components/Direction";
import { GameArea } from "./components/GameArea";
import { Hand } from "./components/Hand";
import { WriteDirection } from "./enums/WriteDirection";
import { createBoard } from "./helpers/createBoard";
import { LetterBag } from "./helpers/LetterBag";
import { setSpecialCells } from "./helpers/setSpecialTiles";
import { useKeyDownListener } from "./hooks/useKeyDownListener";
import { IBoardCell, ITile } from "./react-app-env";

const BOARD_SIZE = 15;
export const HAND_SIZE = 7;

function App() {
	const [letterBag, setLetterBag] = useState<LetterBag>();
	const [direction, setDirection] = useState<WriteDirection>(WriteDirection.Right);
	const [hand, setHand] = useState<ITile[]>([]);
	const [boardCells, setBoardCells] = useState<IBoardCell[][]>([[]]);

	useEffect(() => {
		setBoardCells(setSpecialCells(createBoard(BOARD_SIZE)));
	}, []);

	const keyDownCallback = useCallback(
		(event: KeyboardEvent) => {
			const code = event.code;

			if (code === "Tab") {
				event.preventDefault();
				const newDirection = direction === WriteDirection.Right ? WriteDirection.Down : WriteDirection.Right;

				setDirection(newDirection);
			}
		},
		[direction]
	);

	useKeyDownListener(keyDownCallback);

	const fillHand = useCallback(
		(existingHand: ITile[]) => {
			if (!letterBag) return;

			const newHand = existingHand?.slice();

			for (let i = newHand.length; i < HAND_SIZE; i++) {
				const newLetter = letterBag.getNextLetter();

				if (newLetter === null) {
					break;
				}

				newHand.push({ letter: newLetter });
			}

			setHand(newHand);
		},
		[letterBag]
	);

	const playHandTile = (letter: string): boolean => {
		const upperCaseLetter = letter.toUpperCase();
		const currentHand = hand.slice();

		for (let i = 0, len = currentHand.length; i < len; i++) {
			const handTile = currentHand[i];

			if (upperCaseLetter === handTile.letter && !handTile.played) {
				handTile.played = true;

				setHand(currentHand);

				return true;
			}
		}

		return false;
	};

	const unPlayHandTile = (letter: string): boolean => {
		const upperCaseLetter = letter.toUpperCase();
		const currentHand = hand.slice();

		for (let i = 1, len = currentHand.length; i <= len; i++) {
			const handTile = currentHand[len - i];

			if (upperCaseLetter === handTile.letter && handTile.played) {
				handTile.played = false;

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
		fillHand(hand);
	}, [letterBag]);

	return (
		<div className='app'>
			<GameArea>
				<Board playHandTile={playHandTile} unPlayHandTile={unPlayHandTile} direction={direction} boardCells={boardCells} setBoardCells={setBoardCells} />
				<Direction direction={direction} />
				<Hand hand={hand} />
			</GameArea>
		</div>
	);
}

export default App;

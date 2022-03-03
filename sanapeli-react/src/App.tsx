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
import { IBoardCell, ITile, ITileCoordinates } from "./react-app-env";

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

	const getCellsWithNotLockedTiles = useCallback(() => {
		const cellsWithNotLockedTiles: IBoardCell[] = [];

		for (let i = 0, len = boardCells.length; i < len; i++) {
			const row = boardCells[i];
			const cells = row.filter((cell) => cell.tile && cell.tile.played && !cell.tile.locked);

			cellsWithNotLockedTiles.push(...cells);
		}

		return cellsWithNotLockedTiles;
	}, [boardCells]);

	const moveFocus = useCallback(
		(coordinates: ITileCoordinates, direction: ITileCoordinates) => {
			const { column, row } = coordinates;
			const { column: moveColumn, row: moveRow } = direction;
			const bTiles = boardCells.slice();
			const rowLength = bTiles.length - 1;
			const columnLength = rowLength ? bTiles[0].length - 1 : 0;
			const newRow = row + moveRow;
			const focusRow = newRow > rowLength ? (newRow % rowLength) - 1 : newRow < 0 ? rowLength : newRow;
			const newColumn = column + moveColumn;
			const focusColumn = newColumn > columnLength ? (newColumn % columnLength) - 1 : newColumn < 0 ? columnLength : newColumn;
			const focusTile = bTiles[focusRow][focusColumn];
			const input = focusTile?.inputRef?.current;

			input?.focus();
		},
		[boardCells]
	);

	const keyDownCallback = useCallback(
		(event: KeyboardEvent) => {
			const code = event.code;

			if (code === "Tab") {
				event.preventDefault();

				const playedCells = getCellsWithNotLockedTiles();
				const amountOfPlayedCells = playedCells.length;

				if (amountOfPlayedCells > 1) return;

				const newDirection = direction === WriteDirection.Right ? WriteDirection.Down : WriteDirection.Right;

				setDirection(newDirection);

				if (amountOfPlayedCells === 1) {
					const currentCoordinates = playedCells[amountOfPlayedCells - 1].coordinates;

					if (currentCoordinates) {
						const moveDirection = { row: 0, column: 0 };

						if (newDirection === WriteDirection.Right) {
							moveDirection.column = 1;
						} else if (newDirection === WriteDirection.Down) {
							moveDirection.row = 1;
						}

						moveFocus(currentCoordinates, moveDirection);
					}
				}
			}
		},
		[direction, getCellsWithNotLockedTiles, moveFocus]
	);

	useKeyDownListener(keyDownCallback);

	const alignedWithOtherPlayedTiles = (coordinates: ITileCoordinates) => {
		const cellsWithPlayedTile = getCellsWithNotLockedTiles();
		const isSameRow = cellsWithPlayedTile.every((playedCell) => playedCell.coordinates?.row && playedCell.coordinates.row && coordinates?.row && coordinates.row && playedCell.coordinates.row === coordinates.row);
		const isSameColumn = cellsWithPlayedTile.every((playedCell) => playedCell.coordinates?.column && playedCell.coordinates.column && coordinates?.column && coordinates.column && playedCell.coordinates.column === coordinates.column);

		return isSameRow || isSameColumn;
	};

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

	const playHandTile = (letter: string, coordinates: ITileCoordinates): ITile | null => {
		const upperCaseLetter = letter.toUpperCase();
		const currentHand = hand.slice();

		for (let i = 0, len = currentHand.length; i < len; i++) {
			const handTile = currentHand[i];

			if (upperCaseLetter === handTile.letter && !handTile.played && alignedWithOtherPlayedTiles(coordinates)) {
				handTile.played = true;

				setHand(currentHand);

				return handTile;
			}
		}

		return null;
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
				<Board playHandTile={playHandTile} unPlayHandTile={unPlayHandTile} direction={direction} boardCells={boardCells} setBoardCells={setBoardCells} moveFocus={moveFocus} />
				<Direction direction={direction} />
				<Hand hand={hand} />
			</GameArea>
		</div>
	);
}

export default App;

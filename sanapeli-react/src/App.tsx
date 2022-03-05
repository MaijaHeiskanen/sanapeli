import { useCallback, useEffect, useState } from "react";
import "./App.scss";
import { Checker } from "./checker/Checker";
import { Board } from "./components/Board";
import { Direction } from "./components/Direction";
import { GameArea } from "./components/GameArea";
import { Hand } from "./components/Hand";
import { WriteDirection } from "./enums/WriteDirection";
import { createBoard } from "./helpers/createBoard";
import { LetterBag } from "./helpers/LetterBag";
import { setSpecialCells } from "./helpers/setSpecialTiles";
import { useKeyDownListener } from "./hooks/useKeyDownListener";
import { IBoardCell, ITile, ITileCoordinates, ITurn } from "./react-app-env";

export const BOARD_SIZE = 15;
export const HAND_SIZE = 7;

function App() {
	const [letterBag, setLetterBag] = useState<LetterBag>();
	const [direction, setDirection] = useState<WriteDirection>(WriteDirection.Right);
	const [hand, setHand] = useState<ITile[]>([]);
	const [boardCells, setBoardCells] = useState<IBoardCell[][]>([[]]);
	const [turns, setTurns] = useState<ITurn[]>([]);

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

	const emptyCellsBetween = useCallback(
		(playedCells: IBoardCell[], boardCells: IBoardCell[][]) => {
			const cellsLength = playedCells.length;

			if (cellsLength < 2) return [];

			const directionIsRight = direction === WriteDirection.Right;
			const fieldWithDynamicValue = directionIsRight ? "column" : "row";
			const fieldWithStaticValue = directionIsRight ? "row" : "column";
			const staticFieldIndex = playedCells[0].coordinates[fieldWithStaticValue];

			const emptyIndexes: ITileCoordinates[] = [];
			const firstIndex = playedCells[0].coordinates[fieldWithDynamicValue];
			const lastIndex = playedCells[cellsLength - 1].coordinates[fieldWithDynamicValue];

			for (let i = firstIndex + 1, len = lastIndex; i < len; i++) {
				const tile = (directionIsRight ? boardCells[staticFieldIndex][i] : boardCells[i][staticFieldIndex]).tile;

				if (!tile) {
					emptyIndexes.push(directionIsRight ? { column: i, row: staticFieldIndex } : { column: staticFieldIndex, row: i });
				}
			}

			return emptyIndexes;
		},
		[direction]
	);

	const resetCellErrors = useCallback(() => {
		const rows: IBoardCell[][] = [];

		for (let i = 0, len1 = boardCells.length; i < len1; i++) {
			const column: IBoardCell[] = [];

			for (let ii = 0, len2 = boardCells[0].length; ii < len2; ii++) {
				const cell = boardCells[i][ii];

				cell.invalidTile = false;

				column.push(cell);
			}

			rows.push(column);
		}

		setBoardCells(rows);
	}, [boardCells]);

	const setCellErrors = useCallback(
		(coordinates: ITileCoordinates[]) => {
			const newBoardCells = [...boardCells];

			for (let i = 0, len = coordinates.length; i < len; i++) {
				const { column, row } = coordinates[i];
				const cell = { ...newBoardCells[row][column] };

				cell.invalidTile = true;

				newBoardCells[row][column] = cell;
			}

			setBoardCells(newBoardCells);
		},
		[boardCells]
	);

	const wordOnSecondaryAxis = useCallback(
		(cell: IBoardCell, boardCells: IBoardCell[][]): IBoardCell[] | undefined => {
			const tile = cell.tile;

			if (!tile) return undefined;

			const directionIsRight = direction === WriteDirection.Right;
			const fieldWithStaticValue = directionIsRight ? "column" : "row";
			const fieldWithDynamicValue = directionIsRight ? "row" : "column";
			const staticFieldIndex = cell.coordinates[fieldWithStaticValue];
			const dynamicFieldIndex = cell.coordinates[fieldWithDynamicValue];

			let existingCellsBefore: IBoardCell[] = [];

			for (let i = 0, len = dynamicFieldIndex; i < len; i++) {
				const cell = directionIsRight ? boardCells[i][staticFieldIndex] : boardCells[staticFieldIndex][i];
				const tile = cell.tile;
				const letter = tile?.letter;

				if (letter) {
					existingCellsBefore.push(cell);
				} else {
					existingCellsBefore = [];
				}
			}

			let existingCellsAfter: IBoardCell[] = [];

			for (let i = dynamicFieldIndex + 1, len = BOARD_SIZE; i < len; i++) {
				const cell = directionIsRight ? boardCells[i][staticFieldIndex] : boardCells[staticFieldIndex][i];
				const tile = cell.tile;
				const letter = tile?.letter;

				if (letter) {
					existingCellsAfter.push(cell);
				} else {
					break;
				}
			}

			const word: IBoardCell[] = existingCellsBefore.concat(cell, ...existingCellsAfter);

			if (word.length > 1) {
				return word;
			}

			return undefined;
		},
		[direction]
	);

	const getNewWords = useCallback(
		(playedCells: IBoardCell[], boardCells: IBoardCell[][]): IBoardCell[][] => {
			const words = [];

			const cellsLength = playedCells.length;

			const directionIsRight = direction === WriteDirection.Right;
			const fieldWithDynamicValue = directionIsRight ? "column" : "row";
			const fieldWithStaticValue = directionIsRight ? "row" : "column";
			const staticFieldIndex = playedCells[0].coordinates[fieldWithStaticValue];

			const firstIndex = playedCells[0].coordinates[fieldWithDynamicValue];
			const lastIndex = playedCells[cellsLength - 1].coordinates[fieldWithDynamicValue];

			let existingCellsBeforeTheWordOnMainAxis: IBoardCell[] = [];

			for (let i = 0, len = firstIndex; i < len; i++) {
				const cell = directionIsRight ? boardCells[staticFieldIndex][i] : boardCells[i][staticFieldIndex];
				const tile = cell.tile;
				const letter = tile?.letter;

				if (letter) {
					existingCellsBeforeTheWordOnMainAxis.push(cell);
				} else {
					existingCellsBeforeTheWordOnMainAxis = [];
				}
			}

			let existingCellsAfterTheWordOnMainAxis: IBoardCell[] = [];

			for (let i = lastIndex + 1, len = BOARD_SIZE; i < len; i++) {
				const cell = directionIsRight ? boardCells[staticFieldIndex][i] : boardCells[i][staticFieldIndex];
				const tile = cell.tile;
				const letter = tile?.letter;

				if (letter) {
					existingCellsAfterTheWordOnMainAxis.push(cell);
				} else {
					break;
				}
			}

			let playedWordOnMainAxis: IBoardCell[] = [];

			for (let i = firstIndex, len = lastIndex + 1; i < len; i++) {
				const cell = directionIsRight ? boardCells[staticFieldIndex][i] : boardCells[i][staticFieldIndex];
				const tile = cell.tile;
				const letter = tile?.letter;

				if (letter) {
					playedWordOnMainAxis.push(cell);
				}
			}

			const wordOnMainAxis = existingCellsBeforeTheWordOnMainAxis.concat(...playedWordOnMainAxis, ...existingCellsAfterTheWordOnMainAxis);

			const wordsOnSecondaryAxis = [];

			for (let i = 0, len = playedCells.length; i < len; i++) {
				const cell = playedCells[i];
				const word = wordOnSecondaryAxis(cell, boardCells);

				if (word) {
					wordsOnSecondaryAxis.push(word);
				}
			}

			console.log({ a: [...wordOnMainAxis], b: [...wordsOnSecondaryAxis] });

			words.push(wordOnMainAxis, ...wordsOnSecondaryAxis);

			return words;
		},
		[direction, wordOnSecondaryAxis]
	);

	const validateWords = useCallback((words: IBoardCell[][]): [passingWords: IBoardCell[][], failingWords: IBoardCell[][]] => {
		const checker = Checker;

		const passingWords = [];
		const failingWords = [];

		for (let i = 0, len = words.length; i < len; i++) {
			const word = words[i];
			let text = "";

			for (let ii = 0, len2 = word.length; ii < len2; ii++) {
				const letter = word[ii].tile?.letter;

				if (letter) {
					text += letter;
				}
			}

			const check = checker.checkWord(text);

			if (check) {
				passingWords.push(word);
			} else {
				failingWords.push(word);
			}
		}

		return [passingWords, failingWords];
	}, []);

	const calculatePoints = useCallback((words: IBoardCell[][]): number => {
		return 10;
	}, []);

	const checkPlayedWord = useCallback(() => {
		resetCellErrors();

		const playedCells = getCellsWithNotLockedTiles();
		const emptyCells = emptyCellsBetween(playedCells, boardCells);

		if (emptyCells.length > 0) {
			setCellErrors(emptyCells);

			return false;
		}

		const newWords = getNewWords(playedCells, boardCells);

		const [passingWords, failingWords] = validateWords(newWords);

		if (failingWords.length > 0) {
			const invalidCoordinates: ITileCoordinates[] = [];

			for (let i = 0, len = failingWords.length; i < len; i++) {
				const word = failingWords[i];

				for (let ii = 0, len2 = word.length; ii < len2; ii++) {
					const cell = word[ii];
					const coordinates = cell.coordinates;
					invalidCoordinates.push(coordinates);
				}
			}

			setCellErrors(invalidCoordinates);

			return false;
		}

		const points = calculatePoints(passingWords);

		const words = [];

		for (let i = 0, len = passingWords.length; i < len; i++) {
			const word = passingWords[i];
			let stringWord = "";

			for (let ii = 0, len2 = word.length; ii < len2; ii++) {
				const letter = word[ii].tile?.letter;

				if (letter) {
					stringWord += letter;
				}
			}

			words.push(stringWord);
		}

		turns.push({ playedWords: words, filledCells: playedCells, points });
		console.log({ playedWords: words, filledCells: playedCells, points });

		setTurns(turns);
	}, [boardCells, getCellsWithNotLockedTiles, emptyCellsBetween, resetCellErrors, setCellErrors, turns, getNewWords, calculatePoints, validateWords]);

	const keyDownCallback = useCallback(
		(event: KeyboardEvent) => {
			const code = event.code;
			let preventDefault = false;

			if (code === "Tab") {
				preventDefault = true;

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
			} else if (code === "Enter") {
				preventDefault = true;
				checkPlayedWord();
				console.log("enter");
			}

			if (preventDefault) {
				event.preventDefault();
			}
		},
		[direction, getCellsWithNotLockedTiles, moveFocus, checkPlayedWord]
	);

	useKeyDownListener(keyDownCallback);

	const sameRow = (c1: ITileCoordinates, c2: ITileCoordinates) => {
		return c1.row === c2.row;
	};

	const sameColumn = (c1: ITileCoordinates, c2: ITileCoordinates) => {
		return c1.column === c2.column;
	};

	const alignedWithOtherPlayedTiles = (coordinates: ITileCoordinates) => {
		const cellsWithPlayedTile = getCellsWithNotLockedTiles();
		const isSameRow = cellsWithPlayedTile.every((playedCell) => sameRow(playedCell.coordinates, coordinates));
		const isSameColumn = cellsWithPlayedTile.every((playedCell) => sameColumn(playedCell.coordinates, coordinates));

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
				resetCellErrors();

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
				resetCellErrors();

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

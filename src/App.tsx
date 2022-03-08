import { useCallback, useEffect, useState } from "react";
import "./App.scss";
import { Checker } from "./checker/Checker";
import { Board } from "./components/Board";
import { GameArea } from "./components/GameArea";
import { Hand } from "./components/Hand";
import { PointSheet } from "./components/PointSheet";
import { SpecialCell } from "./enums/SpecialCell";
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
			const moveDirection = { ...direction };
			let focusCell: IBoardCell | undefined = undefined;
			let i = 0;

			while (!focusCell && i < BOARD_SIZE) {
				const { column, row } = coordinates;
				const { column: moveColumn, row: moveRow } = moveDirection;
				const bTiles = boardCells.slice();
				const rowLength = bTiles.length - 1;
				const columnLength = rowLength ? bTiles[0].length - 1 : 0;
				const newRow = row + moveRow;
				const focusRow = newRow > rowLength ? (newRow % rowLength) - 1 : newRow < 0 ? rowLength : newRow;
				const newColumn = column + moveColumn;
				const focusColumn = newColumn > columnLength ? (newColumn % columnLength) - 1 : newColumn < 0 ? columnLength : newColumn;
				const cell = bTiles[focusRow][focusColumn];

				if (!cell.tile || !cell.tile.locked) {
					focusCell = cell;
					break;
				}

				moveDirection.column = direction.column === 0 ? 0 : moveDirection.column + (direction.column > 0 ? 1 : -1);
				moveDirection.row = direction.row === 0 ? 0 : moveDirection.row + (direction.row > 0 ? 1 : -1);
				i++;
			}

			if (!focusCell) return;

			const input = focusCell.inputRef?.current;

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

			const wordOnMainAxisIsTooShort = wordOnMainAxis.length < 2;

			if (wordOnMainAxisIsTooShort && wordsOnSecondaryAxis.length < 1) {
				words.push(wordOnMainAxis);
			} else if (wordOnMainAxisIsTooShort && wordsOnSecondaryAxis.length > 0) {
				words.push(...wordsOnSecondaryAxis);
			} else {
				words.push(wordOnMainAxis, ...wordsOnSecondaryAxis);
			}

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
				const char = word[ii].tile?.letter.char;

				if (char) {
					text += char;
				}
			}

			const check = checker.checkWord(text) && word.length > 1;

			if (check) {
				passingWords.push(word);
			} else {
				failingWords.push(word);
			}
		}

		return [passingWords, failingWords];
	}, []);

	const getLetterMultiplierForSpecial = (special: SpecialCell | undefined) => {
		switch (special) {
			case SpecialCell.x2letter:
				return 2;
			case SpecialCell.x3letter:
				return 3;
			default:
				return 1;
		}
	};

	const getWordMultiplierForSpecial = (special: SpecialCell | undefined) => {
		switch (special) {
			case SpecialCell.start:
			case SpecialCell.x2word:
				return 2;
			case SpecialCell.x3word:
				return 3;
			default:
				return 1;
		}
	};

	const calculatePoints = useCallback((words: IBoardCell[][]): number => {
		let points = 0;

		words.forEach((word) => {
			let wordPoints = 0;
			let wordMultiplier = 1;

			word.forEach((cell) => {
				const special = cell.special;
				const tile = cell.tile;
				let letterMultiplier = getLetterMultiplierForSpecial(special);

				wordMultiplier *= getWordMultiplierForSpecial(special);

				if (tile) {
					wordPoints += letterMultiplier * tile.letter.value;
				}
			});

			points += wordMultiplier * wordPoints;
		});

		return points;
	}, []);

	const fillHand = useCallback(
		(existingHand: ITile[]) => {
			if (!letterBag) return;

			const newHand = existingHand.slice();

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

	const removePlayedTilesFromHandAndFill = useCallback(() => {
		const currentHand = [...hand];
		const newHand = currentHand.filter((tile) => !tile.played);

		fillHand(newHand);
	}, [hand, fillHand]);

	const lockCells = useCallback(
		(cells: IBoardCell[]) => {
			const newBoard = [...boardCells];

			for (let i = 0, len = cells.length; i < len; i++) {
				const cell = cells[i];
				const { row, column } = cell.coordinates;

				const tile = newBoard[row][column].tile;

				if (tile) {
					tile.locked = true;
				}
			}

			setBoardCells(newBoard);
		},
		[boardCells]
	);

	const getCoordinates = (words: IBoardCell[][]) => {
		const coordinates: ITileCoordinates[] = [];

		for (let i = 0, len = words.length; i < len; i++) {
			const word = words[i];

			for (let ii = 0, len2 = word.length; ii < len2; ii++) {
				const cell = word[ii];

				coordinates.push(cell.coordinates);
			}
		}

		return coordinates;
	};

	const checkPlayedWord = useCallback(() => {
		resetCellErrors();

		const playedCells = getCellsWithNotLockedTiles();
		const emptyCells = emptyCellsBetween(playedCells, boardCells);

		if (emptyCells.length > 0) {
			setCellErrors(emptyCells);

			return false;
		}

		const newWords = getNewWords(playedCells, boardCells);

		if (turns.length === 0) {
			let usesStartingCell = false;

			for (let i = 0, len = newWords.length; i < len; i++) {
				const word = newWords[i];

				for (let ii = 0, len2 = word.length; ii < len2; ii++) {
					const cell = word[ii];

					if (cell.special === SpecialCell.start) {
						usesStartingCell = true;
						break;
					}
				}
			}

			if (!usesStartingCell) {
				const invalidCoordinates = getCoordinates(newWords);

				setCellErrors(invalidCoordinates);

				return false;
			}
		}

		if (newWords.length === 1 && turns.length > 0) {
			const word = newWords[0];
			let usesExistingCell = false;

			for (let i = 0, len = word.length; i < len; i++) {
				const cell = word[i];

				if (cell.tile && cell.tile.locked) {
					usesExistingCell = true;
					break;
				}
			}

			if (!usesExistingCell) {
				const invalidCoordinates = getCoordinates(newWords);

				setCellErrors(invalidCoordinates);

				return false;
			}
		}
		console.log({ newWords });

		const [passingWords, failingWords] = validateWords(newWords);
		console.log({ passingWords, failingWords });

		if (failingWords.length > 0) {
			const invalidCoordinates = getCoordinates(failingWords);

			setCellErrors(invalidCoordinates);

			return false;
		}

		if (passingWords.length < 1) return false;

		const points = calculatePoints(passingWords);

		const words = [];

		for (let i = 0, len = passingWords.length; i < len; i++) {
			const word = passingWords[i];
			let stringWord = "";

			for (let ii = 0, len2 = word.length; ii < len2; ii++) {
				const letter = word[ii].tile?.letter;

				if (letter) {
					stringWord += letter.char;
				}
			}

			words.push(stringWord);
		}

		removePlayedTilesFromHandAndFill();
		lockCells(playedCells);

		const newTurns = [...turns];
		newTurns.push({ playedWords: words, filledCells: playedCells, points });

		setTurns(newTurns);

		return true;
	}, [boardCells, getCellsWithNotLockedTiles, emptyCellsBetween, resetCellErrors, setCellErrors, turns, getNewWords, calculatePoints, validateWords, removePlayedTilesFromHandAndFill, lockCells]);

	const keyDownCallback = useCallback(
		(event: KeyboardEvent) => {
			const code = event.code;
			let preventDefault = false;

			if (code === "Tab") {
				console.log("tab");

				preventDefault = true;

				const playedCells = getCellsWithNotLockedTiles();
				const amountOfPlayedCells = playedCells.length;

				if (amountOfPlayedCells < 2) {
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
			} else if (code === "Enter") {
				console.log("enter");
				preventDefault = true;
				checkPlayedWord();
			}

			if (preventDefault) {
				console.log("prevdef");
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

	const alignedWithWriteDirection = useCallback(
		(coordinates: ITileCoordinates) => {
			const cellsWithPlayedTile = getCellsWithNotLockedTiles();

			if (cellsWithPlayedTile.length < 2) return true;

			const directionIsRight = direction === WriteDirection.Right;
			let isAligned = false;

			if (directionIsRight) {
				const isSameRow = cellsWithPlayedTile.every((playedCell) => sameRow(playedCell.coordinates, coordinates));

				isAligned = isSameRow;
			} else {
				const isSameColumn = cellsWithPlayedTile.every((playedCell) => sameColumn(playedCell.coordinates, coordinates));

				isAligned = isSameColumn;
			}

			return isAligned;
		},
		[getCellsWithNotLockedTiles, direction]
	);

	const shouldChangeDirection = useCallback(
		(coordinates: ITileCoordinates) => {
			const cellsWithPlayedTile = getCellsWithNotLockedTiles();

			if (cellsWithPlayedTile.length < 2) return false;

			const directionIsRight = direction === WriteDirection.Right;
			let shouldChange = false;

			if (directionIsRight) {
				const isSameColumn = cellsWithPlayedTile.every((playedCell) => sameColumn(playedCell.coordinates, coordinates));

				shouldChange = isSameColumn;
			} else {
				const isSameRow = cellsWithPlayedTile.every((playedCell) => sameRow(playedCell.coordinates, coordinates));

				shouldChange = isSameRow;
			}

			return shouldChange;
		},
		[getCellsWithNotLockedTiles, direction]
	);

	const playHandTile = useCallback(
		(letter: string, coordinates: ITileCoordinates): ITile | null => {
			const upperCaseLetter = letter.toUpperCase();
			const currentHand = hand.slice();

			for (let i = 0, len = currentHand.length; i < len; i++) {
				const handTile = currentHand[i];

				if (upperCaseLetter === handTile.letter.char && !handTile.played && alignedWithWriteDirection(coordinates)) {
					handTile.played = true;

					setHand(currentHand);
					resetCellErrors();

					return handTile;
				}
			}

			return null;
		},
		[alignedWithWriteDirection, hand, resetCellErrors]
	);

	const unPlayHandTile = useCallback(
		(letter: string): boolean => {
			const upperCaseLetter = letter.toUpperCase();
			const currentHand = hand.slice();

			for (let i = 1, len = currentHand.length; i <= len; i++) {
				const handTile = currentHand[len - i];

				if (upperCaseLetter === handTile.letter.char && handTile.played) {
					handTile.played = false;

					setHand(currentHand);
					resetCellErrors();

					return true;
				}
			}

			return false;
		},
		[hand, resetCellErrors]
	);

	const tileChanged = useCallback(
		(coordinates: ITileCoordinates, value: string | undefined) => {
			const { column, row } = coordinates;
			const cells = boardCells.slice(0);
			const cell = cells[row][column];

			if (cell) {
				if (!Checker.checkLetter(value)) return;

				let playedTile = null;
				const oldValue = cell.tile?.letter;

				if (!value) {
					cell.tile = undefined;
				} else if ((playedTile = playHandTile(value, coordinates)) !== null) {
					cell.tile = playedTile;
				}

				setBoardCells(cells);

				if (oldValue) {
					unPlayHandTile(oldValue.char);
				}

				if (!oldValue && playedTile) {
					const changeDirection = shouldChangeDirection(coordinates);
					const moveDirection = { row: 0, column: 0 };

					const directionIsRight = changeDirection ? !(direction === WriteDirection.Right) : direction === WriteDirection.Right;

					if (directionIsRight) {
						moveDirection.column = 1;
					} else {
						moveDirection.row = 1;
					}

					if (changeDirection) {
						setDirection(directionIsRight ? WriteDirection.Right : WriteDirection.Down);
					}

					moveFocus(coordinates, moveDirection);
				}
			}
		},
		[boardCells, setBoardCells, direction, playHandTile, unPlayHandTile, moveFocus, shouldChangeDirection]
	);

	useEffect(() => {
		const letterBag = new LetterBag();
		setLetterBag(letterBag);
	}, [setLetterBag]);

	useEffect(() => {
		fillHand(hand);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [letterBag]);

	const { startAmount, currentAmount } = letterBag?.getLetterAmounts() || {};

	return (
		<div className='app'>
			{`${currentAmount} / ${startAmount} kirjainta pussissa`}
			<GameArea pointShteet={<PointSheet turns={turns} />} board={<Board tileChanged={tileChanged} direction={direction} boardCells={boardCells} moveFocus={moveFocus} />} hand={<Hand hand={hand} />} />
		</div>
	);
}

export default App;

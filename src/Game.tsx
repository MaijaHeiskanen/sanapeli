import classNames from "classnames";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./App.scss";
import { Checker } from "./checker/Checker";
import { Board } from "./components/Board";
import { GameArea } from "./components/GameArea";
import { Hand } from "./components/Hand";
import { HighscoreBoard } from "./components/HighscoreBoard";
import { Info } from "./components/Info";
import { Menu } from "./components/Menu";
import { PointSheet } from "./components/PointSheet";
import { SpecialCell } from "./enums/SpecialCell";
import { WriteDirection } from "./enums/WriteDirection";
import { createBoard } from "./helpers/createBoard";
import { generateSeed } from "./helpers/generateSeed";
import { ILetterAmounts, LetterBag } from "./helpers/LetterBag";
import { setPlayedCellsToBoard } from "./helpers/setPlayedCells";
import { setSpecialCells } from "./helpers/setSpecialTiles";
import { useKeyDownListener } from "./hooks/useKeyDownListener";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { Instructions } from "./Instructions";
import { IBoardCell, IHighscore, ITile, ITileCoordinates, ITurn } from "./react-app-env";

export const BOARD_SIZE = 15;
export const HAND_SIZE = 7;
export const SHOW_HIGHSCORES = 5;

export const Game = () => {
	const navigate = useNavigate();

	const [highscores, setHighscores] = useLocalStorage<IHighscore[]>("highscores", []);
	const [playedCells, setPlayedCells] = useLocalStorage<IBoardCell[]>("playedCells", []);
	const [letterBag, setLetterBag] = useState<LetterBag>();
	const [direction, setDirection] = useLocalStorage<WriteDirection>("direction", WriteDirection.Right);
	const [hand, setHand] = useLocalStorage<ITile[]>("hand", []);
	const [boardCells, setBoardCells] = useState<IBoardCell[][]>([[]]);
	const [turns, setTurns] = useLocalStorage<ITurn[]>("turns", []);
	const [currentAmount, setCurrentAmount] = useLocalStorage<number | null>("currentAmount", null);
	const [amountOfEachLetter, setAmountOfEachLetter] = useLocalStorage<ILetterAmounts | null>("amountOfEachLetter", null);
	const [gameEnded, setGameEnded] = useLocalStorage("hameEnded", false);
	const [showInstructions, setShowInstruction] = useState(false);
	const [initDone, setInitDone] = useState(false);
	const instructionsRef = useRef<HTMLDivElement>(null);
	const appRef = useRef<HTMLDivElement>(null);

	const { seed: urlSeed } = useParams();
	const [seed, setSeed] = useLocalStorage<string | undefined>("seed", undefined);

	const isBoardEmpty = useMemo(() => {
		for (let i = 0, len = boardCells.length; i < len; i++) {
			const row = boardCells[i];

			for (let ii = 0, len2 = row.length; ii < len2; ii++) {
				const cell = row[ii];

				if (cell.tile?.locked) {
					return false;
				}
			}
		}

		return true;
	}, [boardCells]);

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
				const cell = { ...boardCells[i][ii], invalidTile: false };

				column.push(cell);
			}

			rows.push(column);
		}

		setBoardCells(rows);
	}, [boardCells, setBoardCells]);

	const setCellErrors = useCallback(
		(coordinates: ITileCoordinates[]) => {
			const newBoardCells = [...boardCells];

			for (const { column, row } of coordinates) {
				const cell = { ...newBoardCells[row][column], invalidTile: true };

				newBoardCells[row][column] = cell;
			}

			setBoardCells(newBoardCells);
		},
		[boardCells, setBoardCells]
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
				const locked = tile?.locked;

				let letterMultiplier = locked ? 1 : getLetterMultiplierForSpecial(special);

				wordMultiplier *= locked ? 1 : getWordMultiplierForSpecial(special);

				if (tile) {
					wordPoints += letterMultiplier * tile.letter.value;
				}
			});

			points += wordMultiplier * wordPoints;
		});

		return points;
	}, []);

	const fillHand = useCallback(
		(existingHand: ITile[], letterBagParam: LetterBag | undefined = letterBag) => {
			if (!letterBagParam) return;

			const newHand = existingHand.slice();

			for (let i = newHand.length; i < HAND_SIZE; i++) {
				const newLetter = letterBagParam.getNextLetter();

				if (newLetter === null) {
					break;
				}

				newHand.push({ letter: newLetter });
			}
			setHand(newHand);
		},
		[letterBag, setHand, hand]
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
		[boardCells, setBoardCells]
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

	const addPlayedCell = useCallback(
		(coordinates: ITileCoordinates, playedTile: ITile) => {
			const newPlayedCells = [...playedCells];

			newPlayedCells.push({ coordinates, tile: playedTile });

			setPlayedCells(newPlayedCells);
		},
		[playedCells, setPlayedCells]
	);

	const checkPlayedWord = useCallback(() => {
		resetCellErrors();

		const playedCells = getCellsWithNotLockedTiles();
		const emptyCells = emptyCellsBetween(playedCells, boardCells);

		if (emptyCells.length > 0) {
			setCellErrors(emptyCells);

			return false;
		}

		const newWords = getNewWords(playedCells, boardCells);

		if (isBoardEmpty) {
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

		if (newWords.length === 1 && !isBoardEmpty) {
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

		const [passingWords, failingWords] = validateWords(newWords);

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
		newTurns.push({ playedWords: words, points });

		for (const { coordinates, tile } of playedCells) {
			if (tile) {
				addPlayedCell(coordinates, tile);
			}
		}

		setTurns(newTurns);

		return true;
	}, [boardCells, getCellsWithNotLockedTiles, emptyCellsBetween, resetCellErrors, setCellErrors, turns, getNewWords, calculatePoints, validateWords, removePlayedTilesFromHandAndFill, lockCells, isBoardEmpty, setTurns, addPlayedCell]);

	const keyDownCallback = useCallback(
		(event: KeyboardEvent) => {
			const code = event.code;
			let preventDefault = false;

			if (code === "Tab") {
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
				preventDefault = true;
				checkPlayedWord();
			}

			if (preventDefault) {
				event.preventDefault();
			}
		},
		[direction, getCellsWithNotLockedTiles, moveFocus, checkPlayedWord, setDirection]
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
		[alignedWithWriteDirection, hand, resetCellErrors, setHand]
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
		[hand, resetCellErrors, setHand]
	);

	const removePlayedCell = useCallback(
		(coordinates: ITileCoordinates) => {
			const { row, column } = coordinates;

			for (let i = 0, len = playedCells.length; i < len; i++) {
				const cell = playedCells[i];

				if (!cell) continue;

				const playedCellCoordinates = cell.coordinates;

				if (row === playedCellCoordinates.row && column === playedCellCoordinates.column) {
					const newPlayedCells = [...playedCells];

					newPlayedCells.splice(i, 1);

					setPlayedCells(newPlayedCells);

					return;
				}
			}
		},
		[playedCells, setPlayedCells]
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
					removePlayedCell(coordinates);
				} else if ((playedTile = playHandTile(value, coordinates)) !== null) {
					cell.tile = playedTile;
					addPlayedCell(coordinates, cell.tile);
				}

				setBoardCells(cells);

				if (oldValue) {
					unPlayHandTile(oldValue.char);
				}

				if (!oldValue && playedTile) {
					const changeDirection = shouldChangeDirection(coordinates);
					const moveDirection = { row: 0, column: 0 };
					let localDirection = direction;

					if (changeDirection) {
						localDirection = localDirection === WriteDirection.Right ? WriteDirection.Down : WriteDirection.Right;
						setDirection(localDirection);
					}

					if (localDirection === WriteDirection.Right) {
						moveDirection.column = 1;
					} else {
						moveDirection.row = 1;
					}

					moveFocus(coordinates, moveDirection);
				}
			}
		},
		[boardCells, setBoardCells, direction, playHandTile, unPlayHandTile, moveFocus, shouldChangeDirection, addPlayedCell, removePlayedCell, setDirection]
	);

	const navigateTo = useCallback(
		(seed: string) => {
			navigate(`/${seed}`);
		},
		[navigate]
	);

	const initGame = useCallback(
		(newSeed: string) => {
			setBoardCells(setSpecialCells(createBoard(BOARD_SIZE)));
			setSeed(newSeed);
			setHand([]);
			setTurns([]);
			setPlayedCells([]);
			setGameEnded(false);
			setCurrentAmount(0);
			setAmountOfEachLetter(null);
			setInitDone(false);
		},
		[setGameEnded, setHand, setPlayedCells, setSeed, setTurns, setAmountOfEachLetter, setCurrentAmount]
	);

	const newGame = useCallback(() => {
		navigateTo(generateSeed());
	}, [navigateTo]);

	useEffect(() => {
		if (urlSeed === seed && seed) {
			if (!initDone) {
				setBoardCells(setPlayedCellsToBoard(setSpecialCells(createBoard(BOARD_SIZE)), playedCells));
				const letterBag = new LetterBag(seed, currentAmount);

				if (hand.length === 0) {
					fillHand([], letterBag);
				}

				setLetterBag(letterBag);
				setInitDone(true);
			}

			return;
		}
		if (!urlSeed) {
			if (seed) {
				navigateTo(seed);

				return;
			}
			newGame();

			return;
		}

		initGame(urlSeed);
	}, [initGame, seed, setSeed, urlSeed, currentAmount, initDone, playedCells, newGame, fillHand, navigateTo, hand]);

	// useEffect(() => {
	// 	let letterBag;

	// 	if (initDone) return;

	// 	if (!urlSeed && !seed) {
	// 		newGame();

	// 		setInitDone(true);
	// 		return;
	// 	}

	// 	if (urlSeed && !seed) {
	// 		newGame(urlSeed);
	// 		setInitDone(true);
	// 		return;
	// 	}

	// 	if (!urlSeed && seed) {
	// 		setBoardCells(setPlayedCellsToBoard(setSpecialCells(createBoard(BOARD_SIZE)), playedCells));
	// 		letterBag = new LetterBag(seed, currentAmount, startAmount);
	// 		setLetterBag(letterBag);
	// 		navigateTo(seed);
	// 		setInitDone(true);
	// 		return;
	// 	}

	// 	if (urlSeed !== seed && urlSeed) {
	// 		newGame(urlSeed);
	// 		setInitDone(true);

	// 		return;
	// 	}

	// 	if (urlSeed === seed && seed) {
	// 		setBoardCells(setPlayedCellsToBoard(setSpecialCells(createBoard(BOARD_SIZE)), playedCells));
	// 		letterBag = new LetterBag(seed, currentAmount, startAmount);
	// 		setLetterBag(letterBag);
	// 		navigateTo(seed);
	// 		setInitDone(true);

	// 		return;
	// 	}
	// }, [urlSeed, initDone, navigateTo]);

	const changeHand = () => {
		const result = true; //window.confirm("Menetät kädessäsi olevien kirjainten pisteiden määrän verran pisteitä. Haluatko vaihtaa kaikki kädessäsi olevat kirjaimet?");

		if (!result) return;

		let lostPoints = 0;
		let changedLetters = [];

		for (let i = 0, len = hand.length; i < len; i++) {
			const tile = hand[i];

			lostPoints += tile.letter.value;
			changedLetters.push(tile.letter.char);
		}

		setTurns([...turns, { changingTiles: true, playedWords: changedLetters, points: -lostPoints }]);
		fillHand([]);
	};

	const endGame = () => {
		if (currentAmount === null || currentAmount < 99) return;

		let lostPoints = 0;
		let changedLetters = [];

		for (let i = 0, len = hand.length; i < len; i++) {
			const tile = hand[i];

			lostPoints += tile.letter.value;
			changedLetters.push(tile.letter.char);
		}

		setHand([]);
		const finalTurns = [...turns, { changingTiles: true, playedWords: changedLetters, points: -lostPoints }];
		setTurns(finalTurns);

		const score = finalTurns.reduce((a, b) => a + b.points, 0);
		const amountOfPlayedWords = finalTurns.reduce((a, b) => a + (b.changingTiles ? 0 : b.playedWords.length), 0);
		const amountOfSkippedLetters = finalTurns.reduce((a, b) => a + (b.changingTiles ? b.playedWords.length : 0), 0);
		const newScore = { points: score, amountOfPlayedWords, amountOfSkippedLetters, date: new Date(), seed };
		let newHighscores = [...highscores].sort((a, b) => b.points - a.points);

		if (newHighscores.length < SHOW_HIGHSCORES) {
			newHighscores.push(newScore);
		} else {
			for (let i = 0, len = newHighscores.length; i < len; i++) {
				const highscore = newHighscores[i];

				if (newScore.points > highscore.points) {
					newHighscores.splice(i, 0, newScore);
					newHighscores.pop();

					break;
				}
			}
		}

		newHighscores = newHighscores.sort((a, b) => b.points - a.points);

		setHighscores(newHighscores);
		setGameEnded(true);
	};

	const toggleInstructionsPopover = () => {
		setShowInstruction(!showInstructions);

		if (showInstructions) {
			appRef?.current?.scrollIntoView({ block: "start", behavior: "smooth" });
		} else {
			instructionsRef?.current?.scrollIntoView({ block: "end", behavior: "smooth" });
		}
	};

	// useEffect(() => {
	// 	if (initDone && seed) {
	// 		navigateTo(seed);
	// 	}
	// }, [navigateTo, seed, initDone]);

	// useEffect(() => {
	// 	fillHand(hand);
	// }, [letterBag]);

	const updateLetterAmounts = useCallback(() => {
		if (initDone) {
			const { currentAmount: current, amountOfEachLetter: amounts } = letterBag?.getLetterAmounts() || { currentAmount: null, amountOfEachLetter: null };

			setCurrentAmount(current);
			setAmountOfEachLetter(amounts);
		}
	}, [letterBag, setCurrentAmount, setAmountOfEachLetter, initDone]);

	useEffect(() => {
		updateLetterAmounts();
	}, [hand]);

	return (
		<div className='app' ref={appRef}>
			<div className={classNames("instructions-section")} ref={instructionsRef}>
				<Instructions show={showInstructions} />
				{showInstructions && <button onClick={toggleInstructionsPopover}>Piilota ohjeet</button>}
			</div>
			<GameArea
				pointShteet={<PointSheet turns={turns} />}
				info={<Info currentAmount={currentAmount} amountOfEachLetter={amountOfEachLetter} />}
				board={<Board tileChanged={tileChanged} direction={direction} boardCells={boardCells} moveFocus={moveFocus} />}
				hand={<Hand hand={hand} />}
				highscoreBoard={<HighscoreBoard highscores={highscores} />}
				menu={<Menu toggleInstructionsPopover={toggleInstructionsPopover} newGame={newGame} changeHand={changeHand} endGame={endGame} canEndGame={currentAmount === 99 && !gameEnded} canChangeHand={(currentAmount || 0) < 99} />}
			/>
		</div>
	);
};

import { useEffect, useState } from "react";
import { Checker } from "../checker/Checker";
import { WriteDirection } from "../enums/WriteDirection";
import { createBoard } from "../helpers/createBoard";
import { setSpecialTiles } from "../helpers/setSpecialTiles";
import { IBoardTile, IHandTile, ITileCoordinates } from "../react-app-env";
import { Tile } from "./Tile";

const SIZE = 15;

const forEachTile = (board: IBoardTile[][], f: (tile: IBoardTile) => IBoardTile): IBoardTile[][] => {
	const newBoard = board.slice();

	for (let i = 0, len = newBoard.length; i < len; i++) {
		for (let ii = 0, len2 = newBoard[0].length; ii < len2; ii++) {
			const tile = newBoard[i][ii];
			f(tile);
		}
	}

	return newBoard;
};

export const Board = (props: { hand: IHandTile[]; direction: WriteDirection; useHandTile: (letter: string) => boolean; unUseHandTile: (letter: string) => boolean }) => {
	const [boardTiles, setBoardTiles] = useState<IBoardTile[][]>([[]]);

	useEffect(() => {
		setBoardTiles(setSpecialTiles(createBoard(SIZE)));
	}, []);

	// useEffect(() => {
	// 	const keyUpCallback = (event: KeyboardEvent) => {
	// 		const code = event.code;
	// 		console.log(code);

	// 		if (code === "ShiftLeft" || code === "ShiftRight") {
	// 			console.log("shift up");
	// 			setDirection(WriteDirection.Right);
	// 		}
	// 	};
	// 	document.addEventListener("keyup", keyUpCallback);

	// 	const removeShiftListener = () => {
	// 		document.removeEventListener("keyup", keyUpCallback);
	// 	};

	// 	return removeShiftListener;
	// }, []);

	// useEffect(() => {
	// 	const keyDownCallback = (event: KeyboardEvent) => {
	// 		const code = event.code;
	// 		console.log(code);

	// 		if (code === "ShiftLeft" || code === "ShiftRight") {
	// 			console.log("shift down");
	// 			setDirection(WriteDirection.Down);
	// 		}
	// 	};
	// 	document.addEventListener("keydown", keyDownCallback);

	// 	const removeShiftListener = () => {
	// 		document.removeEventListener("keydown", keyDownCallback);
	// 	};

	// 	return removeShiftListener;
	// }, []);

	const tileFocused = (coordinates: ITileCoordinates) => {
		const { column, row } = coordinates;
		const bTiles = forEachTile(boardTiles.slice(), (tile: IBoardTile) => {
			if (tile.tile) {
				tile.tile.focused = false;
			}

			return tile;
		});
		const bTile = bTiles[row][column];

		if (bTile && bTile.tile) {
			bTile.tile.focused = true;
			setBoardTiles(bTiles);
		}
	};

	const tileBlurred = (coordinates: ITileCoordinates) => {
		const { column, row } = coordinates;
		const bTiles = boardTiles.slice();
		const bTile = bTiles[row][column];

		if (bTile && bTile.tile) {
			bTile.tile.focused = false;
			setBoardTiles(bTiles);
		}
	};

	const tileChanged = (coordinates: ITileCoordinates, value: string | undefined) => {
		const direction = props.direction;
		const { column, row } = coordinates;
		const bTiles = boardTiles.slice();
		const bTile = bTiles[row][column];

		if (bTile && bTile.tile) {
			console.log(Checker.checkLetter(value));

			if (!Checker.checkLetter(value)) return;

			if (!value || props.useHandTile(value)) {
				const oldValue = bTile.tile.letter;

				if (oldValue) {
					props.unUseHandTile(oldValue);
				}

				bTile.tile.letter = value;
				setBoardTiles(bTiles);

				if (!oldValue) {
					let nextTile = bTiles[row][column + 1];

					if (direction === WriteDirection.Right) {
						nextTile = bTiles[row][column + 1];
					} else if (direction === WriteDirection.Down) {
						nextTile = bTiles[row + 1][column];
					}

					nextTile?.inputRef?.current?.focus();
				}
			}
		}
	};

	const moveFocus = (coordinates: ITileCoordinates, direction: ITileCoordinates) => {
		const { column, row } = coordinates;
		const { column: moveColumn, row: moveRow } = direction;
		const bTiles = boardTiles.slice();
		const rowLength = bTiles.length - 1;
		const columnLength = rowLength ? bTiles[0].length - 1 : 0;
		const newRow = row + moveRow;
		const focusRow = newRow > rowLength ? (newRow % rowLength) - 1 : newRow < 0 ? rowLength : newRow;
		const newColumn = column + moveColumn;
		const focusColumn = newColumn > columnLength ? (newColumn % columnLength) - 1 : newColumn < 0 ? columnLength : newColumn;
		const focusTile = bTiles[focusRow][focusColumn];
		const input = focusTile?.inputRef?.current;

		input?.focus();
	};

	const boardRows = [];

	for (let i = 0; i < boardTiles.length; i++) {
		const row = [];

		for (let ii = 0; ii < boardTiles[0].length; ii++) {
			const tile = boardTiles[i][ii];
			row.push(<Tile ref={tile.inputRef} key={`${i}${ii}`} tile={tile} direction={props.direction} moveFocus={moveFocus} focusedCallback={tileFocused} blurredCallback={tileBlurred} changedCallback={tileChanged} />);
		}

		boardRows.push(row);
	}

	const rows = boardRows.map((row, index) => {
		return (
			<div key={index} className='row'>
				{row}
			</div>
		);
	});

	return <div className='board'>{rows}</div>;
};

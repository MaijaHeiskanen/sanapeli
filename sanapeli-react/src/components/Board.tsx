import { useEffect, useState } from "react";
import { Checker } from "../checker/Checker";
import { createBoard } from "../helpers/createBoard";
import { setSpecialTiles } from "../helpers/setSpecialTiles";
import { IBoardTile, ITile, ITileCoordinates } from "../react-app-env";
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

export const Board = () => {
	const [boardTiles, setBoardTiles] = useState<IBoardTile[][]>([[]]);

	useEffect(() => {
		setBoardTiles(setSpecialTiles(createBoard(SIZE)));
	}, []);

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
		const { column, row } = coordinates;
		const bTiles = boardTiles.slice();
		const bTile = bTiles[row][column];

		if (bTile && bTile.tile) {
			console.log(Checker.checkLetter(value));

			if (!Checker.checkLetter(value)) return;

			console.log({ value });

			bTile.tile.letter = value;
			setBoardTiles(bTiles);

			if (!value) {
				const previousColumn = column === 0 ? -1 : column - 1;
				const previousTile = bTiles[row][previousColumn];

				previousTile?.inputRef?.current?.focus();
			} else {
				const nextTile = bTiles[row][column + 1];

				nextTile?.inputRef?.current?.focus();
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

		focusTile?.inputRef?.current?.focus();
	};

	const boardRows = [];

	for (let i = 0; i < boardTiles.length; i++) {
		const row = [];

		for (let ii = 0; ii < boardTiles[0].length; ii++) {
			const tile = boardTiles[i][ii];
			row.push(<Tile ref={tile.inputRef} key={`${i}${ii}`} tile={tile} moveFocus={moveFocus} focusedCallback={tileFocused} blurredCallback={tileBlurred} changedCallback={tileChanged} />);
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

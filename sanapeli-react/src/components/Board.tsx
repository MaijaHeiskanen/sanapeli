import { useCallback, useMemo } from "react";
import { Checker } from "../checker/Checker";
import { WriteDirection } from "../enums/WriteDirection";
import { IBoardCell, ITileCoordinates } from "../react-app-env";
import { Cell } from "./Cell";

const forEachCell = (board: IBoardCell[][], f: (tile: IBoardCell) => IBoardCell): IBoardCell[][] => {
	const newBoard = board.slice();

	for (let i = 0, len = newBoard.length; i < len; i++) {
		for (let ii = 0, len2 = newBoard[0].length; ii < len2; ii++) {
			const cell = newBoard[i][ii];
			f(cell);
		}
	}

	return newBoard;
};

export const Board = (props: {
	direction: WriteDirection;
	boardCells: IBoardCell[][];
	setBoardCells: React.Dispatch<React.SetStateAction<IBoardCell[][]>>;
	playHandTile: (letter: string) => boolean;
	unPlayHandTile: (letter: string) => boolean;
}) => {
	const { direction, boardCells, setBoardCells, playHandTile, unPlayHandTile } = props;

	const tileFocused = useCallback(
		(coordinates: ITileCoordinates) => {
			const { column, row } = coordinates;
			const cells = forEachCell(boardCells.slice(), (cell: IBoardCell) => {
				cell.focused = false;

				return cell;
			});
			const cell = cells[row][column];

			cell.focused = true;
			setBoardCells(cells);
		},
		[boardCells, setBoardCells]
	);

	const tileBlurred = useCallback(
		(coordinates: ITileCoordinates) => {
			const { column, row } = coordinates;
			const cells = boardCells.slice(0);
			const cell = cells[row][column];

			cell.focused = false;
			setBoardCells(cells);
		},
		[boardCells, setBoardCells]
	);

	const tileChanged = useCallback(
		(coordinates: ITileCoordinates, value: string | undefined) => {
			const { column, row } = coordinates;
			const cells = boardCells.slice(0);
			const cell = cells[row][column];

			if (cell) {
				if (!Checker.checkLetter(value)) return;

				let tilePlayed = false;
				const oldValue = cell.tile?.letter;

				if (!value) {
					cell.tile = undefined;
					tilePlayed = true;
				} else if (playHandTile(value)) {
					cell.tile = { letter: value };
					tilePlayed = true;
				}

				setBoardCells(cells);

				if (oldValue && tilePlayed) {
					unPlayHandTile(oldValue);
				}

				if (!oldValue && tilePlayed) {
					let nextTile = cells[row][column + 1];

					if (direction === WriteDirection.Right) {
						nextTile = cells[row][column + 1];
					} else if (direction === WriteDirection.Down) {
						nextTile = cells[row + 1][column];
					}

					nextTile?.inputRef?.current?.focus();
				}
			}
		},
		[boardCells, setBoardCells, direction, playHandTile, unPlayHandTile]
	);

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

	const boardRows: JSX.Element[] = useMemo(() => {
		const rows: JSX.Element[][] = [];

		for (let i = 0; i < boardCells.length; i++) {
			const column: JSX.Element[] = [];

			for (let ii = 0; ii < boardCells[0].length; ii++) {
				const cell = boardCells[i][ii];
				column.push(<Cell ref={cell.inputRef} key={`${i}${ii}`} cell={cell} direction={direction} moveFocus={moveFocus} focusedCallback={tileFocused} blurredCallback={tileBlurred} changedCallback={tileChanged} />);
			}

			rows.push(column);
		}

		return rows.map((row, index) => {
			return (
				<div key={index} className='row'>
					{row}
				</div>
			);
		});
	}, [boardCells, direction, moveFocus, tileFocused, tileBlurred, tileChanged]);

	return <div className='board'>{boardRows}</div>;
};

import { useCallback, useMemo } from "react";
import { Checker } from "../checker/Checker";
import { WriteDirection } from "../enums/WriteDirection";
import { IBoardCell, ITile, ITileCoordinates } from "../react-app-env";
import { Cell } from "./Cell";

export const Board = (props: {
	direction: WriteDirection;
	boardCells: IBoardCell[][];
	setBoardCells: React.Dispatch<React.SetStateAction<IBoardCell[][]>>;
	playHandTile: (letter: string, coordinates: ITileCoordinates) => ITile | null;
	unPlayHandTile: (letter: string) => boolean;
	moveFocus: (coordinates: ITileCoordinates, direction: ITileCoordinates) => void;
}) => {
	const { direction, boardCells, setBoardCells, playHandTile, unPlayHandTile, moveFocus } = props;

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

	const boardRows: JSX.Element[] = useMemo(() => {
		const rows: JSX.Element[][] = [];

		for (let i = 0; i < boardCells.length; i++) {
			const column: JSX.Element[] = [];

			for (let ii = 0; ii < boardCells[0].length; ii++) {
				const cell = boardCells[i][ii];
				column.push(<Cell ref={cell.inputRef} key={`${i}${ii}`} cell={cell} direction={direction} moveFocus={moveFocus} changedCallback={tileChanged} />);
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
	}, [boardCells, direction, moveFocus, tileChanged]);

	return <div className='board'>{boardRows}</div>;
};

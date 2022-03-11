import { useMemo } from "react";

import { WriteDirection } from "../enums/WriteDirection";
import { IBoardCell, ITileCoordinates } from "../react-app-env";
import { Cell } from "./Cell";

export const Board = (props: {
	direction: WriteDirection;
	boardCells: IBoardCell[][];
	tileChanged: (coordinates: ITileCoordinates, value: string | undefined) => void;
	moveFocus: (coordinates: ITileCoordinates, direction: ITileCoordinates) => void;
}) => {
	const { direction, boardCells, tileChanged, moveFocus } = props;

	console.log({ boardCells });

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

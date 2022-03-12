import { IBoardCell } from "../react-app-env";

export const setPlayedCellsToBoard = (board: IBoardCell[][], playedCells: IBoardCell[]) => {
	playedCells.forEach((cell) => {
		const { coordinates, tile } = cell;
		const { row, column } = coordinates;

		const boardCell = board[row][column];

		if (boardCell && tile) {
			boardCell.tile = { ...tile };
		}
	});

	return board;
};
